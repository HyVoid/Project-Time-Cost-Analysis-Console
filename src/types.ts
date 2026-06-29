export interface Employee {
  Employee_ID: string; // EMP001, etc.
  Employee_Name: string;
  Department: string;
  Cost_Center: string;
  Hourly_Rate: number;
  Is_Active: boolean;
}

export interface Project {
  Project_Code: string; // PRJ001, etc.
  Project_Name: string;
  Billing_Type: 'Billable' | 'Non-Billable';
  Cost_Center: string;
  Project_Manager: string;
  Project_Status: 'Active' | 'Closed';
}

export interface AsanaLog {
  Asana_Log_ID: string;
  Employee: string;
  Work_Date: string; // YYYY-MM-DD
  Project: string; // Project Name matching
  Task_Name: string;
  Hours: number;
  Approved_Status: 'Approved' | 'Unapproved';
}

export interface MeetingLog {
  Meeting_ID: string;
  Organizer: string;
  Attendee: string;
  Subject: string;
  Meeting_Date: string; // YYYY-MM-DD
  Duration_Hours: number;
}

export interface AppConfig {
  departments: string[];
  costCenters: string[];
  projectManagers: string[];
  maxDailyHoursThreshold: number;
}

export interface MasterTimesheetRow {
  Asana_Log_ID: string;
  Employee: string;
  Work_Date: string;
  Project: string;
  Task_Name: string;
  Hours: number;
  Rate: number;
  Cost: number;
  Cost_Center: string;
  Billing_Type: 'Billable' | 'Non-Billable';
}

export interface ValidationIssue {
  type: 'orphan_project' | 'overtime_limit' | 'unmapped_employee' | 'unapproved_hours';
  level: 'warning' | 'error';
  description: string;
  details: string;
  itemKey: string; // reference id or value
}
