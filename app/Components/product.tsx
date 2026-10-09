"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import {Archive, BarChart3, Boxes, ChevronDown, ChevronLeft, ChevronRight,CircleDollarSign, ClipboardList, Edit3, Ellipsis,LayoutDashboard, Menu, PackagePlus, PanelLeftClose, Plus, Search, Settings, SlidersHorizontal, Trash2, Users, X,} from 'lucide-react' 
import { StatusBadge } from './inventory/status-badge'
import { useSession, signOut } from 'next-auth/react'
import AddProductModal from './modals/add-product'
import Sidebar from './sidebar'
import EditProductModal from './modals/edit-product'


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
  }

export default function Product() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All collections')
  const [status, setStatus] = useState('All statuses')
  const [sort, setSort] = useState('Recently updated')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [products, setProducts] = useState<ProductRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  const { data: session } = useSession()

  const user = session?.user

  const initials = user?.name
        ?.split(' ')
        .map((name) => name[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'U'



const loadProducts = useCallback(async () => {
  try {
    setFetchError('')

    const response = await fetch('/api/products')

    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    const data = await response.json()

    setProducts(data.products)
  } catch (error) {
    console.error('Error loading products:', error)
    setFetchError('Unable to load products. Please try again.')
  } finally {
    setLoading(false)
  }
}, [])

useEffect(() => {
  void loadProducts()
}, [loadProducts])

const filtered = useMemo(() => {
  const matches = products.filter((product) => {
    const searchText =
      `${product.name} ${product.description ?? ''} ${product.collection ?? ''} ${product.type}`
        .toLowerCase()

    const matchesSearch = searchText.includes(query.toLowerCase())

    const matchesCollection =
      category === 'All collections' ||
      product.collection === category

    const matchesStatus =
      status === 'All statuses' ||
      product.status === status

    return matchesSearch && matchesCollection && matchesStatus
  })

  if (sort === 'Name A-Z') {
    return [...matches].sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }

  return [...matches].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() -
      new Date(a.updatedAt).getTime()
  )
}, [products, query, category, status, sort])

const [editingProduct, setEditingProduct] =
  useState<ProductRecord | null>(null)

const [deletingProductId, setDeletingProductId] =
  useState<number | null>(null)


async function handleDeleteProduct(product: ProductRecord) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`
    )
  
    if (!confirmed) return
  
    setDeletingProductId(product.id)
  
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product')
      }
  
      setOpenMenu(null)
      await loadProducts()
    } catch (error) {
      console.error('Delete product error:', error)
  
      window.alert(
        error instanceof Error
          ? error.message
          : 'Unable to delete product.'
      )
    } finally {
      setDeletingProductId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafb] text-slate-950">
       
       <Sidebar/>
       
        {/* Mobile navigation overlay */}
        {mobileNav && 
        
        <button aria-label="Close navigation overlay" onClick={() => setMobileNav(false)} className="fixed inset-0 z-20 bg-slate-900/20 lg:hidden" />}
        
        <main className="min-h-screen lg:pl-[252px]">
            <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8 lg:px-10">
                <button onClick={() => setMobileNav(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Open navigation">
                    <Menu className="size-5" />
                </button>
                
                <div className="hidden lg:block" />
                    
                    <div className="relative flex items-center gap-3">
                        
                        {/*<button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Open filters">
                                <SlidersHorizontal className="size-5" />
                            </button>
                            
                            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">MS</div>
                            <ChevronDown className="size-4 text-slate-400" />*/}
                        
                        <button onClick={() => setProfileOpen(!profileOpen)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-50">
                        
                            <div className="flex size-9 items-center justify-center rounded-full bg-[#d8a48f] text-sm font-semibold text-white"> {initials}</div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold">{user?.name}</p>
                                    <p className="truncate text-xs text-slate-500">{user?.email}</p>
                                </div>
                                <ChevronDown className="size-4 text-slate-400" />
                        </button>
                        
                        {/* Profile dropdown */}
                        {profileOpen && (
                            <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">

                                <button onClick={() => signOut({ callbackUrl: '/views/sign-in' })} className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
                                    Sign out
                                </button>
                            </div>
                         )}
                    </div>
            </header>

            {/* Inventory page content */}
            <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

                {/* Page heading */}
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                        <p className="mb-2 text-sm font-medium text-emerald-700">Workspace / Products</p>
                        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-slate-950">Products</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage all products in one environment</p>
                    </div>
                    <button onClick={() => setIsAddProductOpen(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700">
                        <Plus className="size-4" />Add Product
                    </button>

                    <AddProductModal
                        open={isAddProductOpen}
                        onClose={() => setIsAddProductOpen(false)}
                    />

                    <EditProductModal
                        open={editingProduct !== null}
                        product={editingProduct}
                        onClose={() => setEditingProduct(null)}
                        onSaved={() => {
                            void loadProducts()
                        }}
                    />
                </div>

                {/* Inventory summary */}
                <section aria-label="Inventory summary" className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">{[['Total Products', '24', '+3 this month'], ['Total Units', '1,248', '+12.5% from last month'], ['Low Stock', '3', 'Needs attention'], ['Out of Stock', '1', 'Needs restocking']].map(([label, value, note], index) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)] sm:p-5">
                
                    <div className="flex items-start justify-between">
                        <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
                        <span className={`mt-0.5 size-2 rounded-full ${index === 2 ? 'bg-amber-500' : index === 3 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    </div>
                    
                    <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[28px]">{value}</p>
                    <p className={`mt-1 text-xs ${index < 2 ? 'text-emerald-600' : index === 2 ? 'text-amber-600' : 'text-red-600'}`}>{note}</p>
                    
                    </div>)}
                
                </section>
                
                {/* Product inventory section */}
                <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                    
                    {/* Search and filters */}
                    <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative w-full lg:max-w-[290px]">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input aria-label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:flex">
                            
                            <select aria-label="Filter by collection" value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-emerald-500">
                           
                                <option>All collections</option>
                                
                                {[...new Set(
                                    products
                                    .map((product) => product.collection)
                                    .filter((collection): collection is string => Boolean(collection))
                                )].map((collection) => (
                                    <option key={collection} value={collection}>
                                    {collection}
                                    </option>
                                ))}
                            </select>
                            
                            <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-emerald-500">
                                <option>All statuses</option>
                                <option value="ACTIVE">Active</option>
                                <option value="DRAFT">Draft</option>
                            </select>

                            <select aria-label="Sort products" value={sort} onChange={(e) => setSort(e.target.value)} className="col-span-2 h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-emerald-500 sm:col-span-1">
                                <option>Recently updated</option>
                                <option>Name A-Z</option>
                            </select>
                        </div>
                    </div>
                    
                    {loading && (
                    <p className="px-5 py-4 text-sm text-slate-500">
                        Loading products...
                    </p>
                    )}

                    {fetchError && (
                    <div className="flex items-center justify-between px-5 py-4">
                        <p className="text-sm text-red-600">{fetchError}</p>
                        <button
                        onClick={() => {
                            setLoading(true)
                            void loadProducts()
                        }}
                        className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                        >
                        Retry
                        </button>
                    </div>
                    )}
                    {/* Product table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left">
                            
                            {/* Table headers */}
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                    <th className="px-5 py-3.5 font-semibold">Product</th>
                                    <th className="px-4 py-3.5 font-semibold">Collection</th>
                                    <th className="px-4 py-3.5 font-semibold">Type</th>
                                    <th className="px-4 py-3.5 font-semibold">Status</th>
                                    <th className="px-4 py-3.5 font-semibold">Last Updated</th>
                                    <th className="w-12 px-3 py-3.5" />
                                </tr>
                            </thead>
                            
                            {/* Product rows */}
                            
                            <tbody>
                                {!loading && !fetchError && filtered.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                                    >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-emerald-50 text-sm font-bold text-emerald-700">
                                            {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="size-full object-cover"
                                            />
                                            ) : (
                                            product.name.slice(0, 1).toUpperCase()
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                            {product.name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-400">
                                            {product.description || 'No description'}
                                            </p>
                                        </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 text-sm text-slate-600">
                                        {product.collection || '—'}
                                    </td>

                                    <td className="px-4 py-4 text-sm text-slate-600">
                                        {product.type.replaceAll('_', ' ')}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                            product.status === 'ACTIVE'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-slate-100 text-slate-600'
                                        }`}
                                        >
                                        {product.status === 'ACTIVE' ? 'Active' : 'Draft'}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4 text-sm text-slate-500">
                                        {new Date(product.updatedAt).toLocaleDateString()}
                                    </td>

                                    <td className="relative px-3 py-4">
                                        <button
                                        onClick={() =>
                                            setOpenMenu(
                                            openMenu === String(product.id)
                                                ? null
                                                : String(product.id)
                                            )
                                        }
                                        aria-label={`Actions for ${product.name}`}
                                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                        >
                                        <Ellipsis className="size-4" />
                                        </button>

                                        {openMenu === String(product.id) && (
                                        <div className="absolute right-3 top-12 z-10 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                                            
                                            <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50">
                                            View Product
                                            </button>

                                            
                                            <button onClick={() => {setEditingProduct(product)
                                                setOpenMenu(null)
                                                }}
                                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50">
                                                <Edit3 className="size-3.5" />
                                                Edit
                                            </button>

                                           
                                            <button onClick={() => void handleDeleteProduct(product)} disabled={deletingProductId === product.id} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 disabled:opacity-50">
                                                <Trash2 className="size-3.5" />
                                                {deletingProductId === product.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                        )}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {/* Empty state */}
                        {!loading && !fetchError && filtered.length === 0 && <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                                <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                    <Boxes className="size-5" />
                                </div>
                            <h2 className="mt-4 text-sm font-semibold">No products found</h2>
                            <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p>
                        </div>}
                    </div>
                        
                        {/* Pagination */}
                        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
                            <p className="text-xs text-slate-500">Showing <span className="font-medium text-slate-700">{filtered.length}</span> of {products.length} products</p>
                            <div className="flex items-center gap-1">
                                <button className="rounded-md border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50" aria-label="Previous page">
                                    <ChevronLeft className="size-4" />
                                </button>
                                <button className="rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white">1</button>
                                <button className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50">2</button>
                                <button className="rounded-md border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50" aria-label="Next page"><ChevronRight className="size-4" />
                                </button>
                            </div>
                        </div>
                </section>
            </div>
        </main>

        Add product modal
        {/* {showAdd && <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/30 p-4">
            
            <div role="dialog" aria-modal="true" aria-labelledby="add-product-title" className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                
                <div className="flex items-start justify-between">
                    <div>
                        <h2 id="add-product-title" className="text-lg font-semibold">Add product</h2>
                        <p className="mt-1 text-sm text-slate-500">Create a product record for your inventory.</p>
                    </div>
                    
                    Close modal
                    <button onClick={() => setShowAdd(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Close dialog">
                        <X className="size-4" />
                    </button>
                </div>
                
                <div className="mt-6 flex flex-col gap-4">
                    
                    <label className="flex flex-col gap-1.5 text-sm font-medium">
                        SKU<input placeholder="e.g. SC-500" className="h-10 rounded-lg border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10" />
                    </label>
                    
                    <label className="flex flex-col gap-1.5 text-sm font-medium">
                        Product name<input autoFocus placeholder="e.g. Sorrel Concentrate" className="h-10 rounded-lg border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10" />
                    </label>
                    
                    <label className="flex flex-col gap-1.5 text-sm font-medium">
                        Description<input placeholder="Description" className="h-10 rounded-lg border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10" />
                    </label>
                    
                    Modal actions
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setShowAdd(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                        <button onClick={() => setShowAdd(false)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Add Product</button>
                    </div>
                </div>
            </div>
        </div>} */}
    </div>
  )
}
