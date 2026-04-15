# Frontend Assets Setup

## Asset Organization

Logo and other static assets are placed in the `public/assets/` directory.

## Logo

**Location:** `public/assets/logo/`

Add your logo file as:
- **`logo.svg`** – Primary logo (recommended SVG format for scalability)

The `Logo` component in `src/components/common/Logo.tsx` will automatically import from this location.

**Usage:**
```tsx
import { Logo } from "@/components/common";

export function Header() {
  return <Logo width={40} height={40} />;
}
```

## Icons

**Icons are provided by lucide-react** – a comprehensive icon library with 1000+ professionally designed icons.

The `Icon` component wraps lucide-react icons for easy usage.

**Usage:**
```tsx
import { Icon } from "@/components/common";

export function AppointmentCard() {
  return (
    <div>
      <Icon name="Calendar" size={32} />
      <p>Your Appointment</p>
    </div>
  );
}
```

### Popular Icons for Healthcare Platform

- `Calendar` – Appointments
- `User` – Profile
- `Users` – Doctor/Team
- `Clock` – Time/Duration
- `MapPin` – Location
- `Phone` – Contact
- `Mail` – Email
- `Lock` – Security
- `Heart` – Health
- `Pill` – Medicine
- `FileText` – Reports/Prescriptions
- `Video` – Video consultation
- `CreditCard` – Payment
- `CheckCircle` – Confirmed
- `AlertCircle` – Alert/Warning
- `Trash2` – Delete
- `Edit` – Edit
- `Download` – Download
- `Upload` – Upload
- `Search` – Search
- `Menu` – Hamburger menu
- `X` – Close
- `ChevronRight` – Next/Forward
- `Star` – Rating

See [lucide-react documentation](https://lucide.dev) for the full icon catalog. All icons are component-based and inherit styling from Tailwind classes.

## Logo Format Recommendation

- **SVG** – Recommended for logo (scalable, lightweight)
- **PNG** – For raster logo if needed (use optimize tools)

## Performance Notes

- All icons are inline SVGs from lucide-react (no additional requests)
- Icons automatically scale and inherit color via Tailwind classes
- No image optimization needed—all icons are optimized by default
