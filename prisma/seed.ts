import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const db = new PrismaClient()

// ── Helpers ──────────────────────────────────────────────────────
function rand<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function pickMany<T>(arr: T[], count: number): T[] {
  const copy = [...arr]
  const out: T[] = []
  for (let i = 0; i < count && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length)
    out.push(copy.splice(idx, 1)[0])
  }
  return out
}
function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

const REVIEW_COMMENTS = [
  "Excellent travail, je recommande vivement ! Livraison rapide et qualité au top.",
  "Très professionnel, a bien compris mes besoins dès le premier échange.",
  "خدمة ممتازة وسريعة، تواصل رائع وفهم جيد للمطلوب. أنصح به بشدة.",
  "العمل كان احترافي جداً، التزام بالمواعيد وجودة عالية. شكراً جزيلاً!",
  "Great communication and fast delivery, exactly what I asked for. Will hire again.",
  "Amazing quality for the price, definitely worth it. Five stars!",
  "Bon rapport qualité-prix, quelques retouches nécessaires mais résultat final satisfaisant.",
  "تجربة جيدة بشكل عام، كان هناك تأخير بسيط لكن النتيجة كانت تستحق الانتظار.",
  "Service impeccable du début à la fin, je n'ai rien à redire.",
  "Solid work, responsive freelancer, would recommend to anyone in need of this service.",
  "تعامل راقي واحترافية في العمل، النتيجة فاقت توقعاتي.",
  "Pas mal, mais la communication aurait pu être plus rapide. Le résultat reste correct.",
  "Outstanding! Delivered ahead of schedule with extra revisions included for free.",
  "العمل جيد ومناسب للسعر المطلوب، سأطلب مجدداً في المستقبل.",
  "Très satisfait du résultat final, freelance à l'écoute et patient avec mes demandes.",
]

const ORDER_STATUSES = ["PENDING", "IN_PROGRESS", "REVISION", "DELIVERED", "COMPLETED", "CANCELLED"] as const

async function main() {
  console.log("🧹 Deep cleaning database...")
  await db.review.deleteMany({})
  await db.order.deleteMany({})
  await db.package.deleteMany({})
  await db.service.deleteMany({})
  await db.subCategory.deleteMany({})
  await db.category.deleteMany({})
  await db.user.deleteMany({})

  console.log("🌱 Creating Users...")
  const pass = await bcrypt.hash("pass123", 10)
  const adminPw = await bcrypt.hash("admin123", 10)
  const clientPw = await bcrypt.hash("client123", 10)

  const admin = await db.user.create({ data: { name: "Admin BrandDZ", email: "admin@branddz.dz", passwordHash: adminPw, role: "ADMIN" }})

  // ── Clients (buyers) ─────────────────────────────────────────
  const clientSeed = [
    { name: "Ahmed Client", email: "client@branddz.dz", bio: "Propriétaire d'une petite entreprise de e-commerce à Alger." },
    { name: "Yasmine Boutique", email: "yasmine.boutique@branddz.dz", bio: "Gérante d'une boutique de vêtements en ligne, Oran." },
    { name: "Mohamed Trade", email: "mohamed.trade@branddz.dz", bio: "Importateur et distributeur basé à Constantine." },
    { name: "Lina StartUp", email: "lina.startup@branddz.dz", bio: "Co-fondatrice d'une startup tech à Alger." },
    { name: "Omar Restaurant", email: "omar.restaurant@branddz.dz", bio: "Propriétaire de restaurant cherchant à développer sa présence en ligne." },
    { name: "Imane Agency", email: "imane.agency@branddz.dz", bio: "وكالة تسويق صغيرة تبحث عن مستقلين موهوبين." },
    { name: "Bilal Auto", email: "bilal.auto@branddz.dz", bio: "Concessionnaire automobile à Sétif, besoin de contenu marketing." },
    { name: "Hana Cosmetics", email: "hana.cosmetics@branddz.dz", bio: "Marque de cosmétiques naturels, en pleine croissance." },
    { name: "Riad Immo", email: "riad.immo@branddz.dz", bio: "Agence immobilière basée à Annaba." },
    { name: "Sofia Events", email: "sofia.events@branddz.dz", bio: "Organisatrice d'événements et de mariages." },
  ]
  const clients = []
  for (const c of clientSeed) {
    const u = await db.user.create({ data: { name: c.name, email: c.email, passwordHash: clientPw, role: "CLIENT", bio: c.bio }})
    clients.push(u)
  }
  const clientUser = clients[0]

  // ── Freelancers ──────────────────────────────────────────────
  const freelancerSeed = [
    { name: "Karim Designs", email: "karim@branddz.dz", bio: "Designer graphique avec 6 ans d'expérience. Spécialiste logos & branding." },
    { name: "Sara Marketing", email: "sara@branddz.dz", bio: "Experte marketing digital & réseaux sociaux. +200 campagnes réussies." },
    { name: "Amine Dev", email: "amine@branddz.dz", bio: "Développeur web full-stack. React, Next.js, Node.js." },
    { name: "Nadia Video", email: "nadia@branddz.dz", bio: "Monteuse vidéo professionnelle. Spécialiste Reels & contenu TikTok." },
    { name: "Youcef Photo", email: "youcef@branddz.dz", bio: "Photographe professionnel basé à Alger. Produits, portraits, événements." },
    { name: "Leila Branding", email: "leila@branddz.dz", bio: "مصممة هوية بصرية، أساعد العلامات التجارية على التميز بصرياً." },
    { name: "Walid SEO", email: "walid@branddz.dz", bio: "SEO specialist helping Algerian businesses rank #1 on Google." },
    { name: "Meriem Social", email: "meriem@branddz.dz", bio: "مديرة حسابات سوشيال ميديا، خبرة 4 سنوات في إدارة المحتوى." },
    { name: "Hicham Studio", email: "hicham@branddz.dz", bio: "Vidéaste & monteur, j'aide les marques à raconter leur histoire." },
    { name: "Dounia Voice", email: "dounia@branddz.dz", bio: "Voix-off professionnelle arabe et française, 8 ans d'expérience." },
    { name: "Reda Pixel", email: "reda@branddz.dz", bio: "UI/UX designer & développeur front-end passionné par le détail." },
    { name: "Fatima UGC", email: "fatima@branddz.dz", bio: "Créatrice de contenu UGC, collaboration avec +50 marques DZ." },
    { name: "Anis Photography", email: "anis@branddz.dz", bio: "Photographe culinaire et produit, basé à Oran." },
    { name: "Sabrina Ads", email: "sabrina@branddz.dz", bio: "Spécialiste Meta Ads & Google Ads, ROI garanti pour vos campagnes." },
    { name: "Tarek Webdev", email: "tarek@branddz.dz", bio: "مطور مواقع متخصص في المتاجر الإلكترونية والصفحات السريعة." },
    { name: "Asma Illustration", email: "asma@branddz.dz", bio: "Illustratrice freelance, identité visuelle et character design." },
    { name: "Yacine Motion", email: "yacine@branddz.dz", bio: "Motion designer, animations 2D pour réseaux sociaux et publicités." },
    { name: "Khadija Copy", email: "khadija@branddz.dz", bio: "Rédactrice de contenu et copywriter bilingue (FR/AR)." },
  ]
  const freelancers = []
  for (const f of freelancerSeed) {
    const u = await db.user.create({ data: { name: f.name, email: f.email, passwordHash: pass, role: "FREELANCER", bio: f.bio }})
    freelancers.push(u)
  }

  // ── Categories & Subcategories ──────────────────────────────
  const cats = [
    { name: "Design", nameAr: "التصميم", slug: "design", icon: "Palette", color: "#8b5cf6", order: 1, img: "https://images.unsplash.com/photo-1626785774573-4b799315345d",
      description: "Logos, identité visuelle, supports imprimés et tout ce qui touche au design graphique.",
      subs: [
        { name: "Logo Design", nameAr: "تصميم الشعار", slug: "logo", icon: "Star", order: 1 },
        { name: "Business Card", nameAr: "بطاقة العمل", slug: "business-card", icon: "CreditCard", order: 2 },
        { name: "Social Media", nameAr: "سوشيال ميديا", slug: "social-media", icon: "Share2", order: 3 },
        { name: "Flyer & Brochure", nameAr: "فلاير وبروشور", slug: "flyer", icon: "FileText", order: 4 },
        { name: "Packaging Design", nameAr: "تصميم التغليف", slug: "packaging", icon: "Box", order: 5 },
        { name: "Brand Identity", nameAr: "الهوية البصرية", slug: "brand-identity", icon: "Sparkles", order: 6 },
      ]},
    { name: "Marketing", nameAr: "التسويق", slug: "marketing", icon: "Megaphone", color: "#f59e0b", order: 2, img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      description: "Campagnes publicitaires, gestion de comptes et stratégies pour développer votre audience.",
      subs: [
        { name: "Sponsor & Ads", nameAr: "إعلانات ممولة", slug: "sponsor-ads", icon: "Megaphone", order: 1 },
        { name: "Account Management", nameAr: "إدارة حسابات", slug: "account-mgmt", icon: "Users", order: 2 },
        { name: "SEO", nameAr: "تحسين SEO", slug: "seo", icon: "Search", order: 3 },
        { name: "Email Marketing", nameAr: "تسويق بالبريد", slug: "email-marketing", icon: "Mail", order: 4 },
        { name: "Influencer Outreach", nameAr: "التسويق بالمؤثرين", slug: "influencer", icon: "Users2", order: 5 },
      ]},
    { name: "Video", nameAr: "المونتاج", slug: "video", icon: "Video", color: "#ef4444", order: 3, img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d",
      description: "Montage vidéo, contenu pour réseaux sociaux et animations pour vos campagnes.",
      subs: [
        { name: "Video Editing", nameAr: "مونتاج فيديو", slug: "editing", icon: "Scissors", order: 1 },
        { name: "Reels & Shorts", nameAr: "ريلز وشورتس", slug: "reels", icon: "PlayCircle", order: 2 },
        { name: "Motion Graphics", nameAr: "موشن غرافيك", slug: "motion-graphics", icon: "Sparkles", order: 3 },
        { name: "YouTube Intro/Outro", nameAr: "مقدمة ونهاية يوتيوب", slug: "youtube-intro", icon: "Youtube", order: 4 },
      ]},
    { name: "Photography", nameAr: "التصوير", slug: "photography", icon: "Camera", color: "#06b6d4", order: 4, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
      description: "Photographie professionnelle pour produits, portraits et événements.",
      subs: [
        { name: "Product Photography", nameAr: "تصوير منتجات", slug: "product", icon: "Package", order: 1 },
        { name: "Portrait", nameAr: "بورتريه", slug: "portrait", icon: "User", order: 2 },
        { name: "Event Photography", nameAr: "تصوير فعاليات", slug: "events", icon: "CalendarHeart", order: 3 },
        { name: "Food Photography", nameAr: "تصوير طعام", slug: "food", icon: "Utensils", order: 4 },
      ]},
    { name: "Web Dev", nameAr: "تطوير الويب", slug: "web-dev", icon: "Code2", color: "#3b82f6", order: 5, img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
      description: "Sites web, boutiques en ligne et applications sur mesure pour votre activité.",
      subs: [
        { name: "Landing Page", nameAr: "صفحة هبوط", slug: "landing", icon: "Globe", order: 1 },
        { name: "E-Commerce", nameAr: "متجر إلكتروني", slug: "ecommerce", icon: "ShoppingCart", order: 2 },
        { name: "WordPress", nameAr: "وردبريس", slug: "wordpress", icon: "Layout", order: 3 },
        { name: "Web App", nameAr: "تطبيق ويب", slug: "web-app", icon: "AppWindow", order: 4 },
      ]},
    { name: "UGC", nameAr: "UGC", slug: "ugc", icon: "Smartphone", color: "#ec4899", order: 6, img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0",
      description: "Contenu généré par utilisateurs : avis produits, vidéos authentiques et unboxing.",
      subs: [
        { name: "UGC Videos", nameAr: "فيديوهات UGC", slug: "videos", icon: "Video", order: 1 },
        { name: "Product Reviews", nameAr: "مراجعات منتجات", slug: "reviews", icon: "Star", order: 2 },
        { name: "Unboxing", nameAr: "فتح الصناديق", slug: "unboxing", icon: "PackageOpen", order: 3 },
      ]},
    { name: "Voiceover", nameAr: "التعليق الصوتي", slug: "voiceover", icon: "Mic", color: "#10b981", order: 7, img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc",
      description: "Voix-off professionnelle en arabe, français et anglais pour tous vos projets.",
      subs: [
        { name: "Arabic Voiceover", nameAr: "تعليق عربي", slug: "arabic", icon: "Mic", order: 1 },
        { name: "French Voiceover", nameAr: "تعليق فرنسي", slug: "french", icon: "Mic2", order: 2 },
        { name: "English Voiceover", nameAr: "تعليق إنجليزي", slug: "english", icon: "Mic2", order: 3 },
      ]},
    { name: "Writing", nameAr: "الكتابة", slug: "writing", icon: "PenTool", color: "#a855f7", order: 8, img: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
      description: "Rédaction, traduction et création de contenu écrit pour votre marque.",
      subs: [
        { name: "Copywriting", nameAr: "كتابة إعلانية", slug: "copywriting", icon: "PenTool", order: 1 },
        { name: "Translation", nameAr: "ترجمة", slug: "translation", icon: "Languages", order: 2 },
        { name: "Blog Articles", nameAr: "مقالات بلوغ", slug: "blog", icon: "Newspaper", order: 3 },
      ]},
  ]

  const SERVICE_TITLES_FR = [
    "Service professionnel de {sub}",
    "Je vais créer un {sub} de qualité premium",
    "{sub} sur mesure pour votre entreprise",
    "Solution complète de {sub}",
    "{sub} rapide et professionnel",
  ]
  const SERVICE_TITLES_EN = [
    "Professional {sub} service",
    "I will design a premium {sub} for you",
    "Custom {sub} tailored to your brand",
    "Fast & reliable {sub} delivery",
    "High quality {sub} for your business",
  ]
  const SERVICE_DESC_TEMPLATES = [
    (subName: string) => `Besoin d'un travail de qualité ? Je suis là pour vous aider avec un service professionnel de ${subName}.\n\n✅ Livraison rapide\n✅ Satisfaction garantie\n✅ Support 24/7\n✅ Révisions illimitées sur demande\n\nN'hésitez pas à me contacter avant de commander pour discuter de votre projet !`,
    (subName: string) => `Looking for top-notch ${subName}? You're in the right place. With years of hands-on experience, I deliver work that's polished, on-brand, and on time.\n\n✔ Fast turnaround\n✔ Unlimited revisions on Premium\n✔ Source files included\n✔ Friendly, responsive communication\n\nMessage me before ordering so we can align on your vision!`,
    (subName: string) => `أقدم لكم خدمة ${subName} باحترافية عالية وبأسعار تنافسية تناسب جميع الميزانيات.\n\n✅ تسليم سريع في الوقت المحدد\n✅ جودة مضمونة 100%\n✅ تعديلات مجانية حسب الباقة\n✅ تواصل مستمر طوال فترة العمل\n\nلا تترددوا في التواصل معي قبل الطلب لمناقشة تفاصيل مشروعكم!`,
  ]

  const TAG_POOL = [
    "rapide", "professionnel", "premium", "qualité", "créatif", "moderne",
    "fast delivery", "high quality", "creative", "modern", "affordable",
    "احترافي", "سريع", "إبداعي", "جودة عالية", "حصري",
  ]

  const subMap: Record<string, string> = {}
  const allServices: { id: string; price: number; sellerId: string; packages: { id: string; price: number }[] }[] = []

  for (const cat of cats) {
    const createdCat = await db.category.create({ data: { name: cat.name, nameAr: cat.nameAr, slug: cat.slug, icon: cat.icon, color: cat.color, order: cat.order, description: cat.description }})
    for (const sub of cat.subs) {
      const createdSub = await db.subCategory.create({ data: { name: sub.name, nameAr: sub.nameAr, slug: sub.slug, icon: sub.icon, order: sub.order, categoryId: createdCat.id }})
      subMap[`${cat.slug}/${sub.slug}`] = createdSub.id

      // For EACH Subcategory, generate a handful of services across different freelancers
      const servicesForSub = randInt(6, 8)
      const sellersForSub = pickMany(freelancers, Math.min(servicesForSub, freelancers.length))

      for (let i = 1; i <= servicesForSub; i++) {
        const seller = sellersForSub[i % sellersForSub.length] || rand(freelancers)
        const price = (Math.floor(Math.random() * 16) + 4) * 500 // 2000 - 9500 DA

        const titleTemplate = i % 2 === 0 ? rand(SERVICE_TITLES_FR) : rand(SERVICE_TITLES_EN)
        const title = titleTemplate.replace("{sub}", sub.name)
        const descFn = rand(SERVICE_DESC_TEMPLATES)

        const reviewCount = randInt(8, 96)
        const tags = pickMany(TAG_POOL, randInt(2, 4))
        const service = await db.service.create({
          data: {
            sellerId: seller.id,
            subCategoryId: createdSub.id,
            title: title,
            titleAr: `خدمة ${sub.nameAr} احترافية - نسخة ${i}`,
            description: descFn(sub.name),
            price: price,
            deliveryDays: rand([1, 2, 3, 5, 7]),
            revisions: rand([1, 2, 3, 5]),
            isActive: Math.random() > 0.07, // a few inactive/paused services for realism
            images: [
              `${cat.img}?q=80&w=1000&auto=format&fit=crop`,
              `${cat.img}?q=80&w=800&auto=format&fit=crop&sat=-50`,
            ],
            tags: tags,
            rating: Math.round((4.2 + Math.random() * 0.8) * 10) / 10,
            reviewCount: reviewCount,
          }
        })

        const createdPackages = await Promise.all([
          db.package.create({ data: { serviceId: service.id, name: "Basique", price: price, description: "Offre standard, idéale pour démarrer.", deliveryDays: 5, revisions: 1, features: ["Qualité HD", "1 concept initial"] } }),
          db.package.create({ data: { serviceId: service.id, name: "Standard", price: Math.round(price * 1.8), description: "العرض الأكثر طلباً، توازن بين السعر والجودة.", deliveryDays: 3, revisions: 3, features: ["Fichiers sources", "2 concepts", "Support prioritaire"] } }),
          db.package.create({ data: { serviceId: service.id, name: "Premium", price: price * 3, description: "Full premium package with everything included.", deliveryDays: 2, revisions: 99, features: ["Fichiers sources", "Priorité absolue", "3 concepts", "Appel vidéo inclus"] } }),
        ])

        allServices.push({ id: service.id, price: price, sellerId: seller.id, packages: createdPackages.map(p => ({ id: p.id, price: p.price })) })
      }
    }
  }

  console.log(`✅ Created ${allServices.length} services across ${cats.length} categories.`)

  // ── Orders ───────────────────────────────────────────────────
  console.log("🛒 Creating Orders...")
  const REQUIREMENTS_SAMPLES = [
    "J'aimerais un style moderne et minimaliste, avec des couleurs bleu et blanc si possible.",
    "أحتاج العمل في أسرع وقت ممكن، الميزانية محدودة فضلاً خذ ذلك بعين الاعتبار.",
    "Please use a clean, professional tone. I'll share brand guidelines after you accept.",
    "Le logo doit représenter une boutique de vêtements pour femmes, ambiance chic.",
    "أرغب في نسخة عربية وفرنسية من العمل، مع إمكانية التعديل بعد التسليم الأول.",
    "Looking for something bold and eye-catching, this is for a social media campaign.",
  ]
  let ordersCreated = 0
  const completedOrdersForReview: { serviceId: string; clientId: string; sellerId: string; orderId: string }[] = []

  for (const svc of allServices) {
    const numOrders = randInt(2, 6)
    for (let j = 0; j < numOrders; j++) {
      const buyer = rand(clients)
      const status = rand(ORDER_STATUSES)
      const createdAt = daysAgo(randInt(1, 180))

      // Most orders reference one of the service's packages, mirroring real checkout flow
      const usePackage = Math.random() > 0.1 && svc.packages.length > 0
      const chosenPackage = usePackage ? rand(svc.packages) : null
      const requirements = Math.random() > 0.4 ? rand(REQUIREMENTS_SAMPLES) : null

      const order = await db.order.create({
        data: {
          serviceId: svc.id,
          buyerId: buyer.id,
          packageId: chosenPackage ? chosenPackage.id : null,
          totalPrice: chosenPackage ? chosenPackage.price : svc.price,
          status: status,
          requirements: requirements,
          createdAt: createdAt,
        }
      })
      ordersCreated++

      if (status === "COMPLETED") {
        completedOrdersForReview.push({ serviceId: svc.id, clientId: buyer.id, sellerId: svc.sellerId, orderId: order.id })
      }
    }
  }
  console.log(`✅ Created ${ordersCreated} orders.`)

  // ── Reviews ──────────────────────────────────────────────────
  console.log("⭐ Creating Reviews...")
  let reviewsCreated = 0
  // Roughly 70% of completed orders get a review, to feel organic
  for (const co of completedOrdersForReview) {
    if (Math.random() > 0.3) {
      await db.review.create({
        data: {
          serviceId: co.serviceId,
          authorId: co.clientId,
          orderId: co.orderId,
          rating: rand([3, 4, 4, 5, 5, 5]), // weighted towards good ratings, like real marketplaces
          comment: rand(REVIEW_COMMENTS),
          createdAt: daysAgo(randInt(0, 150)),
        }
      })
      reviewsCreated++
    }
  }
  console.log(`✅ Created ${reviewsCreated} reviews.`)

  console.log("🎉 Site BrandDZ is now FULL with rich, multilingual demo data!")
  console.log(`   👤 Users: ${1 + clients.length + freelancers.length} (1 admin, ${clients.length} clients, ${freelancers.length} freelancers)`)
  console.log(`   🗂️  Categories: ${cats.length}`)
  console.log(`   🧩 Services: ${allServices.length}`)
  console.log(`   🛒 Orders: ${ordersCreated}`)
  console.log(`   ⭐ Reviews: ${reviewsCreated}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
