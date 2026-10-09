
'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

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

type EditProductModalProps = {
  open: boolean
  product: ProductRecord | null
  onClose: () => void
  onSaved: () => void
}

export default function EditProductModal({open,product,onClose,onSaved,}: EditProductModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [collection, setCollection] = useState('')
  const [type, setType] = useState('T_SHIRT')
  const [status, setStatus] = useState('DRAFT')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!product) return

    setName(product.name)
    setDescription(product.description ?? '')
    setImageUrl(product.imageUrl ?? '')
    setCollection(product.collection ?? '')
    setType(product.type)
    setStatus(product.status)
    setError('')
  }, [product])

  if (!open || !product) return null

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          imageUrl: imageUrl.trim() || null,
          collection: collection.trim() || null,
          type,
          status,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product')
      }

      onSaved()
      onClose()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'

  const labelClass =
    'flex flex-col gap-1.5 text-sm font-medium text-slate-700'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-product-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2
              id="edit-product-title"
              className="text-lg font-semibold text-slate-950"
            >
              Edit product
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Update the details for {product.name}.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className={labelClass}>
            Product name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Description
            <textarea
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />
          </label>

          <label className={labelClass}>
            Image URL
            <input
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Collection
            <input
              value={collection}
              onChange={(event) => setCollection(event.target.value)}
              placeholder="e.g. ascension"
              className={inputClass}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className={labelClass}>
              Product type
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className={inputClass}
              >
                <option value="T_SHIRT">T-shirt</option>
                <option value="HOODIE">Hoodie</option>
                <option value="ACCESSORY">Accessory</option>
              </select>
            </label>

            <label className={labelClass}>
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className={inputClass}
              >
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
              </select>
            </label>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}