# Healthcare Telemedicine Frontend

A scalable, modular Next.js frontend for the AI-enabled healthcare appointment and telemedicine platform.

## Architecture Overview

```
app/
├── components/          # UI components organized by service
│   ├── common/         # Shared components (Logo, Icon)
│   ├── ui/             # shadcn/ui components (Button, Card, Input, Badge)
│   ├── brand/          # Brand visuals
│   ├── layout/         # Shared layout sections
│   ├── patient/        # Patient service components
│   ├── doctor/         # Doctor service components
│   ├── appointment/    # Appointment service components
│   ├── telemedicine/   # Video consultation components
│   ├── payment/        # Payment service components
│   └── ai-symptom/     # AI symptom checker components
├── styles/             # Shared stylesheets
├── lib/                # API endpoints, constants, helpers
├── hooks/              # Custom hooks
├── login/              # Login page route
├── role-selection/     # Role selection route
└── sign-up/            # Sign-up route

public/assets/
├── logo/logo.svg
└── images/auth/doctor-tablet.svg
```

## Design System

### Typography

All typography is defined in semantic CSS classes for consistency across the application. Use these classes instead of inline Tailwind typography utilities.

**Available Classes:**
- `.h1` – Main headings (32px, bold)
- `.h2` – Section headings (24px, semibold)
- `.h3` – Subsection headings (20px, semibold)
- `.h4` – Small headings (16px, semibold)
- `.body-lg` – Large body text (16px)
- `.body-base` – Default body text (14px)
- `.body-sm` – Small body text (12px)
- `.label` – Form labels (14px, medium)
- `.label-sm` – Small labels (12px, medium)
- `.helper-text` – Help text (12px, muted foreground)

**Example:**
```tsx
<h1 className="h1">Welcome to Healthcare</h1>
<p className="body-base">Book appointments with trusted doctors</p>
<label className="label">Full Name</label>
```

### Color Tokens

Design tokens based on your brand palette (deep navy, blues, and accent colors) are defined in `app/globals.css`:

- `--background` – Main background (deep navy)
- `--foreground` – Primary text color
- `--card` – Card surfaces
- `--primary` – Primary action color
- `--secondary` – Secondary actions
- `--accent` – Accent highlights
- `--destructive` – Error/delete states
- `--success` – Success states
- `--border`, `--input`, `--ring` – UI chrome

## Common Components (shadcn/ui)

All core UI components are built with **shadcn/ui**, a collection of accessible, customizable React components.

### Button

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
```

**Variants:** `default` | `secondary` | `outline` | `ghost` | `destructive` | `link`  
**Sizes:** `default` | `sm` | `lg` | `icon`

### Card

```tsx
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Doctor Profile</CardTitle>
    <CardDescription>View full details</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

### Input

```tsx
import { Input } from "@/components/ui/input";

<Input placeholder="Enter email" />
<Input type="password" placeholder="Password" />
<Input disabled />
```

Add labels and error handling with your own wrapper component.

### Badge

```tsx
import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

**Variants:** `default` | `secondary` | `destructive` | `outline`

### Logo & Icon

```tsx
import { Logo, Icon } from "@/components/common";

// Logo component (custom)
<Logo width={48} height={48} />

// lucide-react icons (1000+ available)
<Icon name="Calendar" size={24} />
<Icon name="Heart" size={24} />
<Icon name="Video" size={24} />
<Icon name="CreditCard" size={24} className="text-primary" />
```

**Logo** – Custom components render `public/assets/logo/logo.svg` as documented in `ASSETS.md`

**Signup testimonial image** – Uses `public/assets/images/auth/doctor-tablet.svg` in `app/sign-up/page.tsx`

**Icons** – Powered by [lucide-react](https://lucide.dev), a comprehensive icon library. Use any icon name from the lucide catalog. Icons inherit Tailwind classes for styling and sizing.

## Service Organization

Each microservice gets its own component folder:

### Patient Service (`app/components/patient/`)
- Patient profile management
- Medical history display
- Report uploads
- Prescription viewing

### Doctor Service (`app/components/doctor/`)
- Doctor profile setup
- Availability scheduling
- Patient consultation history
- Digital prescriptions

### Appointment Service (`app/components/appointment/`)
- Doctor search and filtering
- Appointment booking
- Booking management (reschedule, cancel)
- Status tracking

### Telemedicine Service (`app/components/telemedicine/`)
- Video consultation interface
- Session controls
- Call recording state
- Chat/messaging (if integrated)

### Payment Service (`app/components/payment/`)
- Payment form
- Payment status display
- Transaction history
- Refund status

### AI Symptom Checker (`app/components/ai-symptom/`)
- Symptom input form
- Preliminary health suggestions
- Recommended specialties
- Next-step guidance

## API Integration

Microservice endpoints are centralized in `app/lib/api.ts`:

```tsx
import { API_ENDPOINTS } from "@/lib/api";

async function fetchPatientProfile(id: string) {
  const response = await fetch(`${API_ENDPOINTS.patient.profile}/${id}`);
  return response.json();
}
```

Update `NEXT_PUBLIC_API_URL` in your `.env.local` to point to your backend gateway or individual service endpoints.

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add or replace assets:**
  - Logo file: `public/assets/logo/logo.svg`
  - Signup image: `public/assets/images/auth/doctor-tablet.svg`
  - See `ASSETS.md` for details
  - Icons are provided by lucide-react (no action needed)

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Development Guidelines

### Component Structure

Each component should:
- Be in its appropriate service folder
- Export a default or named function
- Have minimal inline styles (use Tailwind + semantic classes)
- Not exceed 150 lines (split into smaller components if needed)
- Include JSDoc comments for complex logic only

### Naming Conventions

- Components: PascalCase (e.g., `BookAppointmentForm.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Styles: lowercase with hyphens (e.g., `.card-content`)

### Import Paths

Use path aliases for cleaner imports:
```tsx
// ✅ Good
import { Button } from "@/components/common";
import { API_ENDPOINTS } from "@/lib/api";

// ❌ Avoid
import { Button } from "../../../../components/common";
```

Aliases are pre-configured in `tsconfig.json`.

## Deployment

This frontend is deployed as a static Next.js app on Vercel, AWS S3 + CloudFront, or Docker.

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Team Collaboration

- **Design tokens & typography:** Centralized in `app/globals.css` and `app/styles/typography.css`
- **Shared components:** In `app/components/common/` and `app/components/ui/`
- **Service-specific components:** Isolated in service folders
- **API endpoints:** Centralized in `app/lib/api.ts`
- **Constants:** Centralized in `app/lib/constants.ts`

When integrating fetch requests, add them to the appropriate service folder component and use the pre-configured endpoints and constants.

## Next Steps

1. Add logo and auth image assets to `public/assets/`
2. Implement authentication flow component
3. Build patient landing page
4. Integrate doctor listing and search
5. Implement appointment booking flow
6. Connect payment gateway
7. Setup video consultation module
8. Integrate AI symptom checker

---

For questions on component usage, consult `ASSETS.md` or check existing component implementations.
