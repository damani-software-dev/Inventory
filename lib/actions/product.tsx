import { Archive, BadgeDollarSign, BarChart3, Boxes, CircleDollarSign, Coins, GitGraph, LayoutDashboard, Settings, Users } from "lucide-react"


export type Product = {
  name: string
  description: string
  sku: string
  category: string
  variants: number
  stock: number
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
  updated: string
  icon: string
  tint: string
}

export const products: Product[] = [
  { name: 'Blue Mountain Coffee', description: '250g bag', sku: 'BMC-250', category: 'Beverages', variants: 3, stock: 124, status: 'In Stock', updated: 'Today, 9:42 AM', icon: 'BM', tint: 'bg-amber-50' },
  { name: 'Jerk Seasoning', description: '500ml bottle', sku: 'JS-500', category: 'Groceries', variants: 2, stock: 48, status: 'In Stock', updated: 'Today, 8:15 AM', icon: 'JS', tint: 'bg-red-50' },
  { name: 'Coconut Oil', description: '1L cold-pressed', sku: 'CO-1L', category: 'Groceries', variants: 4, stock: 9, status: 'Low Stock', updated: 'Yesterday, 4:30 PM', icon: 'CO', tint: 'bg-yellow-50' },
  { name: 'Tropical Fruit Blend', description: 'Frozen 2kg pack', sku: 'TFB-2K', category: 'Frozen Foods', variants: 2, stock: 0, status: 'Out of Stock', updated: 'Yesterday, 1:10 PM', icon: 'TF', tint: 'bg-orange-50' },
  { name: 'Ginger Beer', description: '330ml can', sku: 'GB-330', category: 'Beverages', variants: 6, stock: 86, status: 'In Stock', updated: 'Oct 12, 2024', icon: 'GB', tint: 'bg-emerald-50' },
  { name: 'Ackee in Brine', description: '540g tin', sku: 'AB-540', category: 'Groceries', variants: 1, stock: 6, status: 'Low Stock', updated: 'Oct 11, 2024', icon: 'AA', tint: 'bg-lime-50' },
]

export const navGroups = [
  { label: 'Workspace', items: [{ label: 'Dashboard', icon: LayoutDashboard }, { label: 'Inventory', icon: Archive }, { label: 'Products', icon: Users }] },
  { label: 'Business', items: [{ label: 'Sales', icon: Coins}, { label: 'Revenue', icon: BadgeDollarSign }, { label: 'Reports', icon: GitGraph }] },
  {label: 'Business', items: [{ label: 'Settings', icon: Settings }] },
]