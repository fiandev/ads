/**
 * Ads library
 * Authored by Aditia Akbar (fiandev)
 */

import { AdsConfig, AdsResponse, AdItem, AdType } from "./types";

export class Ads {
  private static instance: Ads;
  private config: AdsConfig | null = null;
  private isBrowser: boolean;

  private constructor() {
    this.isBrowser =
      typeof window !== "undefined" && typeof document !== "undefined";
  }

  public static getInstance(): Ads {
    if (!Ads.instance) {
      Ads.instance = new Ads();
    }
    return Ads.instance;
  }

  public init(config: AdsConfig): void {
    this.config = {
      debug: false,
      requestTimeout: 5000,
      fetchOptions: {},
      ...config,
    };

    if (this.config.debug) {
      console.log("[Ads] Initialized with config:", this.config);
    }

    if (this.isBrowser) {
      this.renderAds();
    }
  }

  public async getAds(): Promise<AdsResponse> {
    if (!this.config) {
      throw new Error("Ads library not initialized. Call ads.init() first.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config!.requestTimeout,
    );

    try {
      const response = await fetch(this.config.url, {
        ...this.config.fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AdsResponse = await response.json();

      if (this.config.debug) {
        console.log("[Ads] Fetched ads:", data);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (this.config.debug) {
        console.error("[Ads] Error fetching ads:", error);
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
          `Request timeout after ${this.config!.requestTimeout}ms`,
        );
      }

      throw error;
    }
  }

  private renderAds(): void {
    if (!this.isBrowser) return;

    const adElements = document.querySelectorAll('[class^="ads-"]');

    adElements.forEach((element) => {
      const className = Array.from(element.classList).find((cls) =>
        cls.startsWith("ads-"),
      );
      if (!className) return;

      const adType = className.replace("ads-", "") as AdType;
      this.renderAdToElement(element, adType);
    });
  }

  private async renderAdToElement(
    element: Element,
    adType: AdType,
  ): Promise<void> {
    try {
      const response = await this.getAds();
      const ad = this.selectAdByType(response.data, adType);

      if (ad) {
        this.createAdElement(element, ad);
      }
    } catch (error) {
      if (this.config?.debug) {
        console.error(`[Ads] Error rendering ${adType} ad:`, error);
      }
    }
  }

  private selectAdByType(ads: AdItem[], type: AdType): AdItem | null {
    if (ads.length === 0) return null;

    const typeIndex = type === "vertical" ? 0 : type === "horizontal" ? 1 : 2;
    return ads[Math.min(typeIndex, ads.length - 1)];
  }

  private createAdElement(container: Element, ad: AdItem): void {
    const link = document.createElement("a");
    link.href = ad.redirect;
    link.target = ad.target || "_blank";
    link.rel = "noopener noreferrer";

    const img = document.createElement("img");
    img.src = ad.image;
    img.alt = ad.alt || "Advertisement";

    if (ad.width) img.width = ad.width;
    if (ad.height) img.height = ad.height;

    link.appendChild(img);
    container.innerHTML = "";
    container.appendChild(link);

    if (this.config?.debug) {
      console.log("[Ads] Rendered ad:", ad);
    }
  }
}

export const ads = Ads.getInstance();
export default ads;
