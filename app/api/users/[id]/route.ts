import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { handleApiError, notFoundResponse } from '@/lib/route-errors'
import { userUpdateSchema } from '@/lib/validators'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession([Role.ADMIN])
  if ('response' in auth) return auth.response

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) return notFoundResponse('User')
    return NextResponse.json(user)
  } catch (error) {
    return handleApiError(error, 'Failed to fetch user')
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession([Role.ADMIN])
  if ('response' in auth) return auth.response

  try {
    const body = await request.json()
    const data = userUpdateSchema.parse(body)

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password ? await bcrypt.hash(data.password, 12) : undefined,
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

    return NextResponse.json(user)
  } catch (error) {
    return handleApiError(error, 'Failed to update user')
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession([Role.ADMIN])
  if ('response' in auth) return auth.response

  try {
    if (auth.session.user.id === params.id) {
      return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { id: params.id }, select: { id: true } })
    if (!existingUser) return notFoundResponse('User')

    await prisma.user.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, 'Failed to delete user')
  }
}
