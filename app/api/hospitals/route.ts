import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/route-errors'
import { hospitalCreateSchema } from '@/lib/validators'

export async function GET() {
  const auth = await requireSession()
  if ('response' in auth) return auth.response

  try {
    const hospitals = await prisma.hospital.findMany({
      include: {
        country: { select: { id: true, name: true, code: true } },
        _count: { select: { departments: true } },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(hospitals)
  } catch (error) {
    return handleApiError(error, 'Failed to fetch hospitals')
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER])
  if ('response' in auth) return auth.response

  try {
    const body = await request.json()
    const data = hospitalCreateSchema.parse(body)
    const hospital = await prisma.hospital.create({ data })
    return NextResponse.json(hospital, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'Failed to create hospital')
  }
}
