import React from "react";
import Image from "next/image";
import { MediaLightbox } from "@/app/custom_pages/components/sections/MediaLightbox";

export type HeroPromoSplitProps = {
  headline: string;
  badgeText?: string;
  title: string;
  subtitle: string;
  description: string;
  bulletPoints: string[];
  buttonLabel: string;
  buttonUrl: string;
  contactPhone?: string;
  contactEmail?: string;
  profileImageUrl: string;
  fullWidth?: boolean;
  backgroundLeftMedia?: string;
  backgroundLeftMediaType?: 'image' | 'video';
  theme?: {
    backgroundLeft: string;
    backgroundRight: string;
    textColor: string;
    buttonColor: string;
  };
  isEditing?: boolean;
  onChangeMedia?: (url: string) => void;
};

// Function to determine shadow color based on text color
const getShadowColor = (textColor: string): string => {
  // Check if text is white or light colored
  if (textColor.includes('white') || textColor.includes('light') || textColor.includes('gray-100') || textColor.includes('gray-200') || textColor.includes('gray-300')) {
    return 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]';
  }
  // Check if text is black or dark colored
  else if (textColor.includes('black') || textColor.includes('gray-900') || textColor.includes('gray-800') || textColor.includes('gray-700')) {
    return 'drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]';
  }
  // Default to black shadow for other colors
  return 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]';
};

export const HeroPromoSplitSection: React.FC<HeroPromoSplitProps> = ({
  headline,
  badgeText = "Join Us",
  title,
  subtitle,
  description,
  bulletPoints,
  buttonLabel,
  buttonUrl,
  contactPhone,
  contactEmail,
  profileImageUrl,
  fullWidth = false,
  backgroundLeftMedia,
  backgroundLeftMediaType = 'image',
  theme = {
    backgroundLeft: "from-blue-700 to-blue-900",
    backgroundRight: "bg-white",
    textColor: "text-white",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
  },
  isEditing = false,
  onChangeMedia,
}) => {
  // Get the appropriate shadow color based on text color
  const shadowColor = getShadowColor(theme.textColor);

  return (
    <section className={`${fullWidth ? 'w-screen -mx-4 md:-mx-8 lg:-mx-16 xl:-mx-24' : 'w-full'}`}>
      <div className={`flex flex-col lg:flex-row w-full min-h-[500px]`}>
        {/* Left Side */}
        <div
          className={`flex-1 flex items-center justify-center relative ${!backgroundLeftMedia ? `bg-gradient-to-b lg:bg-gradient-to-r ${theme.backgroundLeft}` : ''} ${theme.textColor} p-8`}
        >
          {/* Background Media */}
          {backgroundLeftMedia && (
            <div className="absolute inset-0 z-0">
              {backgroundLeftMediaType === 'video' ? (
                <video
                  src={backgroundLeftMedia}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={backgroundLeftMedia}
                  alt="Background"
                  fill
                  className="object-cover"
                />
              )}
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          )}
          
          <h1 className={`text-4xl md:text-6xl font-extrabold text-center max-w-lg leading-tight relative z-10 ${shadowColor}`}>
            {headline}
          </h1>
        </div>

        {/* Right Side */}
        <div className={`flex-1 relative ${theme.backgroundRight} p-8 lg:p-12 text-gray-900`}>
          {/* Badge */}
          {badgeText && (
            <div className="absolute -top-6 left-6 bg-blue-700 text-white px-4 py-1 rounded-full shadow text-sm font-semibold">
              {badgeText}
            </div>
          )}

          {/* Image */}
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-blue-700 mb-6">
            <Image
              src={profileImageUrl || "/placeholder-profile.jpg"}
              alt="Promo visual"
              fill
              className="object-cover"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <MediaLightbox mediaUrl={profileImageUrl} open={isEditing} mediaType="image" onClose={() => {}} />
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-1">{title}</h2>
          <h3 className="text-blue-700 font-medium mb-3">{subtitle}</h3>
          <p className="mb-4 max-w-lg leading-relaxed text-sm text-gray-700">
            {description}
          </p>

          <ul className="space-y-2 mb-6">
            {bulletPoints.map((point, idx) => (
              <li key={idx} className="flex items-start text-sm">
                <span className="text-blue-600 mr-2 mt-1">✔</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <a
            href={buttonUrl}
            className={`inline-block text-white font-semibold px-6 py-3 rounded-full shadow ${theme.buttonColor}`}
          >
            {buttonLabel}
          </a>

          {/* Contact Info */}
          <div className="mt-6 text-sm text-gray-600">
            {contactPhone && <p>📞 {contactPhone}</p>}
            {contactEmail && <p>📧 {contactEmail}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};