import { Employee, Project, AsanaLog, MeetingLog, AppConfig } from './types';

export const INITIAL_CONFIG: AppConfig = {
  departments: ['Engineering', 'Product', 'Marketing', 'Design', 'Operations', 'Sales', 'Finance', 'HR'],
  costCenters: ['CC001', 'CC002', 'CC003', 'CC004', 'CC005'],
  projectManagers: ['PM Alpha', 'PM Beta', 'PM Gamma', 'PM Delta'],
  maxDailyHoursThreshold: 15,
};

export const INITIAL_EMPLOYEES: Employee[] = [
  { Employee_ID: 'EMP001', Employee_Name: 'Alice Chen', Department: 'Engineering', Cost_Center: 'CC001', Hourly_Rate: 150, Is_Active: true },
  { Employee_ID: 'EMP002', Employee_Name: 'Bob Zhang', Department: 'Engineering', Cost_Center: 'CC001', Hourly_Rate: 150, Is_Active: true },
  { Employee_ID: 'EMP003', Employee_Name: 'Charlie Wang', Department: 'Product', Cost_Center: 'CC002', Hourly_Rate: 180, Is_Active: true },
  { Employee_ID: 'EMP004', Employee_Name: 'David Li', Department: 'Marketing', Cost_Center: 'CC003', Hourly_Rate: 120, Is_Active: true },
  { Employee_ID: 'EMP005', Employee_Name: 'Eva Liu', Department: 'Design', Cost_Center: 'CC002', Hourly_Rate: 130, Is_Active: true },
  { Employee_ID: 'EMP006', Employee_Name: 'Frank Zhao', Department: 'Operations', Cost_Center: 'CC004', Hourly_Rate: 110, Is_Active: true },
  { Employee_ID: 'EMP007', Employee_Name: 'Grace Sun', Department: 'Engineering', Cost_Center: 'CC001', Hourly_Rate: 150, Is_Active: true },
  { Employee_ID: 'EMP008', Employee_Name: 'Henry Wu', Department: 'Engineering', Cost_Center: 'CC001', Hourly_Rate: 150, Is_Active: true },
  { Employee_ID: 'EMP009', Employee_Name: 'Ivy Yang', Department: 'Sales', Cost_Center: 'CC005', Hourly_Rate: 120, Is_Active: true },
  { Employee_ID: 'EMP010', Employee_Name: 'Jack Zhou', Department: 'HR', Cost_Center: 'CC004', Hourly_Rate: 100, Is_Active: true },
  { Employee_ID: 'EMP011', Employee_Name: 'Karen Qian', Department: 'Engineering', Cost_Center: 'CC001', Hourly_Rate: 150, Is_Active: true },
  { Employee_ID: 'EMP012', Employee_Name: 'Leo Xu', Department: 'Design', Cost_Center: 'CC002', Hourly_Rate: 130, Is_Active: true },
  { Employee_ID: 'EMP013', Employee_Name: 'Mia Lin', Department: 'Finance', Cost_Center: 'CC004', Hourly_Rate: 140, Is_Active: true },
  { Employee_ID: 'EMP014', Employee_Name: 'Nathan Gao', Department: 'Product', Cost_Center: 'CC002', Hourly_Rate: 180, Is_Active: true },
  { Employee_ID: 'EMP015', Employee_Name: 'Olivia Chang', Department: 'Marketing', Cost_Center: 'CC003', Hourly_Rate: 120, Is_Active: true },
];

export const INITIAL_PROJECTS: Project[] = [
  { Project_Code: 'PRJ001', Project_Name: 'NextGen ERP Portal', Billing_Type: 'Billable', Cost_Center: 'CC001', Project_Manager: 'PM Alpha', Project_Status: 'Active' },
  { Project_Code: 'PRJ002', Project_Name: 'Mobile App Refactoring', Billing_Type: 'Billable', Cost_Center: 'CC001', Project_Manager: 'PM Beta', Project_Status: 'Active' },
  { Project_Code: 'PRJ003', Project_Name: 'Brand Campaign Q3', Billing_Type: 'Billable', Cost_Center: 'CC003', Project_Manager: 'PM Gamma', Project_Status: 'Active' },
  { Project_Code: 'PRJ004', Project_Name: 'Internal Automation Bot', Billing_Type: 'Non-Billable', Cost_Center: 'CC004', Project_Manager: 'PM Delta', Project_Status: 'Active' },
  { Project_Code: 'PRJ005', Project_Name: 'Design System Setup', Billing_Type: 'Non-Billable', Cost_Center: 'CC002', Project_Manager: 'PM Alpha', Project_Status: 'Active' },
  { Project_Code: 'PRJ006', Project_Name: 'Customer Feedback Research', Billing_Type: 'Billable', Cost_Center: 'CC002', Project_Manager: 'PM Beta', Project_Status: 'Closed' },
];

export const INITIAL_ASANA_LOGS: AsanaLog[] = [
  // Normal Approved logs
  { Asana_Log_ID: 'LOG001', Employee: 'Alice Chen', Work_Date: '2026-06-22', Project: 'NextGen ERP Portal', Task_Name: 'Database schema design & migrations', Hours: 8, Approved_Status: 'Approved' },
  { Asana_Log_ID: 'LOG002', Employee: 'Bob Zhang', Work_Date: '2026-06-22', Project: 'NextGen ERP Portal', Task_Name: 'API route implementation', Hours: 7.5, Approved_Status: 'Approved' },
  { Asana_Log_ID: 'LOG003', Employee: 'Charlie Wang', Work_Date: '2026-06-22', Project: 'Design System Setup', Task_Name: 'Design tokens review', Hours: 4, Approved_Status: 'Approved' },
  { Asana_Log_ID: 'LOG004', Employee: 'David Li', Work_Date: '2026-06-22', Project: 'Brand Campaign Q3', Task_Name: 'Slogan ideation & assets planning', Hours: 6, Approved_Status: 'Approved' },
  { Asana_Log_ID: 'LOG005', Employee: 'Eva Liu', Work_Date: '2026-06-22', Project: 'Design System Setup', Task_Name: 'Figma component library sync', Hours: 8, Approved_Status: 'Approved' },
  { Asana_Log_ID: 'LOG006', Employee: 'Grace Sun', Work_Date: '2026-06-23', Project: 'Mobile App Refactoring', Task_Name: 'State management cleanup', Hours: 7, Approved_Status: 'Approved' },
  { Asana_Log_ID: 'LOG007', Employee: 'Henry Wu', Work_Date: '2026-06-23', Project: 'Mobile App Refactoring', Task_Name: 'Push notification bugs fixing', Hours: 8, Approved_Status: 'Approved' },
  
  // Unapproved Logs (Should be excluded from MASTER_TIMESHEET, and flagged in Validation if desired)
  { Asana_Log_ID: 'LOG008', Employee: 'Ivy Yang', Work_Date: '2026-06-23', Project: 'Brand Campaign Q3', Task_Name: 'Outreach to influencers', Hours: 5, Approved_Status: 'Unapproved' },
  { Asana_Log_ID: 'LOG009', Employee: 'Nathan Gao', Work_Date: '2026-06-23', Project: 'Design System Setup', Task_Name: 'Drafting design specs docs', Hours: 6, Approved_Status: 'Unapproved' },
  
  // Overtime Anomaly Log (Alice has more than 15 hours recorded on 2026-06-24: LOG010=9, LOG011=7.5 -> Total 16.5h)
  { Asana_Log_ID: 'LOG010', Employee: 'Alice Chen', Work_Date: '2026-06-24', Project: 'NextGen ERP Portal', Task_Name: 'Critical Hotfix deployment support', Hours: 9, Approved_Status: 'Approved' },
  { Asana_Log_ID: 'LOG011', Employee: 'Alice Chen', Work_Date: '2026-06-24', Project: 'Mobile App Refactoring', Task_Name: 'Code review for PRs', Hours: 7.5, Approved_Status: 'Approved' },
  
  // Orphan Project Anomaly Log (Project "Secret Moonshot" is NOT in PROJECT_MAP)
  { Asana_Log_ID: 'LOG012', Employee: 'Bob Zhang', Work_Date: '2026-06-24', Project: 'Secret Moonshot Initiative', Task_Name: 'Draft architecture proposal', Hours: 6, Approved_Status: 'Approved' },
  
  // Unregistered Employee Anomaly Log ("Zack Miller" is NOT in EMPLOYEE_MAP)
  { Asana_Log_ID: 'LOG013', Employee: 'Zack Miller', Work_Date: '2026-06-24', Project: 'NextGen ERP Portal', Task_Name: 'QA script setups', Hours: 8, Approved_Status: 'Approved' },
  
  // More normal logs to enrich data
  { Asana_Log_ID: 'LOG014', Employee: 'Karen Qian', Work_Date: '2026-06-24', Project: 'NextGen ERP Portal', Task_Name: 'CI/CD pipeline configuration', Hours: 8, Approved_Status: 'Approved' },
  { Asana_Log_ID: 'LOG015', Employee: 'Leo Xu', Work_Date: '2026-06-24', Project: 'Design System Setup', Task_Name: 'Tailwind configuration mapping', Hours: 6, Approved_Status: 'Approved' },
  { Asana_Log_ID: 'LOG016', Employee: 'Mia Lin', Work_Date: '2026-06-25', Project: 'Internal Automation Bot', Task_Name: 'Automating team weekly reports', Hours: 7, Approved_Status: 'Approved' },
  { Asana_Log_ID: 'LOG017', Employee: 'Olivia Chang', Work_Date: '2026-06-25', Project: 'Brand Campaign Q3', Task_Name: 'Social media visual designs', Hours: 6.5, Approved_Status: 'Approved' },
  { Asana_Log_ID: 'LOG018', Employee: 'Frank Zhao', Work_Date: '2026-06-25', Project: 'Internal Automation Bot', Task_Name: 'Teams API integration handler', Hours: 8, Approved_Status: 'Approved' },
  { Asana_Log_ID: 'LOG019', Employee: 'Jack Zhou', Work_Date: '2026-06-25', Project: 'Internal Automation Bot', Task_Name: 'Onboarding automation flow', Hours: 4, Approved_Status: 'Approved' },
];

export const INITIAL_MEETING_LOGS: MeetingLog[] = [
  { Meeting_ID: 'MTG001', Organizer: 'Charlie Wang', Attendee: 'Alice Chen', Subject: 'NextGen ERP Sprint Planning', Meeting_Date: '2026-06-22', Duration_Hours: 1.5 },
  { Meeting_ID: 'MTG002', Organizer: 'PM Beta', Attendee: 'Bob Zhang', Subject: 'Mobile Sync & API Handshake', Meeting_Date: '2026-06-22', Duration_Hours: 1.0 },
  { Meeting_ID: 'MTG003', Organizer: 'David Li', Attendee: 'Olivia Chang', Subject: 'Marketing Copy brainstorming', Meeting_Date: '2026-06-22', Duration_Hours: 2.0 },
  { Meeting_ID: 'MTG004', Organizer: 'Alice Chen', Attendee: 'Henry Wu', Subject: 'Notification Microservice Design', Meeting_Date: '2026-06-23', Duration_Hours: 1.5 },
  { Meeting_ID: 'MTG005', Organizer: 'Charlie Wang', Attendee: 'Charlie Wang', Subject: 'Product Board Alignment', Meeting_Date: '2026-06-23', Duration_Hours: 1.0 },
  { Meeting_ID: 'MTG006', Organizer: 'Nathan Gao', Attendee: 'Eva Liu', Subject: 'Design tokens system sync', Meeting_Date: '2026-06-24', Duration_Hours: 1.0 },
  { Meeting_ID: 'MTG007', Organizer: 'PM Alpha', Attendee: 'Karen Qian', Subject: 'NextGen ERP Deployment Retrospective', Meeting_Date: '2026-06-25', Duration_Hours: 1.2 },
];
