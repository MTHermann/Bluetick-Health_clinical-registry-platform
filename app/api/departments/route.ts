import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/route-errors'
import { departmentCreateSchema } from '@/lib/validators'

export async function GET() {
  const auth = await requireSession()
  if ('response' in auth) return auth.response

  try {
    const departments = await prisma.department.findMany({
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
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(departments)
  } catch (error) {
    return handleApiError(error, 'Failed to fetch departments')
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER])
  if ('response' in auth) return auth.response

  try {
    const body = await request.json()
    const data = departmentCreateSchema.parse(body)
    const department = await prisma.department.create({ data })
    return NextResponse.json(department, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'Failed to create department')
  }
}
