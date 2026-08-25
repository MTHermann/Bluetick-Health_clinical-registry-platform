import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { handleApiError, notFoundResponse } from '@/lib/route-errors'
import { icuUpdateSchema } from '@/lib/validators'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession()
  if ('response' in auth) return auth.response

  try {
    const icu = await prisma.iCU.findUnique({
      where: { id: params.id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            hospital: { select: { id: true, name: true } },
          },
        },
        _count: { select: { patients: true } },
      },
    })

    if (!icu) return notFoundResponse('ICU')
    return NextResponse.json(icu)
  } catch (error) {
    return handleApiError(error, 'Failed to fetch ICU')
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER])
  if ('response' in auth) return auth.response

  try {
    const body = await request.json()
    const data = icuUpdateSchema.parse(body)
    const icu = await prisma.iCU.update({ where: { id: params.id }, data })
    return NextResponse.json(icu)
  } catch (error) {
    return handleApiError(error, 'Failed to update ICU')
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER])
  if ('response' in auth) return auth.response

  try {
    await prisma.iCU.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, 'Failed to delete ICU')
  }
}
