export type Role = 'ADMIN' | 'DATA_MANAGER' | 'VALIDATOR' | 'VIEWER'
export type FormStatus = 'DRAFT' | 'SUBMITTED' | 'VALIDATED' | 'REJECTED'

export interface Country {
  id: string
  name: string
  code: string
  createdAt: string
  updatedAt: string
  _count?: {
    hospitals: number
  }
}

export interface Hospital {
  id: string
  name: string
  countryId: string
  latitude: number | null
  longitude: number | null
  createdAt: string
  updatedAt: string
  country?: Pick<Country, 'id' | 'name' | 'code'>
  _count?: {
    departments: number
  }
}

export interface Department {
  id: string
  name: string
  hospitalId: string
  createdAt: string
  updatedAt: string
  hospital?: Pick<Hospital, 'id' | 'name'> & {
    country?: Pick<Country, 'id' | 'name' | 'code'>
  }
  _count?: {
    icus: number
  }
}

export interface ICU {
  id: string
  name: string
  departmentId: string
  createdAt: string
  updatedAt: string
  department?: Pick<Department, 'id' | 'name'> & {
    hospital?: Pick<Hospital, 'id' | 'name'>
  }
  _count?: {
    patients: number
  }
}

export interface UserRecord {
  id: string
  name: string | null
  email: string
  role: Role
  createdAt: string
  updatedAt: string
}

export interface Patient {
  id: string
  mrn: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  icuId: string | null
  createdAt: string
  updatedAt: string
  icu?: Pick<ICU, 'id' | 'name'> & {
    department?: Pick<Department, 'id' | 'name'> & {
      hospital?: Pick<Hospital, 'id' | 'name'>
    }
  }
  forms?: DataForm[]
}

export interface FormValidation {
  id: string
  formId: string
  status: FormStatus
  notes: string | null
  createdAt: string
}

export interface DataForm {
  id: string
  title: string
  patientId: string
  status: FormStatus
  data: unknown
  createdAt: string
  updatedAt: string
  patient?: Pick<Patient, 'id' | 'mrn' | 'firstName' | 'lastName'>
  validations?: FormValidation[]
}

export interface DashboardStats {
  metrics: {
    countries: number
    hospitals: number
    departments: number
    icus: number
    users: number
    patients: number
    forms: number
    draftForms: number
    submittedForms: number
    validatedForms: number
    rejectedForms: number
  }
  formsByStatus: Array<{
    status: FormStatus
    count: number
  }>
  patientsByGender: Array<{
    gender: string
    count: number
  }>
  hospitalsByCountry: Array<{
    country: string
    code: string
    hospitals: number
  }>
  recentPatients: Patient[]
  recentForms: DataForm[]
}

export interface ApiError {
  error: string | Record<string, unknown> | Array<Record<string, unknown>>
}
