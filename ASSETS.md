# Frontend Assets Setup

## Asset Organization

Static assets are stored under `public/assets/`.

Current project asset paths:

- `public/assets/logo/logo.svg` (brand logo)
- `public/assets/images/auth/doctor-tablet.svg` (signup testimonial background)

## Logo Asset

Place your primary brand logo at `public/assets/logo/logo.svg`.

This file is used by:

- `app/components/common/Logo.tsx`
- `app/components/brand/distributed-health-logo.tsx`

Both components now render the same logo file, so updating this one asset updates brand visuals across auth pages.

## Auth Image Asset

The signup testimonial card uses:

- `public/assets/images/auth/doctor-tablet.svg`

Referenced in:

- `app/sign-up/page.tsx`

If you replace this file, keep the same file name to avoid code changes.

## Icons

Icons are provided by `lucide-react` through the shared icon wrapper:

- `app/components/common/Icon.tsx`

Popular icon names used in this project include:

- `Calendar`
- `User`
- `Users`
- `Clock`
- `MapPin`
- `Phone`
- `Mail`
- `Lock`
- `Heart`
- `Pill`
- `FileText`
- `Video`
- `CreditCard`
- `CheckCircle`
- `AlertCircle`
- `Trash2`
- `Edit`
- `Download`
- `Upload`
- `Search`
- `Menu`
- `X`
- `ChevronRight`
- `Star`

See https://lucide.dev for the full icon catalog.

## File Format Notes

- SVG is preferred for logos and illustration-style UI assets.
- Keep logo and auth image files optimized to reduce payload size.
