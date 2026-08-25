import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/route-errors'
import { patientCreateSchema } from '@/lib/validators'

export async function GET() {
  const auth = await requireSession()
  if ('response' in auth) return auth.response

  try {
    const patients = await prisma.patient.findMany({
      include: {
        icu: {
          select: {
            id: true,
            name: true,
            department: {
              select: {
                id: true,
                name: true,
                hospital: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(patients)
  } catch (error) {
    return handleApiError(error, 'Failed to fetch patients')
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER])
  if ('response' in auth) return auth.response

  try {
    const body = await request.json()
    const data = patientCreateSchema.parse(body)
    const patient = await prisma.patient.create({ data })
    return NextResponse.json(patient, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'Failed to create patient')
  }
}
