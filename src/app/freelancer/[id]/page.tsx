import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Star, CheckCircle, Calendar, Mail, Phone, MapPin } from "lucide-react"
import { ServiceCard } from "@/components/marketplace/ServiceCard"
import { formatPrice } from "@/lib/utils"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"


export default async function FreelancerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // 1. TOUJOURS attendre les params en premier
  const { id } = await params
  
  // 2. Vérifier la session
  const session = await auth()
  
  // 3. Rediriger si pas de session (Sécurité double avec le middleware)
  if (!session) {
    redirect(`/auth/login?from=/freelancer/${id}`)
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      services: {
        where: { isActive: true },
        include: { packages: { take: 1, orderBy: { price: 'asc' } } }
      },
      reviews: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user || user.role !== "FREELANCER") notFound()

  // CALCUL DES STATS (Puisque rating n'est pas dans le modèle User)
  const totalReviews = user.services.reduce((acc, s) => acc + s.reviewCount, 0)
  const avgRating = user.services.length > 0 
    ? user.services.reduce((acc, s) => acc + s.rating, 0) / user.services.length 
    : 0

  return (
    <div className="container py-12 space-y-12">
      {/* Header Profil Moderne */}
      <div className="bg-card border border-border rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center text-5xl font-black text-primary border-4 border-background shadow-xl">
            {user.name[0]}
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              {user.name} <CheckCircle className="h-6 w-6 text-blue-500 fill-blue-500" />
            </h1>
            
            {/* Stats de notation */}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> 
                {avgRating.toFixed(1)} ({totalReviews} avis)
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Membre depuis {new Date(user.createdAt).getFullYear()}
              </span>
            </div>

            {/* INFOS DE CONTACT (Email & Téléphone) */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl text-sm border border-border/50">
                <Mail className="h-4 w-4 text-primary" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl text-sm border border-border/50">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>

            <p className="text-muted-foreground max-w-xl mx-auto pt-6 leading-relaxed italic">
              {user.bio || "Freelance professionnel sur BrandDZ"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Services du Freelance */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold italic">Services proposés</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {user.services.map(s => (
              <ServiceCard 
                key={s.id} 
                {...s} 
                sellerName={user.name} 
                sellerId={user.id}
                price={s.packages[0]?.price ?? s.price} 
              />
            ))}
          </div>
        </div>

        {/* Avis des clients */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold italic">Avis clients</h2>
          <div className="space-y-4">
            {user.reviews.length === 0 ? (
              <div className="p-10 border-2 border-dashed rounded-3xl text-center text-muted-foreground text-sm">
                لا توجد تقييمات بعد
              </div>
            ) : (
              user.reviews.map(review => (
                <div key={review.id} className="bg-card border border-border rounded-[2rem] p-6 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{review.author.name}</span>
                    <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded-lg">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs font-bold text-yellow-600">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}