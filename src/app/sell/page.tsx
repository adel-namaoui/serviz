import Link from "next/link"
import { CheckCircle2, Star, DollarSign, Clock } from "lucide-react"
export const metadata = { title: "ابدأ البيع" }
export default function SellPage() {
  return (
    <div>
      <div className="relative overflow-hidden py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,hsl(174,72%,42%,0.15),transparent)]" />
        <div className="container relative">
          <h1 className="text-4xl font-bold mb-4">ابدأ البيع على <span className="text-gradient">سيرفيز</span></h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-8">انضم إلى أكثر من 500 مستقل ناجح وابدأ في تحقيق دخل من مهاراتك</p>
          <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-[0.97] transition-all">إنشاء حساب مجاناً</Link>
        </div>
      </div>
      <div className="container pb-20">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[{icon:Star,t:"أنشئ ملفك",d:"سجّل حسابك كمستقل وأضف مهاراتك في دقائق"},{icon:DollarSign,t:"انشر خدماتك",d:"حدد أسعارك بنفسك وأضف حزم مختلفة"},{icon:Clock,t:"ابدأ الكسب",d:"استقبل الطلبات وسلّم العمل واحصل على تقييمات"}].map(s=>(
            <div key={s.t} className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4"><s.icon className="h-6 w-6 text-primary"/></div>
              <h3 className="font-bold mb-2">{s.t}</h3>
              <p className="text-muted-foreground text-sm">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold mb-6">ما تحصل عليه</h2>
          <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto text-start mb-8">
            {["التسجيل والبيع مجاني 100%","تحديد أسعارك بنفسك","وصول لآلاف العملاء","نظام تقييمات يبني سمعتك","دعم فني متواصل","مدفوعات آمنة"].map(b=>(
              <div key={b} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0"/>{b}</div>
            ))}
          </div>
          <Link href="/auth/register" className="inline-flex px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">ابدأ الآن</Link>
        </div>
      </div>
    </div>
  )
}
