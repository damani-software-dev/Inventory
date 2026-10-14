
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
    variantId: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id, variantId } = await params;
    const productId = Number(id);
    const parsedVariantId = Number(variantId);

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(parsedVariantId) ||
      parsedVariantId <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid product or variant ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const existingVariant = await prisma.productVariant.findFirst({
      where: {
        id: parsedVariantId,
        productId,
      },
    });

    if (!existingVariant) {
      return NextResponse.json(
        { error: "Variant not found." },
        { status: 404 }
      );
    }

    const data: {
      color?: string;
      size?: string;
      sku?: string;
      price?: number;
      cost?: number;
      quantity?: number;
    } = {};

    if (body.color !== undefined) {
      if (typeof body.color !== "string" || !body.color.trim()) {
        return NextResponse.json(
          { error: "Color is required." },
          { status: 400 }
        );
      }
      data.color = body.color.trim();
    }

    if (body.size !== undefined) {
      if (typeof body.size !== "string" || !body.size.trim()) {
        return NextResponse.json(
          { error: "Size is required." },
          { status: 400 }
        );
      }
      data.size = body.size.trim();
    }

    if (body.sku !== undefined) {
      if (typeof body.sku !== "string" || !body.sku.trim()) {
        return NextResponse.json(
          { error: "SKU is required." },
          { status: 400 }
        );
      }
      data.sku = body.sku.trim();
    }

    for (const field of ["price", "cost"] as const) {
      if (body[field] !== undefined) {
        const value = Number(body[field]);

        if (!Number.isFinite(value) || value < 0) {
          return NextResponse.json(
            { error: `${field} must be a non-negative number.` },
            { status: 400 }
          );
        }

        data[field] = value;
      }
    }

    if (body.quantity !== undefined) {
      const quantity = Number(body.quantity);

      if (!Number.isInteger(quantity) || quantity < 0) {
        return NextResponse.json(
          { error: "Quantity must be a non-negative integer." },
          { status: 400 }
        );
      }

      data.quantity = quantity;
    }

    const updatedVariant = await prisma.productVariant.update({
      where: { id: parsedVariantId },
      data,
    });

    return NextResponse.json({ variant: updatedVariant });
  } catch (error) {
    console.error("Failed to update variant:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "That SKU or product color/size combination already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Unable to update variant." },
      { status: 500 }
    );
  }
}


export async function DELETE(
    _request: Request,
    { params }: RouteContext
  ) {
    try {
      const { id, variantId } = await params;
      const productId = Number(id);
      const parsedVariantId = Number(variantId);
  
      if (
        !Number.isInteger(productId) ||
        productId <= 0 ||
        !Number.isInteger(parsedVariantId) ||
        parsedVariantId <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid product or variant ID." },
          { status: 400 }
        );
      }
  
      // Ensure the variant belongs to this product.
      const variant = await prisma.productVariant.findFirst({
        where: {
          id: parsedVariantId,
          productId,
        },
        select: { id: true },
      });
  
      if (!variant) {
        return NextResponse.json(
          { error: "Variant not found." },
          { status: 404 }
        );
      }
  
      await prisma.productVariant.delete({
        where: { id: variant.id },
      });
  
      return NextResponse.json({
        message: "Variant deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete variant:", error);
  
      return NextResponse.json(
        { error: "Unable to delete variant." },
        { status: 500 }
      );
    }
  }
  