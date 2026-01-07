import { useEffect, useState } from "react";
import {
  Search,
  MoreVertical,
  Ban,
  CheckCircle,
  Shield,
  User,
  Mail,
  Calendar,
  UserCheck,
  X,
  Trash2,
  Lock,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { toast } from "sonner";

import { fetchWithAuth } from "../utils/fetchWithAuth";
import {
  GET_USERS_FOR_ADMIN_API,
  APPROVE_SELLER_UPGRADE_API,
  REJECT_SELLER_UPGRADE_API,
  GET_USER_DETAILS_API,
  UPDATE_USER_DETAILS_API,
  TOGGLE_BAN_USER_API,
  TOGGLE_DELETE_USER_API,
  CHANGE_USER_PASSWORD_API,
} from "../utils/api";

import { LoadingSpinner } from "../state";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "bidder" | "seller" | "admin";
  status: "active" | "banned";
  joinedDate: string;

  totalBids: number; // products_joined
  totalPurchases: number; // products_won
  totalSales: number; // products_sold

  avatarUrl?: string;
  verificationStatus: "verified" | "unverified";

  sellerApprovalStatus?: "none" | "pending" | "approved" | "rejected";
  sellerApprovalDate?: string;

  sellerRequestId?: string;
  isDeleted: boolean;
}

/* ================= COMPONENT ================= */

export function UserManagementSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null);
  const [deleteMode, setDeleteMode] = useState<"delete" | "restore">("delete");
  const [passwordUser, setPasswordUser] = useState<UserData | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  /* ================= FETCH USERS ================= */

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      const res = await fetchWithAuth(GET_USERS_FOR_ADMIN_API);
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Failed to load users");
      }

      const mapped: UserData[] = json.data.map((u: any) => ({
        id: u.id,
        name: u.full_name,
        email: u.email,

        role: u.role,

        status: u.is_blocked ? "banned" : "active",

        joinedDate: u.created_at.split("T")[0],

        totalBids: Number(u.products_joined),
        totalPurchases: Number(u.products_won),
        totalSales: Number(u.products_sold),

        verificationStatus: "verified",

        sellerRequestId: u.latest_seller_request_id,
        sellerApprovalStatus:
          u.latest_seller_request_status === "pending"
            ? "pending"
            : u.latest_seller_request_status === "approved"
            ? "approved"
            : u.latest_seller_request_status === "rejected"
            ? "rejected"
            : "none",

        isDeleted: u.is_deleted,
      }));

      setUsers(mapped);
    } catch (err: any) {
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  /* ================= APPROVE / REJECT SELLER ================= */

  const handleApproveSellerRequest = async (requestUserId: string) => {
    try {
      const res = await fetchWithAuth(
        APPROVE_SELLER_UPGRADE_API(requestUserId),
        {
          method: "POST",
        }
      );

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Approve failed");
      }

      toast.success("Seller request approved");

      // refresh list
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Approve seller failed");
    }
  };

  const handleRejectSellerRequest = async (requestUserId: string) => {
    try {
      const res = await fetchWithAuth(
        REJECT_SELLER_UPGRADE_API(requestUserId),
        {
          method: "POST",
        }
      );

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Reject failed");
      }

      toast.success("Seller request rejected");

      // refresh list
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Reject seller failed");
    } finally {
      setLoadingUsers(false);
    }
  };

  /* ================= OPEN DIALOGS ================= */

  const openViewDialog = async (user: UserData) => {
    try {
      setViewLoading(true);
      setSelectedUser(null);

      const res = await fetchWithAuth(GET_USER_DETAILS_API(user.id));
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      const u = json.data;
      setSelectedUser({
        id: u.id,
        name: u.full_name,
        email: u.email,
        role: u.role,
        status: u.is_blocked ? "banned" : "active",
        joinedDate: u.created_at.split("T")[0],

        totalBids: Number(u.products_joined),
        totalPurchases: Number(u.products_won),
        totalSales: Number(u.products_sold),

        verificationStatus: u.is_verified ? "verified" : "unverified",
        isDeleted: u.is_deleted,
      });
    } catch (e: any) {
      toast.error(e.message || "Load user failed");
    } finally {
      setViewLoading(false);
    }
  };

  const getDeletedBadge = () => (
    <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">
      Deleted
    </Badge>
  );

  const openEditDialog = (user: UserData) => {
    setEditingUser(user);
  };

  const openDeleteDialog = (user: UserData) => {
    setDeleteMode("delete");
    setDeleteTarget(user);
  };
  const openRestoreDialog = (user: UserData) => {
    setDeleteMode("restore");
    setDeleteTarget(user);
  };

  const openChangePasswordDialog = (user: UserData) => {
    setPasswordUser(user);
    setNewPassword("");
    setConfirmPassword("");
  };

  /* ================= API ACTIONS ================= */

  const handleSaveUser = async () => {
    if (!editingUser) return;
    try {
      setEditLoading(true);
      const res = await fetchWithAuth(UPDATE_USER_DETAILS_API(editingUser.id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
          isBlocked: editingUser.status === "banned",
          isVerified: editingUser.verificationStatus === "verified",
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      toast.success("User updated");
      setEditingUser(null);
      fetchUsers();
    } catch (e: any) {
      toast.error(e.message || "Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleBanUser = async (userId: string, ban: boolean) => {
    try {
      const res = await fetchWithAuth(TOGGLE_BAN_USER_API(userId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ban }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      toast.success(ban ? "User banned" : "User unbanned");
      fetchUsers();
    } catch (e: any) {
      toast.error(e.message || "Toggle ban failed");
    }
  };

  const handleConfirmDeleteToggle = async () => {
    if (!deleteTarget) return;

    const isDelete = deleteMode === "delete";

    try {
      setDeleteLoading(true);

      const res = await fetchWithAuth(TOGGLE_DELETE_USER_API(deleteTarget.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleted: isDelete }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      toast.success(
        isDelete ? "User deleted successfully" : "User restored successfully"
      );

      setDeleteTarget(null);
      fetchUsers();
    } catch (e: any) {
      toast.error(e.message || "Action failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordUser) return;

    if (newPassword.length < 8) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);

      const res = await fetchWithAuth(
        CHANGE_USER_PASSWORD_API(passwordUser.id),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      toast.success("Password updated successfully");
      setPasswordUser(null);
    } catch (e: any) {
      console.error("CHANGE PASSWORD ERROR:", e.message);
      toast.error(e.message || "Change password failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  /* ================= FILTER ================= */

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingSellerApprovals = filteredUsers.filter(
    (u) => u.sellerApprovalStatus === "pending"
  );

  const regularUsers = filteredUsers.filter(
    (u) => u.sellerApprovalStatus !== "pending"
  );

  const totalUsers = filteredUsers.length;

  const activeUsers = filteredUsers.filter(
    (u) => u.status === "active" && !u.isDeleted
  ).length;

  const sellerCount = filteredUsers.filter((u) => u.role === "seller").length;

  const pendingCount = filteredUsers.filter(
    (u) => u.sellerApprovalStatus === "pending"
  ).length;

  /* ================= BADGES ================= */

  const getRoleBadge = (role: string) => {
    if (role === "admin")
      return (
        <Badge className="bg-purple-500/10 text-purple-500 border-0">
          Admin
        </Badge>
      );
    if (role === "seller")
      return (
        <Badge className="bg-[#fbbf24]/10 text-[#fbbf24] border-0">
          Seller
        </Badge>
      );
    return (
      <Badge className="bg-blue-500/10 text-blue-500 border-0">Buyer</Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === "active")
      return (
        <Badge className="bg-green-500/10 text-green-500 border-0">
          Active
        </Badge>
      );
    if (status === "suspended")
      return (
        <Badge className="bg-[#f59e0b]/10 text-[#f59e0b] border-0">
          Suspended
        </Badge>
      );
    return (
      <Badge className="bg-red-500/10 text-red-500 border-0">Banned</Badge>
    );
  };

  if (loadingUsers) return <LoadingSpinner />;

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage platform users and permissions
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="pl-10 w-64 bg-secondary/50 border-border/50"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* TOTAL USERS */}
        <Card className="p-6 bg-card border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Users</p>
              <h3 className="text-foreground">{totalUsers}</h3>
            </div>
            <User className="h-8 w-8 text-[#fbbf24]" />
          </div>
        </Card>

        {/* ACTIVE USERS */}
        <Card className="p-6 bg-card border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Active Users</p>
              <h3 className="text-foreground">
                <h3 className="text-foreground">{activeUsers}</h3>
              </h3>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        {/* SELLERS */}
        <Card className="p-6 bg-card border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Sellers</p>
              <h3 className="text-foreground">
                <h3 className="text-foreground">{sellerCount}</h3>
              </h3>
            </div>
            <Badge className="bg-[#fbbf24]/10 text-[#fbbf24] border-0 h-8 px-3">
              Verified
            </Badge>
          </div>
        </Card>

        {/* PENDING APPROVAL */}
        <Card className="p-6 bg-card border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">
                Pending Approvals
              </p>
              <h3 className="text-foreground">
                <h3 className="text-foreground">{pendingCount}</h3>
              </h3>
            </div>
            <UserCheck className="h-8 w-8 text-[#d4a446]" />
          </div>
        </Card>
      </div>

      {/* ================= PENDING SELLER APPROVAL REQUESTS ================= */}
      {pendingSellerApprovals.length > 0 && (
        <Card className=" bg-card bg-[#d4a446]/10">
          {/* HEADER */}
          <div className="p-4 border-b border-[#d4a446]/30 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-[#d4a446]" />
            <h3 className="text-foreground">
              Pending Seller Approval Requests
            </h3>
            <Badge className="bg-[#d4a446]/20 text-[#d4a446] border-0">
              {pendingSellerApprovals.length}
            </Badge>
          </div>

          {/* TABLE */}
          <Table>
            <TableHeader>
              <TableRow className="border-[#d4a446]/20">
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pendingSellerApprovals.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-[#d4a446]/20 hover:bg-[#d4a446]/10 transition"
                >
                  {/* USER */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-[#d4a446]/60">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="text-foreground">{user.name}</p>
                        <div className="flex gap-1 mt-1">
                          {user.isDeleted && getDeletedBadge()}
                        </div>
                        <Badge className="bg-[#d4a446]/20 text-[#d4a446] border-0 text-xs mt-1 inline-flex items-center gap-1">
                          <UserCheck className="h-3 w-3" />
                          Seller Request
                        </Badge>
                      </div>
                    </div>
                  </TableCell>

                  {/* EMAIL */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                  </TableCell>

                  {/* ROLE */}
                  <TableCell>
                    <Badge className="bg-blue-500/10 text-blue-400 border-0">
                      Buyer
                    </Badge>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <Badge className="bg-green-500/10 text-green-400 border-0">
                      Active
                    </Badge>
                  </TableCell>

                  {/* JOINED */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {user.joinedDate}
                    </div>
                  </TableCell>

                  {/* ACTIVITY */}
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        Bids: {user.totalBids}
                      </p>
                      <p className="text-muted-foreground">
                        Purchases: {user.totalPurchases}
                      </p>
                    </div>
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
                        onClick={() =>
                          handleApproveSellerRequest(user.sellerRequestId!)
                        }
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                        onClick={() =>
                          handleRejectSellerRequest(user.sellerRequestId!)
                        }
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-[#d4a446]/10"
                        onClick={() => setSelectedUser(user)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* USERS TABLE */}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regularUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{user.name}</p>
                      <div className="flex gap-1 mt-1">
                        {user.isDeleted && getDeletedBadge()}
                      </div>
                      {user.role === "seller" && (
                        <Badge className="bg-blue-500/10 text-blue-500 border-0 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {user.role === "admin" && (
                        <Badge className="bg-[#d4a446]/20 text-[#d4a446] border-0 text-xs">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Boss
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {user.joinedDate}
                  </div>
                </TableCell>
                <TableCell>
                  {user.role !== "admin" &&
                    (user.role === "seller" ? (
                      <p className="text-muted-foreground">
                        Products Sold: {user.totalSales}
                      </p>
                    ) : (
                      <>
                        <p className="text-muted-foreground">
                          Products Joined: {user.totalBids}
                        </p>
                        <p className="text-muted-foreground">
                          Products Won: {user.totalPurchases}
                        </p>
                      </>
                    ))}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-44">
                      {/* VIEW */}
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          openViewDialog(user);
                        }}
                      >
                        <User className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>

                      {/* UPDATE */}
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          openEditDialog(user);
                        }}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Update User
                      </DropdownMenuItem>

                      {/* CHANGE PASSWORD */}
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          openChangePasswordDialog(user);
                        }}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </DropdownMenuItem>

                      {/* BAN */}
                      {user.status !== "banned" && (
                        <DropdownMenuItem
                          className="text-red-500"
                          onSelect={(e) => {
                            e.preventDefault();
                            handleToggleBanUser(user.id, true);
                          }}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Ban User
                        </DropdownMenuItem>
                      )}

                      {/* UNBAN */}
                      {user.status === "banned" && (
                        <DropdownMenuItem
                          className="text-green-500"
                          onSelect={(e) => {
                            e.preventDefault();
                            handleToggleBanUser(user.id, false);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Unban User
                        </DropdownMenuItem>
                      )}

                      {/* DELETE */}
                      {!user.isDeleted && (
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={(e) => {
                            e.preventDefault();
                            openDeleteDialog(user);
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Delete Account
                        </DropdownMenuItem>
                      )}

                      {user.isDeleted && (
                        <DropdownMenuItem
                          className="text-green-500"
                          onSelect={(e) => {
                            e.preventDefault();
                            openRestoreDialog(user);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Restore Account
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* VIEW DIALOG */}
      {selectedUser && (
        <Dialog
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
        >
          <DialogContent className="max-w-2xl bg-[#0a0a0a] border-[#fbbf24]/20">
            {viewLoading ? (
              <div className="flex items-center justify-center h-64 bg-black">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <DialogHeader className="bg-black">
                  <DialogTitle className="flex items-center gap-2 text-[#d4a446]">
                    <User className="h-5 w-5 text-[#d4a446]" />
                    User Details
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 bg-black">
                  {/* Header */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-black to-[#d4a446]/20 rounded-lg border border-[#d4a446]/50 ">
                    <Avatar className="h-20 w-20 ring-2 ring-[#d4a446]/70">
                      <AvatarFallback className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black">
                        {selectedUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 ">
                      <h3 className="text-white mb-1">{selectedUser.name}</h3>
                      <p className="text-gray-300 text-sm mb-2">
                        {selectedUser.email}
                      </p>
                      <div className="flex gap-2">
                        {getRoleBadge(selectedUser.role)}
                        {getStatusBadge(selectedUser.status)}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 ">
                    <Card className="p-4 bg-gray-800 border border-[#d4a446]/30 bg-gradient-to-r from-black to-[#d4a446]/20 rounded-lg border border-[#d4a446]/50 ">
                      <p className="text-gray-400 text-sm">Total Bids</p>
                      <p className="text-white text-2xl">
                        {selectedUser.totalBids}
                      </p>
                    </Card>
                    <Card className="p-4 bg-gray-800 border border-[#d4a446]/30 bg-gradient-to-r from-black to-[#d4a446]/20 rounded-lg border border-[#d4a446]/50 ">
                      <p className="text-gray-400 text-sm">Total Purchases</p>
                      <p className="text-white text-2xl">
                        {selectedUser.totalPurchases}
                      </p>
                    </Card>
                    <Card className="p-4 bg-gray-800 border border-[#d4a446]/30 bg-gradient-to-r from-black to-[#d4a446]/20 rounded-lg border border-[#d4a446]/50 ">
                      <p className="text-gray-400 text-sm">Total Sales</p>
                      <p className="text-white text-2xl">
                        {selectedUser.totalSales}
                      </p>
                    </Card>
                    <Card className="p-4 bg-gray-800 border border-[#d4a446]/30 bg-gradient-to-r from-black to-[#d4a446]/20 rounded-lg border border-[#d4a446]/50 ">
                      <p className="text-gray-400 text-sm">Member Since</p>
                      <p className="text-white">
                        <Calendar className="h-4 w-4 mb-1 inline" />{" "}
                        {selectedUser.joinedDate}
                      </p>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* EDIT DIALOG */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="bg-[#0a0a0a] border-[#fbbf24]/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#d4a446]">
                <Shield className="h-5 w-5 text-[#d4a446]" />
                Update User Information
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* User Header */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-black to-[#d4a446]/20 rounded-lg border border-[#d4a446]/50">
                <Avatar className="h-16 w-16 ring-2 ring-[#d4a446]/50">
                  <AvatarFallback className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black">
                    {editingUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="text-white">{editingUser.id}</p>
                  <div className="flex gap-2 mt-2">
                    {getRoleBadge(editingUser.role)}
                    {getStatusBadge(editingUser.status)}
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-yellow-500 font-semibold">
                    Full Name
                  </label>
                  <Input
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm text-yellow-500 font-semibold">
                    Email
                  </label>
                  <Input
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm text-yellow-500 font-semibold">
                    Role
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value as any,
                      })
                    }
                    className="w-full h-10 rounded-md bg-secondary border border-border px-3"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-yellow-500 font-semibold">
                    Status
                  </label>
                  <select
                    value={editingUser.status}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full h-10 rounded-md bg-secondary border border-border px-3"
                  >
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveUser}
                disabled={editLoading}
                className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
              >
                {editLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {passwordUser && (
        <Dialog
          open={!!passwordUser}
          onOpenChange={() => setPasswordUser(null)}
        >
          <DialogContent className="bg-[#0a0a0a] border-[#fbbf24]/20 max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#d4a446]">
                <Lock className="h-5 w-5" />
                Change Password
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-black to-[#d4a446]/20 rounded-lg border border-[#d4a446]/50">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black">
                    {passwordUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-semibold">
                    {passwordUser.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {passwordUser.email}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-yellow-500 font-semibold">
                  New Password
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-yellow-500 font-semibold">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setPasswordUser(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
              >
                {passwordLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* DELETE DIALOG */}
      {deleteTarget && (
        <Dialog
          open={!!deleteTarget}
          onOpenChange={() => setDeleteTarget(null)}
        >
          <DialogContent className="bg-[#0a0a0a] border-[#fbbf24]/20 max-w-md">
            <DialogHeader>
              <DialogTitle
                className={`flex items-center gap-2 ${
                  deleteMode === "delete" ? "text-red-500" : "text-green-500"
                }`}
              >
                {deleteMode === "delete" ? (
                  <>
                    <X className="h-5 w-5" />
                    Delete User Account
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Restore User Account
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-black to-[#d4a446]/20 rounded-lg border border-[#d4a446]/50">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black">
                    {deleteTarget.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg text-white font-semibold">
                    {deleteTarget.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {deleteTarget.email}
                  </p>
                </div>
              </div>

              {deleteMode === "delete" ? (
                <p className="text-sm text-red-400">
                  ⚠️ User will be disabled. Admin can restore this account
                  later.
                </p>
              ) : (
                <p className="text-sm text-green-400">
                  ✅ This will restore user access and allow login again.
                </p>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeleteToggle}
                disabled={deleteLoading}
                className={`${
                  deleteMode === "delete"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-black`}
              >
                {deleteLoading ? (
                  <LoadingSpinner size="sm" />
                ) : deleteMode === "delete" ? (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete User
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Restore User
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
