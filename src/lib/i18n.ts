// src/lib/i18n.ts
// ─────────────────────────────────────────────────────────────
// Central translation store for Arabic / French / English.
// ─────────────────────────────────────────────────────────────

export const locales = ["ar", "fr", "en"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "ar"

export const localeConfig: Record<Locale, { label: string; flag: string; dir: "rtl" | "ltr" }> = {
  ar: { label: "العربية",  flag: "🇩🇿", dir: "rtl" },
  fr: { label: "Français", flag: "🇫🇷", dir: "ltr" },
  en: { label: "English",  flag: "🇬🇧", dir: "ltr" },
}

// ── Dictionary type ───────────────────────────────────────────
export type Dict = {
  // Site
  "site.name": string
  "site.tagline": string

  // Navbar
  "nav.browse": string
  "nav.sell": string
  "nav.login": string
  "nav.register": string
  "nav.logout": string
  "nav.dashboard": string
  "nav.myOrders": string
  "nav.myServices": string
  "nav.addService": string
  "nav.profile": string
  "nav.search": string

  // Home
  "home.hero.title": string
  "home.hero.subtitle": string
  "home.hero.searchPlaceholder": string
  "home.popular": string
  "home.categories.title": string
  "home.categories.subtitle": string
  "home.categories.viewAll": string
  "home.featured.title": string
  "home.featured.subtitle": string
  "home.stats.freelancers": string
  "home.stats.services": string
  "home.stats.clients": string
  "home.stats.rating": string
  "home.cta.title": string
  "home.cta.subtitle": string
  "home.cta.button": string
  "home.comingSoon": string

  // Service card
  "card.startingFrom": string
  "card.orderNow": string
  "card.days": string
  "card.reviews": string

  // Service detail
  "service.about": string
  "service.aboutSeller": string
  "service.delivery": string
  "service.revisions": string
  "service.packages.basic": string
  "service.packages.standard": string
  "service.packages.premium": string
  "service.tags": string
  "service.startingFrom": string
  "service.orderNow": string
  "service.comparePackages": string

  // Checkout
  "checkout.title": string
  "checkout.requirements": string
  "checkout.requirementsHint": string
  "checkout.summary": string
  "checkout.includes": string
  "checkout.total": string
  "checkout.platformFee": string
  "checkout.confirm": string
  "checkout.terms": string

  // Order
  "order.confirmed": string
  "order.confirmedSubtitle": string
  "order.number": string
  "order.status.pending": string
  "order.status.in_progress": string
  "order.status.revision": string
  "order.status.delivered": string
  "order.status.completed": string
  "order.status.cancelled": string
  "order.myOrders": string
  "order.browseMore": string
  "order.noOrders": string
  "order.noOrdersSubtitle": string

  // Auth
  "auth.loginTitle": string
  "auth.loginSubtitle": string
  "auth.registerTitle": string
  "auth.registerSubtitle": string
  "auth.email": string
  "auth.password": string
  "auth.name": string
  "auth.login": string
  "auth.register": string
  "auth.noAccount": string
  "auth.hasAccount": string
  "auth.asClient": string
  "auth.asFreelancer": string
  "auth.demoAccounts": string
  "auth.error.invalid": string
  "auth.error.emailExists": string

  // Profile
  "profile.title": string
  "profile.myOrders": string
  "profile.myServices": string
  "profile.revenue": string
  "profile.addService": string
  "profile.bio": string

  // Dashboard - Freelancer
  "dash.freelancer.title": string
  "dash.freelancer.subtitle": string
  "dash.totalOrders": string
  "dash.activeOrders": string
  "dash.myServices": string
  "dash.revenue": string
  "dash.addService": string
  "dash.noServices": string
  "dash.noServicesSubtitle": string
  "dash.incomingOrders": string
  "dash.noIncomingOrders": string
  "dash.changeStatus": string
  "dash.viewService": string
  "dash.hideService": string
  "dash.showService": string
  "dash.active": string
  "dash.hidden": string

  // Dashboard - Admin
  "admin.title": string
  "admin.subtitle": string
  "admin.users": string
  "admin.services": string
  "admin.orders": string
  "admin.totalRevenue": string
  "admin.revenueChart": string
  "admin.revenueChartSubtitle": string
  "admin.recentOrders": string
  "admin.manageUsers": string
  "admin.promote": string
  "admin.delete": string
  "admin.deleteConfirmTitle": string
  "admin.deleteConfirmSubtitle": string
  "admin.deleteConfirm": string
  "admin.cancel": string
  "admin.browseSite": string
  "admin.role.client": string
  "admin.role.freelancer": string
  "admin.role.admin": string
  "admin.table.name": string
  "admin.table.email": string
  "admin.table.role": string
  "admin.table.orders": string
  "admin.table.services": string
  "admin.table.date": string
  "admin.table.actions": string
  "admin.table.service": string
  "admin.table.client": string
  "admin.table.status": string
  "admin.table.price": string

  // New Service Form
  "newService.title": string
  "newService.subtitle": string
  "newService.titleAr": string
  "newService.titleFr": string
  "newService.description": string
  "newService.price": string
  "newService.delivery": string
  "newService.revisions": string
  "newService.category": string
  "newService.subCategory": string
  "newService.tags": string
  "newService.tagsHint": string
  "newService.images": string
  "newService.imagesHint": string
  "newService.packages": string
  "newService.packagesHint": string
  "newService.addPackage": string
  "newService.packageName": string
  "newService.packagePrice": string
  "newService.packageDesc": string
  "newService.packageFeatures": string
  "newService.addFeature": string
  "newService.publish": string
  "newService.cancel": string
  "newService.selectCategory": string
  "newService.selectSubCategory": string

  // Search
  "search.title": string
  "search.results": string
  "search.noResults": string
  "search.noResultsSubtitle": string
  "search.clearFilters": string
  "search.filterTitle": string
  "search.priceRange": string
  "search.deliveryTime": string
  "search.sortBy": string
  "search.sort.popular": string
  "search.sort.newest": string
  "search.sort.priceAsc": string
  "search.sort.priceDesc": string
  "search.sort.rating": string
  "search.delivery.any": string
  "search.delivery.1day": string
  "search.delivery.3days": string
  "search.delivery.1week": string
  "search.activeFilters": string
  "search.categories": string

  // Sell page
  "sell.title": string
  "sell.subtitle": string
  "sell.cta": string
  "sell.step1.title": string
  "sell.step1.desc": string
  "sell.step2.title": string
  "sell.step2.desc": string
  "sell.step3.title": string
  "sell.step3.desc": string
  "sell.benefits.title": string
  "sell.benefits.free": string
  "sell.benefits.pricing": string
  "sell.benefits.reach": string
  "sell.benefits.ratings": string
  "sell.benefits.support": string
  "sell.benefits.payments": string

  // Review
  "review.title": string
  "review.submit": string
  "review.placeholder": string
  "review.labels.1": string
  "review.labels.2": string
  "review.labels.3": string
  "review.labels.4": string
  "review.labels.5": string
  "review.success": string
  "review.yourReview": string

  // Common
  "common.loading": string
  "common.error": string
  "common.back": string
  "common.viewAll": string
  "common.save": string
  "common.edit": string
  "common.delete": string
  "common.confirm": string
  "common.cancel": string
  "common.search": string
  "common.home": string
  "common.and": string
  "common.by": string
  "common.noData": string

  // Footer
  "footer.rights": string
  "footer.tagline": string
}

// ── Arabic translations ──────────────────────────────────────
const ar: Dict = {
  "site.name": "براند ديزاد",
  "site.tagline": "أكبر سوق للخدمات المصغرة في الجزائر",

  "nav.browse": "تصفح الخدمات",
  "nav.sell": "ابدأ البيع",
  "nav.login": "تسجيل الدخول",
  "nav.register": "إنشاء حساب",
  "nav.logout": "تسجيل الخروج",
  "nav.dashboard": "لوحة التحكم",
  "nav.myOrders": "طلباتي",
  "nav.myServices": "خدماتي",
  "nav.addService": "إضافة خدمة",
  "nav.profile": "حسابي",
  "nav.search": "ابحث عن خدمة...",

  "home.hero.title": "أكبر سوق للخدمات المصغرة في الجزائر",
  "home.hero.subtitle": "اعثر على أفضل المستقلين للتصميم، التسويق، الفيديو، وأكثر",
  "home.hero.searchPlaceholder": "ابحث... مثل: تصميم شعار، إدارة إنستغرام",
  "home.popular": "شائع:",
  "home.categories.title": "تصفح حسب الفئة",
  "home.categories.subtitle": "اختر ما تحتاجه",
  "home.categories.viewAll": "عرض الكل",
  "home.featured.title": "خدمات مميزة",
  "home.featured.subtitle": "الأعلى تقييماً من مستقلينا",
  "home.stats.freelancers": "مستقل محترف",
  "home.stats.services": "خدمة متاحة",
  "home.stats.clients": "عميل سعيد",
  "home.stats.rating": "متوسط التقييم",
  "home.cta.title": "هل أنت مستقل محترف؟",
  "home.cta.subtitle": "انضم إلى مجتمع المستقلين وابدأ في تقديم خدماتك لآلاف العملاء اليوم",
  "home.cta.button": "ابدأ البيع الآن — مجاناً",
  "home.comingSoon": "قريباً",

  "card.startingFrom": "بداية من",
  "card.orderNow": "اطلب الآن ←",
  "card.days": "ي",
  "card.reviews": "تقييم",

  "service.about": "عن الخدمة",
  "service.aboutSeller": "عن المستقل",
  "service.delivery": "أيام تسليم",
  "service.revisions": "تعديل",
  "service.packages.basic": "أساسي",
  "service.packages.standard": "قياسي",
  "service.packages.premium": "مميز",
  "service.tags": "الكلمات المفتاحية",
  "service.startingFrom": "بداية من",
  "service.orderNow": "اطلب الآن",
  "service.comparePackages": "أو اختر باقة أدناه ↓",

  "checkout.title": "تأكيد الطلب",
  "checkout.requirements": "متطلباتك",
  "checkout.requirementsHint": "أخبر المستقل بكل التفاصيل اللازمة لإتمام الخدمة",
  "checkout.summary": "ملخص الطلب",
  "checkout.includes": "يشمل الطلب",
  "checkout.total": "الإجمالي",
  "checkout.platformFee": "رسوم المنصة",
  "checkout.confirm": "تأكيد الطلب",
  "checkout.terms": "بالضغط على تأكيد الطلب، أنت توافق على شروط الاستخدام",

  "order.confirmed": "تم تأكيد طلبك!",
  "order.confirmedSubtitle": "سيتواصل معك المستقل في أقرب وقت ممكن",
  "order.number": "رقم الطلب",
  "order.status.pending": "في الانتظار",
  "order.status.in_progress": "جارٍ التنفيذ",
  "order.status.revision": "مراجعة",
  "order.status.delivered": "تم التسليم",
  "order.status.completed": "مكتمل",
  "order.status.cancelled": "ملغي",
  "order.myOrders": "طلباتي",
  "order.browseMore": "تصفح خدمات أخرى",
  "order.noOrders": "لا توجد طلبات بعد",
  "order.noOrdersSubtitle": "اطلب خدمتك الأولى من مستقلينا",

  "auth.loginTitle": "مرحباً بعودتك",
  "auth.loginSubtitle": "سجّل دخولك للمتابعة",
  "auth.registerTitle": "إنشاء حساب جديد",
  "auth.registerSubtitle": "انضم إلى مجتمع براند ديزاد",
  "auth.email": "البريد الإلكتروني",
  "auth.password": "كلمة المرور",
  "auth.name": "الاسم الكامل",
  "auth.login": "تسجيل الدخول",
  "auth.register": "إنشاء الحساب",
  "auth.noAccount": "ليس لديك حساب؟",
  "auth.hasAccount": "لديك حساب بالفعل؟",
  "auth.asClient": "🛒 أبحث عن خدمة",
  "auth.asFreelancer": "💼 أقدم خدمات",
  "auth.demoAccounts": "حسابات تجريبية",
  "auth.error.invalid": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  "auth.error.emailExists": "البريد الإلكتروني مستخدم بالفعل",

  "profile.title": "حسابي",
  "profile.myOrders": "طلباتي",
  "profile.myServices": "خدماتي",
  "profile.revenue": "الإيرادات",
  "profile.addService": "إضافة خدمة جديدة",
  "profile.bio": "نبذة",

  "dash.freelancer.title": "لوحة المستقل",
  "dash.freelancer.subtitle": "إدارة خدماتك وطلباتك",
  "dash.totalOrders": "إجمالي الطلبات",
  "dash.activeOrders": "طلبات نشطة",
  "dash.myServices": "خدماتي",
  "dash.revenue": "الإيرادات",
  "dash.addService": "إضافة خدمة جديدة",
  "dash.noServices": "لا توجد خدمات بعد",
  "dash.noServicesSubtitle": "أضف خدمتك الأولى وابدأ في استقبال الطلبات",
  "dash.incomingOrders": "الطلبات الواردة",
  "dash.noIncomingOrders": "لم تستقبل أي طلب بعد",
  "dash.changeStatus": "تغيير الحالة",
  "dash.viewService": "عرض",
  "dash.hideService": "إخفاء",
  "dash.showService": "إظهار",
  "dash.active": "نشط",
  "dash.hidden": "مخفي",

  "admin.title": "لوحة تحكم المدير",
  "admin.subtitle": "نظرة شاملة على منصة براند ديزاد",
  "admin.users": "المستخدمون",
  "admin.services": "الخدمات",
  "admin.orders": "الطلبات",
  "admin.totalRevenue": "الإيرادات",
  "admin.revenueChart": "الإيرادات الشهرية",
  "admin.revenueChartSubtitle": "آخر 6 أشهر",
  "admin.recentOrders": "آخر الطلبات",
  "admin.manageUsers": "إدارة المستخدمين",
  "admin.promote": "ترقية",
  "admin.delete": "حذف",
  "admin.deleteConfirmTitle": "حذف المستخدم",
  "admin.deleteConfirmSubtitle": "هذا الإجراء لا يمكن التراجع عنه",
  "admin.deleteConfirm": "حذف المستخدم",
  "admin.cancel": "إلغاء",
  "admin.browseSite": "تصفح الموقع ←",
  "admin.role.client": "عميل",
  "admin.role.freelancer": "مستقل",
  "admin.role.admin": "مدير",
  "admin.table.name": "الاسم",
  "admin.table.email": "البريد",
  "admin.table.role": "الدور",
  "admin.table.orders": "الطلبات",
  "admin.table.services": "الخدمات",
  "admin.table.date": "تاريخ التسجيل",
  "admin.table.actions": "إجراءات",
  "admin.table.service": "الخدمة",
  "admin.table.client": "العميل",
  "admin.table.status": "الحالة",
  "admin.table.price": "السعر",

  "newService.title": "إضافة خدمة جديدة",
  "newService.subtitle": "أضف خدمتك وستظهر فوراً للعملاء",
  "newService.titleAr": "عنوان الخدمة (بالعربية)",
  "newService.titleFr": "عنوان الخدمة (بالفرنسية / الإنجليزية)",
  "newService.description": "وصف الخدمة",
  "newService.price": "السعر (DA)",
  "newService.delivery": "التسليم (أيام)",
  "newService.revisions": "التعديلات",
  "newService.category": "الفئة الرئيسية",
  "newService.subCategory": "الفئة الفرعية",
  "newService.tags": "الكلمات المفتاحية",
  "newService.tagsHint": "مفصولة بفاصلة — مثل: logo, design, شعار",
  "newService.images": "صور الخدمة",
  "newService.imagesHint": "حتى 4 صور — PNG, JPG, WebP",
  "newService.packages": "الباقات (اختياري)",
  "newService.packagesHint": "أضف باقات بأسعار مختلفة",
  "newService.addPackage": "إضافة باقة",
  "newService.packageName": "اسم الباقة",
  "newService.packagePrice": "السعر (DA)",
  "newService.packageDesc": "الوصف",
  "newService.packageFeatures": "المميزات",
  "newService.addFeature": "+ إضافة ميزة",
  "newService.publish": "نشر الخدمة",
  "newService.cancel": "إلغاء",
  "newService.selectCategory": "اختر فئة...",
  "newService.selectSubCategory": "اختر فئة fer3ia...",

  "search.title": "نتائج البحث",
  "search.results": "خدمة",
  "search.noResults": "لا توجد نتائج",
  "search.noResultsSubtitle": "جرب تعديل الفلاتر أو استخدام كلمات مختلفة",
  "search.clearFilters": "مسح الفلاتر",
  "search.filterTitle": "الفلاتر والترتيب",
  "search.priceRange": "نطاق السعر (DA)",
  "search.deliveryTime": "مدة التسليم",
  "search.sortBy": "الترتيب",
  "search.sort.popular": "الأكثر طلباً",
  "search.sort.newest": "الأحدث",
  "search.sort.priceAsc": "السعر ↑",
  "search.sort.priceDesc": "السعر ↓",
  "search.sort.rating": "الأعلى تقييماً",
  "search.delivery.any": "كل المدد",
  "search.delivery.1day": "يوم واحد",
  "search.delivery.3days": "3 أيام",
  "search.delivery.1week": "أسبوع",
  "search.activeFilters": "فلاتر نشطة:",
  "search.categories": "فئات مطابقة",

  "sell.title": "ابدأ البيع على براند ديزاد",
  "sell.subtitle": "انضم إلى مئات المستقلين الناجحين وابدأ في تحقيق دخل من مهاراتك",
  "sell.cta": "إنشاء حساب مجاناً",
  "sell.step1.title": "أنشئ ملفك",
  "sell.step1.desc": "سجّل حسابك كمستقل وأضف مهاراتك في دقائق",
  "sell.step2.title": "انشر خدماتك",
  "sell.step2.desc": "حدد أسعارك بنفسك وأضف حزم مختلفة",
  "sell.step3.title": "ابدأ الكسب",
  "sell.step3.desc": "استقبل الطلبات وسلّم العمل واحصل على تقييمات",
  "sell.benefits.title": "ما تحصل عليه",
  "sell.benefits.free": "التسجيل والبيع مجاني 100%",
  "sell.benefits.pricing": "تحديد أسعارك بنفسك",
  "sell.benefits.reach": "وصول لآلاف العملاء",
  "sell.benefits.ratings": "نظام تقييمات يبني سمعتك",
  "sell.benefits.support": "دعم فني متواصل",
  "sell.benefits.payments": "مدفوعات آمنة",

  "review.title": "قيّم هذه الخدمة",
  "review.submit": "إرسال التقييم",
  "review.placeholder": "أضف تعليقاً (اختياري)...",
  "review.labels.1": "ضعيف",
  "review.labels.2": "مقبول",
  "review.labels.3": "جيد",
  "review.labels.4": "جيد جداً",
  "review.labels.5": "ممتاز",
  "review.success": "شكراً! تم إرسال تقييمك بنجاح",
  "review.yourReview": "تقييمك",

  "common.loading": "جارٍ التحميل...",
  "common.error": "حدث خطأ",
  "common.back": "رجوع",
  "common.viewAll": "عرض الكل",
  "common.save": "حفظ",
  "common.edit": "تعديل",
  "common.delete": "حذف",
  "common.confirm": "تأكيد",
  "common.cancel": "إلغاء",
  "common.search": "بحث",
  "common.home": "الرئيسية",
  "common.and": "و",
  "common.by": "بواسطة",
  "common.noData": "لا توجد بيانات",

  "footer.rights": "جميع الحقوق محفوظة",
  "footer.tagline": "أكبر سوق للخدمات المصغرة في الجزائر",
}

// ── French translations ──────────────────────────────────────
const fr: Dict = {
  "site.name": "BrandDZ",
  "site.tagline": "La plus grande marketplace freelance d'Algérie",

  "nav.browse": "Parcourir",
  "nav.sell": "Vendre",
  "nav.login": "Connexion",
  "nav.register": "S'inscrire",
  "nav.logout": "Déconnexion",
  "nav.dashboard": "Tableau de bord",
  "nav.myOrders": "Mes commandes",
  "nav.myServices": "Mes services",
  "nav.addService": "Ajouter un service",
  "nav.profile": "Mon compte",
  "nav.search": "Rechercher un service...",

  "home.hero.title": "La plus grande marketplace freelance d'Algérie",
  "home.hero.subtitle": "Trouvez les meilleurs freelances pour le design, marketing, vidéo et plus",
  "home.hero.searchPlaceholder": "Rechercher... ex: logo, gestion Instagram",
  "home.popular": "Populaires:",
  "home.categories.title": "Parcourir par catégorie",
  "home.categories.subtitle": "Choisissez ce dont vous avez besoin",
  "home.categories.viewAll": "Voir tout",
  "home.featured.title": "Services en vedette",
  "home.featured.subtitle": "Les mieux notés de nos freelances",
  "home.stats.freelancers": "freelances professionnels",
  "home.stats.services": "services disponibles",
  "home.stats.clients": "clients satisfaits",
  "home.stats.rating": "note moyenne",
  "home.cta.title": "Vous êtes freelance?",
  "home.cta.subtitle": "Rejoignez notre communauté et proposez vos services à des milliers de clients",
  "home.cta.button": "Commencer gratuitement",
  "home.comingSoon": "Bientôt",

  "card.startingFrom": "À partir de",
  "card.orderNow": "Commander →",
  "card.days": "j",
  "card.reviews": "avis",

  "service.about": "À propos du service",
  "service.aboutSeller": "À propos du freelance",
  "service.delivery": "jours de livraison",
  "service.revisions": "révision(s)",
  "service.packages.basic": "Basique",
  "service.packages.standard": "Standard",
  "service.packages.premium": "Premium",
  "service.tags": "Mots-clés",
  "service.startingFrom": "À partir de",
  "service.orderNow": "Commander maintenant",
  "service.comparePackages": "Ou choisissez un forfait ci-dessous ↓",

  "checkout.title": "Confirmer la commande",
  "checkout.requirements": "Vos exigences",
  "checkout.requirementsHint": "Donnez tous les détails nécessaires au freelance pour réaliser le travail",
  "checkout.summary": "Résumé de la commande",
  "checkout.includes": "Inclus",
  "checkout.total": "Total",
  "checkout.platformFee": "Frais de plateforme",
  "checkout.confirm": "Confirmer la commande",
  "checkout.terms": "En confirmant, vous acceptez nos conditions d'utilisation",

  "order.confirmed": "Commande confirmée!",
  "order.confirmedSubtitle": "Le freelance vous contactera très prochainement",
  "order.number": "Numéro de commande",
  "order.status.pending": "En attente",
  "order.status.in_progress": "En cours",
  "order.status.revision": "Révision",
  "order.status.delivered": "Livré",
  "order.status.completed": "Terminé",
  "order.status.cancelled": "Annulé",
  "order.myOrders": "Mes commandes",
  "order.browseMore": "Parcourir d'autres services",
  "order.noOrders": "Aucune commande",
  "order.noOrdersSubtitle": "Passez votre première commande auprès de nos freelances",

  "auth.loginTitle": "Bon retour!",
  "auth.loginSubtitle": "Connectez-vous pour continuer",
  "auth.registerTitle": "Créer un compte",
  "auth.registerSubtitle": "Rejoignez la communauté BrandDZ",
  "auth.email": "Adresse e-mail",
  "auth.password": "Mot de passe",
  "auth.name": "Nom complet",
  "auth.login": "Se connecter",
  "auth.register": "Créer le compte",
  "auth.noAccount": "Pas de compte?",
  "auth.hasAccount": "Déjà un compte?",
  "auth.asClient": "🛒 Je cherche un service",
  "auth.asFreelancer": "💼 Je propose des services",
  "auth.demoAccounts": "Comptes de démonstration",
  "auth.error.invalid": "Email ou mot de passe incorrect",
  "auth.error.emailExists": "Cette adresse email est déjà utilisée",

  "profile.title": "Mon compte",
  "profile.myOrders": "Mes commandes",
  "profile.myServices": "Mes services",
  "profile.revenue": "Revenus",
  "profile.addService": "Ajouter un service",
  "profile.bio": "Bio",

  "dash.freelancer.title": "Tableau de bord freelance",
  "dash.freelancer.subtitle": "Gérez vos services et commandes",
  "dash.totalOrders": "Commandes totales",
  "dash.activeOrders": "Commandes actives",
  "dash.myServices": "Mes services",
  "dash.revenue": "Revenus",
  "dash.addService": "Ajouter un service",
  "dash.noServices": "Aucun service",
  "dash.noServicesSubtitle": "Ajoutez votre premier service pour recevoir des commandes",
  "dash.incomingOrders": "Commandes reçues",
  "dash.noIncomingOrders": "Aucune commande reçue",
  "dash.changeStatus": "Changer le statut",
  "dash.viewService": "Voir",
  "dash.hideService": "Masquer",
  "dash.showService": "Afficher",
  "dash.active": "Actif",
  "dash.hidden": "Masqué",

  "admin.title": "Tableau de bord Admin",
  "admin.subtitle": "Vue d'ensemble de la plateforme BrandDZ",
  "admin.users": "Utilisateurs",
  "admin.services": "Services",
  "admin.orders": "Commandes",
  "admin.totalRevenue": "Revenus",
  "admin.revenueChart": "Revenus mensuels",
  "admin.revenueChartSubtitle": "6 derniers mois",
  "admin.recentOrders": "Dernières commandes",
  "admin.manageUsers": "Gestion des utilisateurs",
  "admin.promote": "Promouvoir",
  "admin.delete": "Supprimer",
  "admin.deleteConfirmTitle": "Supprimer l'utilisateur",
  "admin.deleteConfirmSubtitle": "Cette action est irréversible",
  "admin.deleteConfirm": "Supprimer",
  "admin.cancel": "Annuler",
  "admin.browseSite": "Voir le site →",
  "admin.role.client": "Client",
  "admin.role.freelancer": "Freelance",
  "admin.role.admin": "Admin",
  "admin.table.name": "Nom",
  "admin.table.email": "Email",
  "admin.table.role": "Rôle",
  "admin.table.orders": "Commandes",
  "admin.table.services": "Services",
  "admin.table.date": "Inscription",
  "admin.table.actions": "Actions",
  "admin.table.service": "Service",
  "admin.table.client": "Client",
  "admin.table.status": "Statut",
  "admin.table.price": "Prix",

  "newService.title": "Ajouter un service",
  "newService.subtitle": "Votre service sera visible immédiatement",
  "newService.titleAr": "Titre du service (en arabe)",
  "newService.titleFr": "Titre du service (en français / anglais)",
  "newService.description": "Description du service",
  "newService.price": "Prix (DA)",
  "newService.delivery": "Délai (jours)",
  "newService.revisions": "Révisions",
  "newService.category": "Catégorie principale",
  "newService.subCategory": "Sous-catégorie",
  "newService.tags": "Mots-clés",
  "newService.tagsHint": "Séparés par des virgules — ex: logo, design, برندينج",
  "newService.images": "Images du service",
  "newService.imagesHint": "Jusqu'à 4 images — PNG, JPG, WebP",
  "newService.packages": "Forfaits (optionnel)",
  "newService.packagesHint": "Ajoutez des forfaits à prix différents",
  "newService.addPackage": "Ajouter un forfait",
  "newService.packageName": "Nom du forfait",
  "newService.packagePrice": "Prix (DA)",
  "newService.packageDesc": "Description",
  "newService.packageFeatures": "Fonctionnalités",
  "newService.addFeature": "+ Ajouter une fonctionnalité",
  "newService.publish": "Publier le service",
  "newService.cancel": "Annuler",
  "newService.selectCategory": "Choisir une catégorie...",
  "newService.selectSubCategory": "Choisir une sous-catégorie...",

  "search.title": "Résultats de recherche",
  "search.results": "service(s)",
  "search.noResults": "Aucun résultat",
  "search.noResultsSubtitle": "Essayez de modifier les filtres ou d'utiliser d'autres mots",
  "search.clearFilters": "Effacer les filtres",
  "search.filterTitle": "Filtres et tri",
  "search.priceRange": "Fourchette de prix (DA)",
  "search.deliveryTime": "Délai de livraison",
  "search.sortBy": "Trier par",
  "search.sort.popular": "Plus populaires",
  "search.sort.newest": "Plus récents",
  "search.sort.priceAsc": "Prix croissant",
  "search.sort.priceDesc": "Prix décroissant",
  "search.sort.rating": "Mieux notés",
  "search.delivery.any": "Tous les délais",
  "search.delivery.1day": "1 jour",
  "search.delivery.3days": "3 jours",
  "search.delivery.1week": "1 semaine",
  "search.activeFilters": "Filtres actifs:",
  "search.categories": "Catégories correspondantes",

  "sell.title": "Commencer à vendre sur BrandDZ",
  "sell.subtitle": "Rejoignez des centaines de freelances qui gagnent leur vie grâce à leurs compétences",
  "sell.cta": "Créer un compte gratuit",
  "sell.step1.title": "Créez votre profil",
  "sell.step1.desc": "Inscrivez-vous en tant que freelance et ajoutez vos compétences en quelques minutes",
  "sell.step2.title": "Publiez vos services",
  "sell.step2.desc": "Fixez vos propres prix et créez des forfaits variés",
  "sell.step3.title": "Commencez à gagner",
  "sell.step3.desc": "Recevez des commandes, livrez le travail et obtenez des avis positifs",
  "sell.benefits.title": "Ce que vous obtenez",
  "sell.benefits.free": "Inscription et vente 100% gratuits",
  "sell.benefits.pricing": "Fixez vos propres prix",
  "sell.benefits.reach": "Accès à des milliers de clients",
  "sell.benefits.ratings": "Système d'avis pour bâtir votre réputation",
  "sell.benefits.support": "Support technique continu",
  "sell.benefits.payments": "Paiements sécurisés",

  "review.title": "Évaluer ce service",
  "review.submit": "Envoyer l'évaluation",
  "review.placeholder": "Ajouter un commentaire (optionnel)...",
  "review.labels.1": "Mauvais",
  "review.labels.2": "Passable",
  "review.labels.3": "Bien",
  "review.labels.4": "Très bien",
  "review.labels.5": "Excellent",
  "review.success": "Merci! Votre évaluation a été envoyée avec succès",
  "review.yourReview": "Votre évaluation",

  "common.loading": "Chargement...",
  "common.error": "Une erreur est survenue",
  "common.back": "Retour",
  "common.viewAll": "Voir tout",
  "common.save": "Enregistrer",
  "common.edit": "Modifier",
  "common.delete": "Supprimer",
  "common.confirm": "Confirmer",
  "common.cancel": "Annuler",
  "common.search": "Rechercher",
  "common.home": "Accueil",
  "common.and": "et",
  "common.by": "par",
  "common.noData": "Aucune donnée",

  "footer.rights": "Tous droits réservés",
  "footer.tagline": "La plus grande marketplace freelance d'Algérie",
}

// ── English translations ──────────────────────────────────────
const en: Dict = {
  "site.name": "BrandDZ",
  "site.tagline": "Algeria's largest freelance marketplace",

  "nav.browse": "Browse",
  "nav.sell": "Start Selling",
  "nav.login": "Log In",
  "nav.register": "Sign Up",
  "nav.logout": "Log Out",
  "nav.dashboard": "Dashboard",
  "nav.myOrders": "My Orders",
  "nav.myServices": "My Services",
  "nav.addService": "Add Service",
  "nav.profile": "My Account",
  "nav.search": "Search for a service...",

  "home.hero.title": "Algeria's Largest Freelance Marketplace",
  "home.hero.subtitle": "Find top freelancers for design, marketing, video, and more",
  "home.hero.searchPlaceholder": "Search... e.g. logo design, Instagram management",
  "home.popular": "Popular:",
  "home.categories.title": "Browse by Category",
  "home.categories.subtitle": "Choose what you need",
  "home.categories.viewAll": "View All",
  "home.featured.title": "Featured Services",
  "home.featured.subtitle": "Top rated from our freelancers",
  "home.stats.freelancers": "professional freelancers",
  "home.stats.services": "services available",
  "home.stats.clients": "happy clients",
  "home.stats.rating": "average rating",
  "home.cta.title": "Are you a freelancer?",
  "home.cta.subtitle": "Join our community and offer your services to thousands of clients today",
  "home.cta.button": "Start Selling — Free",
  "home.comingSoon": "Coming Soon",

  "card.startingFrom": "From",
  "card.orderNow": "Order Now →",
  "card.days": "d",
  "card.reviews": "reviews",

  "service.about": "About this service",
  "service.aboutSeller": "About the freelancer",
  "service.delivery": "days delivery",
  "service.revisions": "revision(s)",
  "service.packages.basic": "Basic",
  "service.packages.standard": "Standard",
  "service.packages.premium": "Premium",
  "service.tags": "Tags",
  "service.startingFrom": "Starting at",
  "service.orderNow": "Order Now",
  "service.comparePackages": "Or choose a package below ↓",

  "checkout.title": "Confirm Order",
  "checkout.requirements": "Your Requirements",
  "checkout.requirementsHint": "Tell the freelancer everything they need to complete the job",
  "checkout.summary": "Order Summary",
  "checkout.includes": "Includes",
  "checkout.total": "Total",
  "checkout.platformFee": "Platform fee",
  "checkout.confirm": "Confirm Order",
  "checkout.terms": "By confirming, you agree to our Terms of Service",

  "order.confirmed": "Order Confirmed!",
  "order.confirmedSubtitle": "The freelancer will contact you soon",
  "order.number": "Order Number",
  "order.status.pending": "Pending",
  "order.status.in_progress": "In Progress",
  "order.status.revision": "Revision",
  "order.status.delivered": "Delivered",
  "order.status.completed": "Completed",
  "order.status.cancelled": "Cancelled",
  "order.myOrders": "My Orders",
  "order.browseMore": "Browse More Services",
  "order.noOrders": "No orders yet",
  "order.noOrdersSubtitle": "Place your first order with our freelancers",

  "auth.loginTitle": "Welcome back",
  "auth.loginSubtitle": "Log in to continue",
  "auth.registerTitle": "Create an account",
  "auth.registerSubtitle": "Join the BrandDZ community",
  "auth.email": "Email address",
  "auth.password": "Password",
  "auth.name": "Full name",
  "auth.login": "Log In",
  "auth.register": "Create Account",
  "auth.noAccount": "Don't have an account?",
  "auth.hasAccount": "Already have an account?",
  "auth.asClient": "🛒 I need a service",
  "auth.asFreelancer": "💼 I offer services",
  "auth.demoAccounts": "Demo accounts",
  "auth.error.invalid": "Invalid email or password",
  "auth.error.emailExists": "This email is already in use",

  "profile.title": "My Account",
  "profile.myOrders": "My Orders",
  "profile.myServices": "My Services",
  "profile.revenue": "Revenue",
  "profile.addService": "Add New Service",
  "profile.bio": "Bio",

  "dash.freelancer.title": "Freelancer Dashboard",
  "dash.freelancer.subtitle": "Manage your services and orders",
  "dash.totalOrders": "Total Orders",
  "dash.activeOrders": "Active Orders",
  "dash.myServices": "My Services",
  "dash.revenue": "Revenue",
  "dash.addService": "Add New Service",
  "dash.noServices": "No services yet",
  "dash.noServicesSubtitle": "Add your first service to start receiving orders",
  "dash.incomingOrders": "Incoming Orders",
  "dash.noIncomingOrders": "No orders received yet",
  "dash.changeStatus": "Change Status",
  "dash.viewService": "View",
  "dash.hideService": "Hide",
  "dash.showService": "Show",
  "dash.active": "Active",
  "dash.hidden": "Hidden",

  "admin.title": "Admin Dashboard",
  "admin.subtitle": "Platform-wide overview",
  "admin.users": "Users",
  "admin.services": "Services",
  "admin.orders": "Orders",
  "admin.totalRevenue": "Revenue",
  "admin.revenueChart": "Monthly Revenue",
  "admin.revenueChartSubtitle": "Last 6 months",
  "admin.recentOrders": "Recent Orders",
  "admin.manageUsers": "User Management",
  "admin.promote": "Promote",
  "admin.delete": "Delete",
  "admin.deleteConfirmTitle": "Delete User",
  "admin.deleteConfirmSubtitle": "This action cannot be undone",
  "admin.deleteConfirm": "Delete User",
  "admin.cancel": "Cancel",
  "admin.browseSite": "Browse Site →",
  "admin.role.client": "Client",
  "admin.role.freelancer": "Freelancer",
  "admin.role.admin": "Admin",
  "admin.table.name": "Name",
  "admin.table.email": "Email",
  "admin.table.role": "Role",
  "admin.table.orders": "Orders",
  "admin.table.services": "Services",
  "admin.table.date": "Joined",
  "admin.table.actions": "Actions",
  "admin.table.service": "Service",
  "admin.table.client": "Client",
  "admin.table.status": "Status",
  "admin.table.price": "Price",

  "newService.title": "Add New Service",
  "newService.subtitle": "Your service will appear to clients immediately",
  "newService.titleAr": "Service title (in Arabic)",
  "newService.titleFr": "Service title (in French / English)",
  "newService.description": "Service description",
  "newService.price": "Price (DA)",
  "newService.delivery": "Delivery (days)",
  "newService.revisions": "Revisions",
  "newService.category": "Main category",
  "newService.subCategory": "Sub-category",
  "newService.tags": "Tags",
  "newService.tagsHint": "Comma separated — e.g. logo, design, branding",
  "newService.images": "Service images",
  "newService.imagesHint": "Up to 4 images — PNG, JPG, WebP",
  "newService.packages": "Packages (optional)",
  "newService.packagesHint": "Add packages at different price points",
  "newService.addPackage": "Add Package",
  "newService.packageName": "Package name",
  "newService.packagePrice": "Price (DA)",
  "newService.packageDesc": "Description",
  "newService.packageFeatures": "Features",
  "newService.addFeature": "+ Add feature",
  "newService.publish": "Publish Service",
  "newService.cancel": "Cancel",
  "newService.selectCategory": "Select a category...",
  "newService.selectSubCategory": "Select a sub-category...",

  "search.title": "Search Results",
  "search.results": "service(s)",
  "search.noResults": "No results found",
  "search.noResultsSubtitle": "Try adjusting filters or using different keywords",
  "search.clearFilters": "Clear filters",
  "search.filterTitle": "Filters & Sorting",
  "search.priceRange": "Price range (DA)",
  "search.deliveryTime": "Delivery time",
  "search.sortBy": "Sort by",
  "search.sort.popular": "Most popular",
  "search.sort.newest": "Newest",
  "search.sort.priceAsc": "Price: Low to High",
  "search.sort.priceDesc": "Price: High to Low",
  "search.sort.rating": "Top rated",
  "search.delivery.any": "Any time",
  "search.delivery.1day": "1 day",
  "search.delivery.3days": "3 days",
  "search.delivery.1week": "1 week",
  "search.activeFilters": "Active filters:",
  "search.categories": "Matching categories",

  "sell.title": "Start Selling on BrandDZ",
  "sell.subtitle": "Join hundreds of successful freelancers earning from their skills",
  "sell.cta": "Create Free Account",
  "sell.step1.title": "Create your profile",
  "sell.step1.desc": "Sign up as a freelancer and add your skills in minutes",
  "sell.step2.title": "Publish your services",
  "sell.step2.desc": "Set your own prices and create multiple packages",
  "sell.step3.title": "Start earning",
  "sell.step3.desc": "Receive orders, deliver work and collect great reviews",
  "sell.benefits.title": "What you get",
  "sell.benefits.free": "Registration and selling 100% free",
  "sell.benefits.pricing": "Set your own prices",
  "sell.benefits.reach": "Access to thousands of clients",
  "sell.benefits.ratings": "Review system to build your reputation",
  "sell.benefits.support": "Ongoing technical support",
  "sell.benefits.payments": "Secure payments",

  "review.title": "Rate this service",
  "review.submit": "Submit Review",
  "review.placeholder": "Add a comment (optional)...",
  "review.labels.1": "Poor",
  "review.labels.2": "Fair",
  "review.labels.3": "Good",
  "review.labels.4": "Very Good",
  "review.labels.5": "Excellent",
  "review.success": "Thank you! Your review was submitted successfully",
  "review.yourReview": "Your review",

  "common.loading": "Loading...",
  "common.error": "An error occurred",
  "common.back": "Back",
  "common.viewAll": "View All",
  "common.save": "Save",
  "common.edit": "Edit",
  "common.delete": "Delete",
  "common.confirm": "Confirm",
  "common.cancel": "Cancel",
  "common.search": "Search",
  "common.home": "Home",
  "common.and": "and",
  "common.by": "by",
  "common.noData": "No data",

  "footer.rights": "All rights reserved",
  "footer.tagline": "Algeria's largest freelance marketplace",
}

// ── Export ────────────────────────────────────────────────────
export const translations: Record<Locale, Dict> = { ar, fr, en }

export function getDict(locale: Locale): Dict {
  return translations[locale] ?? translations[defaultLocale]
}