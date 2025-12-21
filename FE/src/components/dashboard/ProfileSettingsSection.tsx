import { useState, useEffect } from "react";
import { User, Mail, Calendar, MapPin, Lock } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import {
  GET_PROFILE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
} from "../utils/api";
import { toast } from "sonner";

import { LoadingSpinner } from "../state";

const normalizeDobForDateInput = (v: any) => {
  if (!v) return "";
  if (typeof v === "string") {
    // Nếu là "2003-11-17" thì ok luôn
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;

    // Nếu là ISO "2003-11-17T..." -> lấy phần trước T
    if (v.includes("T")) return v.split("T")[0];

    // Nếu là kiểu "17 Nov 2003" -> parse date
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);

    return "";
  }

  // Nếu backend trả Date object
  const d = new Date(v);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return "";
};

export function ProfileSettingsSection() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  /* ================= PROFILE STATE ================= */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  /* ================= PASSWORD STATE ================= */
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetchWithAuth(GET_PROFILE_API);
        if (!res.ok) throw new Error();

        const json = await res.json();
        const u = json.data;
        console.log(u);

        setFullName(u.full_name ?? "");
        setEmail(u.email ?? "");
        setDob(normalizeDobForDateInput(u.dob));
        setAddress(u.address ?? "");
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* ================= SAVE PROFILE ================= */
  const handleSaveProfile = async () => {
    try {
      await fetchWithAuth(UPDATE_PROFILE_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          dob: dob || null,
          address,
        }),
      });

      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.warning("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await fetchWithAuth(CHANGE_PASSWORD_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated");
    } catch {
      toast.error("Failed to change password");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Update your personal information and password
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 border border-border/50">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        {/* ================= PROFILE ================= */}
        <TabsContent value="profile" className="mt-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
            <h3 className="text-foreground">Personal Information</h3>

            <div className="space-y-4">
              <Field
                label="Full Name"
                icon={<User />}
                value={fullName}
                onChange={setFullName}
              />

              <Field
                label="Email"
                icon={<Mail />}
                type="email"
                value={email}
                onChange={setEmail}
              />

              <Field
                label="Date of Birth"
                icon={<Calendar />}
                type="date"
                value={dob}
                onChange={setDob}
              />

              <Field
                label="Address"
                icon={<MapPin />}
                value={address}
                onChange={setAddress}
              />
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button
                onClick={handleSaveProfile}
                className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ================= PASSWORD ================= */}
        <TabsContent value="password" className="mt-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
            <h3 className="text-foreground">Change Password</h3>

            <Field
              label="Current Password"
              icon={<Lock />}
              type="password"
              value={oldPassword}
              onChange={setOldPassword}
            />

            <Field
              label="New Password"
              icon={<Lock />}
              type="password"
              value={newPassword}
              onChange={setNewPassword}
            />

            <Field
              label="Confirm New Password"
              icon={<Lock />}
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            <Button
              onClick={handleChangePassword}
              className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
            >
              Update Password
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ================= SMALL FIELD COMPONENT ================= */

function Field({
  label,
  icon,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-yellow-500">{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 bg-secondary/50 border-border/50 text-lg"
        />
      </div>
    </div>
  );
}
