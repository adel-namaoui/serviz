"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, X, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Category = {
  id: string; name: string; nameAr: string; slug: string
  subCategories: { id: string; name: string; nameAr: string; slug: string }[]
}

interface Props { categories: Category[] }

interface PackageInput { name: string; price: string; description: string; deliveryDays: string; revisions: string; features: string[] }

const emptyPackage = (): PackageInput => ({ name: "", price: "", description: "", deliveryDays: "3", revisions: "2", features: [] })

export function NewServiceForm({ categories }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  // Form state
  const [title, setTitle] = useState("")
  const [titleAr, setTitleAr] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [deliveryDays, setDeliveryDays] = useState("3")
  const [revisions, setRevisions] = useState("2")
  const [categoryId, setCategoryId] = useState("")
  const [subCategoryId, setSubCategoryId] = useState("")
  const [tags, setTags] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [packages, setPackages] = useState<PackageInput[]>([])

  const selectedCategory = categories.find(c => c.id === categoryId)

  // Image upload (Base64 preview for demo; production would use uploadthing)
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    const results: string[] = []
    for (const file of files.slice(0, 3)) {
      const reader = new FileReader()
      await new Promise<void>(res => {
        reader.onload = ev => { results.push(ev.target?.result as string); res() }
        reader.readAsDataURL(file)
      })
    }
    setImages(prev => [...prev, ...results].slice(0, 4))
    setUploading(false)
  }

  function addPackage() { setPackages(p => [...p, emptyPackage()]) }
  function removePackage(i: number) { setPackages(p => p.filter((_, j) => j !== i)) }
  function updatePackage(i: number, field: keyof PackageInput, val: string) {
    setPackages(p => p.map((pkg, j) => j === i ? { ...pkg, [field]: val } : pkg))
  }
  function addFeature(i: number) {
    setPackages(p => p.map((pkg, j) => j === i ? { ...pkg, features: [...pkg.features, ""] } : pkg))
  }
  function updateFeature(pi: number, fi: number, val: string) {
    setPackages(p => p.map((pkg, j) => j === pi ? { ...pkg, features: pkg.features.map((f, k) => k === fi ? val : f) } : pkg))
  }
  function removeFeature(pi: number, fi: number) {
    setPackages(p => p.map((pkg, j) => j === pi ? { ...pkg, features: pkg.features.filter((_, k) => k !== fi) } : pkg))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!subCategoryId) { setError("اختر فئة فرعية"); return }
    setLoading(true); setError("")

    try {
      const res = await fetch("/api/services/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, titleAr, description, price: Number(price),
          deliveryDays: Number(deliveryDays), revisions: Number(revisions),
          subCategoryId, images,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
          packages: packages.map(p => ({
            name: p.name, price: Number(p.price), description: p.description,
            deliveryDays: Number(p.deliveryDays), revisions: Number(p.revisions),
            features: p.features.filter(Boolean),
          })),
        }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? "حدث خطأ"); return }
      router.push(`/service/${d.id}`)
      router.refresh()
    } catch { setError("تعذّر الاتصال بالخادم") }
    finally { setLoading(false) }
  }

  const inputCls = "w-full h-11 px-4 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60"
  const labelCls = "block text-sm font-medium mb-1.5"

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Basic info */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-sm">معلومات الخدمة</h2>

        <div>
          <label className={labelCls}>عنوان الخدمة (بالعربية) <span className="text-destructive">*</span></label>
          <input value={titleAr} onChange={e => setTitleAr(e.target.value)} required placeholder="سأصمم لك شعاراً احترافياً..."
            className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>عنوان الخدمة (بالفرنسية / الإنجليزية)</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Je vais créer votre logo professionnel..."
            className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>وصف الخدمة <span className="text-destructive">*</span></label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={5}
            placeholder="اشرح بالتفصيل ما تقدمه، مميزاتك، وما سيحصل عليه العميل..."
            className="w-full px-4 py-3 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60 resize-none" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>السعر ($) <span className="text-destructive">*</span></label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min={1}
              placeholder="2000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>التسليم (أيام)</label>
            <input type="number" value={deliveryDays} onChange={e => setDeliveryDays(e.target.value)} min={1} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>التعديلات</label>
            <input type="number" value={revisions} onChange={e => setRevisions(e.target.value)} min={0} className={inputCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>الكلمات المفتاحية (مفصولة بفاصلة)</label>
          <input value={tags} onChange={e => setTags(e.target.value)}
            placeholder="logo, design, branding, شعار"
            className={inputCls} />
        </div>
      </div>

      {/* Category */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-sm">الفئة <span className="text-destructive">*</span></h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>الفئة الرئيسية</label>
            <select value={categoryId} onChange={e => { setCategoryId(e.target.value); setSubCategoryId("") }}
              className={cn(inputCls, "cursor-pointer")}>
              <option value="">اختر فئة...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nameAr} — {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>الفئة الفرعية</label>
            <select value={subCategoryId} onChange={e => setSubCategoryId(e.target.value)}
              disabled={!selectedCategory} className={cn(inputCls, "cursor-pointer disabled:opacity-50")}>
              <option value="">اختر فئة فرعية...</option>
              {selectedCategory?.subCategories.map(s => <option key={s.id} value={s.id}>{s.nameAr} — {s.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-sm">صور الخدمة</h2>
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative h-24 w-24 rounded-xl overflow-hidden border border-border">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                className="absolute top-1 end-1 h-5 w-5 rounded-full bg-destructive flex items-center justify-center">
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
          {images.length < 4 && (
            <label className="h-24 w-24 rounded-xl border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all">
              {uploading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
              <span className="text-[10px] text-muted-foreground">إضافة صورة</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            </label>
          )}
        </div>
        <p className="text-xs text-muted-foreground">حتى 4 صور — PNG, JPG, WebP</p>
      </div>

      {/* Packages */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm">الباقات (اختياري)</h2>
            <p className="text-xs text-muted-foreground mt-0.5">أضف باقات بأسعار مختلفة (أساسي، قياسي، مميز)</p>
          </div>
          {packages.length < 3 && (
            <button type="button" onClick={addPackage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-secondary text-xs font-medium transition-all">
              <Plus className="h-3.5 w-3.5" /> إضافة باقة
            </button>
          )}
        </div>

        {packages.map((pkg, i) => (
          <div key={i} className="border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground">باقة {i + 1}</p>
              <button type="button" onClick={() => removePackage(i)}
                className="h-6 w-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1">اسم الباقة</label>
                <input value={pkg.name} onChange={e => updatePackage(i, "name", e.target.value)}
                  placeholder="أساسي، قياسي، مميز..." className={cn(inputCls, "h-9 text-xs")} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">السعر ($)</label>
                <input type="number" value={pkg.price} onChange={e => updatePackage(i, "price", e.target.value)}
                  placeholder="5000" min={1} className={cn(inputCls, "h-9 text-xs")} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">الوصف</label>
              <input value={pkg.description} onChange={e => updatePackage(i, "description", e.target.value)}
                placeholder="ما تشمله هذه الباقة..." className={cn(inputCls, "h-9 text-xs")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1">التسليم (أيام)</label>
                <input type="number" value={pkg.deliveryDays} onChange={e => updatePackage(i, "deliveryDays", e.target.value)}
                  min={1} className={cn(inputCls, "h-9 text-xs")} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">التعديلات</label>
                <input type="number" value={pkg.revisions} onChange={e => updatePackage(i, "revisions", e.target.value)}
                  min={0} className={cn(inputCls, "h-9 text-xs")} />
              </div>
            </div>
            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium">المميزات</label>
                <button type="button" onClick={() => addFeature(i)} className="text-xs text-primary hover:underline">+ إضافة ميزة</button>
              </div>
              {pkg.features.map((f, fi) => (
                <div key={fi} className="flex gap-2 mb-2">
                  <input value={f} onChange={e => updateFeature(i, fi, e.target.value)}
                    placeholder="مثال: ملفات AI + SVG" className={cn(inputCls, "h-9 text-xs")} />
                  <button type="button" onClick={() => removeFeature(i, fi)}
                    className="h-9 w-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      {error && (
        <div className="p-4 rounded-xl bg-destructive/8 border border-destructive/20 text-destructive text-sm text-center">{error}</div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={() => router.back()}
          className="flex-1 h-12 rounded-xl border border-border hover:bg-secondary text-sm font-medium transition-all">
          إلغاء
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          نشر الخدمة
        </button>
      </div>
    </form>
  )
}