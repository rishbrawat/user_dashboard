# user_dashboard

A high-density minimalist user analytics and account portal built with React 19 and React Router v7.

## Design Philosophy

- **Minimalist Palette**: Pure black (`#000000`) and white (`#ffffff`) foundation accented with gold, green, and red indicator states.
- **Compact Geometry**: Reduced spatial density, 11px–13px typography scale, 30px inputs and controls.
- **Zero Heavy UI Dependencies**: Completely native DOM styling with vanilla CSS design tokens. No icon pack bloat.

## Features

- **Authentication System**:
  - Compact Login component with credential validation and demo autofill
  - Registration component with inline password security strength meter
  - Session persistence and protected client routing
- **Dashboard Workspace**:
  - Key performance metric indicators (Revenue, Members, SLA Uptime, Failure Rate)
  - Member directory table with active/pending/inactive status toggles and record removal
  - Realtime system audit logs

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start local development server:
```bash
npm run dev
```

3. Build production bundle:
```bash
npm run build
```

## Demo Credentials

For testing authentication:
- **Email**: `alex.morgan@example.com`
- **Password**: `Password123!`
