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
  },
  speedometer: {
    totalCaption: 'horas en total',
  },
  setup: {
    environmentReady: (envName: string): string => `Entorno listo · ambiente: ${envName}`,
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
} as const;
