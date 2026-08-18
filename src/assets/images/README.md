# Bundler Image Assets Directory (`src/assets/images`)

This folder is available if you prefer importing images directly in TypeScript/React modules.

## How to use:
```tsx
import myLogo from '../assets/images/my-logo.png';
import mySvg from '../assets/images/my-icon.svg';

export function Example() {
  return <img src={myLogo} alt="Logo" />;
}
```

*Note: For direct URLs (like `<img src="/images/..." />`), use `/public/images/`.*
