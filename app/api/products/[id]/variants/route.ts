import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = Number(id)

    if (!Number.isInteger(productId) || productId <= 0) {
      return Response.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const color =
      typeof body.color === 'string' ? body.color.trim() : ''

    const size =
      typeof body.size === 'string' ? body.size.trim() : ''

    const sku =
      typeof body.sku === 'string' ? body.sku.trim() : ''

    const price = Number(body.price)
    const cost = Number(body.cost)
    const quantity = body.quantity

    if (!color || !size || !sku) {
      return Response.json(
        { error: 'Color, size, and SKU are required' },
        { status: 400 }
      )
    }

    if (
      body.price === '' ||
      body.price === null ||
      body.cost === '' ||
      body.cost === null ||
      !Number.isFinite(price) ||
      !Number.isFinite(cost) ||
      price < 0 ||
      cost < 0
    ) {
      return Response.json(
        { error: 'Price and cost must be valid non-negative numbers' },
        { status: 400 }
      )
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      return Response.json(
        { error: 'Quantity must be a non-negative whole number' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    })

    if (!product) {
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        color,
        size,
        sku,
        price,
        cost,
        quantity,
      },
    })

    return Response.json(
      { variant },
      { status: 201 }
    )
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return Response.json(
        { error: 'This SKU or product color-and-size combination already exists' },
        { status: 409 }
      )
    }

    console.error('Create variant error:', error)

    return Response.json(
      { error: 'Unable to create variant' },
      { status: 500 }
    )
  }
}