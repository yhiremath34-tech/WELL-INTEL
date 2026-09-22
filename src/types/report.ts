export type ReportIssueType = 
  | 'Incorrect Location'
  | 'Damaged Well'
  | 'Water Unavailable'
  | 'Information Incorrect'
  | 'Water Quality Concern'
  | 'Other';

export type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';

export interface WellReport {
  id: string;
  well_id: string;
  well_code?: string;
  well_name?: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  report_type: ReportIssueType;
  description: string;
  status: ReportStatus;
  admin_notes?: string;
  created_at: string;
  resolved_at?: string;
}
