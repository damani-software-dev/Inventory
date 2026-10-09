
import Link from "next/link"
import { useMemo, useState } from 'react'
import {Archive, BadgeDollarSign, BarChart3, Boxes, ChevronDown, ChevronLeft, ChevronRight,CircleDollarSign, ClipboardList, Coins, Edit3, Ellipsis,GitGraph,LayoutDashboard, Menu, Package, PackagePlus, PanelLeftClose, Plus, Search, Settings, SlidersHorizontal, Trash2, Users, X,} from 'lucide-react'
import { navGroups, products, } from '@/lib/actions/product' 
import { StatusBadge } from './inventory/status-badge'
import { useSession, signOut } from 'next-auth/react'
import AddProductModal from './modals/add-product'
import { usePathname } from 'next/navigation'



export default function Sidebar() {
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('All categories')
    const [status, setStatus] = useState('All statuses')
    const [sort, setSort] = useState('Recently updated')
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const [mobileNav, setMobileNav] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [isAddProductOpen, setIsAddProductOpen] = useState(false)


    const pathname = usePathname()

    const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(`${href}/`)) 

    const navLinkClass = (href: string) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors 
    ${ isActive(href) ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900' }`


 return (

    <aside className={`fixed inset-y-0 left-0 z-30 flex w-[252px] flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform duration-200 lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
            
        <div className="flex items-center justify-between px-2">
        
        <div className="flex items-center gap-3">
            
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Archive className="size-5" />
            </div>
        
            <div>
                <p className="text-sm font-semibold tracking-tight">Island Ledger</p>
                <p className="text-xs text-slate-500">Kingston Workspace</p>
            </div>
        </div>
        
        <button onClick={() => setMobileNav(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden" aria-label="Close navigation">
            <X className="size-4" />
        </button>
        
        </div>
        
        {/* Sidebar navigation */}
        <nav className="mt-10 flex flex-1 flex-col gap-8" aria-label="Primary navigation">
            {/* Workspace */}
            <div>
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Workspace
                </p>

                <div className="flex flex-col gap-1">
                    {/* <Link href="/" className={navLinkClass('/')}>
                        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
                            <LayoutDashboard className="size-[18px]" />
                            Dashboard
                        </button>
                        {isActive('/dashboard') && 
                        ( 
                        <span className="ml-auto size-1.5 rounded-full bg-emerald-600" /> 
                        )}
                    </Link> */}

                    <Link href="/" className={navLinkClass('/')}>
                        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors">
                            <Archive className="size-[18px]" />
                            Inventory
                            <span className="ml-auto size-1.5 rounded-full bg-emerald-600" />
                            {isActive('/') && 
                            ( 
                            <span className="ml-auto size-1.5 rounded-full bg-emerald-600" /> 
                            )}
                        </button>
                    </Link>
                    
                    <Link href="/views/products" className={navLinkClass('/views/products')}>
                    <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
                        <Package className="size-[18px]" />
                        Products
                    </button>
                    {isActive('/views/products') && 
                    ( 
                    <span className="ml-auto size-1.5 rounded-full bg-emerald-600" /> 
                    )}
                    </Link>

                </div>
            </div>

            {/* Business */}
            <div>
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Business
                </p>

                <div className="flex flex-col gap-1">
                    <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
                        <Coins className="size-[18px]" />
                        Sales
                    </button>

                    <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
                        <BadgeDollarSign className="size-[18px]" />
                        Revenue
                    </button>

                    <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
                        <GitGraph className="size-[18px]" />
                        Reports
                    </button>
                </div>
            </div>

            {/* Settings */}
            <div>
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    System
                </p>

                <div className="flex flex-col gap-1">
                    <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
                        <Settings className="size-[18px]" />
                        Settings
                    </button>
                </div>
            </div>
        </nav>
        
        {/* Sidebar profile 
        <div className="border-t border-slate-100 pt-4">
            <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-50">
                <div className="flex size-9 items-center justify-center rounded-full bg-[#d8a48f] text-sm font-semibold text-white">MS</div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">Marsha Sinclair</p>
                        <p className="truncate text-xs text-slate-500">marsha@islandledger.jm</p>
                    </div>
                    <ChevronDown className="size-4 text-slate-400" />
            </button>
        </div>*/}
    </aside>
       
  )  
} 

