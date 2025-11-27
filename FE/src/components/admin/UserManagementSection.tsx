import { useState } from "react";
import { Search, MoreVertical, Ban, CheckCircle, Shield, User, Mail, Calendar } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  status: "active" | "suspended" | "banned";
  joinedDate: string;
  totalBids: number;
  totalPurchases: number;
  totalSales: number;
  avatarUrl?: string;
  verificationStatus: "verified" | "unverified";
}

export function UserManagementSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [users, setUsers] = useState<UserData[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "seller",
      status: "active",
      joinedDate: "2024-01-15",
      totalBids: 45,
      totalPurchases: 12,
      totalSales: 28,
      verificationStatus: "verified"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "buyer",
      status: "active",
      joinedDate: "2024-02-20",
      totalBids: 32,
      totalPurchases: 8,
      totalSales: 0,
      verificationStatus: "verified"
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.j@example.com",
      role: "seller",
      status: "suspended",
      joinedDate: "2024-03-10",
      totalBids: 18,
      totalPurchases: 5,
      totalSales: 15,
      verificationStatus: "unverified"
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      role: "buyer",
      status: "active",
      joinedDate: "2024-04-05",
      totalBids: 67,
      totalPurchases: 23,
      totalSales: 0,
      verificationStatus: "verified"
    },
    {
      id: "5",
      name: "Tom Brown",
      email: "tom.brown@example.com",
      role: "admin",
      status: "active",
      joinedDate: "2023-12-01",
      totalBids: 0,
      totalPurchases: 0,
      totalSales: 0,
      verificationStatus: "verified"
    },
  ]);

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: "suspended" as const } : user
    ));
    toast.success("User suspended successfully");
  };

  const handleActivateUser = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: "active" as const } : user
    ));
    toast.success("User activated successfully");
  };

  const handleBanUser = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: "banned" as const } : user
    ));
    toast.success("User banned");
  };

  const handlePromoteToSeller = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, role: "seller" as const } : user
    ));
    toast.success("User promoted to seller");
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500/10 text-purple-500 border-0"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
      case "seller":
        return <Badge className="bg-[#fbbf24]/10 text-[#fbbf24] border-0">Seller</Badge>;
      case "buyer":
        return <Badge className="bg-blue-500/10 text-blue-500 border-0">Buyer</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-500 border-0">Active</Badge>;
      case "suspended":
        return <Badge className="bg-[#f59e0b]/10 text-[#f59e0b] border-0">Suspended</Badge>;
      case "banned":
        return <Badge className="bg-red-500/10 text-red-500 border-0">Banned</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage platform users and permissions
          </p>
        </div>
        <div className="flex items-center gap-4">
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-card border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Users</p>
              <h3 className="text-foreground">{users.length}</h3>
            </div>
            <User className="h-8 w-8 text-[#fbbf24]" />
          </div>
        </Card>
        <Card className="p-6 bg-card border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Active Users</p>
              <h3 className="text-foreground">{users.filter(u => u.status === "active").length}</h3>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6 bg-card border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Sellers</p>
              <h3 className="text-foreground">{users.filter(u => u.role === "seller").length}</h3>
            </div>
            <Badge className="bg-[#fbbf24]/10 text-[#fbbf24] border-0 h-8 px-3">Verified</Badge>
          </div>
        </Card>
        <Card className="p-6 bg-card border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Suspended</p>
              <h3 className="text-foreground">{users.filter(u => u.status === "suspended").length}</h3>
            </div>
            <Ban className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-card border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
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
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-border/50 hover:bg-secondary/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-foreground">{user.name}</p>
                      {user.verificationStatus === "verified" && (
                        <Badge className="bg-blue-500/10 text-blue-500 border-0 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
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
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Bids: {user.totalBids}</p>
                    <p className="text-muted-foreground">
                      {user.role === "seller" ? `Sales: ${user.totalSales}` : `Purchases: ${user.totalPurchases}`}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border/50">
                      <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                        View Details
                      </DropdownMenuItem>
                      {user.role === "buyer" && (
                        <DropdownMenuItem onClick={() => handlePromoteToSeller(user.id)}>
                          Promote to Seller
                        </DropdownMenuItem>
                      )}
                      {user.status === "active" ? (
                        <DropdownMenuItem 
                          onClick={() => handleSuspendUser(user.id)}
                          className="text-[#f59e0b]"
                        >
                          Suspend User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => handleActivateUser(user.id)}
                          className="text-green-500"
                        >
                          Activate User
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleBanUser(user.id)}
                        className="text-red-500"
                      >
                        Ban User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="bg-card border-border/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black text-xl">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-foreground mb-1">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-secondary/30 border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Total Bids</p>
                  <p className="text-foreground text-xl">{selectedUser.totalBids}</p>
                </Card>
                <Card className="p-4 bg-secondary/30 border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Total Purchases</p>
                  <p className="text-foreground text-xl">{selectedUser.totalPurchases}</p>
                </Card>
                <Card className="p-4 bg-secondary/30 border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
                  <p className="text-foreground text-xl">{selectedUser.totalSales}</p>
                </Card>
                <Card className="p-4 bg-secondary/30 border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                  <p className="text-foreground">{selectedUser.joinedDate}</p>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
