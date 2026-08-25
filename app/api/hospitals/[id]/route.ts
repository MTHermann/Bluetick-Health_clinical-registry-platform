import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { handleApiError, notFoundResponse } from '@/lib/route-errors'
import { hospitalUpdateSchema } from '@/lib/validators'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession()
  if ('response' in auth) return auth.response

  try {
    const hospital = await prisma.hospital.findUnique({
      where: { id: params.id },
      include: {
        country: { select: { id: true, name: true, code: true } },
        _count: { select: { departments: true } },
      },
    })

    if (!hospital) return notFoundResponse('Hospital')
    return NextResponse.json(hospital)
  } catch (error) {
    return handleApiError(error, 'Failed to fetch hospital')
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER])
  if ('response' in auth) return auth.response

  try {
    const body = await request.json()
    const data = hospitalUpdateSchema.parse(body)
    const hospital = await prisma.hospital.update({ where: { id: params.id }, data })
    return NextResponse.json(hospital)
  } catch (error) {
    return handleApiError(error, 'Failed to update hospital')
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER])
  if ('response' in auth) return auth.response

  try {
    await prisma.hospital.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, 'Failed to delete hospital')
  }
}
