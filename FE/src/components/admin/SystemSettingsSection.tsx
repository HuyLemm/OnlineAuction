import { useEffect, useState } from "react";
import { Clock, Save, Pencil } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { toast } from "sonner";
import { LoadingSpinner } from "../state";
import {
  GET_SYSTEM_SETTINGS_API,
  UPDATE_SYSTEM_SETTINGS_API,
} from "../utils/api";

interface SystemSettings {
  auto_extend_duration_minutes: number;
  auto_extend_threshold_minutes: number;
}

export function SystemSettingsSection() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [settings, setSettings] = useState<SystemSettings>({
    auto_extend_duration_minutes: 10,
    auto_extend_threshold_minutes: 5,
  });

  const [draft, setDraft] = useState<SystemSettings | null>(null);

  /* ================= LOAD ================= */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetchWithAuth(GET_SYSTEM_SETTINGS_API);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);

        const loaded = {
          auto_extend_duration_minutes:
            Number(json.data.auto_extend_duration_minutes) ?? 10,
          auto_extend_threshold_minutes:
            Number(json.data.auto_extend_threshold_minutes) ?? 5,
        };

        setSettings(loaded);
        setDraft(loaded);
      } catch (err: any) {
        toast.error(err.message || "Failed to load system settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!draft) return;

    if (
      draft.auto_extend_threshold_minutes >= draft.auto_extend_duration_minutes
    ) {
      toast.error("Threshold must be smaller than duration");
      return;
    }

    try {
      setSaving(true);

      const res = await fetchWithAuth(UPDATE_SYSTEM_SETTINGS_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      setSettings(draft);
      setIsEditing(false);
      toast.success("System settings updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !draft) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-1">System Settings</h1>
          <p className="text-muted-foreground">
            Configure global auction behaviors
          </p>
        </div>

        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Settings
          </Button>
        )}
      </div>

      {/* Card */}
      <Card className="p-6 space-y-6 border border-border/50">
        {/* Duration */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#fbbf24]" />
            Auto Extend Duration (minutes)
          </Label>
          <Input
            type="number"
            min={1}
            disabled={!isEditing}
            value={draft.auto_extend_duration_minutes}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev!,
                auto_extend_duration_minutes: Number(e.target.value),
              }))
            }
          />
        </div>

        {/* Threshold */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#f59e0b]" />
            Auto Extend Threshold (minutes)
          </Label>
          <Input
            type="number"
            min={1}
            disabled={!isEditing}
            value={draft.auto_extend_threshold_minutes}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev!,
                auto_extend_threshold_minutes: Number(e.target.value),
              }))
            }
          />
        </div>

        {/* Actions */}
        {isEditing && (
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setDraft(settings);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>

            <Button
              className="flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
