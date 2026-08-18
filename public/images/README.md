# Public Images & Static Assets Directory

This directory is designed for placing your images, graphics, and SVG assets for the Beyond Borders website.

## 📁 Recommended Structure

- `/public/images/` - Standard raster images (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`)
- `/public/images/svg/` - Vector graphics and SVG icons (`.svg`)
- `/public/images/courses/` - Course thumbnails and cover photos
- `/public/images/teacher/` - Teacher profiles and photo gallery
- `/public/images/badges/` - Badges, certifications, and partner logos

## 🚀 How to use in React Components

Any file placed in `/public/images/` is served directly at the root URL `/images/...`.

### Example 1: Standard Image
If you add an image `my-photo.jpg` into `/public/images/`:
```tsx
<img 
  src="/images/my-photo.jpg" 
  alt="Description" 
  className="w-full h-auto rounded-xl object-cover" 
/>
```

### Example 2: SVG Image
If you add `crown.svg` into `/public/images/svg/`:
```tsx
<img 
  src="/images/svg/crown.svg" 
  alt="Crown Icon" 
  className="w-8 h-8" 
/>
```

### Example 3: Background Image in Tailwind
```tsx
<div 
  className="bg-cover bg-center rounded-2xl" 
  style={{ backgroundImage: "url('/images/hero-banner.jpg')" }}
>
  {/* Content */}
</div>
```
