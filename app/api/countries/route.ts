import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/route-errors'
import { countryCreateSchema } from '@/lib/validators'

export async function GET() {
  const auth = await requireSession()
  if ('response' in auth) return auth.response

  try {
    const countries = await prisma.country.findMany({
      include: { _count: { select: { hospitals: true } } },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(countries)
  } catch (error) {
    return handleApiError(error, 'Failed to fetch countries')
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER])
  if ('response' in auth) return auth.response

  try {
    const body = await request.json()
    const data = countryCreateSchema.parse(body)
    const country = await prisma.country.create({ data })
    return NextResponse.json(country, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'Failed to create country')
  }
}
