import { FormStatus, Prisma, Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { handleApiError, notFoundResponse } from '@/lib/route-errors'
import { formUpdateSchema } from '@/lib/validators'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession()
  if ('response' in auth) return auth.response

  try {
    const form = await prisma.dataForm.findUnique({
      where: { id: params.id },
      include: {
        patient: {
          select: { id: true, mrn: true, firstName: true, lastName: true },
        },
        validations: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!form) return notFoundResponse('Form')
    return NextResponse.json(form)
  } catch (error) {
    return handleApiError(error, 'Failed to fetch form')
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER, Role.VALIDATOR])
  if ('response' in auth) return auth.response

  try {
    const body = await request.json()
    const data = formUpdateSchema.parse(body)

    const shouldCreateValidation =
      Boolean(data.recordValidation) &&
      Boolean(data.status) &&
      data.status !== FormStatus.DRAFT

    const form = await prisma.dataForm.update({
      where: { id: params.id },
      data: {
        title: data.title,
        patientId: data.patientId,
        status: data.status,
        data: data.data as Prisma.InputJsonValue | undefined,
        validations: shouldCreateValidation
          ? {
              create: {
                status: data.status!,
                notes: data.validationNote,
              },
            }
          : undefined,
      },
      include: {
        patient: {
          select: { id: true, mrn: true, firstName: true, lastName: true },
        },
        validations: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    return NextResponse.json(form)
  } catch (error) {
    return handleApiError(error, 'Failed to update form')
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER, Role.VALIDATOR])
  if ('response' in auth) return auth.response

  try {
    await prisma.dataForm.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, 'Failed to delete form')
  }
}
