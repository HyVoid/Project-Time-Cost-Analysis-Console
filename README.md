# Build a Reliable Project Time Consolidation & Cost Analysis Control Center in Excel

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Tool](https://img.shields.io/badge/Tool-Decision%20Support-orange.svg)

**Transform approved project time entries into a single source of truth for labor cost allocation, utilization analysis, and project profitability decisions — with no installation, no signup, and free access via browser or Excel.**

> ## **No signup. No installation. Free.**
>
> 🌐 **Open in Browser:** HTML interactive version *(Demo link placeholder)*
>
> 📥 **Download Excel:** Excel workbook version *(Release/Gumroad link placeholder)*

---

## Screenshots

### Browser Version

<!-- screenshot: browser version -->

*Interactive management cockpit showing project labor utilization, cost center allocation, approval compliance, and operational exceptions.*

### Excel Version

<!-- screenshot: excel version -->

*Excel 365 implementation with dynamic array engine, validation layer, master timesheet warehouse, and executive dashboard.*

---

## What It Helps You Track

* Approved labor hours versus unapproved "shadow work" that never reaches financial reporting.
* Actual project labor cost by employee, project, department, and cost center.
* Employee utilization and hidden meeting overhead in the same operational view.
* Unmapped projects and missing master data before they contaminate financial analysis.
* Billable versus non-billable labor allocation across the organization.
* Whether existing operational processes are mature enough to justify PSA/ERP investment.

---

# Why I Built This

Many organizations do not fail because they lack project management systems. They fail because they cannot reliably answer a much simpler question:

> **"How much did this project actually cost us?"**

In practice, labor cost allocation often breaks down between three disconnected systems:

* Employees record time in project tools.
* Managers approve work inconsistently.
* Finance allocates costs using assumptions and spreadsheets created after the fact.

The result is a hidden analytical failure: organizations believe they are measuring project profitability when they are actually measuring reporting completeness.

I built this workbook after repeatedly observing the same operational pattern:

| Reality                            | Reported                               |
| ---------------------------------- | -------------------------------------- |
| Employee worked 42 hours           | Only 28 approved hours reached finance |
| 8 hours spent in client meetings   | Meeting costs disappeared              |
| Project lacked cost center mapping | Labor cost assigned manually           |
| Project appeared profitable        | Project actually lost money            |

### Before

A consulting project reported:

```
Revenue:          $48,000
Labor Cost:       $21,000
Reported Margin:  56%
```

### After Applying Structured Validation

```
Unapproved Hours:      +38h
Meeting Overhead:      +17h
Missing Allocation:    +$4,350
Actual Labor Cost:     $33,750
Actual Margin:         30%
```

The decision changed completely.

This workbook is therefore not a reporting dashboard. It is a **productized reasoning framework** for answering a recurring operational question:

> **Which labor costs should be trusted enough to support business decisions?**

---

## Common Project Time & Cost Allocation Problems This Solves

| Problem                        | Without This Tool                        | With This Tool                                 |
| ------------------------------ | ---------------------------------------- | ---------------------------------------------- |
| Unapproved timesheets          | Labor costs disappear from reporting     | Approval leakage becomes measurable            |
| Missing project mappings       | Manual financial allocation              | Automatic cost center assignment               |
| Employee over-reporting        | Duplicate labor entries remain hidden    | Daily utilization validation catches anomalies |
| Meeting overhead               | Internal meetings become invisible costs | Meeting time becomes measurable overhead       |
| Project profitability analysis | Profitability based on incomplete costs  | Profitability based on validated labor cost    |
| ERP investment decisions       | Decisions based on assumptions           | Decisions based on operational evidence        |

---

## Who This Is For

This tool is designed for:

* PMOs managing pilot project accounting processes.
* Professional services teams with 10–100 employees.
* Finance teams performing labor cost allocation.
* Operations managers evaluating PSA or ERP readiness.
* Organizations running Asana-based delivery workflows.
* Consultants building project profitability frameworks.

This tool is **not** designed for:

* Enterprise ERP replacement.
* Real-time payroll processing.
* Multi-country tax compliance.
* Highly customized PSA implementations.

**No spreadsheet expertise is required. Open the browser version and begin tracking immediately. Excel users can extend the underlying analytical framework as needed.**

---

## About

I build lightweight operational decision-support tools for situations where there are too many moving parts to hold reliably in memory.

The central question behind every tool is:

> **"What information needs to exist in one place for the next decision to be made confidently?"**

This Project Time Consolidation & Cost Analysis Control Center is one example of that approach: a reusable analytical framework that transforms fragmented operational data into decision-grade cost information.

---

## Technical Details

<details>
<summary>For technical reviewers, Excel practitioners, and collaborators</summary>

---

### Workbook Architecture

```text
Asana / Teams / Outlook
            │
            ▼
RAW_ASANA
RAW_MEETING
            │
            ▼
EMPLOYEE_MAP
PROJECT_MAP
CONFIG
            │
            ▼
VALIDATION
            │
            ▼
MASTER_TIMESHEET
            │
            ▼
DASHBOARD
```

| Layer         | Worksheet        | Purpose                         |
| ------------- | ---------------- | ------------------------------- |
| Data Staging  | RAW_ASANA        | Approved project time ingestion |
| Data Staging  | RAW_MEETING      | Meeting time capture            |
| Master Data   | EMPLOYEE_MAP     | Employee rates and dimensions   |
| Master Data   | PROJECT_MAP      | Project and cost center mapping |
| Configuration | CONFIG           | Global settings                 |
| Validation    | VALIDATION       | Exception detection             |
| Fact Table    | MASTER_TIMESHEET | Single source of truth          |
| Analytics     | DASHBOARD        | Decision support layer          |

---

### Three Traps That Catch Even Experienced Project Managers

---

#### Trap 1 — Assuming Approved Hours Equal Actual Labor Cost

**Decision made:**

Project profitability approved.

**Faulty assumption:**

Only approved labor was counted.

| Metric | Reported | Actual  |
| ------ | -------- | ------- |
| Hours  | 320      | 398     |
| Cost   | $24,000  | $31,200 |
| Margin | 41%      | 22%     |

**Why the reasoning fails:**

Approval workflows measure administrative completion, not labor consumption.

**Corrected approach:**

Measure:

```
Actual Labor =
Approved Hours
+ Missing Approvals
+ Meeting Overhead
```

<details>
<summary>Formula logic</summary>

```excel
=FILTER(
RAW_ASANA[Hours],
RAW_ASANA[Approved_Status]="Approved"
)
```

```excel
=SUMIFS(
RAW_MEETING[Duration_Hours],
RAW_MEETING[Attendee],
Employee
)
```

</details>

---

#### Trap 2 — Assuming Projects Already Have Financial Ownership

**Decision made:**

Allocate costs by project name.

**Faulty assumption:**

Project names represent accounting structures.

| Project          | Assigned CC | Actual CC |
| ---------------- | ----------- | --------- |
| Client Migration | CC104       | Missing   |
| Internal Upgrade | CC211       | CC305     |

**Why the reasoning fails:**

Operational project structures and financial structures evolve independently.

**Corrected approach:**

Require explicit mapping.

<details>
<summary>Formula logic</summary>

```excel
=XLOOKUP(
Project,
PROJECT_MAP[Project_Name],
PROJECT_MAP[Cost_Center],
"CC_UNKNOWN"
)
```

</details>

---

#### Trap 3 — Assuming Human Timesheets Are Internally Consistent

**Decision made:**

Accept submitted labor records.

**Faulty assumption:**

Employees do not accidentally over-report.

| Employee | Date       | Reported |
| -------- | ---------- | -------- |
| EMP004   | 2026-06-14 | 18.5h    |
| EMP011   | 2026-06-18 | 16.8h    |

**Why the reasoning fails:**

Multiple systems create duplicate reporting opportunities.

**Corrected approach:**

Validate daily aggregation before financial posting.

<details>
<summary>Formula logic</summary>

```excel
=FILTER(
UNIQUE(CHOOSECOLS(RAW_ASANA,2,3)),
MAP(
Employee,
Date,
LAMBDA(
emp,
dt,
SUMIFS(
RAW_ASANA[Hours],
RAW_ASANA[Employee],
emp,
RAW_ASANA[Work_Date],
dt
)
)
)>15
)
```

</details>

---

### Example Scenario

A 15-person consulting team operates a four-week pilot program.

#### Raw Inputs

| Metric           | Value   |
| ---------------- | ------- |
| Employees        | 15      |
| Approved Hours   | 518h    |
| Unapproved Hours | 72h     |
| Meeting Hours    | 86h     |
| Hourly Cost      | $85     |
| Revenue          | $72,000 |

#### Intermediate Calculations

```text
Approved Labor:
518 × $85 = $44,030

Unapproved Labor:
72 × $85 = $6,120

Meeting Overhead:
86 × $85 = $7,310

Actual Labor Cost:
$57,460
```

#### Initial Management Conclusion

```text
Revenue: $72,000
Reported Cost: $44,030
Margin: 39%
```

#### Corrected Conclusion

```text
Revenue: $72,000
Actual Cost: $57,460
Margin: 20%
```

#### Decision Implication

The pilot remains profitable, but utilization leakage and approval failures eliminate nearly half of expected margin. Before expanding into a PSA implementation, approval workflows and cost allocation governance must be corrected.

---

### Formula Reference

<details>
<summary>Validation Engine</summary>

```excel
=UNIQUE(
FILTER(
RAW_ASANA[Project],
ISERROR(
XLOOKUP(...)
)
)
)
```

```excel
=FILTER(
EmployeeDatePairs,
DailyHours>15
)
```

</details>

<details>
<summary>Master Timesheet Engine</summary>

```excel
=FILTER(
HSTACK(...),
ApprovedFlag
)
```

```excel
=MAP(
Employee,
LAMBDA(
emp,
XLOOKUP(...)
)
)
```

</details>

<details>
<summary>Dashboard Engine</summary>

```excel
=UNIQUE(...)
=MAP(...)
=SUMIFS(...)
=LET(...)
=IFS(...)
```

</details>

---

### Validation Rules

| Field           | Rule                | Error Behavior       |
| --------------- | ------------------- | -------------------- |
| Employee_ID     | Unique              | Reject               |
| Employee_Name   | Must exist          | Flag                 |
| Project_Name    | Must exist          | Flag                 |
| Work_Date       | Cannot exceed today | Reject               |
| Hours           | 0 < Hours ≤ 16      | Flag                 |
| Approved_Status | Approved only       | Exclude              |
| Cost_Center     | Mandatory           | Flag                 |
| Billing_Type    | Enumerated          | Default Non-Billable |
| Employee Active | TRUE only           | Exclude              |
| Daily Hours     | ≤15 recommended     | Alert                |

</details>

---

## Other Tools in This Series

* **Inventory Planning & Replenishment Control Center** — Safety stock, reorder point, and working capital decisions.
* **Multifamily Acquisition Model** — Real estate acquisition underwriting and scenario analysis.
* **Google Ads Marketing Truth Audit System** — Marketing attribution and budget validation.
* **Dual-Track Personal & Business Budget System** — Integrated cash flow and allocation planning.
* **Cross-Entity Logistics Operations Console** — Shipment, customs, and operational exception management.

More tools available via GitHub profile and release repository.

---

## License

This project is licensed under the **Apache License 2.0**.

See the LICENSE file for details.
