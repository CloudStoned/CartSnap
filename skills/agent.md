# Agent Instructions

This document defines the operational constraints, codebase structure, and design principles that the AI assistant must adhere to when working on the CartSnap project. These guidelines are activated automatically.

---

## 1. Command Execution Constraints

*   **Do Not Run Build/Dev Commands**: Under no circumstances should the agent run `npm run build` or `npm run dev` (or any equivalent build/dev-server commands).

---

## 2. Codebase Structure Directory Reference

```
cartsnap/
├── app/                      # Next.js App Router Pages & Layout
│   ├── layout.tsx            # Wraps application in GroceryProvider and sets up root HTML/body
│   ├── globals.css           # Custom theme variables and global styles
│   ├── page.tsx              # Main dashboard showing statistics, basket, settings, scanner
│   └── login/
│       └── page.tsx          # Login and Sign Up screen
├── components/               # React UI / Presentation Components
│   ├── Header.tsx            # Main header containing user balance, budget progress, app branding
│   ├── ScanHub.tsx           # Scanner screen capturing product photo & handling manual details input
│   ├── BasketPanel.tsx       # Sidebar basket displaying items list, quantities, and price calculations
│   ├── SettingsPanel.tsx     # Budget limit configuration, currency switcher, sound toggle
│   ├── CheckoutModal.tsx     # Summary overlay presenting totals, savings, and final checkout confirmation
│   ├── SuccessDialog.tsx     # Receipt card showing order confirmation and receipt identifier
│   ├── CameraOverlay.tsx     # Standard overlay display overlaying video viewport
│   ├── NotificationLogs.tsx  # Dynamic list toast logs representing updates
│   ├── BudgetCard.tsx        # Dashboard card showing budget gauge indicator
│   ├── StatsCard.tsx         # Dashboard card showing total spent vs budget
│   ├── auth/                 # Auth-related visual components
│   │   ├── AuthBackground.tsx, AuthCard.tsx, AuthForm.tsx, AuthHeader.tsx, AuthTabs.tsx, AuthAlerts.tsx, AuthSandbox.tsx
│   │   └── index.ts          # Exports auth presentation components
│   └── mobile/               # Mobile UI layouts
│       ├── MobileFooterStrip.tsx
│       └── MobileNav.tsx
├── hooks/                    # Custom React state orchestrators (strictly state orchestration, no heavy logic)
│   ├── useCamera.ts          # Orchestrates video streaming, canvas layout captures
│   ├── useGroceryBasket.ts   # Manages item CRUD, budget validation, and calculates dynamic discounts
│   ├── useGrocerySettings.ts # Orchestrates tab switching, budget values, and currency state
│   ├── useAudio.ts           # Standard helper playing sound effects
│   ├── use-mobile.ts         # Hook calculating window boundaries for responsiveness
│   ├── auth/                 # Hooks for authentication forms and Supabase user state
│   │   ├── useAuth.ts
│   │   └── useAuthForm.ts
│   └── scan/                 # Hooks orchestrating scanning state and logs
│       ├── useGroceryNotifications.ts
│       ├── useGroceryScan.ts
│       └── index.ts          # Exports scanning hooks
├── store/                    # Context Provider unifying React hook States
│   ├── GroceryStore.tsx      # Unifies and exposes state via GroceryProvider / useGroceryStore
│   └── types.ts              # Core TypeScript interfaces (GroceryItem, GroceryContextType, etc.)
├── lib/                      # Core backend utilities and third-party wrappers
│   ├── supabase/             # Supabase configuration for client & server auth
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts              # UI utilities (e.g. cn classnames merger)
└── skills/                   # Agent operational guidelines
    ├── agent.md              # THIS FILE: Project rules and codebase architecture reference
    └── separation_of_concerns.md # Design rules for modularization, hooks, and clean code
```

---

## 3. Architectural Guidelines (Separation of Concerns)

*   **Strictly Apply Separation of Concerns**: All modifications and new code must conform to the rules in [separation_of_concerns.md](file:///home/cloudstone/Projects/freshtrack/skills/separation_of_concerns.md).
*   **Key Principles to Follow**:
    *   **Folder-Based Feature Organization**: Group related components/hooks into feature folders (e.g., `hooks/scan/`) if there are more than two related files.
    *   **Module Entrypoints (`index.ts`)**: Expose components/hooks via a clean `index.ts` export, and use clean imports (e.g. import from `../hooks/scan` instead of `../hooks/scan/useGroceryScan`).
    *   **Hooks vs. Helpers**: Custom React hooks should only manage React state and orchestration. Extract any heavy logic (like calculations, parsing, OCR processing) to standalone helper/utility files adjacent to the hook.
    *   **Data Integrity**: Avoid hardcoded mock simulation data. Validate input and handle errors with explicit user alerts.

---

## 4. Git Commit Guidelines

*   **Generate Copy-Pasteable Commit Message**: At the end of every task execution, always generate a clear, concise Git commit message (following Conventional Commits format, e.g. `docs(agent): update agent.md with codebase structure and commit instructions`) that the user can copy and paste directly into their terminal.
