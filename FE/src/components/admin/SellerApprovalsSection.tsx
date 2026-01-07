import { useState } from "react";
import { Check, X, Eye, AlertCircle, FileText, User } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";

interface SellerApplication {
  id: string;
  applicantName: string;
  email: string;
  businessName: string;
  businessType: string;
  description: string;
  experience: string;
  expectedVolume: string;
  verificationDocs: string[];
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  avatarUrl?: string;
}

export function SellerApprovalsSection() {
  const [applications, setApplications] = useState<SellerApplication[]>([
    {
      id: "1",
      applicantName: "Alex Turner",
      email: "alex.turner@example.com",
      businessName: "Turner Fine Watches",
      businessType: "Luxury Watches",
      description: "Specialized dealer in vintage and luxury timepieces with 15 years of experience in the industry.",
      experience: "15+ years in watch trading",
      expectedVolume: "$50,000 - $100,000/month",
      verificationDocs: ["Business License", "ID Verification", "Tax Documents"],
      submittedAt: "2024-11-26 09:30",
      status: "pending"
    },
    {
      id: "2",
      applicantName: "Maria Garcia",
      email: "maria.g@example.com",
      businessName: "Garcia Art Gallery",
      businessType: "Fine Art",
      description: "Contemporary art gallery focusing on emerging artists and limited edition prints.",
      experience: "8 years in art curation",
      expectedVolume: "$30,000 - $75,000/month",
      verificationDocs: ["Business License", "ID Verification"],
      submittedAt: "2024-11-26 08:15",
      status: "pending"
    },
    {
      id: "3",
      applicantName: "David Chen",
      email: "david.chen@example.com",
      businessName: "Chen Collectibles",
      businessType: "Rare Collectibles",
      description: "Trading rare coins, stamps, and memorabilia since 2010.",
      experience: "12 years in collectibles",
      expectedVolume: "$20,000 - $50,000/month",
      verificationDocs: ["Business License", "ID Verification", "Tax Documents", "References"],
      submittedAt: "2024-11-25 16:45",
      status: "pending"
    },
    {
      id: "4",
      applicantName: "Emma Wilson",
      email: "emma.w@example.com",
      businessName: "Wilson Antiques",
      businessType: "Antiques & Furniture",
      description: "Family-owned antique business specializing in 18th and 19th century furniture.",
      experience: "20+ years in antiques",
      expectedVolume: "$75,000 - $150,000/month",
      verificationDocs: ["Business License", "ID Verification"],
      submittedAt: "2024-11-25 14:20",
      status: "approved"
    },
    {
      id: "5",
      applicantName: "James Lee",
      email: "james.lee@example.com",
      businessName: "Lee Motors Classic",
      businessType: "Vintage Cars",
      description: "Classic car restoration and sales.",
      experience: "5 years in automotive",
      expectedVolume: "$100,000+/month",
      verificationDocs: ["Business License"],
      submittedAt: "2024-11-24 11:00",
      status: "rejected"
    },
  ]);

  const [selectedApplication, setSelectedApplication] = useState<SellerApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = (applicationId: string) => {
    setApplications(applications.map(app =>
      app.id === applicationId ? { ...app, status: "approved" as const } : app
    ));
    toast.success("Seller application approved successfully");
    setSelectedApplication(null);
  };

  const handleReject = (applicationId: string, reason: string) => {
    setApplications(applications.map(app =>
      app.id === applicationId ? { ...app, status: "rejected" as const } : app
    ));
    toast.success("Seller application rejected");
    setSelectedApplication(null);
    setRejectionReason("");
  };

  const pendingCount = applications.filter(app => app.status === "pending").length;

  const ApplicationCard = ({ application }: { application: SellerApplication }) => (
    <Card className="p-6 bg-card border-border/50 hover:border-[#fbbf24]/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={application.avatarUrl} />
            <AvatarFallback className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black">
              {application.applicantName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-foreground mb-1">{application.applicantName}</h3>
            <p className="text-muted-foreground text-sm mb-2">{application.email}</p>
            <div className="flex gap-2">
              {application.status === "pending" && (
                <Badge className="bg-[#f59e0b]/10 text-[#f59e0b] border-0">Pending Review</Badge>
              )}
              {application.status === "approved" && (
                <Badge className="bg-green-500/10 text-green-500 border-0">
                  <Check className="h-3 w-3 mr-1" />
                  Approved
                </Badge>
              )}
              {application.status === "rejected" && (
                <Badge className="bg-red-500/10 text-red-500 border-0">
                  <X className="h-3 w-3 mr-1" />
                  Rejected
                </Badge>
              )}
            </div>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{application.submittedAt}</span>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-foreground mb-2">{application.businessName}</h4>
          <p className="text-muted-foreground text-sm mb-3">{application.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Business Type</p>
            <p className="text-sm text-foreground">{application.businessType}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Experience</p>
            <p className="text-sm text-foreground">{application.experience}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Expected Volume</p>
            <p className="text-sm text-foreground">{application.expectedVolume}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Documents</p>
            <p className="text-sm text-foreground">{application.verificationDocs.length} files</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setSelectedApplication(application)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Review Details
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border/50 max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Seller Application Review</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-border/50">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={application.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black text-xl">
                      {application.applicantName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-foreground mb-1">{application.applicantName}</h3>
                    <p className="text-muted-foreground">{application.email}</p>
                    <p className="text-sm text-muted-foreground mt-1">Applied {application.submittedAt}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-foreground mb-2">Business Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-1">Business Name</p>
                        <p className="text-foreground">{application.businessName}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-1">Business Type</p>
                        <p className="text-foreground">{application.businessType}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-1">Experience</p>
                        <p className="text-foreground">{application.experience}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-1">Expected Volume</p>
                        <p className="text-foreground">{application.expectedVolume}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-foreground mb-2">Description</h4>
                    <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                      <p className="text-foreground">{application.description}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-foreground mb-2">Verification Documents</h4>
                    <div className="space-y-2">
                      {application.verificationDocs.map((doc, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50"
                        >
                          <FileText className="h-5 w-5 text-[#fbbf24]" />
                          <span className="text-foreground">{doc}</span>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {application.status === "pending" && (
                  <div className="flex gap-3 pt-6 border-t border-border/50">
                    <Button
                      onClick={() => handleApprove(application.id)}
                      className="flex-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Application
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 text-red-500 hover:text-red-500 hover:bg-red-500/10"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject Application
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card border-border/50">
                        <DialogHeader>
                          <DialogTitle>Reject Application</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-foreground mb-1">This action will reject the seller application</p>
                              <p className="text-xs text-muted-foreground">
                                The applicant will be notified via email with the rejection reason.
                              </p>
                            </div>
                          </div>
                          <Textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter reason for rejection..."
                            className="bg-secondary/50 border-border/50 min-h-[120px]"
                          />
                          <Button
                            onClick={() => handleReject(application.id, rejectionReason)}
                            className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                          >
                            Confirm Rejection
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {application.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => handleApprove(application.id)}
                className="flex-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">Seller Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve seller applications
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black border-0 px-4 py-2">
          {pendingCount} Pending
        </Badge>
      </div>

      {/* Applications */}
      <div className="space-y-4">
        {applications.filter(app => app.status === "pending").length > 0 && (
          <div>
            <h3 className="text-foreground mb-4">Pending Applications</h3>
            <div className="space-y-4">
              {applications
                .filter(app => app.status === "pending")
                .map(app => <ApplicationCard key={app.id} application={app} />)}
            </div>
          </div>
        )}

        {applications.filter(app => app.status !== "pending").length > 0 && (
          <div className="mt-8">
            <h3 className="text-foreground mb-4">Previous Applications</h3>
            <div className="space-y-4">
              {applications
                .filter(app => app.status !== "pending")
                .map(app => <ApplicationCard key={app.id} application={app} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
