import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/route-errors'
import { userCreateSchema } from '@/lib/validators'

export async function GET() {
  const auth = await requireSession([Role.ADMIN])
  if ('response' in auth) return auth.response

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(users)
  } catch (error) {
    return handleApiError(error, 'Failed to fetch users')
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireSession([Role.ADMIN])
  if ('response' in auth) return auth.response

  try {
    const body = await request.json()
    const data = userCreateSchema.parse(body)
    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return handleApiError(error, 'Failed to create user')
  }
}
