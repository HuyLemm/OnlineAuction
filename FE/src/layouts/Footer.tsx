import {
  Gavel,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  GraduationCap,
} from "lucide-react";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const links = {
    Company: [
      { label: "About Us", page: "home" },
      { label: "Careers", page: "home" },
      { label: "Press", page: "home" },
      { label: "Contact", page: "home" },
    ],
    Support: [
      { label: "Help Center", page: "home" },
      { label: "Safety Center", page: "home" },
      { label: "Community Guidelines", page: "home" },
      { label: "Terms of Service", page: "home" },
    ],
    Selling: [
      { label: "How to Sell", page: "seller" },
      { label: "Seller Protection", page: "seller" },
      { label: "Fees", page: "seller" },
      { label: "Best Practices", page: "seller" },
    ],
    Buying: [
      { label: "How to Bid", page: "browse" },
      { label: "Payment Methods", page: "browse" },
      { label: "Buyer Protection", page: "browse" },
      { label: "Shipping Info", page: "browse" },
    ],
  };

  return (
    <footer className="border-t bg-card mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate?.("home")}
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#fbbf24] to-[#f59e0b]">
                <Gavel className="h-5 w-5 text-black" />
              </div>
              <span className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
                LuxeAuction
              </span>
            </button>
            <p className="text-muted-foreground max-w-xs">
              The premier destination for luxury auctions. Discover rare finds,
              place bids, and win exclusive items.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4 text-[#fbbf24]" />
                <span>support@luxeauction.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4 text-[#fbbf24]" />
                <span>+84 (0) 123 456 789</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 text-[#fbbf24]" />
                <span>Ho Chi Minh City, Vietnam</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 hover:border-[#fbbf24]/50 hover:bg-[#fbbf24]/10 transition-all"
              >
                <Twitter className="h-4 w-4 text-yellow-500" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 hover:border-[#fbbf24]/50 hover:bg-[#fbbf24]/10 transition-all"
              >
                <Instagram className="h-4 w-4 text-yellow-500" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 hover:border-[#fbbf24]/50 hover:bg-[#fbbf24]/10 transition-all"
              >
                <Facebook className="h-4 w-4 text-yellow-500" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 hover:border-[#fbbf24]/50 hover:bg-[#fbbf24]/10 transition-all"
              >
                <Linkedin className="h-4 w-4 text-yellow-500" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-foreground">{category}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => onNavigate?.(item.page)}
                      className="text-muted-foreground hover:text-[#fbbf24] transition-colors text-left"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Developer Info Section */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-[#fbbf24]/5 to-transparent border border-[#fbbf24]/10">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex-shrink-0">
              <GraduationCap className="h-6 w-6 text-black" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h4 className="text-foreground mb-2 flex items-center gap-2">
                    <span className="text-[#fbbf24]">Developed by</span>
                    <span>Lâm Thiều Huy</span>
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      MSSV: <span className="text-[#fbbf24]">21127056</span>
                    </p>
                    <p>Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM</p>
                    <p>Khoa Công nghệ Thông tin - Khóa 2021</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="text-right md:text-left">Academic Project</p>
                  <p className="text-right md:text-left text-[#fbbf24]">
                    Web Development Course
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50">
          <p className="text-muted-foreground text-sm">
            © 2026 LuxeAuction. All rights reserved. Built with React & Tailwind
            CSS.
          </p>
          <div className="flex gap-6 text-sm">
            <button
              onClick={() => onNavigate?.("home")}
              className="text-muted-foreground hover:text-[#fbbf24] transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate?.("home")}
              className="text-muted-foreground hover:text-[#fbbf24] transition-colors"
            >
              Cookie Policy
            </button>
            <button
              onClick={() => onNavigate?.("home")}
              className="text-muted-foreground hover:text-[#fbbf24] transition-colors"
            >
              Accessibility
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
