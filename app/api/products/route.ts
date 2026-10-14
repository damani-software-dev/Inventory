import { NextRequest, NextResponse } from 'next/server'
import { ProductStatus, ProductType } from '@/lib/generated/prisma/client'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const name = String(body.name ?? '').trim()
        const description = String(body.description ?? '').trim()
        const collection = String(body.collection ?? '').trim()
        const rawType = String(body.type ?? '')
        const rawStatus = String(body.status ?? 'draft')

        if (!name) {
            return NextResponse.json(
                { error: 'Product name is required.' },
                { status: 400 }
            )
        }

        const typeMap: Record<string, ProductType> = {
            't-shirt': ProductType.T_SHIRT,
            hoodie: ProductType.HOODIE,
            accessory: ProductType.ACCESSORY,
        }

        const statusMap: Record<string, ProductStatus> = {
            draft: ProductStatus.DRAFT,
            active: ProductStatus.ACTIVE,
        }

        const type = typeMap[rawType]
        const status = statusMap[rawStatus]

        if (!type) {
            return NextResponse.json(
                { error: 'Please select a valid product type.' },
                { status: 400 }
            )
        }

        if (!status) {
            return NextResponse.json(
                { error: 'Please select a valid product status.' },
                { status: 400 }
            )
        }

        const product = await prisma.product.create({
            data: {
                name,
                description: description || null,
                collection: collection || null,
                type,
                status,
            },
        })

        return NextResponse.json(
            {
                message: 'Product created successfully.',
                product,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Create product error:', error)

        return NextResponse.json(
            { error: 'Unable to create product. Please try again.' },
            { status: 500 }
        )
    }
}


export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q')?.trim() ?? ''

    const products = await prisma.product.findMany({
      where: query
        ? {
            OR: [
              {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                collection: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Product search failed:', error)

    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    )
  }
}