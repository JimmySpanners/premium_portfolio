import React from "react";
import { HeroPromoSplitProps } from "./HeroPromoSplitSection";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";

interface EditHeroPromoSplitSectionProps {
  data: HeroPromoSplitProps;
  onChange: (updated: Partial<HeroPromoSplitProps>) => void;
  onMediaSelect?: (mediaType?: string) => void;
}

export const EditHeroPromoSplitSection: React.FC<EditHeroPromoSplitSectionProps> = ({
  data,
  onChange,
  onMediaSelect,
}) => {
  const updateField = <K extends keyof HeroPromoSplitProps>(key: K, value: HeroPromoSplitProps[K]) => {
    onChange({ [key]: value });
  };

  const updateTheme = (key: 'backgroundLeft' | 'backgroundRight' | 'textColor' | 'buttonColor', value: string) => {
    onChange({
      theme: {
        backgroundLeft: "from-blue-700 to-blue-900",
        backgroundRight: "bg-white",
        textColor: "text-white",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
        ...data.theme,
        [key]: value,
      },
    });
  };

  const updateBullet = (index: number, value: string) => {
    const updated = [...data.bulletPoints];
    updated[index] = value;
    updateField("bulletPoints", updated);
  };

  const addBullet = () => {
    updateField("bulletPoints", [...data.bulletPoints, ""]);
  };

  const removeBullet = (index: number) => {
    const updated = [...data.bulletPoints];
    updated.splice(index, 1);
    updateField("bulletPoints", updated);
  };

  return (
    <div className="space-y-4">
      <input className="w-full p-2 border rounded" placeholder="Headline" value={data.headline} onChange={(e) => updateField("headline", e.target.value)} />
      <input className="w-full p-2 border rounded" placeholder="Badge Text" value={data.badgeText || ""} onChange={(e) => updateField("badgeText", e.target.value)} />
      <input className="w-full p-2 border rounded" placeholder="Title" value={data.title} onChange={(e) => updateField("title", e.target.value)} />
      <input className="w-full p-2 border rounded" placeholder="Subtitle" value={data.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} />
      <textarea className="w-full p-2 border rounded" placeholder="Description" rows={3} value={data.description} onChange={(e) => updateField("description", e.target.value)} />

      <div className="space-y-2">
        <label className="font-semibold">Bullet Points:</label>
        {data.bulletPoints.map((point, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input className="w-full p-2 border rounded" value={point} onChange={(e) => updateBullet(i, e.target.value)} />
            <button type="button" onClick={() => removeBullet(i)} className="text-red-500">✕</button>
          </div>
        ))}
        <button type="button" onClick={addBullet} className="text-sm text-blue-600 underline">+ Add Bullet Point</button>
      </div>

      <input className="w-full p-2 border rounded" placeholder="Button Label" value={data.buttonLabel} onChange={(e) => updateField("buttonLabel", e.target.value)} />
      <input className="w-full p-2 border rounded" placeholder="Button URL" value={data.buttonUrl} onChange={(e) => updateField("buttonUrl", e.target.value)} />

      <input className="w-full p-2 border rounded" placeholder="Phone" value={data.contactPhone || ""} onChange={(e) => updateField("contactPhone", e.target.value)} />
      <input className="w-full p-2 border rounded" placeholder="Email" value={data.contactEmail || ""} onChange={(e) => updateField("contactEmail", e.target.value)} />

      <div className="pt-4">
        <label className="font-semibold block mb-2">Profile Image:</label>
        <div className="flex items-center gap-3">
          {data.profileImageUrl && (
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src={data.profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onMediaSelect?.('profile-image');
            }}
            className="flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            {data.profileImageUrl ? "Change Image" : "Add Image"}
          </Button>
        </div>
      </div>

      <div className="pt-4">
        <label className="font-semibold block mb-2">Left Column Background:</label>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {data.backgroundLeftMedia && (
              <div className="relative w-16 h-16 rounded overflow-hidden border-2 border-gray-300">
                {data.backgroundLeftMediaType === 'video' ? (
                  <video
                    src={data.backgroundLeftMedia}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={data.backgroundLeftMedia}
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onMediaSelect?.('background-left-media');
              }}
              className="flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              {data.backgroundLeftMedia ? "Change Background" : "Add Background Media"}
            </Button>
          </div>
          
          {data.backgroundLeftMedia && (
            <div className="flex items-center gap-2">
              <label className="text-sm">Media Type:</label>
              <select
                value={data.backgroundLeftMediaType || 'image'}
                onChange={(e) => updateField("backgroundLeftMediaType", e.target.value as 'image' | 'video')}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              <button
                type="button"
                onClick={() => updateField("backgroundLeftMedia", undefined)}
                className="text-sm text-red-600 underline"
              >
                Remove Background
              </button>
            </div>
          )}
          
          <p className="text-sm text-gray-600">
            Choose between a color gradient or media file for the left column background
          </p>
        </div>
      </div>

      <div className="pt-4">
        <label className="flex items-center gap-2 font-semibold">
          <input
            type="checkbox"
            checked={data.fullWidth || false}
            onChange={(e) => updateField("fullWidth", e.target.checked)}
            className="w-4 h-4"
          />
          Full Viewport Width
        </label>
        <p className="text-sm text-gray-600 mt-1">
          When enabled, the section will take up the full height of the viewport
        </p>
      </div>

      <div className="pt-6 space-y-2">
        <label className="font-semibold">Theme Customization</label>
        <input className="w-full p-2 border rounded" placeholder="Left Background Gradient (e.g. from-blue-700 to-blue-900)" value={data.theme?.backgroundLeft || ""} onChange={(e) => updateTheme("backgroundLeft", e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Right Background Color (e.g. bg-white)" value={data.theme?.backgroundRight || ""} onChange={(e) => updateTheme("backgroundRight", e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Text Color (e.g. text-white)" value={data.theme?.textColor || ""} onChange={(e) => updateTheme("textColor", e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Button Color (e.g. bg-blue-600 hover:bg-blue-700)" value={data.theme?.buttonColor || ""} onChange={(e) => updateTheme("buttonColor", e.target.value)} />
      </div>
    </div>
  );
};