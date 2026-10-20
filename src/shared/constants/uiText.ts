/**
 * Textos de la interfaz (en español), centralizados.
 * El contenido del negocio (cursos, horarios, canales...) vive en src/data/content/.
 * Las frases que combinan contenido son funciones, para que el orden de las palabras
 * quede aquí y no en los componentes.
 */
export const UI_TEXT = {
  brand: {
    name: 'Conducir J&R del Sinú',
    tagline: 'Centro de Enseñanza Automovilística',
  },
  a11y: {
    opensInNewTab: '(se abre en una pestaña nueva)',
    skipToContent: 'Saltar al contenido',
    loading: 'Cargando…',
  },
  speedometer: {
    totalCaption: 'horas en total',
  },
  serviceType: {
    private: 'Particular',
    public: 'Público',
  },
  hours: {
    theory: 'Teoría',
    workshop: 'Taller',
    driving: 'Manejo',
    /** "25 horas". */
    count: (hours: number): string => `${String(hours)} horas`,
    /** "25 h", en la lista "Incluye" de la página Planes. */
    short: (hours: number): string => `${String(hours)} h`,
    /** "25 teoría · 5 taller · 20 manejo". */
    breakdown: (theory: number, workshop: number, driving: number): string =>
      `${String(theory)} teoría · ${String(workshop)} taller · ${String(driving)} manejo`,
    /** Descripción accesible del arco. */
    arcLabel: (
      name: string,
      total: number,
      theory: number,
      workshop: number,
      driving: number,
    ): string =>
      `${name}: ${String(total)} horas en total. Teoría ${String(theory)}, taller ${String(workshop)} y manejo ${String(driving)} horas.`,
  },
  heroCards: {
    region: 'Datos del curso, horarios y ubicación',
    /** "Licencia B1 · Servicio particular". */
    planEyebrow: (name: string, serviceType: string): string =>
      `${name} · Servicio ${serviceType.toLocaleLowerCase('es-CO')}`,
    theoryTitle: 'Clases teóricas',
    dayShift: 'Diurna',
    nightShift: 'Nocturna',
    /** "Ubicación · Cereté". */
    locationEyebrow: (city: string): string => `Ubicación · ${city}`,
    /** "B1 · 50 horas". */
    hoursEyebrow: (category: string, total: number): string =>
      `${category} · ${String(total)} horas`,
    /** "Licencia B1 · Particular", en la tarjeta móvil. */
    hoursMobileEyebrow: (name: string, serviceType: string): string => `${name} · ${serviceType}`,
  },
  benefits: {
    seeSchedules: 'Ver horarios',
    seeReviews: 'Ver opiniones en Google',
    /** "5.0 en Google". */
    ratingTitle: (score: string): string => `${score} en Google`,
    /** "Calificación de 5.0 con 5 opiniones, a octubre de 2026." */
    ratingText: (score: string, count: number, monthYear: string): string =>
      `Calificación de ${score} con ${String(count)} opiniones, a ${monthYear}.`,
  },
  courseHours: {
    selectorLabel: 'Categoría de licencia',
    requirementsLink: 'Consulta los requisitos por WhatsApp',
  },
  plans: {
    /** "Desde 16 años · Particular" (el CSS lo pasa a mayúsculas). */
    eyebrow: (age: string, serviceType: string): string => `${age} · ${serviceType}`,
    completeCourse: 'Curso completo',
    includes: 'Incluye',
    theoryClasses: 'Clases teóricas',
    workshopPractice: 'Prácticas de taller',
    drivingPractice: 'Prácticas de manejo',
    total: 'Total',
    askPrice: 'Consultar precio',
    askRequirements: 'Consultar requisitos',
  },
  services: {
    /** "Categoría A2". */
    eyebrow: (category: string): string => `Categoría ${category}`,
    vehicles: 'Vehículos',
    service: 'Servicio',
    age: 'Edad',
    askRequirements: 'Consultar requisitos por WhatsApp',
    seeAll: 'Ver servicios',
  },
  testimonials: {
    ratingLabel: 'Calificación en Google',
    /** "de 5". */
    outOf: (max: number): string => `de ${String(max)}`,
    /** "5 opiniones · dato a octubre de 2026". */
    ratingFootnote: (count: number, monthYear: string): string =>
      `${String(count)} opiniones · dato a ${monthYear}`,
    starsLabel: (score: string): string => `${score} de 5 estrellas`,
    seeReviews: 'Ver opiniones en Google',
    source: 'Opinión en Google',
    /** "consultada en octubre de 2026" (DESIGN.md §5: fecha o fecha de consulta). */
    retrieved: (monthYear: string): string => `consultada en ${monthYear}`,
  },
  contact: {
    actions: {
      whatsapp: 'Escribir',
      phone: 'Llamar',
      email: 'Escribir correo',
      facebook: 'Ver página',
      instagram: 'Ver perfil',
      tiktok: 'Ver perfil',
    },
    copy: 'Copiar',
    copied: 'Copiado',
    /** Nombre accesible del botón "Copiar". */
    copyLabel: (value: string): string => `Copiar ${value}`,
    /** Anuncio para lectores de pantalla. */
    copiedAnnouncement: (value: string): string => `${value} copiado al portapapeles`,
  },
  location: {
    addressLabel: 'Dirección',
    schedulesLabel: 'Horarios de clases',
    /** "En Google nos encuentras como “CEA Conducir J&R del Sinú…”." */
    googleName: (businessName: string): string =>
      `En Google nos encuentras como “${businessName}”.`,
    directions: 'Cómo llegar',
    waze: 'Abrir en Waze',
    showMap: 'Ver mapa',
    mapTitle: (businessName: string): string => `Mapa de ${businessName}`,
  },
  schedule: {
    theory: 'Teóricas',
    practice: 'Prácticas',
    /** Eyebrows de las tarjetas de Contáctanos. */
    dayEyebrow: 'Teóricas · diurna',
    nightEyebrow: 'Teóricas · nocturna',
    practiceEyebrow: 'Prácticas',
    /** "lunes a viernes en cuatro franjas diurnas; nocturna lun, mar y mié de 6:00 a 8:00 p. m.", sin punto final propio. */
    theorySummary: (
      dayDays: string,
      daySlots: string,
      nightDays: string,
      nightSlot: string,
    ): string => `${dayDays} en ${daySlots} diurnas; nocturna ${nightDays} de ${nightSlot}`,
    /** "Teóricas, lunes a viernes:" (Nosotros). */
    theoryDayLabel: (days: string): string => `Teóricas, ${days}:`,
    theoryNightLabel: 'Teóricas nocturnas:',
    practiceLabel: 'Prácticas:',
  },
  company: {
    factsLabel: 'Datos de la empresa',
    /** "Conducir J&R del Sinú · Centro de Enseñanza Automovilística". */
    factsTitle: (brandName: string, tagline: string): string => `${brandName} · ${tagline}`,
    /** "NIT 901722359-5 · Calle 13 # 10-96, Cereté, Córdoba, Colombia". */
    factsText: (nit: string, address: string): string => `NIT ${nit} · ${address}`,
    mission: 'Misión',
    vision: 'Visión',
  },
  nav: {
    label: 'Navegación principal',
    homeLink: 'Conducir J&R del Sinú, ir al inicio',
    links: {
      home: 'Inicio',
      about: 'Nosotros',
      services: 'Servicios',
      plans: 'Planes',
      faq: 'Preguntas frecuentes',
      contact: 'Contáctanos',
    },
    call: 'Llamar',
    write: 'Escríbenos',
    writeWhatsApp: 'Escríbenos por WhatsApp',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    mobileMenuLabel: 'Menú',
  },
  footer: {
    pages: 'Páginas',
    contact: 'Contacto',
    schedules: 'Horarios de clases',
    social: 'Redes',
    phonesLabel: 'WhatsApp y llamadas',
    /** "Teóricas · lun a vie". */
    theoryDay: (days: string): string => `Teóricas · ${days}`,
    theoryNight: 'Nocturnas',
    practice: 'Prácticas',
    /** "© 2026 Conducir J&R del Sinú · NIT 901722359-5". */
    copyright: (year: number, brandName: string, nit: string): string =>
      `© ${String(year)} ${brandName} · NIT ${nit}`,
    /** Crédito de diseño junto al copyright: "Designed by Joker" (el nombre en verde). */
    designedBy: 'Designed by',
    designer: 'Joker',
    dataPolicy: 'Política de Tratamiento de Datos',
  },
  privacyNotice: {
    label: 'Aviso de privacidad',
    textBefore: 'Medimos las visitas de forma anónima y sin cookies. Conoce nuestra ',
    link: 'Política de Tratamiento de Datos',
    textAfter: '.',
    dismiss: 'Entendido',
  },
  environment: {
    qaBadge: 'QA',
    qaDescription: 'Ambiente de pruebas',
  },
  errors: {
    title: 'Algo salió mal',
    text: 'No pudimos mostrar esta página. Recárgala o vuelve al inicio; si sigue fallando, escríbenos.',
    reload: 'Recargar la página',
    home: 'Volver al inicio',
  },
  faqTopics: {
    courses: 'Cursos',
    schedules: 'Horarios',
    pricing: 'Precios y requisitos',
    location: 'Ubicación',
  },
  seo: {
    siteName: 'Conducir J&R del Sinú',
    ogImageAlt: 'Conducir J&R del Sinú, Centro de Enseñanza Automovilística en Cereté, Córdoba',
    /** Catálogo de cursos en los datos estructurados. */
    coursesCatalog: 'Cursos de conducción',
    /** Descripciones para buscadores (máx. ~160 caracteres, sin cifras del contenido). */
    descriptions: {
      home: 'Cursos de conducción para licencias A2, B1 y C1 en Cereté, Córdoba. Clases teóricas de día o de noche y prácticas de lunes a sábado. Escríbenos por WhatsApp.',
      about:
        'Conoce a Conducir J&R del Sinú, Centro de Enseñanza Automovilística en Cereté: misión, visión, instructores certificados y horarios flexibles.',
      services:
        'Cursos de conducción para licencias A2, B1 y C1: motocicletas, vehículos particulares y de servicio público. Edad mínima y vehículos de cada licencia.',
      plans:
        'Planes de los cursos A2, B1 y C1 con sus horas de teoría, taller y manejo. Escríbenos por WhatsApp y te enviamos el precio y las promociones vigentes.',
      contact:
        'WhatsApp, celular, correo y redes de Conducir J&R del Sinú. Cómo llegar a la sede en Cereté, Córdoba, y horarios de clases teóricas y prácticas.',
      faq: 'Respuestas sobre edades, horas de cada curso, horarios de clases, requisitos, precios y ubicación de Conducir J&R del Sinú en Cereté.',
      dataPolicy:
        'Política de Tratamiento de Datos Personales de Conducir J&R del Sinú (Ley 1581 de 2012): derechos de los titulares, finalidades y canales de consulta.',
      notFound:
        'La página que buscas no existe o cambió de dirección. Vuelve al inicio de Conducir J&R del Sinú.',
    },
    /**
     * Vistas previas al compartir (Open Graph y X). Los títulos no repiten el nombre del
     * sitio (va en `og:site_name`) y las descripciones tienen máx. 80 caracteres para que
     * WhatsApp no las corte. Contáctanos, Preguntas frecuentes, Política de datos y la 404
     * usan el título de su página.
     */
    share: {
      titles: {
        home: 'Centro de Enseñanza Automovilística en Cereté',
        about: 'Nosotros: misión y visión',
        services: 'Cursos de conducción A2, B1 y C1',
        plans: 'Planes de los cursos A2, B1 y C1',
      },
      descriptions: {
        home: 'Licencias A2, B1 y C1: teoría de día o de noche y prácticas de lunes a sábado.',
        about: 'Conoce nuestra misión, visión e instructores certificados en Cereté.',
        services: 'Motos, vehículos particulares y de servicio público. Edad mínima por licencia.',
        plans: 'Horas de teoría, taller y manejo de cada curso. Pide el precio por WhatsApp.',
        contact: 'WhatsApp, llamadas, correo, redes y cómo llegar a la sede en Cereté, Córdoba.',
        faq: 'Edades, horas, horarios, requisitos y ubicación de los cursos de conducción.',
        dataPolicy: 'Cómo tratamos tus datos personales, según la Ley 1581 de 2012.',
        notFound: 'La página que buscas no existe. Vuelve al inicio.',
      },
    },
  },
  pages: {
    /** Título de la pestaña: "Planes · Conducir J&R del Sinú". */
    documentTitle: (page: string): string => `${page} · Conducir J&R del Sinú`,
    home: {
      documentTitle: 'Conducir J&R del Sinú · Centro de Enseñanza Automovilística en Cereté',
      title: 'Aprende a conducir con confianza',
      lead: 'Cursos para licencias A2, B1 y C1 con instructores certificados. Clases teóricas de día o de noche y prácticas de lunes a sábado.',
      seePlans: 'Ver planes',
      benefitsTitle: 'Por qué estudiar con nosotros',
      hoursEyebrow: 'Tu curso en horas',
      hoursTitle: 'Así se reparten tus horas de clase',
      hoursSubtitle:
        'Elige tu categoría y mira cuántas horas son de teoría, de taller y de manejo.',
      plansEyebrow: 'Planes',
      plansTitle: 'Elige tu licencia',
      plansSubtitle: 'Escríbenos y te enviamos el precio y las promociones vigentes.',
      plansLink: 'Ver la distribución de horas de cada plan',
      servicesEyebrow: 'Servicios',
      servicesTitle: 'Un curso para cada vehículo',
      testimonialsEyebrow: 'Testimonios',
      testimonialsTitle: 'Lo que dicen de nosotros',
      locationEyebrow: 'Visítanos',
      /** "Estamos en Cereté". */
      locationTitle: (city: string): string => `Estamos en ${city}`,
    },
    about: {
      title: 'Nosotros',
      statementsLabel: 'Misión y visión',
      differenceEyebrow: 'Lo que nos diferencia',
      differenceTitle: 'Instructores certificados y horarios que se ajustan a ti',
      ctaTitle: '¿Tienes preguntas sobre tu curso?',
      ctaText: 'Escríbenos y te contamos precios, requisitos y horarios.',
    },
    services: {
      title: 'Servicios',
      lead: 'Cursos de conducción para tres categorías de licencia. Mira para quién es cada una y qué vehículos cubre.',
      ctaTitle: '¿Cuántas horas dura cada curso?',
      ctaText: 'En Planes ves la distribución de teoría, taller y manejo, y consultas el precio.',
      ctaAction: 'Ver planes',
    },
    plans: {
      title: 'Planes',
      lead: 'Cada curso con su distribución de horas. Escríbenos y te enviamos el precio y las promociones vigentes.',
      gridLabel: 'Cursos y distribución de horas',
      faqEyebrow: 'Preguntas sobre los planes',
      faqTitle: 'Antes de elegir tu curso',
    },
    contact: {
      title: 'Contáctanos',
      lead: 'Escríbenos por WhatsApp: es la forma más rápida de resolver tus dudas sobre precios, requisitos y horarios.',
      channelsTitle: 'Todos nuestros canales',
      locationTitle: 'Cómo llegar a la sede',
      schedulesTitle: 'Horarios de clases',
    },
    faq: {
      title: 'Preguntas frecuentes',
      lead: 'Las dudas más comunes sobre edades, horas, horarios, precios y ubicación.',
      ctaTitle: '¿Tienes otra duda?',
      ctaText: 'Escríbenos y te respondemos por WhatsApp.',
    },
    dataPolicy: {
      title: 'Política de tratamiento de datos',
      /** "Conducir J&R del Sinú · NIT 901722359-5". */
      subtitle: (brandName: string, nit: string): string => `${brandName} · NIT ${nit}`,
      /** "Vigente desde el 15 de enero de 2024". */
      effective: (date: string): string => `Vigente desde el ${date}`,
      index: 'Índice',
    },
    notFound: {
      documentTitle: 'Página no encontrada',
      title: 'Te saliste de la vía',
      lead: 'La página que buscas no existe o cambió de dirección. Vuelve al inicio y retoma el camino.',
      arcLabel: 'Velocímetro en cero',
      home: 'Volver al inicio',
    },
  },
} as const;
