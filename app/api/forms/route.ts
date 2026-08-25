import { FormStatus, Prisma, Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/route-errors'
import { formCreateSchema } from '@/lib/validators'

export async function GET(request: NextRequest) {
  const auth = await requireSession()
  if ('response' in auth) return auth.response

  try {
    const statusParam = request.nextUrl.searchParams.get('status')
    const validStatuses = Object.values(FormStatus)
    const status =
      statusParam && (validStatuses as string[]).includes(statusParam)
        ? (statusParam as FormStatus)
        : null

    const forms = await prisma.dataForm.findMany({
      where: status ? { status } : undefined,
      include: {
        patient: {
          select: { id: true, mrn: true, firstName: true, lastName: true },
        },
        validations: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(forms)
  } catch (error) {
    return handleApiError(error, 'Failed to fetch forms')
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER, Role.VALIDATOR])
  if ('response' in auth) return auth.response

  try {
    const body = await request.json()
    const data = formCreateSchema.parse(body)

    const form = await prisma.dataForm.create({
      data: {
        title: data.title,
        patientId: data.patientId,
        status: data.status ?? FormStatus.DRAFT,
        data: (data.data ?? {}) as Prisma.InputJsonValue,
      },
    })

    return NextResponse.json(form, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'Failed to create form')
  }
}
