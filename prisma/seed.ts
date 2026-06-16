import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
const db = new PrismaClient()

async function main() {
  console.log("🌱 Seeding…")

  // ── Users ─────────────────────────────────────────────────────
  const adminPw = await bcrypt.hash("admin123", 10)
  const admin = await db.user.upsert({ where: { email: "admin@serviz.dz" }, update: {}, create: {
    name: "Admin Serviz", email: "admin@serviz.dz", passwordHash: adminPw, role: "ADMIN" }})

  const freelancers = await Promise.all([
    db.user.upsert({ where: { email: "karim@serviz.dz" }, update: {}, create: {
      name: "Karim Designs", email: "karim@serviz.dz",
      passwordHash: await bcrypt.hash("pass123", 10), role: "FREELANCER",
      bio: "Designer graphique avec 6 ans d'expérience. Spécialiste logos & branding." }}),
    db.user.upsert({ where: { email: "sara@serviz.dz" }, update: {}, create: {
      name: "Sara Marketing", email: "sara@serviz.dz",
      passwordHash: await bcrypt.hash("pass123", 10), role: "FREELANCER",
      bio: "Experte marketing digital & réseaux sociaux. +200 campagnes réussies." }}),
    db.user.upsert({ where: { email: "amine@serviz.dz" }, update: {}, create: {
      name: "Amine Dev", email: "amine@serviz.dz",
      passwordHash: await bcrypt.hash("pass123", 10), role: "FREELANCER",
      bio: "Développeur web full-stack. React, Next.js, Node.js." }}),
    db.user.upsert({ where: { email: "nadia@serviz.dz" }, update: {}, create: {
      name: "Nadia Video", email: "nadia@serviz.dz",
      passwordHash: await bcrypt.hash("pass123", 10), role: "FREELANCER",
      bio: "Monteuse vidéo professionnelle. Spécialiste Reels & contenu TikTok." }}),
    db.user.upsert({ where: { email: "youcef@serviz.dz" }, update: {}, create: {
      name: "Youcef Photo", email: "youcef@serviz.dz",
      passwordHash: await bcrypt.hash("pass123", 10), role: "FREELANCER",
      bio: "Photographe professionnel basé à Alger. Produits, portraits, événements." }}),
  ])

  const client = await db.user.upsert({ where: { email: "client@serviz.dz" }, update: {}, create: {
    name: "Ahmed Client", email: "client@serviz.dz",
    passwordHash: await bcrypt.hash("client123", 10), role: "CLIENT" }})

  // ── Categories ────────────────────────────────────────────────
  const cats = [
    { name: "Design", nameAr: "التصميم", slug: "design", icon: "Palette", color: "#8b5cf6", order: 1,
      description: "Logos, identité visuelle, supports marketing",
      subs: [
        { name: "Logo Design", nameAr: "تصميم الشعار", slug: "logo", icon: "Star", order: 1 },
        { name: "Business Card", nameAr: "بطاقة العمل", slug: "business-card", icon: "CreditCard", order: 2 },
        { name: "Social Media", nameAr: "سوشيال ميديا", slug: "social-media", icon: "Share2", order: 3 },
        { name: "Flyer & Brochure", nameAr: "فلاير وبروشور", slug: "flyer", icon: "FileText", order: 4 },
        { name: "Menu Design", nameAr: "تصميم المنيو", slug: "menu", icon: "BookOpen", order: 5 },
        { name: "Banner & Affiche", nameAr: "بانر وأفيش", slug: "banner", icon: "Image", order: 6 },
      ]},
    { name: "Marketing", nameAr: "التسويق", slug: "marketing", icon: "Megaphone", color: "#f59e0b", order: 2,
      description: "Campagnes pub, SEO, gestion réseaux sociaux",
      subs: [
        { name: "Sponsor & Ads", nameAr: "سبونسور وإعلانات", slug: "sponsor-ads", icon: "Megaphone", order: 1 },
        { name: "Account Management", nameAr: "إدارة حسابات", slug: "account-mgmt", icon: "Users", order: 2 },
        { name: "SEO", nameAr: "تحسين SEO", slug: "seo", icon: "Search", order: 3 },
        { name: "Email Marketing", nameAr: "تسويق بريدي", slug: "email", icon: "Mail", order: 4 },
        { name: "Content Creation", nameAr: "إنتاج محتوى", slug: "content", icon: "PenTool", order: 5 },
      ]},
    { name: "Video", nameAr: "المونتاج", slug: "video", icon: "Video", color: "#ef4444", order: 3,
      description: "Montage, Reels, motion graphics",
      subs: [
        { name: "Video Editing", nameAr: "مونتاج فيديو", slug: "editing", icon: "Scissors", order: 1 },
        { name: "Reels & Shorts", nameAr: "ريلز وشورتس", slug: "reels", icon: "PlayCircle", order: 2 },
        { name: "Motion Graphics", nameAr: "موشن جرافيك", slug: "motion", icon: "Film", order: 3 },
        { name: "Intro & Outro", nameAr: "إنترو وأوترو", slug: "intro", icon: "Play", order: 4 },
      ]},
    { name: "Photography", nameAr: "التصوير", slug: "photography", icon: "Camera", color: "#06b6d4", order: 4,
      description: "Photos produits, portraits, événements",
      subs: [
        { name: "Product Photography", nameAr: "تصوير منتجات", slug: "product", icon: "Package", order: 1 },
        { name: "Portrait", nameAr: "بورتريه", slug: "portrait", icon: "User", order: 2 },
        { name: "Event Photography", nameAr: "تصوير فعاليات", slug: "events", icon: "Calendar", order: 3 },
        { name: "Food Photography", nameAr: "تصوير طعام", slug: "food", icon: "UtensilsCrossed", order: 4 },
      ]},
    { name: "Web Dev", nameAr: "تطوير الويب", slug: "web-dev", icon: "Code2", color: "#3b82f6", order: 5,
      description: "Sites web, landing pages, e-commerce",
      subs: [
        { name: "Landing Page", nameAr: "صفحة هبوط", slug: "landing", icon: "Globe", order: 1 },
        { name: "E-Commerce", nameAr: "متجر إلكتروني", slug: "ecommerce", icon: "ShoppingCart", order: 2 },
        { name: "Full Website", nameAr: "موقع كامل", slug: "full-site", icon: "Layout", order: 3 },
        { name: "Bug Fixing", nameAr: "إصلاح أخطاء", slug: "bug-fix", icon: "Bug", order: 4 },
      ]},
    { name: "UGC", nameAr: "UGC", slug: "ugc", icon: "Smartphone", color: "#ec4899", order: 6,
      description: "Contenu UGC authentique pour vos produits",
      subs: [
        { name: "UGC Videos", nameAr: "فيديوهات UGC", slug: "videos", icon: "Video", order: 1 },
        { name: "Product Reviews", nameAr: "مراجعات منتجات", slug: "reviews", icon: "Star", order: 2 },
        { name: "Unboxing", nameAr: "فتح علب", slug: "unboxing", icon: "Package", order: 3 },
      ]},
    { name: "Voiceover", nameAr: "التعليق الصوتي", slug: "voiceover", icon: "Mic", color: "#10b981", order: 7,
      description: "Voix off arabe, française, anglaise",
      subs: [
        { name: "Arabic Voiceover", nameAr: "تعليق عربي", slug: "arabic", icon: "Mic", order: 1 },
        { name: "French Voiceover", nameAr: "تعليق فرنسي", slug: "french", icon: "Mic2", order: 2 },
        { name: "Commercial", nameAr: "إعلاني", slug: "commercial", icon: "Radio", order: 3 },
      ]},
    { name: "L'Impression", nameAr: "الطباعة", slug: "impression", icon: "Printer", color: "#64748b", order: 8,
      description: "Impression professionnelle — bientôt disponible", comingSoon: true, subs: [] },
  ]

  const categoryMap: Record<string, string> = {}
  const subMap: Record<string, string> = {}

  for (const cat of cats) {
    const { subs, ...catData } = cat
    const created = await db.category.upsert({
      where: { slug: cat.slug }, update: {}, create: { ...catData, comingSoon: cat.comingSoon ?? false }
    })
    categoryMap[cat.slug] = created.id
    for (const sub of subs) {
      const s = await db.subCategory.upsert({
        where: { categoryId_slug: { categoryId: created.id, slug: sub.slug } },
        update: {}, create: { ...sub, categoryId: created.id }
      })
      subMap[`${cat.slug}/${sub.slug}`] = s.id
    }
  }

  // ── Services ─────────────────────────────────────────────────
  const services = [
    // DESIGN
    { sellerId: freelancers[0].id, sub: "design/logo", title: "Je vais créer votre logo professionnel", titleAr: "سأصمم لك شعاراً احترافياً يعكس هويتك",
      description: "Création d'un logo professionnel et mémorable pour votre marque. Je livre des fichiers vectoriels (AI, SVG, PDF) et rasters (PNG, JPG) en haute résolution.\n\n✅ 3 concepts initiaux\n✅ Révisions illimitées dans le package Premium\n✅ Charte graphique incluse (couleurs, typographie)\n✅ Propriété totale des droits transmise",
      price: 3500, deliveryDays: 5, revisions: 3, rating: 4.9, reviewCount: 47,
      tags: ["logo", "design", "branding", "شعار"],
      packages: [
        { name: "Basique", price: 3500, description: "1 concept, fichiers PNG/JPG", deliveryDays: 5, revisions: 2, features: ["1 concept logo", "Fichiers PNG & JPG", "2 révisions"] },
        { name: "Standard", price: 7000, description: "3 concepts, vecteurs inclus", deliveryDays: 4, revisions: 4, features: ["3 concepts logo", "Fichiers vectoriels (AI/SVG)", "4 révisions", "Déclinaisons couleur"] },
        { name: "Premium", price: 12000, description: "Identité visuelle complète", deliveryDays: 7, revisions: 10, features: ["3 concepts logo", "Identité visuelle complète", "Charte graphique", "Révisions illimitées", "Fichiers sources"] },
      ]},
    { sellerId: freelancers[0].id, sub: "design/social-media", title: "Je vais créer vos visuels réseaux sociaux", titleAr: "سأصمم تصاميم احترافية لسوشيال ميديا",
      description: "Pack de visuels professionnels pour Instagram, Facebook et LinkedIn. Chaque design est optimisé pour l'engagement et respecte votre charte graphique.\n\n✅ Templates réutilisables\n✅ Format Stories + Posts\n✅ Retouches selon vos retours",
      price: 2500, deliveryDays: 3, revisions: 2, rating: 4.8, reviewCount: 31,
      tags: ["social media", "instagram", "design", "سوشيال"],
      packages: [
        { name: "Basique", price: 2500, description: "5 visuels Instagram/Facebook", deliveryDays: 3, revisions: 2, features: ["5 visuels posts", "Format 1080x1080", "2 révisions"] },
        { name: "Standard", price: 5000, description: "10 visuels + Stories", deliveryDays: 4, revisions: 3, features: ["10 visuels posts", "5 Stories", "3 révisions", "Templates editables"] },
        { name: "Premium", price: 9000, description: "Pack mensuel complet 30 visuels", deliveryDays: 7, revisions: 5, features: ["30 visuels", "Stories + Reels covers", "Révisions illimitées", "Fichiers sources Canva/PSD"] },
      ]},
    { sellerId: freelancers[0].id, sub: "design/flyer", title: "Je vais créer vos flyers et affiches pro", titleAr: "سأصمم فلايرات وملصقات احترافية",
      description: "Design de flyers, affiches et brochures de haute qualité, prêts à l'impression. Idéal pour événements, restaurants, boutiques.\n\n✅ Format A4/A5 ou personnalisé\n✅ Fichier PDF haute résolution 300dpi\n✅ Prêt pour impression",
      price: 2000, deliveryDays: 2, revisions: 2, rating: 4.7, reviewCount: 22,
      tags: ["flyer", "affiche", "impression", "فلاير"],
      packages: [
        { name: "Basique", price: 2000, description: "1 flyer recto", deliveryDays: 2, revisions: 2, features: ["1 flyer recto", "Format A5", "PDF 300dpi"] },
        { name: "Standard", price: 3500, description: "Flyer recto-verso", deliveryDays: 3, revisions: 3, features: ["Flyer recto-verso", "Format au choix", "PDF + JPG HD", "3 révisions"] },
      ]},
    // MARKETING
    { sellerId: freelancers[1].id, sub: "marketing/sponsor-ads", title: "Je vais créer et gérer vos publicités Facebook & Instagram", titleAr: "سأنشئ وأدير حملاتك الإعلانية على فيسبوك وإنستغرام",
      description: "Configuration et gestion de vos campagnes publicitaires Meta (Facebook & Instagram) pour maximiser votre ROI. Ciblage précis de l'audience algérienne.\n\n✅ Configuration du Pixel Meta\n✅ Création des visuels publicitaires\n✅ Rapport de performance hebdomadaire\n✅ Optimisation continue",
      price: 8000, deliveryDays: 3, revisions: 2, rating: 4.9, reviewCount: 58,
      tags: ["facebook ads", "instagram", "publicité", "إعلانات"],
      packages: [
        { name: "Basique", price: 8000, description: "1 campagne, 1 mois", deliveryDays: 3, revisions: 2, features: ["1 campagne publicitaire", "Ciblage audience", "2 visuels ads", "Rapport mensuel"] },
        { name: "Standard", price: 15000, description: "3 campagnes, optimisation", deliveryDays: 3, revisions: 3, features: ["3 campagnes", "A/B testing", "5 visuels ads", "Rapports hebdomadaires", "Pixel Meta configuré"] },
        { name: "Premium", price: 28000, description: "Gestion complète 3 mois", deliveryDays: 2, revisions: 5, features: ["Campagnes illimitées", "Retargeting", "10 visuels/mois", "Rapport quotidien", "Support WhatsApp 7j/7"] },
      ]},
    { sellerId: freelancers[1].id, sub: "marketing/account-mgmt", title: "Je vais gérer vos réseaux sociaux professionnellement", titleAr: "سأتولى إدارة حسابات التواصل الاجتماعي الخاصة بك",
      description: "Gestion complète de votre présence sur les réseaux sociaux: création de contenu, planification, interaction avec votre communauté et croissance organique.\n\n✅ Planning éditorial mensuel\n✅ Création de contenu (visuels + textes)\n✅ Réponse aux commentaires & DMs\n✅ Statistiques mensuelles",
      price: 12000, deliveryDays: 7, revisions: 3, rating: 4.8, reviewCount: 34,
      tags: ["réseaux sociaux", "community manager", "contenu", "إدارة"],
      packages: [
        { name: "Basique", price: 12000, description: "1 réseau, 12 posts/mois", deliveryDays: 7, revisions: 2, features: ["1 réseau social", "12 posts/mois", "Visuels inclus", "Statistiques mensuelles"] },
        { name: "Standard", price: 22000, description: "2 réseaux, 20 posts/mois", deliveryDays: 5, revisions: 3, features: ["2 réseaux sociaux", "20 posts/mois", "Stories incluses", "Gestion commentaires", "Rapport bimensuel"] },
        { name: "Premium", price: 38000, description: "3 réseaux, gestion complète", deliveryDays: 3, revisions: 5, features: ["3 réseaux", "Posts illimités", "Reels/TikTok", "Support 7j/7", "Croissance abonnés garantie"] },
      ]},
    { sellerId: freelancers[1].id, sub: "marketing/seo", title: "Je vais optimiser votre site pour le SEO en Algérie", titleAr: "سأحسّن ظهور موقعك على محركات البحث",
      description: "Audit complet et optimisation SEO de votre site web pour dominer les résultats de recherche Google en Algérie et au Maghreb.\n\n✅ Audit technique SEO\n✅ Recherche de mots-clés stratégiques\n✅ Optimisation on-page\n✅ Rapport de positionnement",
      price: 6000, deliveryDays: 7, revisions: 2, rating: 4.7, reviewCount: 19,
      tags: ["SEO", "Google", "référencement", "سيو"],
      packages: [
        { name: "Basique", price: 6000, description: "Audit + recommandations", deliveryDays: 7, revisions: 1, features: ["Audit SEO complet", "10 mots-clés cibles", "Rapport PDF", "Recommandations prioritaires"] },
        { name: "Standard", price: 12000, description: "Audit + optimisation on-page", deliveryDays: 10, revisions: 2, features: ["Audit complet", "Optimisation on-page", "30 mots-clés", "Meta tags & structure", "Rapport mensuel"] },
      ]},
    // VIDEO
    { sellerId: freelancers[3].id, sub: "video/editing", title: "Je vais monter votre vidéo professionnellement", titleAr: "سأقوم بمونتاج فيديوهاتك باحترافية عالية",
      description: "Montage vidéo professionnel pour YouTube, Instagram, TikTok ou usage commercial. Colorisation, effets sonores, sous-titres et transitions inclus.\n\n✅ Colorisation cinématique\n✅ Effets sonores & musique\n✅ Sous-titres arabes/français\n✅ Export multi-formats",
      price: 3000, deliveryDays: 3, revisions: 2, rating: 4.9, reviewCount: 41,
      tags: ["montage", "vidéo", "youtube", "مونتاج"],
      packages: [
        { name: "Basique", price: 3000, description: "Jusqu'à 3 min", deliveryDays: 3, revisions: 2, features: ["Jusqu'à 3 min", "Colorisation", "Musique de fond", "2 révisions"] },
        { name: "Standard", price: 5500, description: "Jusqu'à 10 min", deliveryDays: 4, revisions: 3, features: ["Jusqu'à 10 min", "Effets & transitions", "Sous-titres", "3 révisions"] },
        { name: "Premium", price: 9500, description: "Jusqu'à 30 min, cinématique", deliveryDays: 6, revisions: 5, features: ["Jusqu'à 30 min", "Colorisation cinéma", "Motion graphics", "Sous-titres bilingues", "5 révisions"] },
      ]},
    { sellerId: freelancers[3].id, sub: "video/reels", title: "Je vais créer vos Reels & TikToks viraux", titleAr: "سأصنع لك ريلز وتيك توك احترافية وفيروسية",
      description: "Création de Reels Instagram et vidéos TikTok optimisés pour la viralité. Montage dynamique, transitions tendances et hooks accrocheurs.\n\n✅ Format 9:16 optimisé\n✅ Trends & effets actuels\n✅ Hook percutant les 3 premières secondes\n✅ Hashtags stratégiques inclus",
      price: 2000, deliveryDays: 2, revisions: 2, rating: 4.8, reviewCount: 62,
      tags: ["reels", "tiktok", "short", "ريلز"],
      packages: [
        { name: "Basique", price: 2000, description: "1 Reel jusqu'à 30s", deliveryDays: 2, revisions: 2, features: ["1 vidéo 30s", "Musique tendance", "Transitions", "2 révisions"] },
        { name: "Standard", price: 5500, description: "3 Reels, hooks optimisés", deliveryDays: 4, revisions: 3, features: ["3 vidéos", "Jusqu'à 60s chacune", "Hooks viraux", "Sous-titres", "3 révisions"] },
        { name: "Premium", price: 12000, description: "10 Reels pack mensuel", deliveryDays: 10, revisions: 5, features: ["10 vidéos/mois", "Stratégie contenu", "Hashtags recherchés", "Révisions illimitées"] },
      ]},
    // PHOTOGRAPHY
    { sellerId: freelancers[4].id, sub: "photography/product", title: "Je vais photographier vos produits professionnellement", titleAr: "سأصور منتجاتك باحترافية لزيادة مبيعاتك",
      description: "Séance photo professionnelle pour vos produits e-commerce, catalogue ou réseaux sociaux. Studio équipé à Alger, fond blanc ou ambiance.\n\n✅ Studio professionnel Alger-Centre\n✅ Retouche incluse (Lightroom/Photoshop)\n✅ Fond blanc ou ambiance au choix\n✅ Livraison HD en 48h",
      price: 5000, deliveryDays: 3, revisions: 2, rating: 4.9, reviewCount: 28,
      tags: ["photo", "produits", "e-commerce", "تصوير"],
      packages: [
        { name: "Basique", price: 5000, description: "5 produits, fond blanc", deliveryDays: 3, revisions: 2, features: ["5 produits", "Fond blanc", "3 angles/produit", "Retouche incluse", "HD 300dpi"] },
        { name: "Standard", price: 10000, description: "15 produits, ambiance", deliveryDays: 4, revisions: 3, features: ["15 produits", "Fond blanc + ambiance", "5 angles/produit", "Retouche avancée", "Livraison 48h"] },
        { name: "Premium", price: 18000, description: "30 produits, shooting complet", deliveryDays: 6, revisions: 5, features: ["30 produits", "Multi-fonds", "Lifestyle shots", "Retouche HD", "Droits commerciaux"] },
      ]},
    // WEB DEV
    { sellerId: freelancers[2].id, sub: "web-dev/landing", title: "Je vais créer votre landing page haute conversion", titleAr: "سأبني لك صفحة هبوط احترافية لزيادة التحويلات",
      description: "Création d'une landing page professionnelle, rapide et optimisée pour convertir vos visiteurs en clients. Design moderne, responsive et SEO-friendly.\n\n✅ Design sur-mesure (pas de template)\n✅ Optimisé mobile & desktop\n✅ Vitesse de chargement <2s\n✅ Formulaire de contact/conversion inclus",
      price: 15000, deliveryDays: 7, revisions: 3, rating: 4.8, reviewCount: 23,
      tags: ["landing page", "site web", "conversion", "موقع"],
      packages: [
        { name: "Basique", price: 15000, description: "Landing page 1 section", deliveryDays: 7, revisions: 2, features: ["1 page complète", "Design responsive", "Formulaire contact", "2 révisions"] },
        { name: "Standard", price: 28000, description: "Landing page multi-sections", deliveryDays: 10, revisions: 3, features: ["Multi-sections", "Animations", "Intégration CRM", "SEO on-page", "3 révisions"] },
        { name: "Premium", price: 45000, description: "Site complet 5 pages", deliveryDays: 14, revisions: 5, features: ["5 pages", "Blog/actualités", "Dashboard admin", "Hébergement 1 an", "Support 6 mois"] },
      ]},
    { sellerId: freelancers[2].id, sub: "web-dev/ecommerce", title: "Je vais créer votre boutique en ligne complète", titleAr: "سأبني متجرك الإلكتروني الاحترافي",
      description: "Développement d'une boutique e-commerce complète avec gestion des produits, panier, paiement et tableau de bord admin.\n\n✅ Next.js / Shopify selon votre budget\n✅ Paiement CIB & BaridiMob\n✅ Gestion des stocks\n✅ SEO produits inclus",
      price: 35000, deliveryDays: 14, revisions: 3, rating: 4.7, reviewCount: 15,
      tags: ["e-commerce", "boutique", "shopify", "متجر"],
      packages: [
        { name: "Standard", price: 35000, description: "Boutique 50 produits", deliveryDays: 14, revisions: 3, features: ["Jusqu'à 50 produits", "Panier & checkout", "Admin dashboard", "Paiement DZ", "3 révisions"] },
        { name: "Premium", price: 65000, description: "Boutique illimitée + app", deliveryDays: 21, revisions: 5, features: ["Produits illimités", "App mobile", "Intégration livraison", "Analytics avancé", "Support 1 an"] },
      ]},
    // UGC
    { sellerId: freelancers[3].id, sub: "ugc/videos", title: "Je vais créer du contenu UGC authentique pour votre produit", titleAr: "سأصنع محتوى UGC أصيلاً لمنتجك",
      description: "Création de vidéos UGC (User Generated Content) authentiques pour vos publicités et réseaux sociaux. Contenu naturel qui convertit mieux que les publicités classiques.\n\n✅ Style naturel & authentique\n✅ Script fourni ou personnalisé\n✅ Sous-titres inclus\n✅ Droits commerciaux complets",
      price: 4000, deliveryDays: 5, revisions: 2, rating: 4.8, reviewCount: 38,
      tags: ["UGC", "contenu", "publicité", "authentique"],
      packages: [
        { name: "Basique", price: 4000, description: "1 vidéo UGC 30-60s", deliveryDays: 5, revisions: 2, features: ["1 vidéo 30-60s", "Script inclus", "Sous-titres", "Droits commerciaux"] },
        { name: "Standard", price: 9000, description: "3 vidéos UGC variées", deliveryDays: 7, revisions: 3, features: ["3 vidéos", "Angles différents", "Versions avec/sans sous-titres", "Droits complets"] },
        { name: "Premium", price: 22000, description: "10 vidéos pack mensuel", deliveryDays: 14, revisions: 5, features: ["10 vidéos", "Stratégie UGC", "Storyboard", "Multi-formats", "Révisions illimitées"] },
      ]},
    // VOICEOVER
    { sellerId: freelancers[1].id, sub: "voiceover/arabic", title: "Je vais enregistrer votre voix off en arabe dialectal algérien", titleAr: "سأسجل تعليقاً صوتياً باللهجة الجزائرية الاحترافية",
      description: "Enregistrement de voix off professionnelle en arabe dialectal algérien et en arabe classique (MSA). Idéal pour publicités, e-learning, vidéos explicatives.\n\n✅ Studio d'enregistrement professionnel\n✅ Micro Neumann TLM103\n✅ Livraison WAV/MP3 HD\n✅ Plusieurs vitesses & tonalités",
      price: 2500, deliveryDays: 2, revisions: 2, rating: 4.9, reviewCount: 44,
      tags: ["voix off", "arabe", "enregistrement", "تعليق صوتي"],
      packages: [
        { name: "Basique", price: 2500, description: "Jusqu'à 100 mots", deliveryDays: 2, revisions: 2, features: ["100 mots", "WAV 48kHz", "1 ton de voix", "2 révisions"] },
        { name: "Standard", price: 5000, description: "Jusqu'à 300 mots", deliveryDays: 2, revisions: 3, features: ["300 mots", "WAV + MP3", "2 tons de voix", "Musique de fond optionnelle"] },
        { name: "Premium", price: 12000, description: "Script complet + montage", deliveryDays: 3, revisions: 5, features: ["Mots illimités", "Montage audio complet", "Musique incluse", "Droits commerciaux", "Urgence disponible"] },
      ]},
  ]

  for (const svc of services) {
    const { sub, packages, sellerId, ...svcData } = svc
    const subCategoryId = subMap[sub]
    if (!subCategoryId) { console.warn("Sub not found:", sub); continue }
    
    const existing = await db.service.findFirst({ where: { title: svc.title, sellerId } })
    if (existing) continue

    const created = await db.service.create({
      data: { ...svcData, sellerId, subCategoryId, images: [] }
    })
    await db.package.createMany({
      data: packages.map(p => ({ ...p, serviceId: created.id }))
    })
  }

  // ── Sample Order ──────────────────────────────────────────────
  const firstService = await db.service.findFirst()
  if (firstService) {
    const existingOrder = await db.order.findFirst({ where: { buyerId: client.id } })
    if (!existingOrder) {
      await db.order.create({ data: {
        buyerId: client.id, serviceId: firstService.id,
        status: "IN_PROGRESS", totalPrice: firstService.price,
        requirements: "Je voudrais un logo moderne pour mon restaurant de burgers 'Le Gourmet'. Couleurs: rouge et noir. Style urbain et moderne."
      }})
    }
  }

  console.log("✅ Seed terminé!")
  console.log("─────────────────────────────────────────")
  console.log("Admin:     admin@serviz.dz    / admin123")
  console.log("Client:    client@serviz.dz   / client123")
  console.log("Designer:  karim@serviz.dz    / pass123")
  console.log("Marketing: sara@serviz.dz     / pass123")
  console.log("Dev:       amine@serviz.dz    / pass123")
  console.log("Vidéo:     nadia@serviz.dz    / pass123")
  console.log("Photo:     youcef@serviz.dz   / pass123")
}

main().catch(console.error).finally(() => db.$disconnect())
