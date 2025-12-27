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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner";

import { fetchWithAuth } from "../utils/fetchWithAuth";
import { GET_USERS_FOR_ADMIN_API } from "../utils/api";

/* ================= TYPES ================= */

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  status: "active" | "suspended" | "banned";
  joinedDate: string;

  totalBids: number; // products_joined
  totalPurchases: number; // products_won
  totalSales: number; // products_sold

  avatarUrl?: string;
  verificationStatus: "verified" | "unverified";

  sellerApprovalStatus?: "none" | "pending" | "approved" | "rejected";
  sellerApprovalDate?: string;
}

/* ================= COMPONENT ================= */

export function UserManagementSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);

  /* ================= FETCH USERS ================= */

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
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

        sellerApprovalStatus:
          u.latest_seller_request_status === "pending"
            ? "pending"
            : u.latest_seller_request_status === "approved"
            ? "approved"
            : u.latest_seller_request_status === "rejected"
            ? "rejected"
            : "none",
      }));

      setUsers(mapped);
    } catch (err: any) {
      toast.error(err.message || "Failed to load users");
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

  const activeUsers = filteredUsers.filter((u) => u.status === "active").length;

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
                        // onClick={() => handleApproveSellerRequest(user.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                        // onClick={() => handleRejectSellerRequest(user.id)}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedUser(user)}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* USER DETAILS DIALOG */}
      {selectedUser && (
        <Dialog open onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.status}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
