# WellIntel — Nearby Wells Intelligence Platform

> **"Discover the Water Beneath You."**  
> An advanced environmental intelligence dashboard and GIS application that helps users discover, explore, monitor, and understand nearby groundwater wells and regional aquifer dynamics.

---

## 🌟 Key Features

1. **Interactive GIS Map Workspace (`/map`)**:
   - 70/30 split screen layout featuring Leaflet and CartoDB Dark Matter / Positron / Satellite tiles.
   - Pulsing animated markers representing **Active**, **Alert**, **Maintenance**, and **Inactive** stations.
   - User GPS location beacon with dynamic circular radius boundary slider (5 km to 150 km).
   - Animated slide-in side panel (or mobile bottom sheet) displaying real-time water levels, casing depth, sustainable yields, and water quality grades.

2. **Nearby Wells Proximity Explorer (`/explore`)**:
   - One-click `"USE MY LOCATION"` integration with browser Geolocation API and Haversine distance calculations.
   - Proximity sorting (0.8 km, 1.2 km, 2.4 km...) with interactive cards, status badges, and quick water table indicators.

3. **In-Depth Well Intelligence Dossier (`/wells/:id`)**:
   - **Animated Hydrostatic Borehole Visualizer**: A vertical glass cylinder cross-section representing the physical well with undulating SVG waves, animated bubbles, and water column markers.
   - **Telemetry Time Series**: Interactive Recharts telemetry graph supporting 7 Days, 30 Days, 6 Months, and 1 Year historical intervals.
   - **Water Intelligence Rating**: Aquifer saturation percentage gauge, potability classification, and field inspection logs.

4. **Environmental Analytics & AI Insights (`/analytics`)**:
   - State-wide and regional KPI summary cards with animated count-up numbers.
   - Multi-axis charts: 12-month water table trend area, station status donut, well type taxonomy, and mineral potability distributions.
   - **INTELLIGENT INSIGHTS**: Rule-based deterministic environmental models computing aquifer depletion trajectories, coastal saline intrusion warnings, and extraction capacity indicators.

5. **Community-Sourced Reporting Wizard (`/reports`)**:
   - 4-step guided reporting flow: Target Well Selection ➔ Issue Categorization ➔ Observations & Priority ➔ Verification & Dispatch.
   - Transparent community submissions audit feed with status badges (*Pending Review*, *Under Review*, *Resolved*).

6. **Administrative Hub & Registry Management (`/admin/*`)**:
   - Directorate dashboard with critical alert stations feed and KPI counters.
   - Comprehensive CRUD table for well records with full modal form validation (Code, Coordinates, Village, Depth, Water Level, Yield, Quality).
   - Ticket management with status transitions (Review, Resolve, Reject) and administrative resolution notes.
   - User directory and access permission manager.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (Sophisticated palette: Deep Navy `#071A2B`, Water Blue `#168AAD`, Bright Cyan `#38BDF8`, Teal `#14B8A6`, Surface Light `#F7FBFF`)
- **Animation**: Framer Motion, HTML5 Canvas Particle Luminescence, SVG keyframe waves
- **GIS Mapping**: Leaflet, React-Leaflet, CartoDB & OpenStreetMap tile layers
- **Data Visualization**: Recharts
- **Database & Auth**: Supabase (PostgreSQL + PostGIS + Row Level Security + Supabase Auth) with zero-setup reactive local store fallback

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- Node.js (v18 or newer)
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/yhiremath34-tech/WELL-INTEL.git
cd WELL-INTEL

# Install dependencies
npm install
```

### 3. Environment Configuration (Optional)
The application works immediately out-of-the-box in local demo mode with 75+ realistic Karnataka stations. To connect a live Supabase database, copy `.env.example`:

```bash
cp .env.example .env
```

Set your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Database Setup (If using Supabase)
Execute the provided SQL migration in the Supabase SQL Editor:
- File location: `supabase/supabase_schema.sql`
- Creates tables: `profiles`, `wells`, `well_measurements`, `well_reports`, `notifications`
- Configures Row Level Security (RLS) policies
- Installs the PostGIS / Haversine spatial function: `get_nearby_wells(lat, lng, radius)`

### 5. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🧪 Demo Accounts (1-Click Test Access)

For hackathon demonstrations, the login screen includes 1-click test buttons:
- **Citizen Scout**: `citizen.scout@wellintel.org` (Role: User)
- **Administrator Hub**: `admin.director@wellintel.gov.in` (Role: Admin)

---

## 🚢 Deployment to Vercel

The project is pre-configured with `vercel.json` for single-page application routing.

1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Configure environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the project settings if using remote Supabase.
4. Framework preset: **Vite**.
5. Build command: `npm run build`. Output directory: `dist`.
6. Click **Deploy**.

---

## 📄 License & Environmental Disclaimer
*Demo Data Notice*: All well records in the default demonstration database represent synthetic locations calibrated around Karnataka coordinates for testing purposes.
