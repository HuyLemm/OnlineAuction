import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const categories = [
    "Watches",
    "Jewelry",
    "Art",
    "Collectibles",
    "Vintage Cars",
    "Electronics",
    "Fashion",
    "Home & Garden"
  ];

  const conditions = ["New", "Like New", "Good", "Fair"];

  return (
    <aside
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] w-80 border-r bg-card p-6 transition-transform duration-300 overflow-y-auto z-40`}
    >
      {/* Mobile Close Button */}
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <h3>Filters</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <div>
          <h4 className="mb-3 text-muted-foreground">Categories</h4>
          <div className="space-y-2.5">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={category} />
                <Label
                  htmlFor={category}
                  className="cursor-pointer text-foreground/80"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Price Range */}
        <div>
          <h4 className="mb-3 text-muted-foreground">Price Range</h4>
          <div className="space-y-4">
            <Slider
              defaultValue={[0, 100000]}
              max={100000}
              step={1000}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <span className="text-foreground/70">$0</span>
              <span className="text-foreground/70">$100,000+</span>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Condition */}
        <div>
          <h4 className="mb-3 text-muted-foreground">Condition</h4>
          <div className="space-y-2.5">
            {conditions.map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox id={condition} />
                <Label
                  htmlFor={condition}
                  className="cursor-pointer text-foreground/80"
                >
                  {condition}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Auction Status */}
        <div>
          <h4 className="mb-3 text-muted-foreground">Status</h4>
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2">
              <Checkbox id="live" defaultChecked />
              <Label htmlFor="live" className="cursor-pointer text-foreground/80">
                Live Auctions
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="ending-soon" />
              <Label htmlFor="ending-soon" className="cursor-pointer text-foreground/80">
                Ending Soon
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="upcoming" />
              <Label htmlFor="upcoming" className="cursor-pointer text-foreground/80">
                Upcoming
              </Label>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full mt-6">
          Clear Filters
        </Button>
      </div>
    </aside>
  );
}
