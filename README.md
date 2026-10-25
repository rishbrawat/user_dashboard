# user_dashboard

A modern, responsive user management and metrics dashboard built with React 19, React Router v7, and custom CSS design system.

## Features

- **Authentication System**:
  - Secure Login view with validation and demo autofill
  - Registration view with real-time password strength evaluator
  - Session persistence and protected routing
- **Dashboard Workspace**:
  - Live metric KPI cards (Revenue, Active Users, Completion Rate, Health)
  - Team directory table with search, status filtering, and inline management
  - Audit log activity stream
  - Add team member modal dialog
  - Data export to CSV
- **UI / UX Excellence**:
  - Theme switching (Light & Dark modes)
  - WCAG-compliant color contrast and visible focus indicators
  - Full keyboard accessibility and semantic HTML
  - Responsive design across mobile, tablet, and desktop

## Tech Stack

- **Framework**: React 19
- **Routing**: React Router DOM v7
- **Styling**: Vanilla CSS with custom tokens and glassmorphism utilities
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone repository:
```bash
git clone https://github.com/your-username/user_dashboard.git
cd user_dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Demo Credentials

For quick testing on the login screen, click **Auto Fill** or use:
- **Email**: `alex.morgan@example.com`
- **Password**: `Password123!`
