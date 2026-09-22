-- ====================================================================
-- WELLINTEL DATABASE SCHEMA & POSTGRESQL / POSTGIS MIGRATIONS
-- ====================================================================

-- 1. Enable PostGIS extension for spatial queries (optional, fallback haversine function provided)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'field_officer')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Wells table
CREATE TABLE IF NOT EXISTS public.wells (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  well_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  village TEXT NOT NULL,
  taluk TEXT NOT NULL,
  district TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ALERT', 'MAINTENANCE')),
  well_type TEXT NOT NULL CHECK (well_type IN ('Borewell', 'Open Dug Well', 'Tube Well', 'Monitoring Piezometer')),
  depth DOUBLE PRECISION NOT NULL,
  water_level DOUBLE PRECISION NOT NULL,
  water_quality TEXT NOT NULL CHECK (water_quality IN ('Good', 'Moderate', 'Critical', 'High Salinity', 'Fluoride Concern')),
  yield DOUBLE PRECISION NOT NULL DEFAULT 1000,
  description TEXT,
  last_inspected DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Spatial index on coordinates
CREATE INDEX IF NOT EXISTS wells_lat_lng_idx ON public.wells (latitude, longitude);

-- 4. Well Measurements table (telemetry time series)
CREATE TABLE IF NOT EXISTS public.well_measurements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  well_id UUID REFERENCES public.wells(id) ON DELETE CASCADE NOT NULL,
  water_level DOUBLE PRECISION NOT NULL,
  water_quality TEXT NOT NULL,
  yield DOUBLE PRECISION NOT NULL,
  measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS measurements_well_date_idx ON public.well_measurements (well_id, measurement_date DESC);

-- 5. Water Quality Parameters Registry
CREATE TABLE IF NOT EXISTS public.water_quality (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  well_id UUID REFERENCES public.wells(id) ON DELETE CASCADE NOT NULL,
  ph DOUBLE PRECISION NOT NULL DEFAULT 7.2,
  tds DOUBLE PRECISION NOT NULL DEFAULT 350,
  fluoride DOUBLE PRECISION NOT NULL DEFAULT 0.8,
  temperature DOUBLE PRECISION NOT NULL DEFAULT 25.0,
  quality_status TEXT NOT NULL DEFAULT 'Good' CHECK (quality_status IN ('Good', 'Moderate', 'Critical')),
  last_tested_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Well Reports table (Community reporting)
CREATE TABLE IF NOT EXISTS public.well_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  well_id UUID REFERENCES public.wells(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  report_type TEXT NOT NULL CHECK (report_type IN (
    'Incorrect Location',
    'Damaged Well',
    'Water Unavailable',
    'Information Incorrect',
    'Water Quality Concern',
    'Other'
  )),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  resolved_at TIMESTAMPTZ
);

-- 7. Website Content CMS Table (Admin-controlled data)
CREATE TABLE IF NOT EXISTS public.website_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_by UUID REFERENCES public.profiles(id)
);

-- 8. Activity Logs & Security Audit Trail
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  user_role TEXT NOT NULL DEFAULT 'user',
  action TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'SYSTEM',
  details TEXT NOT NULL,
  ip_address TEXT,
  status TEXT NOT NULL DEFAULT 'SUCCESS',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'alert', 'success')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- AUTOMATIC PROFILE TRIGGER ON AUTH SIGNUP
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Groundwater Observer'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ====================================================================
-- HELPER FUNCTIONS
-- ====================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.well_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.well_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can read, users can update own profile, admins can manage all
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Wells: Public can read all wells, only admins can modify
CREATE POLICY "Wells are publicly readable" ON public.wells
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert wells" ON public.wells
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update wells" ON public.wells
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete wells" ON public.wells
  FOR DELETE USING (public.is_admin());

-- Water Quality: Public read, Admin write
CREATE POLICY "Water quality is publicly readable" ON public.water_quality
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage water quality" ON public.water_quality
  FOR ALL USING (public.is_admin());

-- Measurements: Publicly readable
CREATE POLICY "Measurements are publicly readable" ON public.well_measurements
  FOR SELECT USING (true);

-- Reports: Public can create, users view own, admins view and update all
CREATE POLICY "Anyone can create reports" ON public.well_reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own reports" ON public.well_reports
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can update reports" ON public.well_reports
  FOR UPDATE USING (public.is_admin());

-- Website Content: Public read, Admin write
CREATE POLICY "Website content is publicly readable" ON public.website_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can modify website content" ON public.website_content
  FOR ALL USING (public.is_admin());

-- Activity Logs: Admins read all, system insert
CREATE POLICY "Admins can view activity logs" ON public.activity_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Authenticated users can log activities" ON public.activity_logs
  FOR INSERT WITH CHECK (true);

-- Notifications: Users can view and update their own notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark own notifications read" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ====================================================================
-- STORED PROCEDURE / RPC: get_nearby_wells(lat, lng, radius)
-- ====================================================================

CREATE OR REPLACE FUNCTION public.get_nearby_wells(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 25.0
)
RETURNS TABLE (
  id UUID,
  well_code TEXT,
  name TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  village TEXT,
  taluk TEXT,
  district TEXT,
  status TEXT,
  well_type TEXT,
  depth DOUBLE PRECISION,
  water_level DOUBLE PRECISION,
  water_quality TEXT,
  yield DOUBLE PRECISION,
  description TEXT,
  last_inspected DATE,
  distance_km DOUBLE PRECISION
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    w.id,
    w.well_code,
    w.name,
    w.latitude,
    w.longitude,
    w.village,
    w.taluk,
    w.district,
    w.status,
    w.well_type,
    w.depth,
    w.water_level,
    w.water_quality,
    w.yield,
    w.description,
    w.last_inspected,
    ROUND(
      (6371 * acos(
        least(1.0, greatest(-1.0, 
          cos(radians(lat)) * cos(radians(w.latitude)) * cos(radians(w.longitude) - radians(lng)) + 
          sin(radians(lat)) * sin(radians(w.latitude))
        ))
      ))::numeric, 2
    )::double precision AS distance_km
  FROM public.wells w
  WHERE (
    6371 * acos(
      least(1.0, greatest(-1.0, 
        cos(radians(lat)) * cos(radians(w.latitude)) * cos(radians(w.longitude) - radians(lng)) + 
        sin(radians(lat)) * sin(radians(w.latitude))
      ))
    )
  ) <= radius_km
  ORDER BY distance_km ASC;
$$;
