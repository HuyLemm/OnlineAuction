import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

router.get(
  "/seller-upgrade-requests",
  authenticate,
  authorize("admin"),
  AdminController.getUpgradeRequests
);

router.post(
  "/seller-upgrade-requests/:requestId/approve",
  authenticate,
  authorize("admin"),
  AdminController.approveUpgradeRequest
);

router.post(
  "/seller-upgrade-requests/:requestId/reject",
  authenticate,
  authorize("admin"),
  AdminController.rejectUpgrade
);

export default router;
