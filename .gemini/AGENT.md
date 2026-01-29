**Subject: Development of a Universal JavaScript Ad Library (@fiandev/ads)**

**Goal:** Create a TypeScript-based library for fetching and displaying ads that works seamlessly in both **SSR** (Next.js, Nuxt, SvelteKit) and **CSR** (Vite, Create React App) environments.

**Core Requirements:**

1. **Environment Agnostic:** Ensure the code doesn't crash during server-side execution (avoid using `window` or `document` directly without checks).
2. **Singleton Pattern:** The `ads.init()` method should configure a global instance used throughout the app.
3. **Type Safety:** Provide full TypeScript interfaces for configuration and API responses.
4. **Flexible Fetching:** Support custom headers and fetch options, including a timeout mechanism.

**Technical Specifications:**

- **Initialization API:**

```typescript
interface AdsConfig {
  url: string;
  debug?: boolean;
  requestTimeout?: number;
  fetchOptions?: RequestInit;
}
```

- **Expected API Response:**

```typescript
interface AdItem {
  image: string;
  redirect: string;
  alt?: string;
  width?: number;
  height?: number;
  target?: "_blank" | "_self" | "_parent" | "_top";
}

//   response
{
    status?: boolean,
    data: AdItem[]
}
```

## how to usage

1. define some element with class ".ads-<type (vertical|horizontal|square)>"
2. import and init library

**RULES:**

1. **Draft the Core Logic:** Create an `Ads` class that handles the `init` and a `getAds()` method.
2. **SSR/CSR Handling:** Implement a check to ensure DOM-related logic only runs in the browser.
3. **Fetch Implementation:** Use a standard `fetch` approach with an `AbortController` to handle the `requestTimeout`.
4. **Export Strategy:** Provide the code in a way that supports ESM (ES Modules).
5. **codebase**: should write on ts and support @types
