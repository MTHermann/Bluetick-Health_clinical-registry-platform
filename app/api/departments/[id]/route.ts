import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { handleApiError, notFoundResponse } from '@/lib/route-errors'
import { departmentUpdateSchema } from '@/lib/validators'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession()
  if ('response' in auth) return auth.response

  try {
    const department = await prisma.department.findUnique({
      where: { id: params.id },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            country: { select: { id: true, name: true, code: true } },
          },
        },
        _count: { select: { icus: true } },
      },
    })

    if (!department) return notFoundResponse('Department')
    return NextResponse.json(department)
  } catch (error) {
    return handleApiError(error, 'Failed to fetch department')
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER])
  if ('response' in auth) return auth.response

  try {
    const body = await request.json()
    const data = departmentUpdateSchema.parse(body)
    const department = await prisma.department.update({ where: { id: params.id }, data })
    return NextResponse.json(department)
  } catch (error) {
    return handleApiError(error, 'Failed to update department')
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER])
  if ('response' in auth) return auth.response

  try {
    await prisma.department.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, 'Failed to delete department')
  }
}
