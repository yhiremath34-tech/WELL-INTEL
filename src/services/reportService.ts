import type { WellReport, ReportStatus } from '../types/report';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const REPORT_STORAGE_KEY = 'wellintel_community_reports';

const INITIAL_REPORTS: WellReport[] = [
  {
    id: 'rep-101',
    well_id: 'well-1045',
    well_code: 'W-1045',
    well_name: 'Baikampady Industrial Piezometer B-2',
    user_id: 'usr-demo-1',
    user_name: 'Rohan Shetty',
    user_email: 'rohan.shetty@gmail.com',
    report_type: 'Water Quality Concern',
    description: 'Noticeable brackish taste and brownish sediment in recent pump test discharge. Requesting CGWB lab verification.',
    status: 'UNDER_REVIEW',
    admin_notes: 'Dispatched coastal hydrology field crew for EC conductivity sample collection.',
    created_at: '2026-09-19T11:20:00Z',
  },
  {
    id: 'rep-102',
    well_id: 'well-1049',
    well_code: 'W-1049',
    well_name: 'Padubidri Coastal Buffer Well',
    user_id: 'usr-demo-2',
    user_name: 'Asha Poojary',
    user_email: 'asha.p@outlook.com',
    report_type: 'Damaged Well',
    description: 'Protective concrete ring cracked after recent heavy monsoon squall. Wellhead casing exposed to surface runoff.',
    status: 'PENDING',
    created_at: '2026-09-20T08:45:00Z',
  },
  {
    id: 'rep-103',
    well_id: 'well-1053',
    well_code: 'W-1053',
    well_name: 'Whitefield IT Corridor Well #3',
    user_id: 'usr-demo-3',
    user_name: 'Vikram Joshi',
    user_email: 'v.joshi@techcorp.in',
    report_type: 'Water Unavailable',
    description: 'Submersible pump drawing dry air between 2 PM and 6 PM. Sustained yield deficit.',
    status: 'RESOLVED',
    admin_notes: 'Confirmed dynamic drawdown to 84m. Advised residential association to throttle extraction cycles.',
    created_at: '2026-09-14T14:10:00Z',
    resolved_at: '2026-09-17T16:00:00Z',
  },
  {
    id: 'rep-104',
    well_id: 'well-1066',
    well_code: 'W-1066',
    well_name: 'Urwa Market Community Water Point',
    user_id: 'usr-demo-4',
    user_name: 'Preethi Rao',
    user_email: 'preethi.rao@kavoor.org',
    report_type: 'Information Incorrect',
    description: 'Current depth listed as 58m, but recent desilting showed bedrock foundation at 64m.',
    status: 'RESOLVED',
    admin_notes: 'Updated well specification depth following municipality field audit.',
    created_at: '2026-09-12T10:00:00Z',
    resolved_at: '2026-09-15T09:30:00Z',
  }
];

function getLocalReports(): WellReport[] {
  try {
    const data = localStorage.getItem(REPORT_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_REPORTS;
  }
}

function saveLocalReports(reports: WellReport[]) {
  try {
    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports locally', e);
  }
}

export const reportService = {
  async getReports(): Promise<WellReport[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('well_reports')
          .select(`*, wells (well_code, name)`)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((r: any) => ({
            ...r,
            well_code: r.wells?.well_code || r.well_id,
            well_name: r.wells?.name,
          })) as WellReport[];
        }
      } catch (e) {
        console.warn('Supabase reports query error, falling back locally', e);
      }
    }

    return getLocalReports();
  },

  async getUserReports(userId: string): Promise<WellReport[]> {
    const all = await this.getReports();
    return all.filter((r) => r.user_id === userId || !r.user_id);
  },

  async submitReport(
    report: Omit<WellReport, 'id' | 'status' | 'created_at' | 'resolved_at' | 'admin_notes'>
  ): Promise<WellReport> {
    const timestamp = new Date().toISOString();
    const newReport: WellReport = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'PENDING',
      created_at: timestamp,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('well_reports')
          .insert({
            well_id: report.well_id,
            user_id: report.user_id,
            report_type: report.report_type,
            description: report.description,
            status: 'PENDING',
          })
          .select()
          .single();

        if (!error && data) {
          return data as WellReport;
        }
      } catch (e) {
        console.warn('Failed to insert report into Supabase, storing locally', e);
      }
    }

    const current = getLocalReports();
    const updated = [newReport, ...current];
    saveLocalReports(updated);
    return newReport;
  },

  async updateReportStatus(id: string, status: ReportStatus, adminNotes?: string): Promise<WellReport | null> {
    const timestamp = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('well_reports')
          .update({
            status,
            admin_notes: adminNotes,
            resolved_at: status === 'RESOLVED' || status === 'REJECTED' ? timestamp : null,
          })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return data as WellReport;
        }
      } catch (e) {
        console.warn('Supabase update report error, updating locally', e);
      }
    }

    const current = getLocalReports();
    const index = current.findIndex((r) => r.id === id);
    if (index === -1) return null;

    current[index] = {
      ...current[index],
      status,
      admin_notes: adminNotes || current[index].admin_notes,
      resolved_at: status === 'RESOLVED' || status === 'REJECTED' ? timestamp : undefined,
    };
    saveLocalReports(current);
    return current[index];
  },
};
