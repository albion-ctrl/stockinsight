"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Truck, Package } from "lucide-react";

interface VehicleImageProps {
  src?: string | null;
  alt: string;
  brand: string;
  type: "truck" | "van";
  className?: string;
  aspectRatio?: "video" | "square";
}

const SAMPLE_IMAGES: Record<string, string> = {
  "MAN TGX": "https://www.denengelsen.eu/transforms/_stockThumb/3195323/50389020_1.webp",
  "MAN TGE": "https://www.denengelsen.eu/transforms/_stockThumb/3199280/46824866_1.webp",
  "MAN TGM": "https://www.denengelsen.eu/transforms/_stockThumb/3199178/46825346_1.webp",
  "MAN TGL": "https://www.denengelsen.eu/transforms/_stockThumb/3195323/50389020_1.webp",
  "MAN TGS": "https://www.denengelsen.eu/transforms/_stockThumb/3199178/46825346_1.webp",
  "VW Crafter": "https://www.denengelsentopused.eu/transforms/_stockThumb/3205709/52013469_1.webp",
  "VW Transporter": "https://www.denengelsentopused.eu/transforms/_stockThumb/3204248/50945868_1.webp",
  "VW Caddy": "https://www.denengelsentopused.eu/transforms/_stockThumb/3206931/52087636_1.webp",
  "VW Multivan": "https://www.denengelsentopused.eu/transforms/_stockThumb/3204248/50945868_1.webp",
};

function getVehicleImageUrl(name: string, brand: string): string | null {
  const searchKey = `${brand} ${name.split(" ").slice(1).join(" ")}`.toUpperCase();
  
  for (const [key, url] of Object.entries(SAMPLE_IMAGES)) {
    if (searchKey.includes(key.toUpperCase())) {
      return url;
    }
  }
  
  if (brand === "MAN") {
    return "https://www.denengelsen.eu/transforms/_stockThumb/3195323/50389020_1.webp";
  }
  if (brand === "VW") {
    return "https://www.denengelsentopused.eu/transforms/_stockThumb/3205709/52013469_1.webp";
  }
  
  return null;
}

export function VehicleImage({ src, alt, brand, type, className, aspectRatio = "video" }: VehicleImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(src || null);

  useEffect(() => {
    if (!src) {
      const denEngelsenUrl = getVehicleImageUrl(alt, brand);
      if (denEngelsenUrl) {
        setImageUrl(denEngelsenUrl);
      }
    } else {
      setImageUrl(src);
    }
  }, [src, alt, brand]);

  const isMan = brand === "MAN";
  const brandColor = isMan ? "text-brand" : "text-blue-700";
  const brandBg = isMan ? "bg-red-50" : "bg-blue-50";
  const brandBorder = isMan ? "border-red-100" : "border-blue-100";

  const showPlaceholder = !imageUrl || error;

  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-secondary", className, aspectRatio === "video" ? "aspect-[16/10]" : "aspect-square")}>
      {showPlaceholder ? (
        <div className={cn("absolute inset-0 flex flex-col items-center justify-center", brandBg)}>
          {type === "truck" ? (
            <Truck className={cn("w-8 h-8", brandColor)} />
          ) : (
            <Package className={cn("w-8 h-8", brandColor)} />
          )}
        </div>
      ) : (
        <>
          <img
            src={imageUrl}
            alt={alt}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              loading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
          />
          {loading && (
            <div className="absolute inset-0 bg-secondary animate-pulse" />
          )}
        </>
      )}
      {/* Brand badge */}
      <div className={cn(
        "absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold border",
        brandBg, brandColor, brandBorder
      )}>
        {brand === "Mercedes-Benz" ? "Merc" : brand === "Citroën" ? "Cit" : brand === "Škoda" ? "Skod" : brand}
      </div>
    </div>
  );
}
