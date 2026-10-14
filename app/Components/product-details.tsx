"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, ChevronDown, Edit3, ImagePlus, MoreHorizontal, Package, Plus, Search, Trash2, X } from "lucide-react"
import Sidebar from "./sidebar";
import Link from "next/link";

type Variant = {
    id: number
    productId: number
    color: string
    size: string
    sku: string
    price: number
    cost: number
    quantity: number
    imageUrl: string | null
    createdAt: string
    updatedAt: string
  }
  
  type ProductRecord = {
    id: number
    name: string
    description: string | null
    imageUrl: string | null
    collection: string | null
    type: string
    status: string
    createdAt: string
    updatedAt: string
    variants: Variant[]
  }

const money = (value: number) => `J$${value.toLocaleString()}`

type Product = {
    id: number
    name: string
    description: string | null
    imageUrl: string | null
    collection: string | null
    type: string
    status: string
    createdAt: string
    updatedAt: string
  }

export default function ProductDetails() {

    const { id } = useParams<{ id: string }>()

    const [error, setError] = useState("")

    // const params = useParams<{ id: string }>()
    const productId = Number(id)
  
    const [product, setProduct] = useState<ProductRecord | null>(null)
    const [variant, setVariant] = useState<Variant | null>(null)
    const [loading, setLoading] = useState(true)
    const [pageError, setPageError] = useState("")
    const [saving, setSaving] = useState(false)
  
    const [query, setQuery] = useState("")
    const [stockFilter, setStockFilter] = useState("All")
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editing, setEditing] = useState<Variant | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    useEffect(() => {
        async function fetchProduct() {
          try {
            setLoading(true)
            setError("")
      
            const response = await fetch(`/api/products/${id}`)
            const data = await response.json()
      
            if (!response.ok) {
              throw new Error(data.error || "Failed to load product.")
            }
      
            setProduct(data.product)
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "Something went wrong."
            )
          } finally {
            setLoading(false)
          }
        }
      
        if (id) {
          fetchProduct()
        }
      }, [id])
  
    const [form, setForm] = useState({
      color: "",
      size: "",
      sku: "",
      price: "",
      cost: "",
      quantity: "0",
    })

  
    const variants = product?.variants ?? []
  
    const totalStock = variants.reduce(
      (sum, variant) => sum + variant.quantity,
      0
    )
      
  
    const inventoryCost = variants.reduce(
      (sum, variant) => sum + variant.cost * variant.quantity,
      0
    )
  
    const potentialRevenue = variants.reduce(
      (sum, variant) => sum + variant.price * variant.quantity,
      0
    )
  
    const lowestPrice = variants.length
      ? Math.min(...variants.map((variant) => variant.price))
      : null
  
    const highestPrice = variants.length
      ? Math.max(...variants.map((variant) => variant.price))
      : null
  
    const filteredVariants = useMemo(
      () =>
        variants.filter((variant) => {
          const matchesQuery =
            `${variant.color} ${variant.size} ${variant.sku}`
              .toLowerCase()
              .includes(query.toLowerCase())
  
          const status =
            variant.quantity === 0
              ? "Out of Stock"
              : variant.quantity <= 3
                ? "Low Stock"
                : "In Stock"
  
          return (
            matchesQuery &&
            (stockFilter === "All" || stockFilter === status)
          )
        }),
      [query, stockFilter, variants]
    )
  
    const loadProduct = useCallback(async () => {
      if (!Number.isInteger(productId) || productId <= 0) {
        setPageError("Invalid product ID.")
        setLoading(false)
        return
      }
  
      try {
        setPageError("")
  
        const response = await fetch(`/api/products/${productId}`)
  
        const data = await response.json()
  
        if (!response.ok) {
          throw new Error(data.error || "Unable to load product.")
        }
  
        const record = data.product
  
        setProduct({
          ...record,
          variants: record.variants.map((variant: Variant) => ({
            ...variant,
            price: Number(variant.price),
            cost: Number(variant.cost),
            quantity: Number(variant.quantity),
          })),
        })
      } catch (error) {
        setPageError(
          error instanceof Error
            ? error.message
            : "Unable to load product."
        )
      } finally {
        setLoading(false)
      }
    }, [productId])
  
    useEffect(() => {
      void loadProduct()
    }, [loadProduct])
  
    function openAdd() {
      setEditing(null)
      setForm({
        color: "",
        size: "",
        sku: "",
        price: "",
        cost: "",
        quantity: "0",
      })
      setDrawerOpen(true)
    }
  
    function openEdit(variant: Variant) {
      setEditing(variant)
      setForm({
        color: variant.color,
        size: variant.size,
        sku: variant.sku,
        price: String(variant.price),
        cost: String(variant.cost),
        quantity: String(variant.quantity),
      })
      setDrawerOpen(true)
    }
  

  
    async function saveVariant(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
    
        if (!product) return
    
        setSaving(true)
        setPageError("")
    
        try {
        const payload = {
            color: form.color.trim(),
            size: form.size.trim(),
            sku: form.sku.trim(),
            price: Number(form.price),
            cost: Number(form.cost),
            quantity: Number(form.quantity),
        }
    
        if (
            !payload.color ||
            !payload.size ||
            !payload.sku ||
            form.price.trim() === "" ||
            form.cost.trim() === "" ||
            form.quantity.trim() === "" ||
            !Number.isFinite(payload.price) ||
            !Number.isFinite(payload.cost) ||
            !Number.isInteger(payload.quantity) ||
            payload.price < 0 ||
            payload.cost < 0 ||
            payload.quantity < 0
        ) {
            setPageError("Enter valid details for all required fields.")
            return
        }
    
        // Editing requires the PATCH endpoint; creating uses POST.
        const response = await fetch(
            editing
            ? `/api/products/${product.id}/variants/${editing.id}`
            : `/api/products/${product.id}/variants`,
            {
            method: editing ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            }
        )
    
        const data = await response.json()
    
        if (!response.ok) {
            throw new Error(data.error || "Unable to save variant.")
        }
    
        setDrawerOpen(false)
        setEditing(null)
        await loadProduct()
        } catch (error) {
        setPageError(
            error instanceof Error
            ? error.message
            : "Unable to save variant."
        )
        } finally {
        setSaving(false)
        }
    }


    const [deleting, setDeleting] = useState(false);

    const confirmDeleteVariant = async () => {
    if (!product || !deleteId) return;

    setDeleting(true);
    setPageError("");

    try {
        const response = await fetch(
        `/api/products/${product.id}/variants/${deleteId}`,
        { method: "DELETE" }
        );

        const result = await response.json();

        if (!response.ok) {
        throw new Error(result.error || "Unable to delete variant.");
        }

        setDeleteId(null);
        await loadProduct();
    } catch (error) {
        setPageError(
        error instanceof Error
            ? error.message
            : "Unable to delete variant."
        );
    } finally {
        setDeleting(false);
    }
    };


    if (loading) {
        return (
        <div className="min-h-screen bg-[#f8fafb] text-slate-950">
            <Sidebar />
            <main className="p-8">
            <p className="text-sm text-muted-foreground">
                Loading product details...
            </p>
            </main>
        </div>
        )
    }

    if (error || !product) {
        return (
        <div className="min-h-screen bg-[#f8fafb] text-slate-950">
            <Sidebar />
            <main className="p-8">
            <h1 className="text-xl font-semibold">
                Unable to load product
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
                {error || "Product not found."}
            </p>
            </main>
        </div>
        )
    }

    
    
    
  return (
    <div className="min-h-screen bg-[#f8fafb] text-slate-950">
       
        <Sidebar/>
        
        <main className="min-h-screen lg:pl-[252px]">
            
            <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8">
                
                <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" />Back to Products
                </Link>
                <div className="mb-8 flex flex-col justify-between gap-4 border-b pb-7 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-2 text-sm text-muted-foreground">Products / {product.type} / {product.name}</p>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Active</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-muted">
                            <Edit3 className="size-4" />Edit Product
                        </button>
                        <button className="rounded-md border bg-background p-2 hover:bg-muted" aria-label="More actions">
                            <MoreHorizontal className="size-5" />
                        </button>
                    </div>
                </div>

                <section className="grid gap-8 rounded-xl border bg-background p-6 lg:grid-cols-[minmax(280px,0.9fr)_1.1fr] lg:p-8">
                    <div>
                        <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
                            <Package className="size-20 text-muted-foreground/30" />
                        </div>
                        <div className="mt-3 flex gap-2">
                            <div className="flex size-16 items-center justify-center rounded-md border-2 border-foreground bg-muted">
                                <Package className="size-6 text-muted-foreground/30" />
                            </div>
                            <div className="size-16 rounded-md border bg-muted/60" />
                            <div className="size-16 rounded-md border bg-muted/60" />
                        </div>
                    </div>
                    <div>
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Product details</h2>
                                <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
                            </div>
                            <button className="text-sm font-medium text-primary hover:underline">Edit details</button>
                        </div>
                        <dl className="grid grid-cols-2 border-t text-sm">
                            <div className="border-b py-4">
                                <dt className="text-muted-foreground">Product type</dt>
                                <dd className="mt-1 font-medium">{product.type}</dd>
                            </div>
                            <div className="border-b py-4">
                                <dt className="text-muted-foreground">SKU</dt>
                                <dd className="mt-1 font-medium"></dd>
                            </div>
                            <div className="border-b py-4">
                                <dt className="text-muted-foreground">Selling price</dt>
                                <dd className="mt-1 text-lg font-semibold">{variant?.price}</dd>
                            </div>
                            <div className="border-b py-4">
                                <dt className="text-muted-foreground">Cost per item</dt>
                                <dd className="mt-1 font-medium">J$2,800</dd>
                            </div>
                            <div className="py-4">
                                <dt className="text-muted-foreground">Total inventory</dt>
                                <dd className="mt-1 text-lg font-semibold">{totalStock} units</dd>
                            </div>
                                <div className="py-4">
                                    <dt className="text-muted-foreground">Inventory status</dt>
                                    <dd className="mt-1 font-medium text-emerald-600">In Stock</dd>
                                </div>
                        </dl>
                    </div>
                </section>

                <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Total stock", `${totalStock} units`], ["Variant combinations", `${variants.length}`], ["Inventory cost", money(totalStock * 2800)], ["Potential sales revenue", money(totalStock * 7500)]].map(([label, value]) => 
                        <div key={String(label)} className="rounded-xl border bg-background p-5">
                            <Package className="mb-5 size-5 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{label}</p>
                            <p className="mt-1 text-2xl font-semibold">{value}</p>
                        </div>
                    )}
                </section>

                <section className="mt-10 rounded-xl border bg-background">
                    <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Variants &amp; Inventory</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Manage the sizes, colors, and stock levels for this product.</p>
                        </div>
                        <button onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        <Plus className="size-4" />Add Variant</button>
                    </div>
                    <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search variants, colors, or SKU" className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                        </div>
                        <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="h-9 rounded-md border bg-background px-3 text-sm outline-none">
                            <option>All</option>
                            <option>In Stock</option>
                            <option>Low Stock</option>
                            <option>Out of Stock</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="px-6 py-3 font-medium">Variant</th>
                                <th className="px-4 py-3 font-medium">SKU</th>
                                <th className="px-4 py-3 font-medium">Price</th>
                                <th className="px-4 py-3 font-medium">Quantity</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3"/>
                            </tr>
                            </thead>
                            <tbody>{filteredVariants.map((variant) => { const status = variant.quantity === 0 ? "Out of Stock" : variant.quantity <= 3 ? "Low Stock" : "In Stock"; return <tr key={variant.id} className="border-t hover:bg-muted/20">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3"><span className={`size-3 rounded-full border ${variant.color === "Black" ? "bg-black" : "bg-white"}`} />
                                        <span className="font-medium">{variant.color} / {variant.size}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-muted-foreground">{variant.sku}</td>
                                <td className="px-4 py-4">{money(variant.price)}</td>
                                <td className="px-4 py-4 font-medium">{variant.quantity}</td>
                                <td className="px-4 py-4">
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status === "In Stock" ? "bg-emerald-100 text-emerald-700" : status === "Low Stock" ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}>{status}</span>
                                </td>
                                    <td className="px-4 py-4">
                                        <button onClick={() => openEdit(variant)} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={`Edit ${variant.color} ${variant.size}`}>
                                            <Edit3 className="size-4" />
                                        </button>
                                        <button onClick={() => setDeleteId(variant.id)} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive" aria-label={`Delete ${variant.color} ${variant.size}`}>
                                            <Trash2 className="size-4" />
                                        </button>
                                    </td>
                                </tr> 
                            })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {drawerOpen && 
            <div className="fixed inset-0 z-50 bg-foreground/20" onMouseDown={(e) => e.target === e.currentTarget && setDrawerOpen(false)}>
                <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-background shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="variant-title">
                    <header className="flex items-center justify-between border-b px-6 py-5">
                        <div>
                            <h2 id="variant-title" className="text-lg font-semibold">
                                {editing ? "Edit Variant" : "Add Variant"}
                            </h2>
                                <p className="mt-1 text-sm text-muted-foreground">Create a size-and-color combination under this product.</p>
                        </div>
                        <button onClick={() => setDrawerOpen(false)} className="rounded-md p-2 hover:bg-muted" aria-label="Close">
                            <X className="size-5" />
                        </button>
                    </header>
                    <form onSubmit={saveVariant} className="flex flex-1 flex-col">
                        <div className="flex flex-col gap-5 overflow-y-auto px-6 py-6">
                            <label className="flex flex-col gap-2 text-sm font-medium">Color
                                <input required value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="e.g. Black" className="h-10 rounded-md border bg-background px-3 font-normal"/>
                            </label>

                            <label className="flex flex-col gap-2 text-sm font-medium">Size
                                <select required value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="h-10 rounded-md border bg-background px-3 font-normal">
                                    <option value="">Select size</option>
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                </select>
                            </label>

                            <label className="flex flex-col gap-2 text-sm font-medium">
                                SKU <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="h-10 rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-ring" />
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <label className="flex flex-col gap-2 text-sm font-medium">
                                    Selling price <input type="number" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="h-10 rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-ring" />
                                </label>
                                <label className="flex flex-col gap-2 text-sm font-medium">
                                    Cost per item<input type="number" min="0" required value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="h-10 rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-ring" />
                                </label>
                            </div>

                            <label className="flex flex-col gap-2 text-sm font-medium">
                                {editing ? "Stock quantity" : "Opening stock quantity"}<input type="number" min="0" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="h-10 rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-ring" />
                            </label>

                            <div className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                                <ImagePlus className="mb-2 size-5" />Optional variant image
                            </div>

                        </div>
                        <footer className="mt-auto flex justify-end gap-3 border-t px-6 py-4">
                            <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
                            <button type="submit" disabled={saving} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
                            {saving
                                ? "Saving..."
                                : editing
                                ? "Save Changes"
                                : "Add Variant"}
                            </button>
                        </footer>
                    </form>
                </aside>
            </div>
            }
            {deleteId && 
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-5">
                <div className="w-full max-w-sm rounded-xl border bg-background p-6 shadow-xl">
                    <h2 className="text-lg font-semibold">Delete variant?</h2>
                    <p className="mt-2 text-sm text-muted-foreground">This size-and-color combination will be removed from the product.</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={() => setDeleteId(null)} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
                        <button onClick={confirmDeleteVariant} disabled={deleting} className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground disabled:opacity-50">
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </div>}
        </main>
    </div>
  )
}
