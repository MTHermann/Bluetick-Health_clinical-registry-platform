# Bluetick Health — Clinical Registry Platform Flowchart Framework

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         BLUETICK HEALTH SYSTEM                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │   Frontend   │    │   Backend    │    │   Database   │              │
│  │  (Next.js)   │◄──►│   (Node.js)  │◄──►│ (PostgreSQL) │              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
│         │                    │                    │                     │
│    React UI Components   API Routes          Data Models               │
│    State Management      Business Logic       Schemas                   │
│    Form Handling         Validation           Indexes                   │
│                          Auth/Permissions                               │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. User Authentication & Authorization Flow

```
┌─────────────────┐
│   User Login    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Validate Credentials       │
│  (Username/Email + Password)│
└────────┬────────────────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌────────┐  ┌──────────┐
│ Valid  │  │ Invalid  │
└───┬────┘  └────┬─────┘
    │            │
    ▼            ▼
┌──────────────┐ ┌─────────────────────┐
│ Generate JWT │ │ Show Error Message  │
│ Set Session  │ │ & Return to Login   │
└───┬──────────┘ └─────────────────────┘
    │
    ▼
┌──────────────────────┐
│ Fetch User Permissions│
│ & Role Information   │
└───┬──────────────────┘
    │
    ▼
┌──────────────────────────┐
│ Load User Dashboard      │
│ with role-based access   │
└──────────────────────────┘
```

---

## 3. Organization Setup Flow (Administrator)

```
┌────────────────────────────────┐
│  Admin → Organisation Section  │
└────────────┬───────────────────┘
             │
             ▼
        ┌─────────────────┐
        │  Select Tab:    │
        │  • Countries    │
        │  • Hospitals    │
        │  • Departments  │
        │  • ICUs         │
        └────────┬────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   ┌─────────┐      ┌──────────┐
   │ Add New │      │ View All │
   └────┬────┘      └────┬─────┘
        │                │
        ▼                ▼
   ┌─────────────────────────┐
   │  Show Modal/Form        │
   │  • Name (required)      │
   │  • Code (if Country)    │
   │  • Parent ID (if nested)│
   └────────┬────────────────┘
            │
            ▼
   ┌──────────────────┐
   │ Validate Inputs  │
   └────┬─────────────┘
        │
   ┌────┴─────┐
   │           │
   ▼           ▼
┌────────┐  ┌──────────┐
│ Valid  │  │ Invalid  │
└───┬────┘  └────┬─────┘
    │            │
    ▼            ▼
┌────────────────┐ ┌──────────────────┐
│ POST to Backend│ │ Show Error Alerts│
│ Save to DB    │ │ Retain Form Data │
└────┬───────────┘ └──────────────────┘
     │
     ▼
┌────────────────────────┐
│ Success Response       │
│ Refresh List View      │
│ Close Modal/Form       │
└────────────────────────┘
```

---

## 4. Patient Data Collection Flow

```
┌──────────────────────────────┐
│  User → Data Collection Tab  │
└──────────────┬───────────────┘
               │
               ▼
        ┌──────────────────┐
        │ List of Forms:   │
        │ • Patient Info   │
        │ • Medical History│
        │ • Current Status │
        │ • Treatment Plan │
        └────────┬─────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   ┌─────────┐      ┌──────────────┐
   │ New Form│      │ Continue Draft│
   └────┬────┘      └────┬─────────┘
        │                │
        ▼                ▼
   ┌──────────────────────────────┐
   │ Display Form Fields          │
   │ • Text inputs                │
   │ • Dropdowns                  │
   │ • Date pickers               │
   │ • Checkboxes                 │
   │ • File uploads               │
   └────────┬─────────────────────┘
            │
            ▼
   ┌──────────────────────────┐
   │ User Fills Form Data     │
   │ (Client-side Auto-save)  │
   └────────┬─────────────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │ User Submits Form            │
   └────────┬─────────────────────┘
            │
            ▼
   ┌──────────────────────────┐
   │ Client-side Validation   │
   │ • Required fields        │
   │ • Data type checks       │
   │ • Format validation      │
   └────┬───────────────────┘
        │
   ┌────┴─────┐
   │           │
   ▼           ▼
┌────────┐  ┌──────────┐
│ Valid  │  │ Invalid  │
└───┬────┘  └────┬─────┘
    │            │
    ▼            ▼
┌──────────────────┐ ┌──────────────────────┐
│ Send to Backend  │ │ Highlight Error Fields│
│ POST /forms      │ │ Show Help Text       │
└───┬──────────────┘ └──────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│ Server-side Validation       │
│ • Business rules             │
│ • Database constraints       │
│ • Cross-field validation     │
└────┬─────────────────────────┘
     │
 ┌───┴────┐
 │         │
 ▼         ▼
┌────┐  ┌──────────┐
│OK  │  │ Rejected │
└─┬──┘  └────┬─────┘
  │          │
  ▼          ▼
┌──────────────────────┐ ┌────────────────────────┐
│ Save to Database     │ │ Return Error Details   │
│ Generate Unique ID   │ │ Store for Correction   │
│ Log Submission       │ │ Allow User to Revise   │
└───┬──────────────────┘ └────────────────────────┘
    │
    ▼
┌────────────────────────────┐
│ Return Success Response    │
│ Show Confirmation Message  │
│ Redirect to Next Form or   │
│ Dashboard                  │
└────────────────────────────┘
```

---

## 5. Data Validation Flow

```
┌───────────────────────────┐
│  User → Validation Tab    │
└──────────────┬────────────┘
               │
               ▼
        ┌──────────────────────┐
        │ List All Submitted   │
        │ Forms (Pending Valid)│
        └────────┬─────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │ Select Form to Validate│
        └────────┬───────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │ Display Form Details       │
        │ Show Data Entry + Metadata │
        │ Show Validation Rules      │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │ Run Validation Rules:      │
        │ • Data completeness        │
        │ • Format correctness       │
        │ • Value range checks       │
        │ • Cross-field consistency  │
        │ • Business logic           │
        └────────┬───────────────────┘
                 │
        ┌────────┴─────────┐
        │                  │
        ▼                  ▼
   ┌─────────┐       ┌──────────┐
   │ All Pass│       │ Has Issues│
   └────┬────┘       └────┬─────┘
        │                 │
        ▼                 ▼
   ┌──────────────┐   ┌──────────────────────┐
   │ Mark As     │   │ List Failed Rules     │
   │ "Validated" │   │ Highlight Error Fields│
   │ Update DB   │   │ Suggest Corrections   │
   └────┬────────┘   └────┬─────────────────┘
        │                 │
        ▼                 ▼
   ┌──────────────────┐ ┌──────────────────────┐
   │ Ready for        │ │ Return to Data Entry │
   │ Analytics        │ │ Allow Corrections    │
   └──────────────────┘ └──────────────────────┘
```

---

## 6. Analytics & Reporting Flow

```
┌─────────────────────────┐
│  User → Analytics Tab   │
└────────────┬────────────┘
             │
             ▼
      ┌──────────────────┐
      │ Select Filters:  │
      │ • Date Range     │
      │ • Country        │
      │ • Hospital       │
      │ • Department     │
      │ • ICU            │
      │ • Patient Type   │
      └────────┬─────────┘
               │
               ▼
      ┌──────────────────────┐
      │ Select Metrics:      │
      │ • Total Patients     │
      │ • Admission Rates    │
      │ • Treatment Outcomes │
      │ • Mortality Rates    │
      │ • Custom Calculations│
      └────────┬─────────────┘
               │
               ▼
      ┌───────────────────────┐
      │ Query Database:       │
      │ Aggregate Data        │
      │ Calculate Statistics  │
      │ Generate Charts       │
      └────────┬──────────────┘
               │
               ▼
      ┌──────────────────────┐
      │ Display Results:     │
      │ • KPI Cards          │
      │ • Charts/Graphs      │
      │ • Tables             │
      │ • Trends             │
      └────────┬─────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
   ┌────────┐    ┌────────────┐
   │ Drill  │    │ Export Data│
   │ Down   │    │ (PDF/CSV)  │
   └────┬───┘    └────┬───────┘
        │             │
        ▼             ▼
   ┌──────────────┐ ┌────────────────┐
   │ Show Details │ │ Generate Report│
   │ by Site      │ │ Send via Email │
   └──────────────┘ └────────────────┘
```

---

## 7. User Permissions & Access Control Flow

```
┌────────────────────────┐
│ Admin → Users Tab      │
└────────┬───────────────┘
         │
         ▼
    ┌─────────────────┐
    │ Actions:        │
    │ • Add User      │
    │ • Edit User     │
    │ • Assign Roles  │
    │ • View Logs     │
    └────────┬────────┘
             │
    ┌────────┴─────────────┐
    │                      │
    ▼                      ▼
┌──────────────┐   ┌──────────────────────┐
│ Add New User │   │ Assign Permissions   │
└────┬─────────┘   └────┬─────────────────┘
     │                  │
     ▼                  ▼
┌─────────────────────┐ ┌──────────────────────┐
│ Fill User Details:  │ │ Select Role:         │
│ • Email             │ │ • Admin              │
│ • Name              │ │ • Clinician          │
│ • Department        │ │ • Data Validator     │
│ • Phone             │ │ • Analyst            │
└────┬────────────────┘ │ • Viewer             │
     │                  └────┬─────────────────┘
     │                       │
     ▼                       ▼
┌─────────────────────────────────────┐
│ Define Permissions by Role:         │
│ • Can create forms                  │
│ • Can validate data                 │
│ • Can access analytics              │
│ • Can manage users                  │
│ • Can edit organization             │
└────┬────────────────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Set Scope:               │
│ • Global (all sites)     │
│ • Country level          │
│ • Hospital level         │
│ • Department level       │
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Save to Database         │
│ Send Invite Email        │
│ User Accepts & Sets Pass │
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ User Can Now Access      │
│ Permitted Areas          │
└──────────────────────────┘
```

---

## 8. Dashboard Overview Flow

```
┌────────────────────────────┐
│ User Opens Dashboard       │
└────────────┬───────────────┘
             │
             ▼
    ┌────────────────────────┐
    │ Load Dashboard Page    │
    └────────┬───────────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │ Query Registry Metrics:         │
    │ • Count Countries              │
    │ • Count Hospitals              │
    │ • Count Departments            │
    │ • Count ICU Units              │
    │ • Pending Forms                │
    │ • Validated Forms              │
    └────────┬───────────────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ Check User Role:           │
    │ Show role-specific options │
    └────────┬───────────────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │ Display Dashboard Cards:       │
    │ • Summary Metrics              │
    │ • Quick Actions                │
    │ • Recent Activity              │
    │ • Alerts & Notifications       │
    └────────┬───────────────────────┘
             │
    ┌────────┴──────────┐
    │                   │
    ▼                   ▼
┌──────────┐      ┌──────────────┐
│ No Data  │      │ Has Data     │
└────┬─────┘      └────┬─────────┘
     │                 │
     ▼                 ▼
┌──────────────────┐ ┌───────────────────┐
│ Show Setup Guide │ │ Display Metrics   │
│ Prompt to add    │ │ & Recent Activity │
│ First Country   │ │ & Action Prompts   │
└──────────────────┘ └───────────────────┘
```

---

## 9. Form Submission to Validation Pipeline

```
┌──────────────────────────────────────────────────┐
│           COMPLETE DATA SUBMISSION FLOW           │
└──────────────┬───────────────────────────────────┘
               │
┌──────────────┴─────────────────────────┐
│ STEP 1: Form Entry & Collection        │
│ (Data Collection Tab)                  │
├─────────────────────────────────────────┤
│ • User fills form with patient data    │
│ • Client-side validation runs          │
│ • Auto-save drafts to storage          │
│ • User submits form                    │
└──────────────┬─────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ STEP 2: API Submission & Backend Validation │
├──────────────────────────────────────────────┤
│ • POST to /api/forms/submit               │
│ • Server validates data                    │
│ • Database constraints checked             │
│ • Store in DB with status: "PENDING"      │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ STEP 3: Data Validation (Manual/Automated) │
├──────────────────────────────────────────────┤
│ • Rules engine processes form               │
│ • Flag any inconsistencies                 │
│ • Cross-reference with existing data       │
│ • Update status: "NEEDS_REVIEW" or "OK"   │
└──────────────┬───────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
   ┌──────┐        ┌─────────────┐
   │ Pass │        │ Issues Found│
   └───┬──┘        └──────┬──────┘
       │                  │
       ▼                  ▼
   ┌──���──────────┐   ┌──────────────────┐
   │Status:      │   │Alert Validator   │
   │VALIDATED    │   │Status: REVIEW_REQ│
   │Ready for    │   │Notify via email  │
   │Analytics    │   │Link to dashboard │
   └─────────────┘   └────┬─────────────┘
                           │
                           ▼
                    ┌──────────────────────┐
                    │ Validator Reviews    │
                    │ Corrections Needed   │
                    │ Requests Updates     │
                    └────┬─────────────────┘
                         │
                         ▼
                    ┌──────────────────────┐
                    │ User Re-submits with │
                    │ Corrections          │
                    │ Loop back to Validation
                    └──────────────────────┘
```

---

## 10. Error Handling & Recovery Flow

```
┌─────────────────────────────┐
│ Error Occurs During:        │
│ • Form Submission           │
│ • Data Validation           │
│ • Database Save             │
│ • API Call                  │
└────────────┬────────────────┘
             │
             ▼
    ┌────────────────────────┐
    │ Categorize Error:      │
    │ • Client Error (4xx)   │
    │ • Server Error (5xx)   │
    │ • Network Error        │
    │ • Validation Error     │
    └────────┬───────────────┘
             │
    ┌────────┴────────────────────────────┐
    │                                     │
    ▼                                     ▼
┌────────────────────┐        ┌──────────────────────┐
│ Recoverable Error  │        │ Critical Error       │
│ (Validation,Timeout)│       │ (DB Down, 500)       │
└────┬───────────────┘        └────┬─────────────────┘
     │                             │
     ▼                             ▼
┌───────────────────────┐   ┌────────────────────────┐
│ Show User Message:    │   │ Log Error Details      │
│ • What went wrong     │   │ • Stack trace          │
│ • How to fix it       │   │ • Context info         │
│ • Retry option        │   │ • User ID              │
└────┬──────────────────┘   └────┬───────────────────┘
     │                           │
     ▼                           ▼
┌──────────────────────┐   ┌────────────────────────┐
│ User Corrects Data   │   │ Send Alert to Support  │
│ & Resubmits          │   │ Show Maintenance Page  │
│ Or Contacts Support  │   │ Retry Automatically    │
└──────────────────────┘   └────────────────────────┘
```

---

## 11. Database Transaction Flow

```
┌─────────────────────────────────────┐
│ Client Request to Backend API       │
└────────────────┬────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ Start Transaction  │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │ Acquire Database Lock      │
        │ (Prevent race conditions)  │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │ Execute Query:             │
        │ • INSERT form record       │
        │ • INSERT form responses    │
        │ • UPDATE org hierarchy     │
        │ • Log transaction          │
        └────────┬───────────────────┘
                 │
        ┌────────┴──────────┐
        │                   │
        ▼                   ▼
   ┌─────────┐         ┌──────────┐
   │ Success │         │ Error    │
   └────┬────┘         └────┬─────┘
        │                   │
        ▼                   ▼
   ┌──────────────┐   ┌──────────────┐
   │ COMMIT       │   │ ROLLBACK     │
   │ Release Lock │   │ Release Lock │
   │ Return 200   │   │ Return Error │
   └──────────────┘   └──────────────┘
```

---

## Data Models & Relationships

```
Countries
├── id (UUID)
├── name (string)
├── code (string, ISO 3166-1)
├── created_at (timestamp)
├── updated_at (timestamp)
└── Hospitals (1:Many)

Hospitals
├── id (UUID)
├── name (string)
├── country_id (FK → Countries)
├── address (string)
├── created_at (timestamp)
├── updated_at (timestamp)
└── Departments (1:Many)

Departments
├── id (UUID)
├── name (string)
├── hospital_id (FK → Hospitals)
├── budget (decimal)
├── created_at (timestamp)
├── updated_at (timestamp)
└── ICUs (1:Many)

ICUs
├── id (UUID)
├── name (string)
├── department_id (FK → Departments)
├── bed_count (integer)
├── created_at (timestamp)
└── updated_at (timestamp)

Users
├── id (UUID)
├── email (string, unique)
├── password_hash (string)
├── name (string)
├── role (enum: ADMIN, CLINICIAN, VALIDATOR, ANALYST, VIEWER)
├── organization_scope (UUID: country/hospital/department/ICU)
├── created_at (timestamp)
└── Forms (1:Many)

Forms
├── id (UUID)
├── user_id (FK → Users)
├── icu_id (FK → ICUs)
├── patient_id (FK → Patients)
├─��� status (enum: DRAFT, SUBMITTED, PENDING_REVIEW, VALIDATED, REJECTED)
├── created_at (timestamp)
├── updated_at (timestamp)
├── submitted_at (timestamp, nullable)
└── FormResponses (1:Many)

FormResponses
├── id (UUID)
├── form_id (FK → Forms)
├── field_id (FK → FormFields)
├── value (text)
├── created_at (timestamp)
└── updated_at (timestamp)

Patients
├── id (UUID)
├── hospital_id (FK → Hospitals)
├── mrn (string, unique per hospital)
├── name (string)
├── dob (date)
├── gender (enum: M, F, OTHER)
├── created_at (timestamp)
└── Forms (1:Many)

ValidationRules
├── id (UUID)
├── form_id (FK → Forms)
├── rule_name (string)
├── rule_logic (JSON)
├── status (enum: PASS, FAIL)
├── message (text)
└── checked_at (timestamp)
```

---

## API Endpoints Overview

### Authentication
- `POST /api/auth/login` — User login
- `POST /api/auth/logout` — User logout
- `POST /api/auth/refresh` — Refresh JWT token

### Organization Management
- `GET /api/countries` — List countries
- `POST /api/countries` — Create country
- `PUT /api/countries/:id` — Update country
- `DELETE /api/countries/:id` — Delete country

- `GET /api/hospitals` — List hospitals
- `POST /api/hospitals` — Create hospital
- `PUT /api/hospitals/:id` — Update hospital

- `GET /api/departments` — List departments
- `POST /api/departments` — Create department

- `GET /api/icus` — List ICUs
- `POST /api/icus` — Create ICU

### Patient & Form Management
- `GET /api/patients` — List patients
- `POST /api/patients` — Create patient
- `GET /api/forms` — List forms (filtered by status)
- `POST /api/forms` — Create/submit form
- `GET /api/forms/:id` — Get form details
- `PUT /api/forms/:id` — Update form
- `POST /api/forms/:id/validate` — Run validation rules

### Analytics
- `GET /api/analytics/dashboard` — Dashboard metrics
- `GET /api/analytics/reports` — Generate reports
- `GET /api/analytics/export` — Export data (CSV/PDF)

### User Management
- `GET /api/users` — List users (admin only)
- `POST /api/users` — Create user
- `PUT /api/users/:id` — Update user permissions
- `DELETE /api/users/:id` — Remove user

---

## State Management Architecture (Frontend)

```
React Context/Redux Structure:

├── AuthContext
│   ├── user (User object)
│   ├── token (JWT)
│   ├── permissions (string[])
│   ├── login() 
│   └── logout()
│
├── OrganizationContext
│   ├── countries (Country[])
│   ├── hospitals (Hospital[])
│   ├── departments (Department[])
│   ├── icus (ICU[])
│   ├── addCountry()
│   ├── updateHospital()
│   └── deleteICU()
│
├── FormContext
│   ├── forms (Form[])
│   ├── currentForm (Form)
│   ├── formDraft (partial Form)
│   ├── submitForm()
│   ├── saveDraft()
│   └── validateForm()
│
└── UIContext
    ├── loading (boolean)
    ├── error (Error | null)
    ├── notifications (Notification[])
    ├── showModal (boolean)
    ├── setLoading()
    ├── setError()
    └── addNotification()
```

---

## Environment & Deployment Flow

```
Development → Staging → Production

DEV:
├── http://localhost:3000 (Frontend)
├── http://localhost:5000 (API)
└── PostgreSQL (local)

STAGING:
├── https://staging.bluetick-health.com
├── API: https://api-staging.bluetick-health.com
└── PostgreSQL (staging DB)

PRODUCTION:
├── https://app.bluetick-health.com
├── API: https://api.bluetick-health.com
└── PostgreSQL (production DB)
```

---

## Next Implementation Steps

1. **Backend Setup** — Set up Node.js/Express API with PostgreSQL connection
2. **Database Schema** — Create migrations for all data models
3. **Authentication** — Implement JWT-based auth system
4. **API Endpoints** — Develop RESTful endpoints for all operations
5. **Validation Engine** — Build rule-based data validation system
6. **Frontend Integration** — Connect React components to API
7. **Error Handling** — Implement comprehensive error management
8. **Testing** — Unit, integration, and E2E tests
9. **Deployment** — CI/CD pipeline configuration
10. **Monitoring** — Logging, metrics, and alerts setup

