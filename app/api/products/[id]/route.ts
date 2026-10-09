
import { NextRequest, NextResponse } from 'next/server'
import {ProductStatus,ProductType } from '@/lib/generated/prisma/client'
import { prisma } from '@/lib/prisma'

type RouteContext = {
  params: Promise<{ id: string }>
}

const validTypes = Object.values(ProductType)
const validStatuses = Object.values(ProductStatus)

// PATCH /api/products/:id
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params
    const productId = Number(id)

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    let body: unknown

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    if (
      !body ||
      typeof body !== 'object' ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { error: 'Request body must be an object' },
        { status: 400 }
      )
    }

    const input = body as Record<string, unknown>

    const allowedFields = [
      'name',
      'description',
      'imageUrl',
      'collection',
      'type',
      'status',
    ]

    const hasAllowedField = allowedFields.some(
      (field) => Object.hasOwn(input, field)
    )

    if (!hasAllowedField) {
      return NextResponse.json(
        { error: 'No product fields provided to update' },
        { status: 400 }
      )
    }

    const data: {
      name?: string
      description?: string | null
      imageUrl?: string | null
      collection?: string | null
      type?: ProductType
      status?: ProductStatus
    } = {}

    if (Object.hasOwn(input, 'name')) {
      if (
        typeof input.name !== 'string' ||
        !input.name.trim()
      ) {
        return NextResponse.json(
          { error: 'Product name is required' },
          { status: 400 }
        )
      }

      data.name = input.name.trim()
    }

    for (const field of [
      'description',
      'imageUrl',
      'collection',
    ] as const) {
      if (Object.hasOwn(input, field)) {
        const value = input[field]

        if (value !== null && typeof value !== 'string') {
          return NextResponse.json(
            { error: `${field} must be a string or null` },
            { status: 400 }
          )
        }

        data[field] =
          typeof value === 'string' ? value.trim() : null
      }
    }

    if (Object.hasOwn(input, 'type')) {
      if (
        typeof input.type !== 'string' ||
        !validTypes.includes(input.type as ProductType)
      ) {
        return NextResponse.json(
          { error: 'Invalid product type' },
          { status: 400 }
        )
      }

      data.type = input.type as ProductType
    }

    if (Object.hasOwn(input, 'status')) {
      if (
        typeof input.status !== 'string' ||
        !validStatuses.includes(input.status as ProductStatus)
      ) {
        return NextResponse.json(
          { error: 'Invalid product status' },
          { status: 400 }
        )
      }

      data.status = input.status as ProductStatus
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data,
    })

    return NextResponse.json({
      message: 'Product updated successfully',
      product,
    })
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    console.error('Failed to update product:', error)

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/:id
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params
    const productId = Number(id)

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({
      message: 'Product deleted successfully',
    })
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    console.error('Failed to delete product:', error)

    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}