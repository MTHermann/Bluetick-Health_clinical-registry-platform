import { FormStatus } from '@prisma/client'
import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/route-errors'

export async function GET() {
  const auth = await requireSession()
  if ('response' in auth) return auth.response

  try {
    const [
      countries,
      hospitals,
      departments,
      icus,
      users,
      patients,
      forms,
      formsByStatus,
      patientsByGender,
      countriesWithHospitals,
      recentPatients,
      recentForms,
    ] = await Promise.all([
      prisma.country.count(),
      prisma.hospital.count(),
      prisma.department.count(),
      prisma.iCU.count(),
      prisma.user.count(),
      prisma.patient.count(),
      prisma.dataForm.count(),
      prisma.dataForm.groupBy({ by: ['status'], _count: { status: true } }),
      prisma.patient.groupBy({ by: ['gender'], _count: { gender: true } }),
      prisma.country.findMany({
        include: { _count: { select: { hospitals: true } } },
        orderBy: { name: 'asc' },
      }),
      prisma.patient.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          icu: {
            select: {
              id: true,
              name: true,
              department: {
                select: { id: true, name: true, hospital: { select: { id: true, name: true } } },
              },
            },
          },
        },
      }),
      prisma.dataForm.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
          patient: {
            select: { id: true, mrn: true, firstName: true, lastName: true },
          },
          validations: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
    ])

    const countsByStatus = Object.fromEntries(formsByStatus.map((item) => [item.status, item._count.status])) as Record<FormStatus, number>

    return NextResponse.json({
      metrics: {
        countries,
        hospitals,
        departments,
        icus,
        users,
        patients,
        forms,
        draftForms: countsByStatus.DRAFT ?? 0,
        submittedForms: countsByStatus.SUBMITTED ?? 0,
        validatedForms: countsByStatus.VALIDATED ?? 0,
        rejectedForms: countsByStatus.REJECTED ?? 0,
      },
      formsByStatus: formsByStatus.map((item) => ({ status: item.status, count: item._count.status })),
      patientsByGender: patientsByGender.map((item) => ({ gender: item.gender, count: item._count.gender })),
      hospitalsByCountry: countriesWithHospitals.map((country) => ({
        country: country.name,
        code: country.code,
        hospitals: country._count.hospitals,
      })),
      recentPatients,
      recentForms,
    })
  } catch (error) {
    return handleApiError(error, 'Failed to fetch dashboard stats')
  }
}
