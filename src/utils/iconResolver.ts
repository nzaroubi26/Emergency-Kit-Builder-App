import {
  Zap,
  Lightbulb,
  Radio,
  Droplets,
  Droplet,
  Snowflake,
  CloudRain,
  Footprints,
  PawPrint,
  UtensilsCrossed,
  HeartPulse,
  Smile,
  Shirt,
  Settings2,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Lightbulb,
  Radio,
  Droplets,
  Droplet,
  Snowflake,
  CloudRain,
  Footprints,
  PawPrint,
  UtensilsCrossed,
  HeartPulse,
  Smile,
  Shirt,
  Settings2,
};

export const resolveIcon = (iconName: string): LucideIcon | undefined =>
  ICON_MAP[iconName];
