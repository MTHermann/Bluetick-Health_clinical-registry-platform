import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function handleApiError(error: unknown, fallbackMessage: string) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 })
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A unique field already exists.' }, { status: 409 })
    }

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'The requested record was not found.' }, { status: 404 })
    }
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message || fallbackMessage }, { status: 500 })
  }

  return NextResponse.json({ error: fallbackMessage }, { status: 500 })
}

export function notFoundResponse(resource: string) {
  return NextResponse.json({ error: `${resource} not found` }, { status: 404 })
}
