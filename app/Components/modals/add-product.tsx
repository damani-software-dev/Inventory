"use client"

import { useState } from "react"
import { ImagePlus, PackagePlus, Upload, X } from "lucide-react"

type ModalProps = {
    open: boolean
    onClose: () => void
 }

export default function AddProductModal( { open, onClose }: ModalProps) {
  const [imageName, setImageName] = useState("")


  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setImageName(event.target.files?.[0]?.name ?? "")
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const productData = {
        name: String(formData.get("name") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        collection: String(formData.get("collection") ?? ""),
        type: String(formData.get("type") ?? ""),
        status: String(formData.get("status") ?? ""),
    }

    try {
        const response = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
        })

        const data = await response.json()

        if (!response.ok) {
            console.error(data.error)
            return
        }

        console.log("Product created:", data.product)

        onClose()
    } catch (error) {
        console.error("Create product error:", error)
    }
}

  return (
    <>
      <style jsx>{`
        @keyframes product-panel-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .product-panel {
          animation: product-panel-in 250ms ease-out both;
        }
      `}</style>
      {/* <main className="min-h-screen bg-muted/30 px-6 py-10 text-foreground sm:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center"> */}
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            {open && (
              <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20 animate-in fade-in duration-200" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
                <section role="dialog" aria-modal="true" aria-labelledby="create-product-title" className="product-panel flex h-full w-full max-w-xl flex-col overflow-y-auto bg-background shadow-2xl">
                  <header className="flex items-center justify-between border-b px-6 py-5">
                    <h2 id="create-product-title" className="text-lg font-semibold">Create product</h2>
                    <button type="button" onClick={() => onClose()} aria-label="Close create product" className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><X /></button>
                  </header>

                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-5 px-6 py-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="product-name" className="text-sm font-medium">Product name <span className="text-destructive">*</span></label>
                      <input id="product-name" name="name" placeholder="Ascend Tee" required className="h-10 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="description" className="text-sm font-medium">Description</label>
                      <textarea id="description" name="description" placeholder="Premium heavyweight cotton tee..." className="min-h-24 resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>

                    <div className="flex flex-col gap-2 ">
                      <label htmlFor="product-image" className="text-sm font-medium">Product image</label>
                      <label htmlFor="product-image" className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-5 py-6 text-center transition-colors hover:bg-muted/50">
                        {imageName ? (
                          <div className="flex items-center gap-2 text-sm font-medium"><ImagePlus className="size-4" aria-hidden="true" />{imageName}<button type="button" onClick={(event) => { event.preventDefault(); setImageName("") }} aria-label="Remove selected image" className="ml-1 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="size-4" /></button></div>
                        ) : (
                          <><Upload className="mb-2 size-5 text-muted-foreground" aria-hidden="true" /><span className="text-sm font-medium">Upload product photo</span><span className="mt-1 text-xs text-muted-foreground">PNG, JPG or WEBP up to 10MB</span></>
                        )}
                        <input id="product-image" name="image" type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleImageChange} />
                      </label>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="collection" className="text-sm font-medium">Collection</label>
                      <select id="collection" name="collection" defaultValue="ascension" className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="ascension">Ascension</option><option value="essentials">Essentials</option><option value="seasonal">Seasonal</option></select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="product-type" className="text-sm font-medium">Product type <span className="text-destructive">*</span></label>
                      <select id="product-type" name="type" defaultValue="t-shirt" required className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="t-shirt">T-Shirt</option><option value="hoodie">Hoodie</option><option value="accessory">Accessory</option></select>
                    </div>

                    <div className="flex flex-col gap-2 ">
                      <label htmlFor="status" className="text-sm font-medium">Status <span className="text-destructive">*</span></label>
                      <select id="status" name="status" defaultValue="draft" required className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="draft">Draft</option><option value="active">Active</option></select>
                    </div>
                  </div>
                  <footer className="flex justify-end gap-3 border-t px-6 py-4">
                    <button type="button" onClick={() => onClose()} className="h-10 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted">Cancel</button>
                    <button type="submit" className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">Create product</button>
                  </footer>
                </form>
                </section>
              </div>
            )}
          </div>
        
      {/* </section>
    </main> */}
    </>
  )
}

// Product creation is intentionally a UI-only flow until catalog persistence is connected.
