import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/route-errors'
import { icuCreateSchema } from '@/lib/validators'

export async function GET() {
  const auth = await requireSession()
  if ('response' in auth) return auth.response

  try {
    const icus = await prisma.iCU.findMany({
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
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(icus)
  } catch (error) {
    return handleApiError(error, 'Failed to fetch ICUs')
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER])
  if ('response' in auth) return auth.response

  try {
    const body = await request.json()
    const data = icuCreateSchema.parse(body)
    const icu = await prisma.iCU.create({ data })
    return NextResponse.json(icu, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'Failed to create ICU')
  }
}
