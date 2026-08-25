import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { handleApiError, notFoundResponse } from '@/lib/route-errors'
import { countryUpdateSchema } from '@/lib/validators'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession()
  if ('response' in auth) return auth.response

  try {
    const country = await prisma.country.findUnique({
      where: { id: params.id },
      include: { _count: { select: { hospitals: true } } },
    })

    if (!country) return notFoundResponse('Country')
    return NextResponse.json(country)
  } catch (error) {
    return handleApiError(error, 'Failed to fetch country')
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER])
  if ('response' in auth) return auth.response

  try {
    const body = await request.json()
    const data = countryUpdateSchema.parse(body)
    const country = await prisma.country.update({ where: { id: params.id }, data })
    return NextResponse.json(country)
  } catch (error) {
    return handleApiError(error, 'Failed to update country')
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession([Role.ADMIN, Role.DATA_MANAGER])
  if ('response' in auth) return auth.response

  try {
    await prisma.country.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, 'Failed to delete country')
  }
}
