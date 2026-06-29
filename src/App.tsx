import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Settings, 
  ShieldCheck, 
  PieChart, 
  Layers, 
  Users, 
  FolderKanban, 
  Check, 
  X, 
  FileSpreadsheet, 
  CalendarRange,
  Clock,
  Info,
  HelpCircle
} from 'lucide-react';

import { Employee, Project, AsanaLog, MeetingLog, AppConfig, MasterTimesheetRow, ValidationIssue } from './types';
import { INITIAL_CONFIG, INITIAL_EMPLOYEES, INITIAL_PROJECTS, INITIAL_ASANA_LOGS, INITIAL_MEETING_LOGS } from './initialData';

export default function App() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<string>('DASHBOARD');
  
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('pilot_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('pilot_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [asanaLogs, setAsanaLogs] = useState<AsanaLog[]>(() => {
    const saved = localStorage.getItem('pilot_asana_logs');
    return saved ? JSON.parse(saved) : INITIAL_ASANA_LOGS;
  });

  const [meetingLogs, setMeetingLogs] = useState<MeetingLog[]>(() => {
    const saved = localStorage.getItem('pilot_meeting_logs');
    return saved ? JSON.parse(saved) : INITIAL_MEETING_LOGS;
  });

  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('pilot_config');
    return saved ? JSON.parse(saved) : INITIAL_CONFIG;
  });

  const [lastSaved, setLastSaved] = useState<string>(() => {
    return localStorage.getItem('pilot_last_saved') || new Date().toLocaleString('en-US');
  });

  // State for inline add forms
  const [newEmp, setNewEmp] = useState<Partial<Employee>>({
    Employee_ID: '',
    Employee_Name: '',
    Department: 'Engineering',
    Cost_Center: 'CC001',
    Hourly_Rate: 120,
    Is_Active: true
  });

  const [newPrj, setNewPrj] = useState<Partial<Project>>({
    Project_Code: '',
    Project_Name: '',
    Billing_Type: 'Billable',
    Cost_Center: 'CC001',
    Project_Manager: 'PM Alpha',
    Project_Status: 'Active'
  });

  const [newAsana, setNewAsana] = useState<Partial<AsanaLog>>({
    Asana_Log_ID: '',
    Employee: '',
    Work_Date: new Date().toISOString().split('T')[0],
    Project: '',
    Task_Name: '',
    Hours: 8,
    Approved_Status: 'Approved'
  });

  const [newMtg, setNewMtg] = useState<Partial<MeetingLog>>({
    Meeting_ID: '',
    Organizer: '',
    Attendee: '',
    Subject: '',
    Meeting_Date: new Date().toISOString().split('T')[0],
    Duration_Hours: 1
  });

  // Search/Filters state
  const [timesheetSearch, setTimesheetSearch] = useState('');
  const [timesheetBillingFilter, setTimesheetBillingFilter] = useState('ALL');
  const [timesheetCCFilter, setTimesheetCCFilter] = useState('ALL');

  // Triggering visual anims on tab change
  const [animTrigger, setAnimTrigger] = useState(false);
  useEffect(() => {
    setAnimTrigger(true);
    const t = setTimeout(() => setAnimTrigger(false), 220);
    return () => clearTimeout(t);
  }, [activeTab]);

  // --- PERSISTENCE ---
  const saveAllToLocalStorage = (
    currentEmps: Employee[],
    currentPrjs: Project[],
    currentAsana: AsanaLog[],
    currentMeetings: MeetingLog[],
    currentConfig: AppConfig
  ) => {
    localStorage.setItem('pilot_employees', JSON.stringify(currentEmps));
    localStorage.setItem('pilot_projects', JSON.stringify(currentPrjs));
    localStorage.setItem('pilot_asana_logs', JSON.stringify(currentAsana));
    localStorage.setItem('pilot_meeting_logs', JSON.stringify(currentMeetings));
    localStorage.setItem('pilot_config', JSON.stringify(currentConfig));
    const nowStr = new Date().toLocaleString('en-US');
    localStorage.setItem('pilot_last_saved', nowStr);
    setLastSaved(nowStr);
  };

  const handleStateChange = (type: 'employees' | 'projects' | 'asana' | 'meetings' | 'config', updatedData: any) => {
    let nextEmps = employees;
    let nextPrjs = projects;
    let nextAsana = asanaLogs;
    let nextMeetings = meetingLogs;
    let nextConfig = config;

    if (type === 'employees') {
      setEmployees(updatedData);
      nextEmps = updatedData;
    } else if (type === 'projects') {
      setProjects(updatedData);
      nextPrjs = updatedData;
    } else if (type === 'asana') {
      setAsanaLogs(updatedData);
      nextAsana = updatedData;
    } else if (type === 'meetings') {
      setMeetingLogs(updatedData);
      nextMeetings = updatedData;
    } else if (type === 'config') {
      setConfig(updatedData);
      nextConfig = updatedData;
    }

    saveAllToLocalStorage(nextEmps, nextPrjs, nextAsana, nextMeetings, nextConfig);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to restore the default pilot datasets? All custom changes will be overwritten.')) {
      setEmployees(INITIAL_EMPLOYEES);
      setProjects(INITIAL_PROJECTS);
      setAsanaLogs(INITIAL_ASANA_LOGS);
      setMeetingLogs(INITIAL_MEETING_LOGS);
      setConfig(INITIAL_CONFIG);
      
      const nowStr = new Date().toLocaleString('en-US');
      localStorage.setItem('pilot_employees', JSON.stringify(INITIAL_EMPLOYEES));
      localStorage.setItem('pilot_projects', JSON.stringify(INITIAL_PROJECTS));
      localStorage.setItem('pilot_asana_logs', JSON.stringify(INITIAL_ASANA_LOGS));
      localStorage.setItem('pilot_meeting_logs', JSON.stringify(INITIAL_MEETING_LOGS));
      localStorage.setItem('pilot_config', JSON.stringify(INITIAL_CONFIG));
      localStorage.setItem('pilot_last_saved', nowStr);
      setLastSaved(nowStr);
      setActiveTab('DASHBOARD');
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      employees,
      projects,
      asanaLogs,
      meetingLogs,
      config,
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `project_cost_console_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.employees && json.projects && json.asanaLogs && json.meetingLogs && json.config) {
          setEmployees(json.employees);
          setProjects(json.projects);
          setAsanaLogs(json.asanaLogs);
          setMeetingLogs(json.meetingLogs);
          setConfig(json.config);
          
          saveAllToLocalStorage(json.employees, json.projects, json.asanaLogs, json.meetingLogs, json.config);
          alert('Backup imported successfully!');
          setActiveTab('DASHBOARD');
        } else {
          alert('Invalid backup file schema. Please ensure all tables exist.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // --- DYNAMIC FORMULAS & COMPUTATIONS ---

  // 1. MASTER_TIMESHEET calculation
  const masterTimesheet = useMemo<MasterTimesheetRow[]>(() => {
    // Rule: Filter approved, having registered projects & registered employees
    return asanaLogs
      .filter(log => {
        const isApproved = log.Approved_Status === 'Approved';
        const projectExists = projects.some(p => p.Project_Name.toLowerCase() === log.Project.toLowerCase());
        const employeeExists = employees.some(e => e.Employee_Name.toLowerCase() === log.Employee.toLowerCase());
        return isApproved && projectExists && employeeExists;
      })
      .map(log => {
        const matchingEmployee = employees.find(e => e.Employee_Name.toLowerCase() === log.Employee.toLowerCase());
        const matchingProject = projects.find(p => p.Project_Name.toLowerCase() === log.Project.toLowerCase());

        const rate = matchingEmployee ? matchingEmployee.Hourly_Rate : 0;
        const cost = log.Hours * rate;
        const costCenter = matchingProject ? matchingProject.Cost_Center : 'CC_UNKNOWN';
        const billingType = matchingProject ? matchingProject.Billing_Type : 'Non-Billable';

        return {
          Asana_Log_ID: log.Asana_Log_ID,
          Employee: log.Employee,
          Work_Date: log.Work_Date,
          Project: log.Project,
          Task_Name: log.Task_Name,
          Hours: log.Hours,
          Rate: rate,
          Cost: cost,
          Cost_Center: costCenter,
          Billing_Type: billingType,
        };
      });
  }, [asanaLogs, employees, projects]);

  // Filtered master timesheet for UI display
  const filteredMasterTimesheet = useMemo(() => {
    return masterTimesheet.filter(row => {
      const matchSearch = 
        row.Employee.toLowerCase().includes(timesheetSearch.toLowerCase()) ||
        row.Project.toLowerCase().includes(timesheetSearch.toLowerCase()) ||
        row.Task_Name.toLowerCase().includes(timesheetSearch.toLowerCase()) ||
        row.Asana_Log_ID.toLowerCase().includes(timesheetSearch.toLowerCase());
      
      const matchBilling = timesheetBillingFilter === 'ALL' || row.Billing_Type === timesheetBillingFilter;
      const matchCC = timesheetCCFilter === 'ALL' || row.Cost_Center === timesheetCCFilter;

      return matchSearch && matchBilling && matchCC;
    });
  }, [masterTimesheet, timesheetSearch, timesheetBillingFilter, timesheetCCFilter]);

  // 2. VALIDATION ENGINE checks
  const validationIssues = useMemo<ValidationIssue[]>(() => {
    const issues: ValidationIssue[] = [];

    // Rule 1: Orphan projects (Asana logs with projects not registered in Project Map)
    const uniqueRawProjects = Array.from(new Set(asanaLogs.map(l => l.Project))) as string[];
    const registeredProjectNames = projects.map(p => p.Project_Name.toLowerCase());
    
    uniqueRawProjects.forEach(rawProj => {
      if (!registeredProjectNames.includes(rawProj.toLowerCase())) {
        const count = asanaLogs.filter(l => l.Project === rawProj).length;
        issues.push({
          type: 'orphan_project',
          level: 'error',
          description: `Orphan Project: "${rawProj}" is not registered in Project Map.`,
          details: `Found in ${count} raw Asana logs. These logs are currently held back from Master Timesheet and cost distributions.`,
          itemKey: rawProj
        });
      }
    });

    // Rule 2: Unregistered Employees
    const uniqueRawEmployees = Array.from(new Set(asanaLogs.map(l => l.Employee))) as string[];
    const registeredEmployeeNames = employees.map(e => e.Employee_Name.toLowerCase());

    uniqueRawEmployees.forEach(rawEmp => {
      if (!registeredEmployeeNames.includes(rawEmp.toLowerCase())) {
        const count = asanaLogs.filter(l => l.Employee === rawEmp).length;
        issues.push({
          type: 'unmapped_employee',
          level: 'error',
          description: `Unregistered Employee: "${rawEmp}" is not mapped in Employee Master.`,
          details: `Found in ${count} raw Asana logs. Hourly cost calculations are missing; excluded from Master.`,
          itemKey: rawEmp
        });
      }
    });

    // Rule 3: Single day working hours threshold (> limit, standard 15h)
    // Group approved logs by employee and date
    const employeeDateHours: { [key: string]: number } = {};
    asanaLogs
      .filter(l => l.Approved_Status === 'Approved')
      .forEach(log => {
        const key = `${log.Employee}|${log.Work_Date}`;
        employeeDateHours[key] = (employeeDateHours[key] || 0) + log.Hours;
      });

    Object.entries(employeeDateHours).forEach(([key, hours]) => {
      if (hours > config.maxDailyHoursThreshold) {
        const [emp, date] = key.split('|');
        issues.push({
          type: 'overtime_limit',
          level: 'warning',
          description: `Overtime Warning: ${emp} recorded ${hours} approved hours on ${date}.`,
          details: `Total working hours exceed the set daily safety limit of ${config.maxDailyHoursThreshold} hours. Check for duplicates.`,
          itemKey: key
        });
      }
    });

    // Rule 4: Unapproved logs alert
    const unapprovedCount = asanaLogs.filter(l => l.Approved_Status === 'Unapproved').length;
    if (unapprovedCount > 0) {
      issues.push({
        type: 'unapproved_hours',
        level: 'warning',
        description: `${unapprovedCount} raw Asana logs are pending PM approval.`,
        details: `These logs will remain excluded from financial calculations until approved.`,
        itemKey: 'PENDING_APPROV'
      });
    }

    return issues;
  }, [asanaLogs, projects, employees, config]);

  // 3. DASHBOARD METRICS
  const dashboardStats = useMemo(() => {
    const totalHours = masterTimesheet.reduce((sum, r) => sum + r.Hours, 0);
    const totalCost = masterTimesheet.reduce((sum, r) => sum + r.Cost, 0);
    const activeProjectsCount = projects.filter(p => p.Project_Status === 'Active').length;
    const activeEmployeesCount = employees.filter(e => e.Is_Active).length;
    const alertCount = validationIssues.length;

    // Project breakdown list
    const projectBreakdown = projects
      .filter(p => p.Project_Status === 'Active')
      .map(p => {
        const logsForProject = masterTimesheet.filter(r => r.Project.toLowerCase() === p.Project_Name.toLowerCase());
        const hrs = logsForProject.reduce((sum, r) => sum + r.Hours, 0);
        const cost = logsForProject.reduce((sum, r) => sum + r.Cost, 0);
        const billableHrs = logsForProject.filter(r => r.Billing_Type === 'Billable').reduce((sum, r) => sum + r.Hours, 0);
        
        return {
          ...p,
          totalHours: hrs,
          totalCost: cost,
          billableRatio: hrs > 0 ? billableHrs / hrs : 0
        };
      });

    // Employee saturation / utilization list
    const employeeSaturation = employees.map(emp => {
      const logsForEmp = masterTimesheet.filter(r => r.Employee.toLowerCase() === emp.Employee_Name.toLowerCase());
      const prjHrs = logsForEmp.reduce((sum, r) => sum + r.Hours, 0);
      
      const meetingsForEmp = meetingLogs.filter(m => m.Attendee.toLowerCase() === emp.Employee_Name.toLowerCase());
      const mtgHrs = meetingsForEmp.reduce((sum, m) => sum + m.Duration_Hours, 0);

      const totalWorked = prjHrs + mtgHrs;
      // standard weekly cap of 40 hours as base target
      const directUtilization = prjHrs > 0 ? prjHrs / 40 : 0;

      return {
        ...emp,
        projectHours: prjHrs,
        meetingHours: mtgHrs,
        totalHours: totalWorked,
        utilization: directUtilization
      };
    });

    // Cost Center split
    const costCenterAllocation = config.costCenters.map(cc => {
      const ccCost = masterTimesheet.filter(r => r.Cost_Center === cc).reduce((sum, r) => sum + r.Cost, 0);
      const ratio = totalCost > 0 ? ccCost / totalCost : 0;
      return {
        costCenter: cc,
        totalCost: ccCost,
        ratio
      };
    });

    return {
      totalHours,
      totalCost,
      activeProjectsCount,
      activeEmployeesCount,
      alertCount,
      projectBreakdown,
      employeeSaturation,
      costCenterAllocation
    };
  }, [masterTimesheet, projects, employees, validationIssues, config]);


  // --- INLINE ACTION HANDLERS ---

  // Helper to append next item code or unique ID
  const generateNextId = (list: any[], prefix: string, idField: string) => {
    const nums = list
      .map(item => {
        const val = item[idField] || '';
        const m = val.match(/\d+/);
        return m ? parseInt(m[0], 10) : 0;
      });
    const maxNum = nums.length > 0 ? Math.max(...nums) : 0;
    const nextNum = maxNum + 1;
    return `${prefix}${nextNum.toString().padStart(3, '0')}`;
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.Employee_Name) return;

    const nextId = generateNextId(employees, 'EMP', 'Employee_ID');
    const fullEmp: Employee = {
      Employee_ID: nextId,
      Employee_Name: newEmp.Employee_Name,
      Department: newEmp.Department || 'Engineering',
      Cost_Center: newEmp.Cost_Center || 'CC001',
      Hourly_Rate: Number(newEmp.Hourly_Rate) || 100,
      Is_Active: newEmp.Is_Active !== undefined ? newEmp.Is_Active : true
    };

    const updated = [...employees, fullEmp];
    handleStateChange('employees', updated);
    
    // Reset add form
    setNewEmp({
      Employee_ID: '',
      Employee_Name: '',
      Department: 'Engineering',
      Cost_Center: 'CC001',
      Hourly_Rate: 120,
      Is_Active: true
    });
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm('Delete this employee mapping?')) {
      const updated = employees.filter(emp => emp.Employee_ID !== id);
      handleStateChange('employees', updated);
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrj.Project_Name) return;

    const nextCode = generateNextId(projects, 'PRJ', 'Project_Code');
    const fullPrj: Project = {
      Project_Code: nextCode,
      Project_Name: newPrj.Project_Name,
      Billing_Type: newPrj.Billing_Type as 'Billable' | 'Non-Billable' || 'Billable',
      Cost_Center: newPrj.Cost_Center || 'CC001',
      Project_Manager: newPrj.Project_Manager || 'PM Alpha',
      Project_Status: 'Active'
    };

    const updated = [...projects, fullPrj];
    handleStateChange('projects', updated);

    setNewPrj({
      Project_Code: '',
      Project_Name: '',
      Billing_Type: 'Billable',
      Cost_Center: 'CC001',
      Project_Manager: 'PM Alpha',
      Project_Status: 'Active'
    });
  };

  const handleDeleteProject = (code: string) => {
    if (window.confirm('Delete this project mapping?')) {
      const updated = projects.filter(p => p.Project_Code !== code);
      handleStateChange('projects', updated);
    }
  };

  const handleAddAsanaLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsana.Employee || !newAsana.Project || !newAsana.Hours) return;

    const nextId = generateNextId(asanaLogs, 'LOG', 'Asana_Log_ID');
    const fullLog: AsanaLog = {
      Asana_Log_ID: nextId,
      Employee: newAsana.Employee,
      Work_Date: newAsana.Work_Date || new Date().toISOString().split('T')[0],
      Project: newAsana.Project,
      Task_Name: newAsana.Task_Name || 'General tasks',
      Hours: Number(newAsana.Hours) || 0,
      Approved_Status: newAsana.Approved_Status as 'Approved' | 'Unapproved' || 'Approved'
    };

    const updated = [...asanaLogs, fullLog];
    handleStateChange('asana', updated);

    setNewAsana({
      Asana_Log_ID: '',
      Employee: '',
      Work_Date: new Date().toISOString().split('T')[0],
      Project: '',
      Task_Name: '',
      Hours: 8,
      Approved_Status: 'Approved'
    });
  };

  const handleDeleteAsanaLog = (id: string) => {
    if (window.confirm('Delete this raw Asana log?')) {
      const updated = asanaLogs.filter(log => log.Asana_Log_ID !== id);
      handleStateChange('asana', updated);
    }
  };

  const handleAddMeetingLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMtg.Organizer || !newMtg.Attendee || !newMtg.Duration_Hours) return;

    const nextId = generateNextId(meetingLogs, 'MTG', 'Meeting_ID');
    const fullLog: MeetingLog = {
      Meeting_ID: nextId,
      Organizer: newMtg.Organizer,
      Attendee: newMtg.Attendee,
      Subject: newMtg.Subject || 'Sync meeting',
      Meeting_Date: newMtg.Meeting_Date || new Date().toISOString().split('T')[0],
      Duration_Hours: Number(newMtg.Duration_Hours) || 1
    };

    const updated = [...meetingLogs, fullLog];
    handleStateChange('meetings', updated);

    setNewMtg({
      Meeting_ID: '',
      Organizer: '',
      Attendee: '',
      Subject: '',
      Meeting_Date: new Date().toISOString().split('T')[0],
      Duration_Hours: 1
    });
  };

  const handleDeleteMeetingLog = (id: string) => {
    if (window.confirm('Delete this raw meeting log?')) {
      const updated = meetingLogs.filter(log => log.Meeting_ID !== id);
      handleStateChange('meetings', updated);
    }
  };

  const handleUpdateEmployeeField = (index: number, field: keyof Employee, value: any) => {
    const updated = [...employees];
    if (field === 'Hourly_Rate') {
      updated[index] = { ...updated[index], [field]: Number(value) };
    } else if (field === 'Is_Active') {
      updated[index] = { ...updated[index], [field]: Boolean(value) };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    handleStateChange('employees', updated);
  };

  const handleUpdateProjectField = (index: number, field: keyof Project, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    handleStateChange('projects', updated);
  };

  const handleUpdateAsanaLogField = (index: number, field: keyof AsanaLog, value: any) => {
    const updated = [...asanaLogs];
    if (field === 'Hours') {
      updated[index] = { ...updated[index], [field]: Number(value) };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    handleStateChange('asana', updated);
  };

  const handleUpdateMeetingField = (index: number, field: keyof MeetingLog, value: any) => {
    const updated = [...meetingLogs];
    if (field === 'Duration_Hours') {
      updated[index] = { ...updated[index], [field]: Number(value) };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    handleStateChange('meetings', updated);
  };

  // --- AUTOMATIC RESOLUTIONS FOR VALIDATION ALERTS ---
  const resolveOrphanProject = (projectName: string) => {
    // Instantly add this project to the project maps
    const nextCode = generateNextId(projects, 'PRJ', 'Project_Code');
    const fullPrj: Project = {
      Project_Code: nextCode,
      Project_Name: projectName,
      Billing_Type: 'Billable',
      Cost_Center: 'CC001',
      Project_Manager: config.projectManagers[0] || 'PM Alpha',
      Project_Status: 'Active'
    };
    const updated = [...projects, fullPrj];
    handleStateChange('projects', updated);
    alert(`Successfully registered project "${projectName}" as ${nextCode}! Master timesheet will now calculate cost center and billing values.`);
  };

  const resolveUnmappedEmployee = (employeeName: string) => {
    // Instantly map employee to employee master
    const nextId = generateNextId(employees, 'EMP', 'Employee_ID');
    const fullEmp: Employee = {
      Employee_ID: nextId,
      Employee_Name: employeeName,
      Department: config.departments[0] || 'Engineering',
      Cost_Center: config.costCenters[0] || 'CC001',
      Hourly_Rate: 150,
      Is_Active: true
    };
    const updated = [...employees, fullEmp];
    handleStateChange('employees', updated);
    alert(`Successfully registered employee "${employeeName}" with default $150 rate! Costs will now recalculate immediately.`);
  };

  const approveAllPendingLogs = () => {
    const updated = asanaLogs.map(l => {
      if (l.Approved_Status === 'Unapproved') {
        return { ...l, Approved_Status: 'Approved' as const };
      }
      return l;
    });
    handleStateChange('asana', updated);
    alert('All pending raw logs have been approved and promoted to Master Timesheet!');
  };


  return (
    <div className="min-h-screen flex flex-col font-sans-body antialiased bg-[var(--color-bg)]">
      
      {/* ── STICKY TOP NAVIGATION BAR (56px) ── */}
      <header className="sticky top-0 z-50 h-14 bg-white border-b border-[var(--color-border)] shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center justify-between px-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-accent)] font-semibold text-sm">
            T
          </div>
          <span className="font-eb-garamond text-xl font-bold tracking-tight text-[var(--color-primary)]">
            PILOT CONSOLE
          </span>
          <span className="hidden md:inline text-[11px] font-semibold uppercase tracking-wider text-white bg-[var(--color-primary)] px-2 py-0.5 rounded-full ml-1">
            Pilot v1.0
          </span>
        </div>

        {/* Horizontal Navigation List */}
        <nav className="flex h-full items-center">
          {[
            { id: 'DASHBOARD', label: 'Dashboard', icon: PieChart },
            { id: 'MASTER', label: 'Master Timesheet', icon: FileSpreadsheet },
            { id: 'VALIDATION', label: 'Validation Centre', icon: ShieldCheck, badge: validationIssues.length },
            { id: 'EMPLOYEE_MAP', label: 'Employee Master', icon: Users },
            { id: 'PROJECT_MAP', label: 'Project Master', icon: FolderKanban },
            { id: 'RAW_ASANA', label: 'Raw Asana Logs', icon: Clock },
            { id: 'RAW_MEETING', label: 'Raw Meetings', icon: CalendarRange },
            { id: 'CONFIG', label: 'System Config', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id.toLowerCase()}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 h-full px-3 xl:px-4 text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'text-[var(--color-accent)]' 
                    : 'text-[var(--color-primary)]/55 hover:text-[var(--color-accent)] hover:bg-[var(--color-bg)]/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                    tab.id === 'VALIDATION' ? 'bg-[var(--color-negative)] text-white' : 'bg-[var(--color-accent)] text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--color-accent)] rounded-t-sm" />
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* ── MAIN CONTAINER AREA (1400px Max, 40px padding) ── */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-10 py-8">
        
        {/* State Auto-Save & Sync Utility Indicator */}
        <div className="flex flex-wrap items-center justify-between mb-8 pb-3 border-b border-[var(--color-border)]">
          <div>
            <h1 className="font-eb-garamond text-3xl font-bold tracking-tight text-[var(--color-primary)] mb-1">
              {activeTab === 'DASHBOARD' && 'Executive Insight Dashboard'}
              {activeTab === 'MASTER' && 'Unified Master Timesheet (Single Trust)'}
              {activeTab === 'VALIDATION' && 'Security Audit & Data Integrity Checks'}
              {activeTab === 'EMPLOYEE_MAP' && 'Employee Mapping & Rates Controller'}
              {activeTab === 'PROJECT_MAP' && 'Project Scope & Cost Center mapping'}
              {activeTab === 'RAW_ASANA' && 'Asana Connector Stage (Read/Edit Raw)'}
              {activeTab === 'RAW_MEETING' && 'Outlook Calendar Sync Logs'}
              {activeTab === 'CONFIG' && 'Central Configuration & Backup Panel'}
            </h1>
            <p className="text-[var(--color-muted)] text-[13px]">
              {activeTab === 'DASHBOARD' && 'Interactive financial breakdown and workforce utilization ratios for 15-person pilot group.'}
              {activeTab === 'MASTER' && 'Pre-filtered, validated project work logs auto-enriched with financial metrics and billing attributes.'}
              {activeTab === 'VALIDATION' && 'Detection of orphan entities, work hour limit breaches, and missing data points.'}
              {activeTab === 'EMPLOYEE_MAP' && 'Define pilot workforce rates, Default cost center codes, and structural business unit departments.'}
              {activeTab === 'PROJECT_MAP' && 'Manage system translation parameters linking operational projects to capital cost nodes.'}
              {activeTab === 'RAW_ASANA' && 'Power Automate staging environment. Records are locked from master until approved.'}
              {activeTab === 'RAW_MEETING' && 'Implicit company meetings calendar logs for tracking hidden overhead saturation.'}
              {activeTab === 'CONFIG' && 'Configure custom lookup constants, data thresholds, exports, and backup restorations.'}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 sm:mt-0 bg-white px-4 py-2 rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-positive)] animate-pulse"></span>
              <span>Auto-saved to Local</span>
            </div>
            <span className="text-[var(--color-muted)] text-xs font-mono">|</span>
            <span className="text-xs text-[var(--color-primary)] font-mono">
              Last saved: <span className="font-semibold text-[var(--color-accent)]">{lastSaved}</span>
            </span>
          </div>
        </div>

        {/* ── SHEET VIEW CONTENT WITH FADE-UP ANIMATION ── */}
        <div className={animTrigger ? 'animate-fade-up' : ''}>
          
          {/* =======================================================
              1. DASHBOARD VIEW
              ======================================================= */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-8">
              
              {/* FIVE HERO KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-5 border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:translate-y-[-2px] hover:shadow-md border border-border/50 transition-all duration-300">
                  <div className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">Total Project Hours</div>
                  <div className="font-eb-garamond text-3xl font-bold tracking-tight text-[var(--color-primary)] mb-1">
                    {dashboardStats.totalHours.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}h
                  </div>
                  <div className="text-[11px] text-[var(--color-muted)] flex items-center gap-1">
                    <span className="text-[var(--color-positive)] font-semibold">✓ Validated</span>
                    <span>Approved Asana hours</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:translate-y-[-2px] hover:shadow-md border border-border/50 transition-all duration-300">
                  <div className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">Processed Project Costs</div>
                  <div className="font-eb-garamond text-3xl font-bold tracking-tight text-[var(--color-accent)] mb-1">
                    ${dashboardStats.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-[var(--color-muted)]">
                    Calculated hourly rates
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:translate-y-[-2px] hover:shadow-md border border-border/50 transition-all duration-300">
                  <div className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">Active Projects</div>
                  <div className="font-eb-garamond text-3xl font-bold tracking-tight text-[var(--color-primary)] mb-1">
                    {dashboardStats.activeProjectsCount}
                  </div>
                  <div className="text-[11px] text-[var(--color-muted)]">
                    Within mapped boundaries
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:translate-y-[-2px] hover:shadow-md border border-border/50 transition-all duration-300">
                  <div className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">Tracked Pilot Team</div>
                  <div className="font-eb-garamond text-3xl font-bold tracking-tight text-[var(--color-primary)] mb-1">
                    {dashboardStats.activeEmployeesCount} / {employees.length}
                  </div>
                  <div className="text-[11px] text-[var(--color-muted)]">
                    In-service employees active
                  </div>
                </div>

                <div className={`bg-white rounded-xl p-5 border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:translate-y-[-2px] hover:shadow-md border border-border/50 transition-all duration-300 border-l-4 ${
                  dashboardStats.alertCount > 0 ? 'border-[var(--color-negative)]' : 'border-[var(--color-positive)]'
                }`}>
                  <div className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">Validation Issues</div>
                  <div className={`font-eb-garamond text-3xl font-bold tracking-tight mb-1 ${
                    dashboardStats.alertCount > 0 ? 'text-[var(--color-negative)]' : 'text-[var(--color-positive)]'
                  }`}>
                    {dashboardStats.alertCount}
                  </div>
                  <div className="text-[11px] text-[var(--color-muted)]">
                    {dashboardStats.alertCount > 0 ? 'Requires attention / adjustment' : 'No integrity issues found'}
                  </div>
                </div>
              </div>

              {/* AUTOMATIC INSIGHT BLOCK */}
              <div className="p-5 rounded-xl bg-[rgba(34,81,255,0.04)] border-l-4 border-[var(--color-accent)] shadow-[0_2px_8px_rgba(5,28,44,0.02)]">
                <h3 className="font-eb-garamond text-lg font-bold text-[var(--color-primary)] mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-[var(--color-accent)]" />
                  Pilot Execution Summary & Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[13px] text-[#1A1A2E] leading-relaxed">
                  <div>
                    <strong className="text-[var(--color-primary)]">Workforce Integration:</strong> Out of {asanaLogs.length} logged records in the staging area, {masterTimesheet.length} logs are actively feeding into costs. The remainder are blocked due to validation issues or pending approvals.
                  </div>
                  <div>
                    <strong className="text-[var(--color-primary)]">Capitalization Health:</strong> The average cost of pilot projects stands at <strong className="text-[var(--color-accent)]">${(dashboardStats.totalCost / (dashboardStats.activeProjectsCount || 1)).toFixed(2)}</strong> per active initiative, offering reliable allocation mappings for cost-center accounting.
                  </div>
                  <div>
                    <strong className="text-[var(--color-primary)]">Operational Efficiency:</strong> Cross-referencing Teams calendar logs shows a baseline meeting load. Ensuring meetings do not cannibalize direct billable work is the primary focus for pilot control.
                  </div>
                </div>
              </div>

              {/* THREE MAIN VISUAL DATAGRIDS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. Project Workload & Capital Costs Breakdown */}
                <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-eb-garamond text-lg font-bold text-[var(--color-primary)] tracking-tight uppercase">
                      Project Capitalization Breakdown
                    </h2>
                    <span className="text-xs text-[var(--color-muted)] font-mono">Auto-sorted from Master</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--color-border)] text-[var(--color-primary)] font-semibold text-[11px] uppercase">
                          <th className="py-2.5">Project Name</th>
                          <th className="py-2.5 text-right">Hours</th>
                          <th className="py-2.5 text-right">Mapped Cost</th>
                          <th className="py-2.5 text-right">Billable Ratio</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)] text-[13px]">
                        {dashboardStats.projectBreakdown.map(proj => (
                          <tr key={proj.Project_Code} className="hover:bg-[var(--color-bg)]/40 transition duration-150">
                            <td className="py-3 font-medium text-[var(--color-primary)]">
                              {proj.Project_Name}
                              <span className="block text-[11px] text-[var(--color-muted)] font-normal font-sans">
                                PM: {proj.Project_Manager} · {proj.Cost_Center}
                              </span>
                            </td>
                            <td className="py-3 text-right font-mono text-[var(--color-primary)]">{proj.totalHours}h</td>
                            <td className="py-3 text-right font-mono font-medium text-[var(--color-accent)]">
                              ${proj.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 text-right min-w-[120px]">
                              <div className="flex items-center justify-end gap-2">
                                <span className="font-mono text-xs">{(proj.billableRatio * 100).toFixed(0)}%</span>
                                <div className="w-16 h-2 bg-[var(--color-accent)]/10 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-[var(--color-accent)] h-full rounded-full transition-all duration-500" 
                                    style={{ width: `${proj.billableRatio * 100}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {dashboardStats.projectBreakdown.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-4 text-center text-[var(--color-muted)]">No active projects mapped.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Employee Saturation & Utilization Monitor */}
                <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-eb-garamond text-lg font-bold text-[var(--color-primary)] tracking-tight uppercase">
                      Workforce Utilization & Saturation
                    </h2>
                    <span className="text-xs text-[var(--color-muted)] font-mono">Base target: 40h/week</span>
                  </div>
                  <div className="overflow-x-auto max-h-[380px] no-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--color-border)] text-[var(--color-primary)] font-semibold text-[11px] uppercase">
                          <th className="py-2.5">Employee</th>
                          <th className="py-2.5 text-right">Project Hours</th>
                          <th className="py-2.5 text-right">Meetings</th>
                          <th className="py-2.5 text-right">Direct Utilization</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)] text-[13px]">
                        {dashboardStats.employeeSaturation.map(emp => (
                          <tr key={emp.Employee_ID} className="hover:bg-[var(--color-bg)]/40 transition duration-150">
                            <td className="py-3 font-medium text-[var(--color-primary)]">
                              {emp.Employee_Name}
                              <span className="block text-[11px] text-[var(--color-muted)] font-normal font-sans">
                                {emp.Department} · {emp.Cost_Center}
                              </span>
                            </td>
                            <td className="py-3 text-right font-mono text-[var(--color-primary)]">{emp.projectHours}h</td>
                            <td className="py-3 text-right font-mono text-[var(--color-muted)]">{emp.meetingHours}h</td>
                            <td className="py-3 text-right min-w-[130px]">
                              <div className="flex items-center justify-end gap-2">
                                <span className="font-mono text-xs">{(emp.utilization * 100).toFixed(0)}%</span>
                                <div className="w-20 h-2 bg-[var(--color-accent)]/10 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-[var(--color-accent)] h-full rounded-full transition-all duration-500" 
                                    style={{ width: `${Math.min(emp.utilization * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* 3. Cost Center Allocated split block */}
              <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
                <h2 className="font-eb-garamond text-lg font-bold text-[var(--color-primary)] tracking-tight uppercase mb-4">
                  Financial Cost Center Allocation Matrix
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {dashboardStats.costCenterAllocation.map(cc => (
                    <div key={cc.costCenter} className="bg-[var(--color-bg)]/50 p-4 rounded-lg flex flex-col justify-between border-l-4 border-[var(--color-accent)] shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                      <div>
                        <span className="text-[11px] font-bold text-[var(--color-muted)] tracking-wider uppercase">{cc.costCenter}</span>
                        <div className="font-eb-garamond text-2xl font-bold text-[var(--color-primary)] mt-1">
                          ${cc.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-[var(--color-muted)]">Weight Factor</span>
                        <span className="font-mono text-xs font-semibold text-[var(--color-accent)]">{(cc.ratio * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* =======================================================
              2. MASTER TIMESHEET VIEW (Single Trust)
              ======================================================= */}
          {activeTab === 'MASTER' && (
            <div className="space-y-6">
              
              {/* Controls and Search bar */}
              <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5 flex flex-wrap gap-4 items-center justify-between">
                
                <div className="flex flex-wrap gap-3 items-center flex-1 min-w-[300px]">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--color-muted)]" />
                    <input
                      type="text"
                      placeholder="Search employee, project, task..."
                      value={timesheetSearch}
                      onChange={(e) => setTimesheetSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-[var(--color-border)] rounded-lg text-xs font-sans focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>

                  {/* Billing Type selector */}
                  <select
                    value={timesheetBillingFilter}
                    onChange={(e) => setTimesheetBillingFilter(e.target.value)}
                    className="border border-[var(--color-border)] text-xs px-3 py-2 rounded-lg bg-white focus:outline-none focus:border-[var(--color-accent)]"
                  >
                    <option value="ALL">All Billing Types</option>
                    <option value="Billable">Billable</option>
                    <option value="Non-Billable">Non-Billable</option>
                  </select>

                  {/* Cost Center selector */}
                  <select
                    value={timesheetCCFilter}
                    onChange={(e) => setTimesheetCCFilter(e.target.value)}
                    className="border border-[var(--color-border)] text-xs px-3 py-2 rounded-lg bg-white focus:outline-none focus:border-[var(--color-accent)]"
                  >
                    <option value="ALL">All Cost Centers</option>
                    {config.costCenters.map(cc => (
                      <option key={cc} value={cc}>{cc}</option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-[var(--color-muted)] flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--color-positive)]"></span>
                  <span>Formula outputs lock. To change values, modify masters.</span>
                </div>

              </div>

              {/* Master Timesheet Table */}
              <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--color-primary)]/5 text-[var(--color-primary)] border-b border-[var(--color-border)] text-[11px] uppercase tracking-wider font-semibold">
                        <th className="py-3 px-5">Log ID</th>
                        <th className="py-3 px-5">Employee Name</th>
                        <th className="py-3 px-5">Work Date</th>
                        <th className="py-3 px-5">Associated Project</th>
                        <th className="py-3 px-5">Task Details</th>
                        <th className="py-3 px-5 text-right">Hours</th>
                        <th className="py-3 px-5 text-right">Rate / Hr</th>
                        <th className="py-3 px-5 text-right">Total Cost</th>
                        <th className="py-3 px-5">Cost Center</th>
                        <th className="py-3 px-5 text-center">Billing Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-[13px]">
                      {filteredMasterTimesheet.map((row) => (
                        <tr key={row.Asana_Log_ID} className="hover:bg-[var(--color-bg)]/40 transition duration-150">
                          <td className="py-3 px-5 font-mono text-xs font-semibold text-[var(--color-muted)]">{row.Asana_Log_ID}</td>
                          <td className="py-3 px-5 font-medium text-[var(--color-primary)]">{row.Employee}</td>
                          <td className="py-3 px-5 text-[var(--color-muted)] font-mono">{row.Work_Date}</td>
                          <td className="py-3 px-5 text-[var(--color-primary)] font-medium">{row.Project}</td>
                          <td className="py-3 px-5 max-w-xs truncate text-[var(--color-muted)]" title={row.Task_Name}>{row.Task_Name}</td>
                          <td className="py-3 px-5 text-right font-mono font-medium">{row.Hours}h</td>
                          <td className="py-3 px-5 text-right font-mono text-[var(--color-muted)]">${row.Rate}</td>
                          <td className="py-3 px-5 text-right font-mono font-semibold text-[var(--color-accent)]">
                            ${row.Cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-5">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-[var(--color-primary)]/5 text-[var(--color-primary)]">
                              {row.Cost_Center}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              row.Billing_Type === 'Billable' 
                                ? 'bg-[var(--color-positive)]/10 text-[var(--color-positive)]' 
                                : 'bg-[var(--color-muted)]/15 text-[var(--color-muted)]'
                            }`}>
                              {row.Billing_Type}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredMasterTimesheet.length === 0 && (
                        <tr>
                          <td colSpan={10} className="py-8 text-center text-[var(--color-muted)]">
                            No matching timesheet entries found. Check validation engine or logs approval.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="bg-[var(--color-bg)]/40 px-5 py-3 border-t border-[var(--color-border)] flex justify-between items-center text-xs text-[var(--color-muted)]">
                  <span>Showing {filteredMasterTimesheet.length} of {masterTimesheet.length} approved records</span>
                  <span>Grand Total Cost allocated: <strong className="text-[var(--color-accent)]">${
                    filteredMasterTimesheet.reduce((sum, r) => sum + r.Cost, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })
                  }</strong></span>
                </div>
              </div>

            </div>
          )}

          {/* =======================================================
              3. VALIDATION ENGINE VIEW
              ======================================================= */}
          {activeTab === 'VALIDATION' && (
            <div className="space-y-6">
              
              {/* Summary info box */}
              <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6 flex items-center justify-between">
                <div>
                  <h2 className="font-eb-garamond text-lg font-bold text-[var(--color-primary)] tracking-tight uppercase mb-1">
                    System Audit and Integrity Report
                  </h2>
                  <p className="text-xs text-[var(--color-muted)]">
                    Calculates inconsistencies between Asana records and mapping schemas in real-time. Unresolved errors automatically withhold logs from Master output.
                  </p>
                </div>
                {validationIssues.filter(i => i.level === 'error').length > 0 ? (
                  <div className="bg-[var(--color-negative)]/10 text-[var(--color-negative)] px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold border border-[var(--color-negative)]/20">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Inconsistencies detected. Action required.</span>
                  </div>
                ) : (
                  <div className="bg-[var(--color-positive)]/10 text-[var(--color-positive)] px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold border border-[var(--color-positive)]/20">
                    <CheckCircle className="w-4 h-4" />
                    <span>Schema consistent and valid. Ready for book closures.</span>
                  </div>
                )}
              </div>

              {/* List of current issues with automatic quick-resolutions */}
              <div className="space-y-4">
                {validationIssues.map((issue, idx) => {
                  const isError = issue.level === 'error';
                  return (
                    <div 
                      key={idx} 
                      className={`bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5 border-l-4 transition-all duration-200 ${
                        isError ? 'border-[var(--color-negative)]' : 'border-[var(--color-accent)]'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 p-1.5 rounded-lg ${
                            isError ? 'bg-[var(--color-negative)]/10 text-[var(--color-negative)]' : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                          }`}>
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-[14px] font-bold text-[var(--color-primary)]">{issue.description}</h4>
                            <p className="text-xs text-[var(--color-muted)] mt-1">{issue.details}</p>
                          </div>
                        </div>

                        {/* Quick action buttons corresponding to errors */}
                        <div>
                          {issue.type === 'orphan_project' && (
                            <button
                              onClick={() => resolveOrphanProject(issue.itemKey)}
                              className="text-xs font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 px-4 py-1.5 rounded-lg transition"
                            >
                              Auto Register Project
                            </button>
                          )}
                          {issue.type === 'unmapped_employee' && (
                            <button
                              onClick={() => resolveUnmappedEmployee(issue.itemKey)}
                              className="text-xs font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 px-4 py-1.5 rounded-lg transition"
                            >
                              Map to Employee Master
                            </button>
                          )}
                          {issue.type === 'unapproved_hours' && (
                            <button
                              onClick={() => approveAllPendingLogs()}
                              className="text-xs font-medium text-white bg-[var(--color-positive)] hover:bg-[var(--color-positive)]/80 px-4 py-1.5 rounded-lg transition"
                            >
                              Approve All Pending
                            </button>
                          )}
                          {issue.type === 'overtime_limit' && (
                            <button
                              onClick={() => {
                                setActiveTab('RAW_ASANA');
                                alert(`Filter to Employee & Work Date to audit individual log entries for double recording.`);
                              }}
                              className="text-xs font-medium text-[var(--color-primary)] border border-[var(--color-border)] bg-white hover:bg-[var(--color-bg)] px-4 py-1.5 rounded-lg transition"
                            >
                              Audit Raw Logs
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {validationIssues.length === 0 && (
                  <div className="bg-white rounded-xl p-10 text-center text-[var(--color-muted)] border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <CheckCircle className="w-12 h-12 text-[var(--color-positive)] mx-auto mb-3" />
                    <h4 className="font-eb-garamond text-lg font-bold text-[var(--color-primary)] mb-1">Audit complete. Zero anomalies.</h4>
                    <p className="text-xs text-[var(--color-muted)]">All staged employee and project work log items align gracefully with lookups.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* =======================================================
              4. EMPLOYEE MASTER VIEW
              ======================================================= */}
          {activeTab === 'EMPLOYEE_MAP' && (
            <div className="space-y-6">
              
              {/* Add Employee Form */}
              <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5">
                <h3 className="font-eb-garamond text-md font-bold text-[var(--color-primary)] tracking-tight uppercase mb-4">
                  Add New Employee mapping
                </h3>
                <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Zack Miller"
                      value={newEmp.Employee_Name || ''}
                      onChange={(e) => setNewEmp({ ...newEmp, Employee_Name: e.target.value })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Department
                    </label>
                    <select
                      value={newEmp.Department || 'Engineering'}
                      onChange={(e) => setNewEmp({ ...newEmp, Department: e.target.value })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                    >
                      {config.departments.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Cost Center
                    </label>
                    <select
                      value={newEmp.Cost_Center || 'CC001'}
                      onChange={(e) => setNewEmp({ ...newEmp, Cost_Center: e.target.value })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                    >
                      {config.costCenters.map(cc => (
                        <option key={cc} value={cc}>{cc}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Hourly rate ($)
                    </label>
                    <input
                      type="number"
                      placeholder="Rate e.g. 150"
                      value={newEmp.Hourly_Rate || 120}
                      onChange={(e) => setNewEmp({ ...newEmp, Hourly_Rate: Number(e.target.value) })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-medium text-xs py-2 px-4 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Employee
                    </button>
                  </div>
                </form>
              </div>

              {/* Employee table with dynamic inline edit bindings */}
              <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--color-primary)]/5 text-[var(--color-primary)] border-b border-[var(--color-border)] text-[11px] uppercase tracking-wider font-semibold">
                        <th className="py-3 px-5">ID</th>
                        <th className="py-3 px-5">Employee Name</th>
                        <th className="py-3 px-5">Department</th>
                        <th className="py-3 px-5">Default Cost Center</th>
                        <th className="py-3 px-5 text-right">Hourly rate ($)</th>
                        <th className="py-3 px-5 text-center">Status</th>
                        <th className="py-3 px-5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-[13px]">
                      {employees.map((emp, index) => (
                        <tr key={emp.Employee_ID} className="hover:bg-[var(--color-bg)]/40 transition duration-150">
                          <td className="py-3 px-5 font-mono text-xs text-[var(--color-muted)] font-bold">{emp.Employee_ID}</td>
                          <td className="py-3 px-5 font-medium text-[var(--color-primary)]">{emp.Employee_Name}</td>
                          
                          {/* Department Selector cell */}
                          <td className="py-3 px-5">
                            <select
                              value={emp.Department}
                              onChange={(e) => handleUpdateEmployeeField(index, 'Department', e.target.value)}
                              className="bg-[var(--color-input-bg)] hover:scale-[1.02] border border-[var(--color-border)] rounded px-2 py-1 text-xs"
                            >
                              {config.departments.map(d => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          </td>

                          {/* Cost Center Selector cell */}
                          <td className="py-3 px-5">
                            <select
                              value={emp.Cost_Center}
                              onChange={(e) => handleUpdateEmployeeField(index, 'Cost_Center', e.target.value)}
                              className="bg-[var(--color-input-bg)] hover:scale-[1.02] border border-[var(--color-border)] rounded px-2 py-1 text-xs font-mono"
                            >
                              {config.costCenters.map(cc => (
                                <option key={cc} value={cc}>{cc}</option>
                              ))}
                            </select>
                          </td>

                          {/* Hourly Rate Input cell */}
                          <td className="py-3 px-5 text-right">
                            <input
                              type="number"
                              value={emp.Hourly_Rate}
                              onChange={(e) => handleUpdateEmployeeField(index, 'Hourly_Rate', e.target.value)}
                              className="w-20 bg-[var(--color-input-bg)] hover:scale-[1.02] text-right border border-[var(--color-border)] rounded px-2 py-1 text-xs font-mono font-medium text-[var(--color-accent)]"
                            />
                          </td>

                          {/* Active Checkbox toggle */}
                          <td className="py-3 px-5 text-center">
                            <button
                              onClick={() => handleUpdateEmployeeField(index, 'Is_Active', !emp.Is_Active)}
                              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition ${
                                emp.Is_Active 
                                  ? 'bg-[var(--color-positive)]/10 text-[var(--color-positive)]' 
                                  : 'bg-[var(--color-muted)]/10 text-[var(--color-muted)]'
                              }`}
                            >
                              {emp.Is_Active ? 'Active' : 'Inactive'}
                            </button>
                          </td>

                          {/* Delete row */}
                          <td className="py-3 px-5 text-center">
                            <button
                              onClick={() => handleDeleteEmployee(emp.Employee_ID)}
                              className="p-1.5 text-[var(--color-negative)] hover:bg-[var(--color-negative)]/10 rounded transition cursor-pointer"
                              title="Delete mapping entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* =======================================================
              5. PROJECT MASTER VIEW
              ======================================================= */}
          {activeTab === 'PROJECT_MAP' && (
            <div className="space-y-6">
              
              {/* Add Project Form */}
              <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5">
                <h3 className="font-eb-garamond text-md font-bold text-[var(--color-primary)] tracking-tight uppercase mb-4">
                  Register New Mapped Project
                </h3>
                <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Project Name (match Asana import name exactly)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NextGen ERP Portal"
                      value={newPrj.Project_Name || ''}
                      onChange={(e) => setNewPrj({ ...newPrj, Project_Name: e.target.value })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Billing Type
                    </label>
                    <select
                      value={newPrj.Billing_Type || 'Billable'}
                      onChange={(e) => setNewPrj({ ...newPrj, Billing_Type: e.target.value as 'Billable' | 'Non-Billable' })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                    >
                      <option value="Billable">Billable</option>
                      <option value="Non-Billable">Non-Billable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Cost Center
                    </label>
                    <select
                      value={newPrj.Cost_Center || 'CC001'}
                      onChange={(e) => setNewPrj({ ...newPrj, Cost_Center: e.target.value })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                    >
                      {config.costCenters.map(cc => (
                        <option key={cc} value={cc}>{cc}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-medium text-xs py-2 px-4 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Register Project
                    </button>
                  </div>
                </form>
              </div>

              {/* Projects table */}
              <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--color-primary)]/5 text-[var(--color-primary)] border-b border-[var(--color-border)] text-[11px] uppercase tracking-wider font-semibold">
                        <th className="py-3 px-5">Code</th>
                        <th className="py-3 px-5">Project Name</th>
                        <th className="py-3 px-5">Billing Type</th>
                        <th className="py-3 px-5">Allocated Cost Center</th>
                        <th className="py-3 px-5">Project Manager</th>
                        <th className="py-3 px-5 text-center">Status</th>
                        <th className="py-3 px-5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-[13px]">
                      {projects.map((p, index) => (
                        <tr key={p.Project_Code} className="hover:bg-[var(--color-bg)]/40 transition duration-150">
                          <td className="py-3 px-5 font-mono text-xs text-[var(--color-muted)] font-bold">{p.Project_Code}</td>
                          <td className="py-3 px-5 font-medium text-[var(--color-primary)]">{p.Project_Name}</td>
                          
                          {/* Billing Type Selector cell */}
                          <td className="py-3 px-5">
                            <select
                              value={p.Billing_Type}
                              onChange={(e) => handleUpdateProjectField(index, 'Billing_Type', e.target.value)}
                              className="bg-[var(--color-input-bg)] hover:scale-[1.02] border border-[var(--color-border)] rounded px-2 py-1 text-xs"
                            >
                              <option value="Billable">Billable</option>
                              <option value="Non-Billable">Non-Billable</option>
                            </select>
                          </td>

                          {/* Cost Center Selector cell */}
                          <td className="py-3 px-5">
                            <select
                              value={p.Cost_Center}
                              onChange={(e) => handleUpdateProjectField(index, 'Cost_Center', e.target.value)}
                              className="bg-[var(--color-input-bg)] hover:scale-[1.02] border border-[var(--color-border)] rounded px-2 py-1 text-xs font-mono"
                            >
                              {config.costCenters.map(cc => (
                                <option key={cc} value={cc}>{cc}</option>
                              ))}
                            </select>
                          </td>

                          {/* PM Selector cell */}
                          <td className="py-3 px-5">
                            <select
                              value={p.Project_Manager}
                              onChange={(e) => handleUpdateProjectField(index, 'Project_Manager', e.target.value)}
                              className="bg-[var(--color-input-bg)] hover:scale-[1.02] border border-[var(--color-border)] rounded px-2 py-1 text-xs"
                            >
                              {config.projectManagers.map(pm => (
                                <option key={pm} value={pm}>{pm}</option>
                              ))}
                            </select>
                          </td>

                          {/* Status Select cell */}
                          <td className="py-3 px-5 text-center">
                            <button
                              onClick={() => handleUpdateProjectField(index, 'Project_Status', p.Project_Status === 'Active' ? 'Closed' : 'Active')}
                              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition ${
                                p.Project_Status === 'Active' 
                                  ? 'bg-[var(--color-positive)]/10 text-[var(--color-positive)]' 
                                  : 'bg-[var(--color-muted)]/10 text-[var(--color-muted)]'
                              }`}
                            >
                              {p.Project_Status}
                            </button>
                          </td>

                          {/* Delete row */}
                          <td className="py-3 px-5 text-center">
                            <button
                              onClick={() => handleDeleteProject(p.Project_Code)}
                              className="p-1.5 text-[var(--color-negative)] hover:bg-[var(--color-negative)]/10 rounded transition cursor-pointer"
                              title="Delete project entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* =======================================================
              6. RAW ASANA STAGE VIEW
              ======================================================= */}
          {activeTab === 'RAW_ASANA' && (
            <div className="space-y-6">
              
              {/* Add Raw Log Form */}
              <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5">
                <h3 className="font-eb-garamond text-md font-bold text-[var(--color-primary)] tracking-tight uppercase mb-4">
                  Simulate / Log Raw Asana Work Entry
                </h3>
                <form onSubmit={handleAddAsanaLog} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Employee Name
                    </label>
                    <input
                      type="text"
                      placeholder="Alice Chen"
                      value={newAsana.Employee || ''}
                      onChange={(e) => setNewAsana({ ...newAsana, Employee: e.target.value })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Work Date
                    </label>
                    <input
                      type="date"
                      value={newAsana.Work_Date || ''}
                      onChange={(e) => setNewAsana({ ...newAsana, Work_Date: e.target.value })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Project
                    </label>
                    <input
                      type="text"
                      placeholder="NextGen ERP Portal"
                      value={newAsana.Project || ''}
                      onChange={(e) => setNewAsana({ ...newAsana, Project: e.target.value })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Task Description
                    </label>
                    <input
                      type="text"
                      placeholder="UI coding"
                      value={newAsana.Task_Name || ''}
                      onChange={(e) => setNewAsana({ ...newAsana, Task_Name: e.target.value })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Recorded Hours
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="8"
                      value={newAsana.Hours || ''}
                      onChange={(e) => setNewAsana({ ...newAsana, Hours: Number(e.target.value) })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-medium text-xs py-2 px-4 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Stage Log
                    </button>
                  </div>
                </form>
              </div>

              {/* Raw logs table */}
              <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--color-primary)]/5 text-[var(--color-primary)] border-b border-[var(--color-border)] text-[11px] uppercase tracking-wider font-semibold">
                        <th className="py-3 px-5">Asana ID</th>
                        <th className="py-3 px-5">Logged Employee</th>
                        <th className="py-3 px-5">Date</th>
                        <th className="py-3 px-5">staged Project Name</th>
                        <th className="py-3 px-5">Task description</th>
                        <th className="py-3 px-5 text-right">Hours</th>
                        <th className="py-3 px-5 text-center">Approved Status</th>
                        <th className="py-3 px-5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-[13px]">
                      {asanaLogs.map((log, index) => {
                        const isEmployeeValid = employees.some(e => e.Employee_Name.toLowerCase() === log.Employee.toLowerCase());
                        const isProjectValid = projects.some(p => p.Project_Name.toLowerCase() === log.Project.toLowerCase());
                        const hasAnomaly = !isEmployeeValid || !isProjectValid;

                        return (
                          <tr 
                            key={log.Asana_Log_ID} 
                            className={`hover:bg-[var(--color-bg)]/40 transition duration-150 ${
                              hasAnomaly ? 'bg-[var(--color-negative)]/5' : ''
                            }`}
                          >
                            <td className="py-3 px-5 font-mono text-xs text-[var(--color-muted)]">{log.Asana_Log_ID}</td>
                            
                            {/* Employee cell */}
                            <td className="py-3 px-5">
                              <input
                                type="text"
                                value={log.Employee}
                                onChange={(e) => handleUpdateAsanaLogField(index, 'Employee', e.target.value)}
                                className={`bg-[var(--color-input-bg)] hover:scale-[1.02] font-medium border border-[var(--color-border)] rounded px-2 py-1 text-xs ${
                                  !isEmployeeValid ? 'text-[var(--color-negative)] border-[var(--color-negative)]' : 'text-[var(--color-primary)]'
                                }`}
                              />
                            </td>

                            {/* Date cell */}
                            <td className="py-3 px-5">
                              <input
                                type="date"
                                value={log.Work_Date}
                                onChange={(e) => handleUpdateAsanaLogField(index, 'Work_Date', e.target.value)}
                                className="bg-[var(--color-input-bg)] hover:scale-[1.02] border border-[var(--color-border)] rounded px-2 py-1 text-xs font-mono"
                              />
                            </td>

                            {/* Project Name cell */}
                            <td className="py-3 px-5">
                              <input
                                type="text"
                                value={log.Project}
                                onChange={(e) => handleUpdateAsanaLogField(index, 'Project', e.target.value)}
                                className={`bg-[var(--color-input-bg)] hover:scale-[1.02] font-medium border border-[var(--color-border)] rounded px-2 py-1 text-xs w-full max-w-xs ${
                                  !isProjectValid ? 'text-[var(--color-negative)] border-[var(--color-negative)]' : 'text-[var(--color-primary)]'
                                }`}
                              />
                            </td>

                            {/* Task Name cell */}
                            <td className="py-3 px-5">
                              <input
                                type="text"
                                value={log.Task_Name}
                                onChange={(e) => handleUpdateAsanaLogField(index, 'Task_Name', e.target.value)}
                                className="bg-[var(--color-input-bg)] hover:scale-[1.02] border border-[var(--color-border)] rounded px-2 py-1 text-xs w-full max-w-xs text-[var(--color-muted)]"
                              />
                            </td>

                            {/* Hours cell */}
                            <td className="py-3 px-5 text-right">
                              <input
                                type="number"
                                step="0.5"
                                value={log.Hours}
                                onChange={(e) => handleUpdateAsanaLogField(index, 'Hours', e.target.value)}
                                className="w-16 bg-[var(--color-input-bg)] hover:scale-[1.02] text-right border border-[var(--color-border)] rounded px-2 py-1 text-xs font-mono"
                              />
                            </td>

                            {/* Approval select state */}
                            <td className="py-3 px-5 text-center">
                              <button
                                onClick={() => handleUpdateAsanaLogField(index, 'Approved_Status', log.Approved_Status === 'Approved' ? 'Unapproved' : 'Approved')}
                                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition ${
                                  log.Approved_Status === 'Approved' 
                                    ? 'bg-[var(--color-positive)]/10 text-[var(--color-positive)]' 
                                    : 'bg-[var(--color-negative)]/10 text-[var(--color-negative)]'
                                }`}
                              >
                                {log.Approved_Status}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-5 text-center">
                              <button
                                onClick={() => handleDeleteAsanaLog(log.Asana_Log_ID)}
                                className="p-1.5 text-[var(--color-negative)] hover:bg-[var(--color-negative)]/10 rounded transition cursor-pointer"
                                title="Delete staging log"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* =======================================================
              7. RAW MEETING LOGS VIEW
              ======================================================= */}
          {activeTab === 'RAW_MEETING' && (
            <div className="space-y-6">
              
              {/* Add Meeting Log Form */}
              <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5">
                <h3 className="font-eb-garamond text-md font-bold text-[var(--color-primary)] tracking-tight uppercase mb-4">
                  Log Implicit Calendar Meeting Entry
                </h3>
                <form onSubmit={handleAddMeetingLog} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Organizer
                    </label>
                    <input
                      type="text"
                      placeholder="Charlie Wang"
                      value={newMtg.Organizer || ''}
                      onChange={(e) => setNewMtg({ ...newMtg, Organizer: e.target.value })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Attendee
                    </label>
                    <input
                      type="text"
                      placeholder="Alice Chen"
                      value={newMtg.Attendee || ''}
                      onChange={(e) => setNewMtg({ ...newMtg, Attendee: e.target.value })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Meeting Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Design alignment"
                      value={newMtg.Subject || ''}
                      onChange={(e) => setNewMtg({ ...newMtg, Subject: e.target.value })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                      Duration (Hours)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="1.5"
                      value={newMtg.Duration_Hours || ''}
                      onChange={(e) => setNewMtg({ ...newMtg, Duration_Hours: Number(e.target.value) })}
                      className="w-full bg-[var(--color-input-bg)] p-2 border border-[var(--color-border)] rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-medium text-xs py-2 px-4 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Stage Meeting
                    </button>
                  </div>
                </form>
              </div>

              {/* Meetings table */}
              <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--color-primary)]/5 text-[var(--color-primary)] border-b border-[var(--color-border)] text-[11px] uppercase tracking-wider font-semibold">
                        <th className="py-3 px-5">Meeting ID</th>
                        <th className="py-3 px-5">Organizer</th>
                        <th className="py-3 px-5">Attendee</th>
                        <th className="py-3 px-5">Subject</th>
                        <th className="py-3 px-5">Date</th>
                        <th className="py-3 px-5 text-right">Duration (Hours)</th>
                        <th className="py-3 px-5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-[13px]">
                      {meetingLogs.map((log, index) => (
                        <tr key={log.Meeting_ID} className="hover:bg-[var(--color-bg)]/40 transition duration-150">
                          <td className="py-3 px-5 font-mono text-xs text-[var(--color-muted)]">{log.Meeting_ID}</td>
                          
                          {/* Organizer */}
                          <td className="py-3 px-5">
                            <input
                              type="text"
                              value={log.Organizer}
                              onChange={(e) => handleUpdateMeetingField(index, 'Organizer', e.target.value)}
                              className="bg-[var(--color-input-bg)] hover:scale-[1.02] border border-[var(--color-border)] rounded px-2 py-1 text-xs font-medium text-[var(--color-primary)]"
                            />
                          </td>

                          {/* Attendee */}
                          <td className="py-3 px-5">
                            <input
                              type="text"
                              value={log.Attendee}
                              onChange={(e) => handleUpdateMeetingField(index, 'Attendee', e.target.value)}
                              className="bg-[var(--color-input-bg)] hover:scale-[1.02] border border-[var(--color-border)] rounded px-2 py-1 text-xs font-medium text-[var(--color-primary)]"
                            />
                          </td>

                          {/* Subject */}
                          <td className="py-3 px-5">
                            <input
                              type="text"
                              value={log.Subject}
                              onChange={(e) => handleUpdateMeetingField(index, 'Subject', e.target.value)}
                              className="bg-[var(--color-input-bg)] hover:scale-[1.02] border border-[var(--color-border)] rounded px-2 py-1 text-xs text-[var(--color-muted)] w-full max-w-xs"
                            />
                          </td>

                          {/* Date */}
                          <td className="py-3 px-5">
                            <input
                              type="date"
                              value={log.Meeting_Date}
                              onChange={(e) => handleUpdateMeetingField(index, 'Meeting_Date', e.target.value)}
                              className="bg-[var(--color-input-bg)] hover:scale-[1.02] border border-[var(--color-border)] rounded px-2 py-1 text-xs font-mono"
                            />
                          </td>

                          {/* Duration */}
                          <td className="py-3 px-5 text-right">
                            <input
                              type="number"
                              step="0.5"
                              value={log.Duration_Hours}
                              onChange={(e) => handleUpdateMeetingField(index, 'Duration_Hours', e.target.value)}
                              className="w-16 bg-[var(--color-input-bg)] hover:scale-[1.02] text-right border border-[var(--color-border)] rounded px-2 py-1 text-xs font-mono"
                            />
                          </td>

                          {/* Delete row */}
                          <td className="py-3 px-5 text-center">
                            <button
                              onClick={() => handleDeleteMeetingLog(log.Meeting_ID)}
                              className="p-1.5 text-[var(--color-negative)] hover:bg-[var(--color-negative)]/10 rounded transition cursor-pointer"
                              title="Delete meeting log"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* =======================================================
              8. CENTRAL SYSTEM CONFIGURATION VIEW
              ======================================================= */}
          {activeTab === 'CONFIG' && (
            <div className="space-y-6">
              
              {/* Backups card */}
              <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
                <h3 className="font-eb-garamond text-lg font-bold text-[var(--color-primary)] tracking-tight uppercase mb-4">
                  Global State Actions & Backups
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 bg-[var(--color-bg)]/50 rounded-xl border border-[var(--color-border)] flex flex-col justify-between">
                    <div>
                      <h4 className="text-[14px] font-bold text-[var(--color-primary)] mb-1">Export Backup File</h4>
                      <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                        Downloads the entire state variables (workers, rate maps, staged logs, config variables) as a clean `.json` snapshot.
                      </p>
                    </div>
                    <button
                      onClick={handleExportBackup}
                      className="mt-4 flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-white font-medium text-xs py-2 px-4 rounded-lg transition cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Download JSON Backup
                    </button>
                  </div>

                  <div className="p-5 bg-[var(--color-bg)]/50 rounded-xl border border-[var(--color-border)] flex flex-col justify-between">
                    <div>
                      <h4 className="text-[14px] font-bold text-[var(--color-primary)] mb-1">Restore Backup File</h4>
                      <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                        Uploads a previously exported snapshot file to instantly override all current local state values and auto-save.
                      </p>
                    </div>
                    <div className="mt-4">
                      <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef}
                        onChange={handleImportBackup}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-medium text-xs py-2 px-4 rounded-lg transition cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        Upload & Restore Snapshot
                      </button>
                    </div>
                  </div>

                  <div className="p-5 bg-[var(--color-bg)]/50 rounded-xl border border-[var(--color-border)] flex flex-col justify-between">
                    <div>
                      <h4 className="text-[14px] font-bold text-[var(--color-negative)] mb-1">Reset Default Pilot Datasets</h4>
                      <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                        Erases all custom modifications in local storage and restores the standard 15-person team, mapping values, and raw logs.
                      </p>
                    </div>
                    <button
                      onClick={handleResetData}
                      className="mt-4 flex items-center justify-center gap-2 bg-[var(--color-negative)] hover:bg-[var(--color-negative)]/90 text-white font-medium text-xs py-2 px-4 rounded-lg transition cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Restore Defaults
                    </button>
                  </div>
                </div>
              </div>

              {/* Constants Mapping Controllers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Hourly Overtime Rules and Parameters */}
                <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
                  <h3 className="font-eb-garamond text-lg font-bold text-[var(--color-primary)] tracking-tight uppercase mb-4">
                    Audit Threshold Rules
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                        Daily safety limit hours
                      </label>
                      <input
                        type="number"
                        value={config.maxDailyHoursThreshold}
                        onChange={(e) => {
                          const updated = { ...config, maxDailyHoursThreshold: Number(e.target.value) };
                          handleStateChange('config', updated);
                        }}
                        className="w-full bg-[var(--color-input-bg)] p-2.5 border border-[var(--color-border)] rounded-lg text-xs font-mono font-medium"
                      />
                      <p className="text-[11px] text-[var(--color-muted)] mt-1">
                        Approved timesheets with daily totals exceeding this value trigger warnings in the security audit report.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Central Lists management (PMs, CCs, Depts) */}
                <div className="bg-white rounded-xl border border-border/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6">
                  <h3 className="font-eb-garamond text-lg font-bold text-[var(--color-primary)] tracking-tight uppercase mb-4">
                    Pilot Constant Parameters Lists
                  </h3>
                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="font-semibold text-[var(--color-primary)] block mb-1">Registered Departments:</span>
                      <p className="text-[var(--color-muted)] font-mono leading-relaxed bg-[var(--color-bg)] p-2.5 rounded-lg">
                        {config.departments.join(' · ')}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-[var(--color-primary)] block mb-1">Registered Cost Centers:</span>
                      <p className="text-[var(--color-muted)] font-mono leading-relaxed bg-[var(--color-bg)] p-2.5 rounded-lg">
                        {config.costCenters.join(' · ')}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-[var(--color-primary)] block mb-1">Project Managers (PMs):</span>
                      <p className="text-[var(--color-muted)] font-mono leading-relaxed bg-[var(--color-bg)] p-2.5 rounded-lg">
                        {config.projectManagers.join(' · ')}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </main>

      {/* ── FOOTER INFORMATION ── */}
      <footer className="bg-white border-t border-[var(--color-border)] py-5 px-10 text-center text-xs text-[var(--color-muted)] flex flex-wrap justify-between items-center max-w-[1400px] w-full mx-auto">
        <div className="flex items-center gap-2">
          <span>Excel Project Work Consolidation Controls Pilot Dashboard</span>
          <span className="bg-[var(--color-primary)]/5 text-[var(--color-primary)] px-2 py-0.5 rounded text-[10px] font-bold">15-Person Group</span>
        </div>
        <div>
          <span>Bespoke design for financial analysts. Built with React 19 & Tailwind CSS.</span>
        </div>
      </footer>

    </div>
  );
}
