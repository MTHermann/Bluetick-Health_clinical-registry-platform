import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { handleApiError, notFoundResponse } from '@/lib/route-errors'
import { patientUpdateSchema } from '@/lib/validators'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession()
  if ('response' in auth) return auth.response

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
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
        forms: true,
      },
    })

    if (!patient) return notFoundResponse('Patient')
    return NextResponse.json(patient)
  } catch (error) {
    return handleApiError(error, 'Failed to fetch patient')
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER])
  if ('response' in auth) return auth.response

  try {
    const body = await request.json()
    const data = patientUpdateSchema.parse(body)
    const patient = await prisma.patient.update({ where: { id: params.id }, data })
    return NextResponse.json(patient)
  } catch (error) {
    return handleApiError(error, 'Failed to update patient')
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER])
  if ('response' in auth) return auth.response

  try {
    await prisma.patient.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, 'Failed to delete patient')
  }
}
