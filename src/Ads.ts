import { AdsConfig, AdsResponse, AdItem, AdType } from "./types";

/** Constant definitions */
const SCALE_MIN = 1;
const SCALE_MAX = 5;

const CAROUSEL_INTERVAL_MS = 4000;
const CAROUSEL_FADE_MS = 250;

const BORDER_WIDTH = "2px";
const BORDER_COLOR = "#444";

const WRAPPER_BG = "#000";

const RATIO_HORIZONTAL = { w: 12, h: 4 };
const RATIO_VERTICAL = { w: 4, h: 12 };
const RATIO_SQUARE = { w: 4, h: 4 };

export class Ads {
  private static instance: Ads;
  private config: AdsConfig | null = null;
  private isBrowser = typeof window !== "undefined";
  private cachedAds: AdsResponse | null = null;
  private fetchPromise: Promise<AdsResponse> | null = null;

  /** Returns the singleton instance */
  public static getInstance(): Ads {
    if (!Ads.instance) Ads.instance = new Ads();
    return Ads.instance;
  }

  /** Outputs debug log messages */
  private log(...msg: any[]) {
    if (this.config?.debug) console.log("[Ads]", ...msg);
  }

  /** Outputs debug error messages */
  private error(...msg: any[]) {
    if (this.config?.debug) console.error("[Ads ERROR]", ...msg);
  }

  /** Initializes the advertisement system */
  public init(config: AdsConfig): void {
    this.config = {
      debug: false,
      requestTimeout: 5000,
      fetchOptions: {},
      ...config,
    };

    this.fetchAndCacheAds();
    if (this.isBrowser) this.renderAds();
  }

  /** Fetches ads and stores them in cache */
  private async fetchAndCacheAds(): Promise<void> {
    if (!this.config) return;
    if (this.fetchPromise) return;

    this.fetchPromise = this.performFetch();

    try {
      this.cachedAds = await this.fetchPromise;
      this.log("Cached ads", this.cachedAds);
    } catch (err) {
      this.error("fetchAndCacheAds", err);
    } finally {
      this.fetchPromise = null;
    }
  }

  /** Executes a network request to retrieve ad data */
  private async performFetch(): Promise<AdsResponse> {
    if (!this.config) throw new Error("Configuration not initialized");

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      this.config.requestTimeout,
    );

    try {
      const res = await fetch(this.config.url, {
        ...this.config.fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeout);
      if (!res.ok) throw new Error("HTTP " + res.status);

      const json = await res.json();
      this.log("Fetch success", json);
      return json;
    } catch (err) {
      clearTimeout(timeout);
      this.error("performFetch", err);
      throw err;
    }
  }

  /** Returns cached ads or performs a new fetch */
  public getAds(): Promise<AdsResponse> {
    if (!this.config) throw new Error("Configuration not initialized");
    if (this.cachedAds) return Promise.resolve(this.cachedAds);
    if (this.fetchPromise) return this.fetchPromise;

    return this.performFetch().then((data) => {
      this.cachedAds = data;
      return data;
    });
  }

  /** Renders all ads-* nodes */
  private renderAds(): void {
    const elements = document.querySelectorAll('[class^="ads-"]');

    elements.forEach((el) => {
      const cls = Array.from(el.classList).find((c) => c.startsWith("ads-"));
      if (!cls) return;

      const type = cls.replace("ads-", "") as AdType;
      const size = Number(el.getAttribute("size") || SCALE_MIN);
      const carousel = el.getAttribute("carousel") === "true";

      this.renderAdToElement(el, type, size, carousel);
    });
  }

  /** Renders a single advertisement element */
  private async renderAdToElement(
    element: Element,
    adType: AdType,
    size: number,
    carousel: boolean,
  ): Promise<void> {
    try {
      const response = await this.getAds();
      const ads = response.data;

      if (carousel) {
        this.createCarousel(element, ads, adType, size);
      } else {
        const ad = ads[Math.floor(Math.random() * ads.length)];
        this.createAdElement(element, ad, adType, size);
      }
    } catch (err) {
      this.error("renderAdToElement", err);
    }
  }

  /** Returns width/height ratio for specific ad type */
  private getRatio(type: AdType) {
    if (type === "horizontal") return RATIO_HORIZONTAL;
    if (type === "vertical") return RATIO_VERTICAL;
    return RATIO_SQUARE;
  }

  /** Creates an advertisement carousel */
  private createCarousel(
    container: Element,
    ads: AdItem[],
    adType: AdType,
    size: number,
  ): void {
    let index = 0;
    const ratio = this.getRatio(adType);
    const scale = Math.min(Math.max(size, SCALE_MIN), SCALE_MAX);

    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.overflow = "hidden";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.transition = `opacity ${CAROUSEL_FADE_MS}ms`;
    wrapper.style.border = `${BORDER_WIDTH} solid ${BORDER_COLOR}`;
    wrapper.style.background = WRAPPER_BG;
    wrapper.style.width = `${ratio.w * scale}rem`;
    wrapper.style.height = `${ratio.h * scale}rem`;

    container.innerHTML = "";
    container.appendChild(wrapper);

    const renderSlide = () => {
      const ad = ads[index];

      const imgWrap = document.createElement("div");
      imgWrap.style.flex = "1";
      imgWrap.style.width = "100%";
      imgWrap.style.display = "flex";
      imgWrap.style.justifyContent = "center";
      imgWrap.style.alignItems = "center";

      const link = document.createElement("a");
      link.href = ad.redirect;
      link.target = "_blank";

      const img = document.createElement("img");
      img.src = ad.image;
      img.alt = ad.alt || "";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";

      link.style.display = "block";
      link.style.width = "100%";
      link.style.height = "100%";

      link.appendChild(img);
      imgWrap.appendChild(link);

      wrapper.style.opacity = "0";

      setTimeout(() => {
        while (wrapper.lastChild && wrapper.children.length > 0) {
          wrapper.removeChild(wrapper.lastChild);
        }
        wrapper.appendChild(imgWrap);
        wrapper.style.opacity = "1";
      }, CAROUSEL_FADE_MS);
    };

    renderSlide();

    setInterval(() => {
      index = (index + 1) % ads.length;
      renderSlide();
    }, CAROUSEL_INTERVAL_MS);
  }

  /** Creates a single static advertisement */
  private createAdElement(
    container: Element,
    ad: AdItem,
    adType: AdType,
    size: number,
  ): void {
    const ratio = this.getRatio(adType);
    const scale = Math.min(Math.max(size, SCALE_MIN), SCALE_MAX);

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.border = `${BORDER_WIDTH} solid ${BORDER_COLOR}`;
    wrapper.style.background = WRAPPER_BG;
    wrapper.style.width = `${ratio.w * scale}rem`;
    wrapper.style.height = `${ratio.h * scale}rem`;

    const imgWrap = document.createElement("div");
    imgWrap.style.flex = "1";
    imgWrap.style.width = "100%";
    imgWrap.style.display = "flex";
    imgWrap.style.justifyContent = "center";
    imgWrap.style.alignItems = "center";

    const link = document.createElement("a");
    link.href = ad.redirect;
    link.target = "_blank";
    link.style.display = "block";
    link.style.width = "100%";
    link.style.height = "100%";

    const img = document.createElement("img");
    img.src = ad.image;
    img.alt = ad.alt || "";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";

    link.appendChild(img);
    imgWrap.appendChild(link);

    wrapper.appendChild(imgWrap);

    container.innerHTML = "";
    container.appendChild(wrapper);
  }
}

export const ads = Ads.getInstance();
export default ads;
