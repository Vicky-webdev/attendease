# AttendEase — Staff Attendance & Workforce Management

A lightweight HR and attendance management system built for small and medium-sized businesses. Track employee attendance, manage leave requests, enforce office WiFi login restrictions, and generate detailed reports.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)

## Features

### Attendance Management
- Real-time clock-in/clock-out with location verification
- QR code-based attendance marking
- Daily, weekly, and monthly attendance views
- Attendance rate analytics with color-coded indicators

### Leave & Permissions
- Apply for leave, work-from-home, and permission requests
- Multi-level approval workflow (Manager → HR → Super Admin)
- Toast notifications for request status updates
- Calendar view for team availability

### Office WiFi Restriction
- Restrict login access to office network only
- Public IP-based validation (compares against admin-configured office IP)
- Configurable office WiFi SSID display
- Demo override toggle for testing outside office

### Role-Based Access Control
- **Super Admin** — Full system access and configuration
- **HR** — Employee management, approvals, reports
- **Manager** — Team attendance, leave approvals
- **Employee** — Self-service attendance and requests

### Reports & Analytics
- Daily attendance summary with alerts
- Weekly status grid per employee
- Monthly detailed reports with export options
- Email report scheduling (daily/weekly)
- Top performers and attendance concerns tracking

### Real-Time Chat
- Team messaging with role-based visibility
- Notification system for requests and approvals

### Settings & Configuration
- Network restriction settings (IP, SSID, per-employee toggle)
- Email notification preferences
- Theme customization (light/dark mode)
- Report scheduling automation

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui
- **State:** React Context API + Zustand
- **Charts:** Recharts
- **Notifications:** Sonner (toast)
- **Fonts:** Inter, JetBrains Mono
- **Language:** TypeScript 5

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

```bash
git clone https://github.com/Vicky-webdev/attendease.git
cd attendease
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | arjun@company.com | admin123 |
| HR | priya@company.com | admin123 |
| Manager | vignesh@company.com | emp123 |
| Employee | sara@company.com | emp123 |

> **Note:** If WiFi restriction is enabled and you're not on the office network, use the "Demo mode" toggle on the login page to bypass network validation for testing.

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/       # Login page with WiFi restriction
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── leave/          # Leave, WFH, permission management
│   │   ├── reports/        # Attendance reports & analytics
│   │   ├── settings/       # System configuration
│   │   └── ...
│   └── layout.tsx          # Root layout with providers
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── auth-context.tsx    # Authentication & RBAC
│   ├── app-store.tsx       # Global state management
│   └── network-settings.tsx # WiFi restriction settings
└── types/                  # TypeScript type definitions
```

## Configuration

### WiFi Restriction Setup

1. Go to **Settings → Network & Security**
2. Click **"Detect my IP"** while connected to your office WiFi
3. Save the detected IP as **Office Public IP**
4. Set your **Office WiFi SSID** name
5. Toggle per-employee WiFi restriction as needed

When enabled, users connecting from a different public IP will be blocked from logging in unless granted an exception.

## License

MIT

## Author

**Vicky** — [@Vicky-webdev](https://github.com/Vicky-webdev)
