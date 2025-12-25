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

router.post(
  "/categories/parent",
  authenticate,
  authorize("admin"),
  AdminController.createParentCategory
);

router.post(
  "/categories/sub",
  authenticate,
  authorize("admin"),
  AdminController.createSubcategory
);

router.put(
  "/categories/parent/:id",
  authenticate,
  authorize("admin"),
  AdminController.updateParentCategory
);
router.put(
  "/categories/sub/:id",
  authenticate,
  authorize("admin"),
  AdminController.updateSubcategory
);

router.delete(
  "/categories/parent/:id",
  authenticate,
  authorize("admin"),
  AdminController.deleteParentCategory
);
router.delete(
  "/categories/sub/:id",
  authenticate,
  authorize("admin"),
  AdminController.deleteSubcategory
);

export default router;
