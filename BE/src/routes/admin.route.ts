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
  "/seller-upgrade-requests/:id/approve",
  authenticate,
  authorize("admin"),
  AdminController.approveSellerUpgrade
);

router.post(
  "/seller-upgrade-requests/:id/reject",
  authenticate,
  authorize("admin"),
  AdminController.rejectSellerUpgrade
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

router.get(
  "/products",
  authenticate,
  authorize("admin"),
  AdminController.getAdminProducts
);

router.put(
  "/products/:id",
  authenticate,
  authorize("admin"),
  AdminController.updateProduct
);
router.patch(
  "/products/:id/delete",
  authenticate,
  authorize("admin"),
  AdminController.toggleDeleteProduct
);

router.get(
  "/get-users",
  authenticate,
  authorize("admin"),
  AdminController.getAdminUsers
);

router.get(
  "/users/:id",
  authenticate,
  authorize("admin"),
  AdminController.getUserDetails
);
router.put(
  "/users/:id",
  authenticate,
  authorize("admin"),
  AdminController.updateUser
);
router.patch(
  "/users/:id/ban",
  authenticate,
  authorize("admin"),
  AdminController.toggleBanUser
);

router.patch(
  "/users/:id/delete",
  authenticate,
  authorize("admin"),
  AdminController.toggleDeleteUser
);

router.get(
  "/system-settings",
  authenticate,
  authorize("admin"),
  AdminController.getSystemSettings
);


router.put(
  "/system-settings",
  authenticate,
  authorize("admin"),
  AdminController.updateSystemSettings
);

router.patch(
  "/users/:id/change-password",
  authenticate,
  authorize("admin"),
  AdminController.changeUserPassword
);

export default router;
