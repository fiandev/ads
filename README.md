# @fiandev/ads

A lightweight, flexible advertisement management library for web applications. Designed to work just like Google AdSense - easy to setup and use!

## Features

- 🚀 Super easy to use - just initialize once and add CSS classes
- 🎯 Automatic ad rendering based on class selectors (similar to Google AdSense)
- ⚡ Caching for optimal performance - no awaits after initialization
- ⏱️ Configurable request timeouts
- 🔄 Support for vertical, horizontal, and square ad formats
- 🔧 Flexible fetch options
- 🐛 Debug mode for development
- 🌐 Cross-browser compatibility
- 📱 SSR-friendly (works with Next.js, Remix, etc.)

## Installation

### Using npm:

```bash
npm install @fiandev/ads
```

### Using yarn:

```bash
yarn add @fiandev/ads
```

### Using pnpm:

```bash
pnpm add @fiandev/ads
```

## Quick Start

### 1. Initialize the Ads Library (Only Once!)

```javascript
import { ads } from "@fiandev/ads";

// Initialize with your ad server endpoint (This is all you need to do!)
ads.init({
  url: "https://your-ad-server.com/api/ads",
  debug: true,
  requestTimeout: 5000,
});
```

### 2. Add CSS Classes to Display Ads (No JS needed after init!)

Add elements with classes starting with `ads-` to automatically render ads:

```html
<!-- Vertical ad will appear here automatically -->
<div class="ads-vertical"></div>

<!-- Horizontal ad will appear here automatically -->
<div class="ads-horizontal"></div>

<!-- Square ad will appear here automatically -->
<div class="ads-square"></div>
```

That's it! The ads will automatically appear after initialization.

## Configuration

| Property         | Type          | Required | Default | Description                         |
| ---------------- | ------------- | -------- | ------- | ----------------------------------- |
| `url`            | `string`      | ✅       | -       | The endpoint URL to fetch ads from  |
| `debug`          | `boolean`     | ❌       | `false` | Enable debug logging                |
| `requestTimeout` | `number`      | ❌       | `5000`  | Request timeout in milliseconds     |
| `fetchOptions`   | `RequestInit` | ❌       | `{}`    | Additional options to pass to fetch |

Example configuration:

```javascript
ads.init({
  url: "https://api.example.com/ads",
  debug: true,
  requestTimeout: 10000,
  fetchOptions: {
    headers: {
      Authorization: "Bearer your-token",
      "Content-Type": "application/json",
    },
    credentials: "include",
  },
});
```

## Usage in Frameworks

### React Example

```jsx
import { useEffect } from "react";
import { ads } from "@fiandev/ads";

// Initialize once in your app
useEffect(() => {
  ads.init({
    url: "https://your-ads-api.com",
    debug: true,
  });
}, []);

function App() {
  return (
    <div>
      <h1>My Website</h1>

      {/* The ad appears automatically here after init */}
      <div className="ads-horizontal" />

      <p>Content continues...</p>

      {/* Another ad */}
      <div className="ads-vertical" />
    </div>
  );
}
```

### Server Response Format

Your ad server should return JSON in the following format:

```json
{
  "status": true,
  "data": [
    {
      "id": "1",
      "image": "https://example.com/vertical-ad.jpg",
      "redirect": "https://example.com/redirect",
      "alt": "Vertical Advertisement",
      "width": 300,
      "height": 600,
      "target": "_blank"
    },
    {
      "id": "2",
      "image": "https://example.com/horizontal-ad.jpg",
      "redirect": "https://example.com/redirect",
      "alt": "Horizontal Advertisement",
      "width": 728,
      "height": 90,
      "target": "_blank"
    },
    {
      "id": "3",
      "image": "https://example.com/square-ad.jpg",
      "redirect": "https://example.com/redirect",
      "alt": "Square Advertisement",
      "width": 300,
      "height": 300,
      "target": "_blank"
    }
  ]
}
```

## Advanced Usage

### Programmatic Access (After Initialization)

Even after initialization, if you need to access the ad data programmatically:

```javascript
// No await needed after initialization - returns cached data instantly!
const response = await ads.getAds();
console.log(response.data); // Available immediately after init completes
```

## API Reference

### `ads.init(config)`

Initializes the ads library with the provided configuration. Fetches ads automatically after initialization.

#### Parameters

- `config` (`AdsConfig`): Configuration object for the ads library

#### Returns

- `void` (Actually initializes and fetches ads in the background)

### `ads.getAds()`

Returns the cached ad data (no additional network request after initialization).

#### Returns

- `Promise<AdsResponse>`: A promise that resolves to the cached ads response

#### Throws

- `Error`: If the library hasn't been initialized

## Browser CDN Usage

```html
<!-- Include via CDN -->
<script src="https://cdn.skypack.dev/@fiandev/ads"></script>

<script>
  // Initialize with your ad server endpoint
  ads.init({
    url: "https://your-ad-server.com/api/ads",
    debug: true,
  });

  // Add elements with ads classes and they'll render automatically
</script>
```

## Contributing

We welcome contributions! Here's how you can contribute:

### Development Setup

1. Fork and clone the repository:

```bash
git clone https://github.com/your-username/ads.git
cd ads
```

2. Install dependencies:

```bash
npm install
```

3. Start development mode:

```bash
npm run dev
```

4. Make your changes and submit a pull request

### Project Structure

```
src/
├── Ads.ts       # Main Ads class implementation
├── index.ts     # Export statements
└── types.ts     # TypeScript type definitions
```

### Building

```bash
npm run build
```

This compiles the TypeScript code to JavaScript in the `dist/` directory with both CommonJS and ES Modules formats.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [fiandev](https://github.com/fiandev)
