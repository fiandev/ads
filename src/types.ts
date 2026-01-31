export interface AdsConfig {
  url: string;
  debug?: boolean;
  requestTimeout?: number;
  fetchOptions?: RequestInit;
}

export interface AdsResponse {
  status?: boolean;
  data: AdItem[];
}

export type AdType = "vertical" | "horizontal" | "square";

export interface AdItem {
  image: string;
  type: AdType;
  redirect: string;
  alt?: string;
  width?: number;
  height?: number;
  target?: "_blank" | "_self" | "_parent" | "_top";
}
