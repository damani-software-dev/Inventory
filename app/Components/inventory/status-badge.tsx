
import { Product } from "@/lib/actions/product"

export function StatusBadge({ status }: { status: Product['status'] }) {
    const styles = { 'In Stock': 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', 'Low Stock': 'bg-amber-50 text-amber-700 ring-amber-600/20', 'Out of Stock': 'bg-red-50 text-red-700 ring-red-600/20' }
    
    return (
        
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}>
            <span className="size-1.5 rounded-full bg-current" />{status}
        </span>
    )
}