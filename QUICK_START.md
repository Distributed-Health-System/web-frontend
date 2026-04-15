# Quick Reference: Frontend Structure & Usage

## Folder Structure at a Glance

```
public/assets/
  ├── logo/             → Your company logo
  └── icons/            → All UI icons

src/
  ├── components/
  │   ├── common/       → Shared UI building blocks
  │   ├── patient/      → Patient service features
  │   ├── doctor/       → Doctor service features
  │   ├── appointment/  → Appointment booking & management
  │   ├── telemedicine/ → Video consultations
  │   ├── payment/      → Payment processing
  │   └── ai-symptom/   → AI features
  ├── lib/
  │   ├── api.ts        → Backend endpoints
  │   └── constants.ts  → App-wide constants
  ├── utils/
  │   └── helpers.ts    → Utility functions
  └── hooks/            → Custom React hooks
```

## Typography Classes (Don't use inline Tailwind for text)

```tsx
// ✅ Use semantic classes
<h1 className="h1">Heading</h1>
<p className="body-base">Content</p>
<label className="label">Form Label</label>

// ❌ Avoid inline Tailwind typography
<h1 className="text-4xl font-bold">Heading</h1>
```

## Common Components (shadcn/ui)

All UI components use **shadcn/ui**—fully styled, accessible React components.

### Button
```tsx
import { Button } from "@/components/common";

<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/common";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter><Button>Action</Button></CardFooter>
</Card>
```

### Input
```tsx
import { Input } from "@/components/common";

<Input placeholder="Enter text" />
<Input type="email" placeholder="user@example.com" />
<Input disabled />
```

### Badge
```tsx
import { Badge } from "@/components/common";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
```

### Logo & Icons
```tsx
import { Logo, Icon } from "@/components/common";

// Logo
<Logo width={40} height={40} />

// lucide-react icons
<Icon name="Calendar" size={24} />
<Icon name="User" size={24} />
<Icon name="Heart" size={24} />
<Icon name="Video" size={24} />
<Icon name="CreditCard" size={24} />
```

**Popular icons:** `Calendar`, `User`, `Users`, `Clock`, `Phone`, `Mail`, `Heart`, `Pill`, `FileText`, `Video`, `CreditCard`, `CheckCircle`, `AlertCircle`, `Trash2`, `Edit`, `Download`, `Upload`, `Search`, `Menu`, `X`, `ChevronRight`, `Star`

See [lucide-react docs](https://lucide.dev) for 1000+ icons.

## Popular shadcn/ui Add-ons

You can add more components as needed:

```bash
# Dialog/Modal
npx shadcn@latest add dialog

# Dropdown menu
npx shadcn@latest add dropdown-menu

# Tabs
npx shadcn@latest add tabs

# Select/Dropdown
npx shadcn@latest add select

# Checkbox
npx shadcn@latest add checkbox

# Radio buttons
npx shadcn@latest add radio-group

# Loading spinner
npx shadcn@latest add spinner

# Toast notifications
npx shadcn@latest add sonner
```

Then import from `@/components/ui/` and re-export via `@/components/common/index.ts` if you want them in the common barrel export.

## API Calls

```tsx
import { API_ENDPOINTS } from "@/lib/api";

// In your component or hook
async function bookAppointment(data) {
  const response = await fetch(API_ENDPOINTS.appointment.create, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

## Constants

```tsx
import {
  USER_ROLES,
  APPOINTMENT_STATUS,
  PAYMENT_STATUS,
  NOTIFICATION_TYPES,
} from "@/lib/constants";

// Use in logic
if (status === APPOINTMENT_STATUS.CONFIRMED) {
  // Show confirmation badge
}
```

## Utilities

```tsx
import { cn, formatDate, formatTime, formatDateTime } from "@/utils/helpers";

// Combine class names conditionally
className={cn("base-class", isActive && "active-class")}

// Format dates
formatDate(new Date())        // "April 15, 2026"
formatTime(new Date())        // "10:30 AM"
formatDateTime(new Date())    // "April 15, 2026 at 10:30 AM"
```

## Adding a New Component

1. **Create file** in the appropriate service folder:
   ```
   src/components/patient/PatientProfile.tsx
   ```

2. **Implement component:**
   ```tsx
   export function PatientProfile() {
     return (
       <Card>
         <CardHeader>
           <h2 className="h3">My Profile</h2>
         </CardHeader>
         <CardBody>
           {/* Content */}
         </CardBody>
       </Card>
     );
   }
   ```

3. **Export from index.ts:**
   ```tsx
   // src/components/patient/index.ts
   export { PatientProfile } from "./PatientProfile";
   ```

4. **Use in pages/other components:**
   ```tsx
   import { PatientProfile } from "@/components/patient";
   
   export default function Page() {
     return <PatientProfile />;
   }
   ```

## Adding Assets (Logo Only)

**Logo:**
1. **Prepare file** as SVG (recommended) or PNG
2. **Place in:** `public/assets/logo/logo.svg`
3. **Use in components:**
   ```tsx
   <Logo width={48} height={48} />
   ```

**Icons:**
Icons use **lucide-react**, so no need to download or add icon files. Just use icon names:
```tsx
<Icon name="Calendar" size={24} />
<Icon name="User" size={24} />
<Icon name="Heart" size={24} />
```

See `ASSETS.md` for all available icon names and details.

## Environment Setup

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Run ESLint
```

## Color System

All colors are CSS variables. Use Tailwind classes with the token names:

```tsx
<div className="bg-primary text-primary-foreground">
  Primary button
</div>

<div className="bg-secondary text-secondary-foreground">
  Secondary button
</div>

<div className="border border-border">
  Card with border
</div>
```

Available backgrounds: `background`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `success`

## Need Help?

- **Architecture:** See `README-FRONTEND.md`
- **Assets:** See `ASSETS.md`
- **Component examples:** Check `src/components/common/`
- **API setup:** Check `src/lib/api.ts`
