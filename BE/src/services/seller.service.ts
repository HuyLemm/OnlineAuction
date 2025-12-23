import { db } from "../config/db";
import { CreateAuctionDTO, SellerActiveProductDTO } from "../dto/product.dto";

import { supabase } from "../config/supabase";
import crypto from "crypto";
import path from "path";

/* ===============================
 * Types
 * =============================== */
type AutoExtendSettings = {
  thresholdMinutes: number;
  durationMinutes: number;
};

type UploadedImage = {
  url: string;
  isMain: boolean;
};

type ActiveListingRow = {
  id: string;
  title: string;
  description: string;

  start_price: number;
  current_price: number | null;
  buy_now_price: number | null;

  end_time: Date;

  category: string;
  image: string | null;

  bid_count: string; // COUNT() từ Postgres
};

export class SellerService {
  /* ===============================
   * INTERNAL: read auto-extend config
   * =============================== */
  static async getAutoExtendSettings(): Promise<AutoExtendSettings> {
    const rows = await db("system_settings").select("key", "value");

    let thresholdMinutes: number | null = null;
    let durationMinutes: number | null = null;

    for (const row of rows) {
      const key = String(row.key).trim();
      const value = Number(String(row.value).trim());

      if (Number.isNaN(value)) continue;

      if (key.includes("threshold") && key.includes("minute")) {
        thresholdMinutes = value;
      }

      if (key.includes("duration") && key.includes("minute")) {
        durationMinutes = value;
      }
    }

    if (
      thresholdMinutes === null ||
      durationMinutes === null ||
      thresholdMinutes <= 0 ||
      durationMinutes <= 0
    ) {
      throw new Error("Auto-extend system settings are invalid");
    }

    return {
      thresholdMinutes,
      durationMinutes,
    };
  }

  /* ===============================
   * PUBLIC: get auto-extend config
   * =============================== */
  static async getAutoExtendConfig() {
    try {
      return await SellerService.getAutoExtendSettings();
    } catch {
      return {
        thresholdMinutes: 0,
        durationMinutes: 0,
      };
    }
  }

  /* ===============================
   * Upload image to Supabase Storage (TEMP)
   * =============================== */
  static async uploadTempProductImage(params: {
    file: Express.Multer.File;
    uploadSessionId: string;
  }) {
    const { file, uploadSessionId } = params;

    if (!file) throw new Error("No file uploaded");
    if (!uploadSessionId) throw new Error("uploadSessionId is required");
    if (!file.mimetype.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    const ext = path.extname(file.originalname) || ".jpg";
    const fileName = `${crypto.randomUUID()}${ext}`;
    const storagePath = `tmp/${uploadSessionId}/${fileName}`;

    const { error } = await supabase.storage
      .from("product_images")
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage
      .from("product_images")
      .getPublicUrl(storagePath);

    return {
      url: data.publicUrl,
      path: storagePath,
    };
  }

  /* ===============================
   * INTERNAL: move images tmp → products/{productId}
   * =============================== */
  private static async moveImagesFromTmpToProduct(
    uploadSessionId: string,
    productId: string
  ): Promise<UploadedImage[]> {
    const bucket = supabase.storage.from("product_images");

    const { data: files, error } = await bucket.list(`tmp/${uploadSessionId}`);

    if (error) {
      throw new Error("Failed to list uploaded images");
    }

    if (!files || files.length === 0) {
      throw new Error("No uploaded images found");
    }

    const movedImages: UploadedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;

      const fromPath = `tmp/${uploadSessionId}/${file.name}`;
      const toPath = `products/${productId}/${file.name}`;

      // download
      const { data: fileData } = await bucket.download(fromPath);
      if (!fileData) continue;

      // upload to final location
      await bucket.upload(toPath, fileData, {
        upsert: true,
      });

      // delete temp
      await bucket.remove([fromPath]);

      const { data: publicUrl } = bucket.getPublicUrl(toPath);

      movedImages.push({
        url: publicUrl.publicUrl,
        isMain: i === 0, // ảnh đầu tiên là main
      });
    }

    return movedImages;
  }

  /* ===============================
   * Create Auction (FINAL)
   * =============================== */
  static async createAuction(dto: CreateAuctionDTO) {
    return await db.transaction(async (trx) => {
      /* 1️⃣ Check seller */
      const seller = await trx("users")
        .select("id", "role", "is_blocked")
        .where({ id: dto.sellerId })
        .first();

      if (!seller) throw new Error("Seller not found");
      if (seller.role !== "seller") {
        throw new Error("Only sellers can create auctions");
      }
      if (seller.is_blocked) {
        throw new Error("Your account is blocked");
      }

      /* 2️⃣ Auto-extend config */
      let autoExtendConfig: AutoExtendSettings | null = null;
      if (dto.autoExtend === true) {
        autoExtendConfig = await SellerService.getAutoExtendSettings();
      }

      /* 3️⃣ Validate duration */
      if (!dto.durationMinutes || dto.durationMinutes <= 0) {
        throw new Error("Invalid auction duration");
      }

      if (!dto.uploadSessionId) {
        throw new Error("uploadSessionId is required");
      }

      const now = new Date();
      const endTime = new Date(now.getTime() + dto.durationMinutes * 60 * 1000);

      /* 4️⃣ Insert product */
      const [product] = await trx("products")
        .insert({
          title: dto.title,
          category_id: dto.categoryId,
          seller_id: dto.sellerId,

          start_price: dto.startPrice,
          bid_step: dto.bidStep,
          buy_now_price: dto.buyNowPrice ?? null,

          current_price: null,
          highest_bidder_id: null,

          auction_type: dto.auctionType,
          status: "active",

          description: dto.description,

          auto_extend: dto.autoExtend,
          end_time: endTime,

          created_at: now,
        })
        .returning(["id"]);

      const images = await SellerService.moveImagesFromTmpToProduct(
        dto.uploadSessionId,
        product.id
      );

      if (images.length < 3) {
        throw new Error("At least 3 images are required");
      }

      await trx("product_images").insert(
        images.map((img) => ({
          product_id: product.id,
          image_url: img.url,
          is_main: img.isMain,
        }))
      );

      return {
        message: "Auction created successfully",
        productId: product.id,
        endTime,
        autoExtend: dto.autoExtend ? autoExtendConfig : null,
      };
    });
  }
  /* ===============================
   * Get active listings of seller
   * =============================== */
  static async getMyActiveListings(
    sellerId: string
  ): Promise<SellerActiveProductDTO[]> {
    const rows = (await db("products as p")
      .join("categories as c", "c.id", "p.category_id")
      .leftJoin("product_images as img", function () {
        this.on("img.product_id", "p.id").andOn("img.is_main", db.raw("true"));
      })
      .leftJoin("bids as b", "b.product_id", "p.id")
      .where("p.seller_id", sellerId)
      .andWhere("p.status", "active")
      .andWhere("p.end_time", ">", db.fn.now())
      .groupBy("p.id", "c.name", "img.image_url")
      .orderBy("p.end_time", "asc")
      .select(
        "p.id",
        "p.title",
        "p.description",
        "p.start_price",
        "p.current_price",
        "p.buy_now_price",
        "p.end_time",
        "c.name as category",
        "img.image_url as image"
      )
      .count("b.id as bid_count")) as ActiveListingRow[];

    const now = Date.now();

    return rows.map((row) => ({
      id: String(row.id),
      title: row.title,
      category: row.category,
      description: row.description,

      startingBid: Number(row.start_price),
      currentBid:
        row.current_price !== null
          ? Number(row.current_price)
          : Number(row.start_price),

      bid_count: row.bid_count,

      buyNowPrice:
        row.buy_now_price !== null ? Number(row.buy_now_price) : null,

      image: row.image ?? null,

      endDate: new Date(row.end_time).toISOString(),
      timeLeft: Math.max(
        0,
        Math.floor((new Date(row.end_time).getTime() - Date.now()) / 1000)
      ),
    }));
  }
}
