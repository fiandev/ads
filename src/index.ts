/**
 * Ads library
 * Authored by Aditia Akbar (fiandev)
 */

import ads, { Ads } from "./Ads";

declare global {
  interface Window {
    ads: Ads;
    Ads: typeof Ads;
  }
}

export * from "./types";
export { ads, Ads };

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.ads = ads;
  window.Ads = Ads;
}
