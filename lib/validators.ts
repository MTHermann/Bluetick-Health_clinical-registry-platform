import { FormStatus, Role } from '@prisma/client'
import { z } from 'zod'

const optionalNumber = z
  .union([z.number(), z.string().trim().length(0), z.string()])
  .optional()
  .transform((value) => {
    if (value === undefined || value === '') {
      return undefined
    }

    const parsed = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(parsed) ? parsed : NaN
  })
  .refine((value) => value === undefined || !Number.isNaN(value), {
    message: 'Must be a valid number',
  })

export const countryCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  code: z.string().trim().min(2).max(3).transform((value) => value.toUpperCase()),
})

export const countryUpdateSchema = countryCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required',
)

export const hospitalCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  countryId: z.string().trim().min(1, 'Country is required'),
  latitude: optionalNumber.nullable().optional(),
  longitude: optionalNumber.nullable().optional(),
})

export const hospitalUpdateSchema = hospitalCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required',
)

export const departmentCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  hospitalId: z.string().trim().min(1, 'Hospital is required'),
})

export const departmentUpdateSchema = departmentCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required',
)

export const icuCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  departmentId: z.string().trim().min(1, 'Department is required'),
})

export const icuUpdateSchema = icuCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required',
)

export const userCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(Role),
})

export const userUpdateSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().email().optional(),
    password: z.string().min(8).optional(),
    role: z.nativeEnum(Role).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required')

export const patientCreateSchema = z.object({
  mrn: z.string().trim().min(1, 'MRN is required'),
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  dateOfBirth: z.coerce.date(),
  gender: z.string().trim().min(1, 'Gender is required'),
  icuId: z.string().trim().optional().nullable().transform((value) => value || null),
})

export const patientUpdateSchema = z
  .object({
    mrn: z.string().trim().min(1).optional(),
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
    dateOfBirth: z.coerce.date().optional(),
    gender: z.string().trim().min(1).optional(),
    icuId: z.string().trim().optional().nullable().transform((value) => value || null),
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required')

export const formCreateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  patientId: z.string().trim().min(1, 'Patient is required'),
  status: z.nativeEnum(FormStatus).optional(),
  data: z.unknown().optional(),
})

export const formUpdateSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    patientId: z.string().trim().min(1).optional(),
    status: z.nativeEnum(FormStatus).optional(),
    data: z.unknown().optional(),
    validationNote: z.string().trim().max(1000).optional(),
    recordValidation: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required')
