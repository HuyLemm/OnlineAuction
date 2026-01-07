import { Router } from "express";
import { SellerController } from "../controllers/seller.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.post(
  "/upload-image",
  authenticate,
  authorize("seller"),
  upload.single("image"), 
  SellerController.uploadImage
);

export default router;
