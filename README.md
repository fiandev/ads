# @fiandev/ads

A lightweight, flexible advertisement management library for web applications. Display and manage ads with automatic rendering capabilities and configurable options.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Advanced Usage](#advanced-usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🚀 Lightweight and easy to integrate
- 🎯 Automatic ad rendering based on class selectors
- ⏱️ Configurable request timeouts
- 🔄 Support for vertical, horizontal, and square ad formats
- 🔧 Flexible fetch options
- 🐛 Debug mode for development
- 🌐 Cross-browser compatibility
- 📱 Responsive ad placement

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

### Browser CDN:
```html
<!-- ES Module -->
<script type="module">
  import { ads } from 'https://cdn.skypack.dev/@fiandev/ads';
</script>

<!-- Or include directly -->
<script src="https://cdn.skypack.dev/@fiandev/ads"></script>
```

## Quick Start

### 1. Initialize the Ads Library

```javascript
import { ads } from '@fiandev/ads';

// Initialize with your ad server endpoint
ads.init({
  url: 'https://your-ad-server.com/api/ads',
  debug: true,
  requestTimeout: 5000
});
```

### 2. Prepare DOM Elements

Add elements with classes starting with `ads-` to automatically render ads:

```html
<!-- Vertical ad container -->
<div class="ads-vertical"></div>

<!-- Horizontal ad container -->
<div class="ads-horizontal"></div>

<!-- Square ad container -->
<div class="ads-square"></div>
```

### 3. Server Response Format

Your ad server should return JSON in the following format:

```json
{
  "status": true,
  "data": [
    {
      "image": "https://example.com/vertical-ad.jpg",
      "redirect": "https://example.com/redirect",
      "alt": "Vertical Advertisement",
      "width": 300,
      "height": 600,
      "target": "_blank"
    },
    {
      "image": "https://example.com/horizontal-ad.jpg",  
      "redirect": "https://example.com/redirect",
      "alt": "Horizontal Advertisement",
      "width": 728,
      "height": 90,
      "target": "_blank"
    },
    {
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

## Configuration

### AdsConfig Options

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `url` | `string` | ✅ | - | The endpoint URL to fetch ads from |
| `debug` | `boolean` | ❌ | `false` | Enable debug logging |
| `requestTimeout` | `number` | ❌ | `5000` | Request timeout in milliseconds |
| `fetchOptions` | `RequestInit` | ❌ | `{}` | Additional options to pass to fetch |

Example configuration:

```javascript
ads.init({
  url: 'https://api.example.com/ads',
  debug: true,
  requestTimeout: 10000,
  fetchOptions: {
    headers: {
      'Authorization': 'Bearer your-token',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }
});
```

## Usage

### Manual Ad Retrieval

```javascript
import { ads } from '@fiandev/ads';

try {
  const response = await ads.getAds();
  console.log('Fetched ads:', response);
  
  // Handle the ads data manually
  const adsData = response.data;
  // Process adsData as needed
} catch (error) {
  console.error('Error fetching ads:', error);
}
```

### Programmatic Ad Rendering

```javascript
import { ads } from '@fiandev/ads';

// Initialize the library
ads.init({
  url: 'https://your-ad-server.com/api/ads'
});

// Manually render to a specific element
async function renderCustomAd(selector, adType) {
  try {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element with selector ${selector} not found`);
    }
    
    const response = await ads.getAds();
    const ad = selectAppropriateAd(response.data, adType);
    
    if (ad) {
      createAdElement(element, ad);
    }
  } catch (error) {
    console.error('Error rendering custom ad:', error);
  }
}

function selectAppropriateAd(ads, adType) {
  // Logic to select appropriate ad based on type
  switch(adType) {
    case 'vertical':
      return ads.find(ad => ad.width < ad.height); // Tall ads
    case 'horizontal':
      return ads.find(ad => ad.width > ad.height); // Wide ads
    case 'square':
      return ads.find(ad => Math.abs(ad.width - ad.height) < 50); // Nearly square ads
    default:
      return ads[0];
  }
}

function createAdElement(container, ad) {
  // Clear container
  container.innerHTML = '';
  
  // Create link element
  const link = document.createElement('a');
  link.href = ad.redirect;
  link.target = ad.target || '_blank';
  link.rel = 'noopener noreferrer';
  
  // Create image element
  const img = document.createElement('img');
  img.src = ad.image;
  img.alt = ad.alt || 'Advertisement';
  if (ad.width) img.width = ad.width;
  if (ad.height) img.height = ad.height;
  
  // Assemble elements
  link.appendChild(img);
  container.appendChild(link);
}
```

## API Reference

### `ads.init(config)`
Initializes the ads library with the provided configuration.

#### Parameters
- `config` (`AdsConfig`): Configuration object for the ads library

#### Returns
- `void`

### `ads.getAds()`
Fetches ads from the configured endpoint.

#### Returns
- `Promise<AdsResponse>`: A promise that resolves to the ads response

#### Throws
- `Error`: If the library hasn't been initialized or if the request fails

### `AdsResponse`
The response object returned by the ad server.

#### Properties
- `status` (`boolean`, optional): Indicates success of the operation
- `data` (`Array<AdItem>`): Array of ad items

### `AdItem`
Represents a single advertisement.

#### Properties
- `image` (`string`): URL of the ad image
- `redirect` (`string`): URL to redirect to when clicked
- `alt` (`string`, optional): Alt text for accessibility
- `width` (`number`, optional): Width of the ad
- `height` (`number`, optional): Height of the ad
- `target` (`string`, optional): Link target attribute ('_blank', '_self', etc.)

### `AdType`
Enumeration of supported ad types:
- `'vertical'` - Vertical ads (typically taller than wide)
- `'horizontal'` - Horizontal ads (typically wider than tall)
- `'square'` - Square or nearly square ads

## Advanced Usage

### Integration with Frameworks

#### React Component Wrapper

```jsx
import { useEffect, useState } from 'react';
import { ads } from '@fiandev/ads';

const AdComponent = ({ type = 'horizontal', className }) => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        const response = await ads.getAds();
        
        // Select ad based on type
        const selectedAd = selectAdByType(response.data, type);
        setAd(selectedAd);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [type]);

  const selectAdByType = (ads, type) => {
    const typeIndex = type === 'vertical' ? 0 : type === 'horizontal' ? 1 : 2;
    return ads[Math.min(typeIndex, ads.length - 1)] || null;
  };

  if (loading) return <div>Loading ad...</div>;
  if (error) return <div>Error loading ad: {error}</div>;
  if (!ad) return <div>No ad available</div>;

  return (
    <a 
      href={ad.redirect} 
      target={ad.target || '_blank'}
      rel="noopener noreferrer"
      className={`ad-${type} ${className || ''}`}
    >
      <img 
        src={ad.image} 
        alt={ad.alt || 'Advertisement'} 
        width={ad.width}
        height={ad.height}
      />
    </a>
  );
};

export default AdComponent;
```

#### Vue Component

```vue
<template>
  <div v-if="loading">Loading ad...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <a 
    v-else-if="ad" 
    :href="ad.redirect" 
    :target="ad.target || '_blank'"
    rel="noopener noreferrer"
    class="ad-container"
  >
    <img 
      :src="ad.image" 
      :alt="ad.alt || 'Advertisement'" 
      :width="ad.width"
      :height="ad.height"
    />
  </a>
  <div v-else>No ad available</div>
</template>

<script>
import { ads } from '@fiandev/ads';

export default {
  name: 'AdComponent',
  props: {
    type: {
      type: String,
      default: 'horizontal'
    }
  },
  data() {
    return {
      ad: null,
      loading: true,
      error: null
    };
  },
  async mounted() {
    try {
      this.loading = true;
      const response = await ads.getAds();
      this.ad = this.selectAdByType(response.data, this.type);
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    selectAdByType(ads, type) {
      const typeIndex = type === 'vertical' ? 0 : type === 'horizontal' ? 1 : 2;
      return ads[Math.min(typeIndex, ads.length - 1)] || null;
    }
  }
};
</script>
```

### Custom Styling

The library creates basic ad elements, but you can style them with CSS:

```css
.ad-container {
  display: inline-block;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.ad-container:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

.ads-vertical,
.ads-horizontal,
.ads-square {
  position: relative;
  display: inline-block;
  min-height: 50px;
  border: 1px dashed #ddd;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.ads-vertical::before {
  content: 'Vertical Ad Placeholder';
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-style: italic;
}

.ads-horizontal::before {
  content: 'Horizontal Ad Placeholder';
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-style: italic;
}

.ads-square::before {
  content: 'Square Ad Placeholder';
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-style: italic;
}
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