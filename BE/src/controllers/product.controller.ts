import { Request, Response } from "express";
import dayjs from "dayjs";

import {
  getBrowseProductsService,
  searchProductsService,
  getProductDetailService,
} from "../services/product.service";

import { BrowseProductDTO, ProductDetailDTO } from "../dto/product.dto";

/* =====================================================
 * UTIL – map browse product
 * ===================================================== */
function mapBrowseProduct(item: any): BrowseProductDTO {
  const end = dayjs(item.end_time);
  const now = dayjs();

  return {
    id: item.id,
    title: item.title,
    category: item.category,
    image: item.image,
    categoryId: String(item.categoryId ?? item.category_id ?? ""),
    description: item.description,

    postedDate: item.postedDate,
    end_time: item.end_time,

    auctionType: item.auctionType,
    buyNowPrice: item.buyNowPrice,

    currentBid: Number(item.currentBid),
    bids: Number(item.bids),

    highestBidderId: item.highestBidderId ?? null,
    highestBidderName: item.highestBidderName ?? null,

    isHot: Number(item.bids) > 7,
    endingSoon: end.diff(now, "day") < 3,
  };
}

/* =====================================================
 * BROWSE PRODUCTS
 * ===================================================== */
export async function getBrowseProductsController(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const sort = (req.query.sort as string) || "default";

    const categories = req.query.categories
      ? (req.query.categories as string).split(",").filter((x) => x !== "")
      : [];

    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || 999999999;

    const { data, total } = await getBrowseProductsService({
      page,
      limit,
      sort,
      categories,
      minPrice,
      maxPrice,
    });

    res.json({
      success: true,
      page,
      limit,
      sort,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      data: data.map(mapBrowseProduct),
    });
  } catch (error) {
    console.error("❌ getBrowseProductsController:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

/* =====================================================
 * SEARCH PRODUCTS
 * ===================================================== */
export async function searchProductsController(req: Request, res: Response) {
  try {
    const keyword = (req.query.keyword as string) || "";
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 12, 48);
    const sort = (req.query.sort as string) || "default";
    const newMinutes = req.query.newMinutes ? Number(req.query.newMinutes) : 60;

    const categoryIds = req.query.categoryIds
      ? (req.query.categoryIds as string).split(",").map(Number)
      : undefined;

    const result = await searchProductsService({
      keyword,
      categoryIds,
      page,
      limit,
      sort,
      newMinutes,
    });

    res.json(result);
  } catch (error) {
    console.error("❌ searchProductsController:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

/* =====================================================
 * 🔥 PRODUCT DETAIL
 * ===================================================== */
export async function getProductDetailController(req: Request, res: Response) {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
      });
    }

    const raw = await getProductDetailService(productId);

    const dto: ProductDetailDTO = {
      product: {
        id: raw.product.id,
        title: raw.product.title,
        description: raw.product.description,
        postedDate: raw.product.postedDate,
        endTime: raw.product.endTime,
        auctionType: raw.product.auctionType,
        buyNowPrice: raw.product.buyNowPrice,
        categoryId: raw.product.categoryId,
        categoryName: raw.product.categoryName,
        currentBid: raw.product.currentBid,
        bidStep: raw.product.bidStep,
      },

      images: {
        primary: raw.images.find((i: any) => i.is_main)?.image_url || "",
        gallery: raw.images
          .filter((i: any) => !i.is_main)
          .map((i: any) => i.image_url),
      },

      seller: {
        id: raw.seller.id,
        name: raw.seller.name,
        rating: raw.seller.rating, // ✅ { score, total }
      },

      ...(raw.highestBidder && {
        highestBidder: {
          id: raw.highestBidder.id,
          name: raw.highestBidder.name,
          rating: raw.highestBidder.rating, // ✅ { score, total }
        },
      }),

      autoBids: raw.autoBids.map((b: any) => ({
        id: b.id,
        bidderId: b.bidder_id,
        bidderName: "", // frontend resolve / later join
        maxBid: b.max_bid,
        createdAt: b.created_at,
      })),

      questions: raw.questions.map((q: any) => {
        const ans = raw.answers.find((a: any) => a.question_id === q.id);

        return {
          id: q.id,
          question: {
            content: q.content,
            askedBy: {
              id: q.user_id,
              name: "",
            },
            askedAt: q.created_at,
          },
          ...(ans && {
            answer: {
              content: ans.content,
              answeredBy: {
                id: ans.user_id,
                name: "",
              },
              answeredAt: ans.created_at,
            },
          }),
        };
      }),

      relatedProducts: raw.relatedProducts.map((p: any) => ({
        id: p.id,
        title: p.title,
        image: p.image,

        currentBid: Number(p.currentBid),
        bids: Number(p.bids),

        endTime: p.endTime,

        auctionType: p.auctionType,
        buyNowPrice: p.buyNowPrice ?? null,

        postedDate: p.postedDate,

        category: p.category,
        categoryId: Number(p.categoryId),

        highestBidderName: p.highestBidderName ?? null,
      })),
    };

    return res.json({
      success: true,
      data: dto,
    });
  } catch (error: any) {
    console.error("❌ getProductDetailController:", error);
    return res.status(404).json({
      success: false,
      message: error.message || "Product not found",
    });
  }
}
