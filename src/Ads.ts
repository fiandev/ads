/**
 * Ads library
 * Authored by Aditia Akbar (fiandev)
 */

import { AdsConfig, AdsResponse, AdItem, AdType } from "./types";

export class Ads {
  private static instance: Ads;
  private config: AdsConfig | null = null;
  private isBrowser: boolean;
  private cachedAds: AdsResponse | null = null;
  private fetchPromise: Promise<AdsResponse> | null = null;

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

    // Auto-fetch ads after initialization (non-blocking)
    this.fetchAndCacheAds();

    if (this.isBrowser) {
      this.renderAds();
    }
  }

  private async fetchAndCacheAds(): Promise<void> {
    if (!this.config) {
      console.error("Ads library not initialized. Call ads.init() first.");
      return;
    }

    // If we already have a pending fetch, skip
    if (this.fetchPromise) {
      return;
    }

    // Create a new fetch promise
    this.fetchPromise = this.performFetch();

    try {
      this.cachedAds = await this.fetchPromise;
    } catch (error) {
      if (this.config.debug) {
        console.error("[Ads] Failed to fetch ads:", error);
      }
    } finally {
      // Clear the fetch promise after completion
      this.fetchPromise = null;
    }
  }

  private async performFetch(): Promise<AdsResponse> {
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

  public getAds(): Promise<AdsResponse> {
    if (!this.config) {
      throw new Error("Ads library not initialized. Call ads.init() first.");
    }

    // If we already have cached data, return a resolved promise with cached data
    if (this.cachedAds) {
      return Promise.resolve(this.cachedAds);
    }

    // If there's a pending fetch, return that promise
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    // If no cached data and no pending fetch, initiate a new fetch
    return this.performFetch().then((data) => {
      this.cachedAds = data;
      return data;
    });
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

    // Randomly select an ad from the available ads
    const randomIndex = Math.floor(Math.random() * ads.length);
    return ads[randomIndex];
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
