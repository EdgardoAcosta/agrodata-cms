import { createError } from 'h3'

export type Category = {
  id: number
  name: string
  description: string
}

export type Label = {
  id: number
  name: string
  description: string
}

export type ProductPicture = {
  id: number
  productId: number
  imageUrl: string
  displayOrder: number
}

export type ProductFeature = {
  id: number
  productId: number
  featureText: string
  displayOrder: number
}

export type ProductSpecification = {
  id: number
  productId: number
  specName: string
  specValue: string
  createdAt: string
}

export type ProductTechnicalSpec = {
  id: number
  productId: number
  specName: string
  specValue: string
  createdAt: string
}

export type ProductSeoKeyword = {
  id: number
  productId: number
  keyword: string
  createdAt: string
}

export type ProductRecord = {
  id: number
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  currency: string
  inStock: boolean
  featured: boolean
  image: string
}

export type Product = ProductRecord & {
  categories: Category[]
  labels: Label[]
  pictures: ProductPicture[]
  features: ProductFeature[]
  specifications: ProductSpecification[]
  technicalSpecs: ProductTechnicalSpec[]
  relatedProductIds: number[]
  seoKeywords: string[]
}

type ProductCategory = { id: number; productId: number; categoryId: number }
type ProductLabel = { id: number; productId: number; labelId: number }
type ProductRelated = { productId: number; relatedProductId: number; createdAt: string }

const categories: Category[] = [
  { id: 1, name: 'Monitoreo', description: 'Sistemas de monitoreo y sensores' },
  { id: 2, name: 'Análisis', description: 'Servicios de análisis de suelo y cultivos' },
  { id: 3, name: 'Consultoría', description: 'Servicios de consultoría agrícola' },
  { id: 4, name: 'Tecnología', description: 'Tecnología avanzada para agricultura' },
  { id: 5, name: 'Software', description: 'Soluciones de software agrícola' },
  { id: 6, name: 'Alimentación Animal', description: 'Productos para alimentación animal' },
  { id: 7, name: 'Monitoreo', description: 'Sistemas de monitoreo y sensores' },
  { id: 8, name: 'Análisis', description: 'Servicios de análisis de suelo y cultivos' },
  { id: 9, name: 'Consultoría', description: 'Servicios de consultoría agrícola' },
  { id: 10, name: 'Tecnología', description: 'Tecnología avanzada para agricultura' },
  { id: 11, name: 'Software', description: 'Soluciones de software agrícola' },
  { id: 12, name: 'alimentación animal', description: 'Productos para alimentación animal' },
]

const labels: Label[] = [
  { id: 1, name: 'IoT', description: 'Internet de las cosas' },
  { id: 2, name: 'Premium', description: 'Productos premium' },
  { id: 3, name: 'Análisis', description: 'Análisis y datos' },
  { id: 4, name: 'Suelo', description: 'Relacionado con suelo' },
  { id: 5, name: 'Profesional', description: 'Servicios profesionales' },
  { id: 6, name: 'Laboratorio', description: 'Servicios de laboratorio' },
  { id: 7, name: 'Experto', description: 'Servicios de expertos' },
  { id: 8, name: 'Personalizado', description: 'Servicios personalizados' },
  { id: 9, name: 'Optimización', description: 'Optimización de procesos' },
  { id: 10, name: 'Básico', description: 'Productos básicos' },
  { id: 11, name: 'Económico', description: 'Productos económicos' },
  { id: 12, name: 'Inicial', description: 'Productos para iniciar' },
  { id: 13, name: 'Drones', description: 'Tecnología de drones' },
  { id: 14, name: 'Precisión', description: 'Agricultura de precisión' },
  { id: 15, name: 'Mapeo', description: 'Servicios de mapeo' },
  { id: 16, name: 'Gestión', description: 'Gestión y administración' },
  { id: 17, name: 'Digital', description: 'Soluciones digitales' },
  { id: 18, name: 'Nube', description: 'Servicios en la nube' },
  { id: 19, name: 'iniciador', description: 'Productos iniciadores' },
  { id: 20, name: 'vitaminas', description: 'Con vitaminas' },
  { id: 21, name: 'minerales orgánicos', description: 'Minerales orgánicos' },
  { id: 22, name: 'becerras', description: 'Para becerras' },
  { id: 23, name: 'crecimiento', description: 'Para crecimiento' },
  { id: 24, name: 'minerales', description: 'Con minerales' },
  { id: 25, name: 'becerros', description: 'Para becerros' },
  { id: 26, name: 'crecimiento', description: 'Para crecimiento' },
  { id: 27, name: 'minerales', description: 'Con minerales' },
  { id: 28, name: 'becerros', description: 'Para becerros' },
  { id: 29, name: 'IoT', description: 'Internet de las cosas' },
  { id: 30, name: 'Premium', description: 'Productos premium' },
  { id: 31, name: 'Análisis', description: 'Análisis y datos' },
  { id: 32, name: 'Suelo', description: 'Relacionado con suelo' },
  { id: 33, name: 'Profesional', description: 'Servicios profesionales' },
  { id: 34, name: 'Laboratorio', description: 'Servicios de laboratorio' },
  { id: 35, name: 'Experto', description: 'Servicios de expertos' },
  { id: 36, name: 'Personalizado', description: 'Servicios personalizados' },
  { id: 37, name: 'Optimización', description: 'Optimización de procesos' },
  { id: 38, name: 'Básico', description: 'Productos básicos' },
  { id: 39, name: 'Económico', description: 'Productos económicos' },
  { id: 40, name: 'Inicial', description: 'Productos para iniciar' },
  { id: 41, name: 'Drones', description: 'Tecnología de drones' },
  { id: 42, name: 'Precisión', description: 'Agricultura de precisión' },
  { id: 43, name: 'Mapeo', description: 'Servicios de mapeo' },
  { id: 44, name: 'Gestión', description: 'Gestión y administración' },
  { id: 45, name: 'Digital', description: 'Soluciones digitales' },
  { id: 46, name: 'Nube', description: 'Servicios en la nube' },
  { id: 47, name: 'iniciador', description: 'Productos iniciadores' },
  { id: 48, name: 'vitaminas', description: 'Con vitaminas' },
  { id: 49, name: 'minerales orgánicos', description: 'Minerales orgánicos' },
  { id: 50, name: 'becerras', description: 'Para becerras' },
  { id: 51, name: 'crecimiento', description: 'Para crecimiento' },
  { id: 52, name: 'minerales', description: 'Con minerales' },
  { id: 53, name: 'becerros', description: 'Para becerros' },
]

const products: ProductRecord[] = [
  {
    id: 1,
    name: 'Vimicalf',
    slug: 'vimicalf',
    description:
      'Vimicalf es un concentrado iniciador para becerras, en forma peletizada altamente palatable. Estimula el desarrollo del rumen e incrementa la superficie de absorción de las papilas ruminales, mejorando el comportamiento de animales, ganancia diaria de peso y destete más temprano.',
    shortDescription: 'Alimento iniciador premium para becerras.',
    price: 2800,
    currency: 'MXN',
    inStock: true,
    featured: true,
    image: '/assets/img/products/product-box.svg',
  },
  {
    id: 2,
    name: 'Desarrollo High Performance (DHP)',
    slug: 'desarrollo-high-performance-dhp',
    description:
      'DHP es un concentrado balanceado para potencializar el desarrollo y crecimiento de bovinos, científicamente diseñado y balanceado para complementar el programa de alimentación en base a forrajes de buena calidad. Contiene el balance adecuado de proteínas degradables en el rumen, vitaminas y minerales de alta biodisponibilidad para expresar el potencial genético en su etapa productiva.',
    shortDescription: 'Concentrado para desarrollo de becerros en etapa de crecimiento.',
    price: 2600,
    currency: 'MXN',
    inStock: true,
    featured: true,
    image: '/assets/img/products/product-box.svg',
  },
  {
    id: 3,
    name: 'Bura Landeer',
    slug: 'bura-landeer',
    description:
      'Concentrado peletizado premium para cervatos, con el aporte adecuado de energía, proteína, minerales, vitaminas y aditivos. Su fórmula integra premezclas especiales de minerales de alta biodisponibilidad, vitaminas y aditivos que mejoran la salud intestinal y favorecen el desarrollo ruminal óptimo de los cervatos.',
    shortDescription: 'Alimento completo peletizado para cervatos en etapas Starter y Grower.',
    price: 3000,
    currency: 'MXN',
    inStock: true,
    featured: true,
    image: '/assets/img/products/product-box.svg',
  },
  {
    id: 4,
    name: 'MILK CHOICE',
    slug: 'milk-choice',
    description:
      'Concentrado para vacas lecheras en producción, con el aporte adecuado de energía, proteína, minerales, vitaminas y aditivos. MILK CHOICE es formulado científicamente para vacas lecheras, está recomendado para ser utilizado en explotaciones con ganado de alto potencial genético y cuya alimentación está basada en forrajes de buena calidad. Su balance energético proteico, activa e incrementa la función ruminal cubriendo los requerimientos de los microorganismos ruminales, mejorando el desempeño y la productividad de los animales.',
    shortDescription: 'Concentrado para vacas lecheras en producción',
    price: 3000,
    currency: 'MXN',
    inStock: true,
    featured: true,
    image: '/assets/img/products/product-box.svg',
  },
  {
    id: 5,
    name: 'RANGE BUSTER',
    slug: 'range-buster',
    description:
      'RANGE BUSTER es un suplemento a libre acceso alto en Proteína, Minerales y Vitaminas para ganado bovino en pastoreo o consumiendo raciones con alto contenido de forraje. Está diseñado para el invierno o la temporada de sequía. La proteína de los suplementos RANGE BUSTER proviene tanto de fuentes naturales de origen vegetal, como de nitrógeno no proteico, principalmente de BIURET. RANGE BUSTER es un producto exclusivo de ADM Alliance Nutrition, cuyo nitrógeno es liberado gradualmente en el rumen, para proveer un aporte prolongado de nitrógeno a los microorganismos del rumen. El diseño de las fuentes de minerales, vitaminas y la exclusiva fuente de proteínas de RANGE BUSTER, permite una mejor utilización del forraje, lo que repercutirá en una mejor condición corporal, mejor desempeño productivo y reproductivo del ganado.',
    shortDescription: 'Suplemento a libre acceso para ganado bovino en pastoreo',
    price: 3000,
    currency: 'MXN',
    inStock: true,
    featured: true,
    image: '/assets/img/products/product-box.svg',
  },
  {
    id: 6,
    name: 'SHOW BOS',
    slug: 'show-bos',
    description:
      'SHOW BOS es un concentrado/suplemento para la alimentación de Bovinos. Producto versátil que de acuerdo al fin zootécnico, funciona como concentrado para animales alimentados a base de forraje (desarrollo), o como suplemento para animales, en los que se busca además de un buen desarrollo, una mayor GDP. Contiene una combinación de granos de cereales y pastas de oleaginosas, obteniendo un balance adecuado de nutrientes degradables en el rumen y de sobrepaso. Es también fuente de minerales de alta biodisponibilidad. Aporta las vitaminas en niveles adecuados para obtener un buen desarrollo y tener buenas bases para que los animales expresen su potencial genético en su etapa productiva, es enriquecido con aditivos para potencializar el uso de los ingredientes que consumen en la dieta total.',
    shortDescription: 'Concentrado/Suplemento para Bovinos',
    price: 3000,
    currency: 'MXN',
    inStock: true,
    featured: true,
    image: '/assets/img/products/product-box.svg',
  },
  {
    id: 7,
    name: 'VIMI SHEEP RANGE MINERAL',
    slug: 'vimi-sheep-range-mineral',
    description:
      'VIMI SHEEP, RANGE MINERAL es un suplemento a libre acceso que aporta Minerales y Vitaminas para ganado ovino en pastoreo o consumiendo raciones con alto contenido de forraje. Proporciona minerales, vitaminas y modificador de la fermentación ruminal, componentes esenciales para un adecuado crecimiento, producción y reproducción. Estos nutrientes también mejoran la actividad de los microorganismos del rumen para una eficiente utilización del pasto o forraje con baja disponibilidad. Este mineral está provisto de protección WEATHERMASTER, un proceso que permite la compactación de los ingredientes con una dureza ideal para asegurar el correcto consumo a libre acceso. Este diseñado para proporcionar el nivel adecuado de minerales, proteínas y vitaminas para el ganado, haciendo más eficiente las fuentes de forraje que consume el ganado.',
    shortDescription: 'Suplemento mineral para ovinos en pastoreo',
    price: 3000,
    currency: 'MXN',
    inStock: true,
    featured: true,
    image: '/assets/img/products/product-box.svg',
  },
  {
    id: 8,
    name: 'RANCH BLOCK',
    slug: 'ranch-block',
    description:
      'RANCH BLOCK: suplementos a libre acceso para ganado bovino productor de carne en pastoreo o alimentado con raciones a base de forraje. Línea de suplementos proteicos en presentación de blocks, los cuales contienen una mezcla de ingredientes de origen vegetal, minerales y vitaminas. Buscando proveer a los microorganismos del rumen los nutrientes necesarios para su funcionamiento. Los diferentes colores nos dan un indicador de dureza, para el manejo y control de los consumos; Rojo A blando, Café A Duro y Café Extra duro. Puede estar en el suelo, pero de preferencia colocarlo en comederos o jaulas.',
    shortDescription: 'Suplementos en bloques para ganado bovino de carne',
    price: 3000,
    currency: 'MXN',
    inStock: true,
    featured: true,
    image: '/assets/img/products/product-box.svg',
  },
  {
    id: 9,
    name: 'SHEEP RANGE TUB MINERAL',
    slug: 'sheep-range-tub-mineral',
    description:
      'SHEEP RANGE, TUB MINERAL es un suplemento mineral y proteico a libre acceso que aporta Minerales, Vitaminas y Proteínas para ganado ovino en pastoreo o consumiendo raciones con alto contenido de forraje. SHEEP RANGE, TUB MINERAL está diseñado para ser utilizado en condiciones en las cuales el forraje no aporta la proteína requerida para el buen funcionamiento del rumen o la temporada de sequía, proporciona minerales, vitaminas y proteínas de origen natural, componentes esenciales para un adecuado crecimiento, producción y reproducción. Estos nutrientes también mejoran la actividad de los microorganismos del rumen para una eficiente utilización del pasto o forraje con baja disponibilidad de proteína en el mismo. SHEEP RANGE TUB MINERAL se presenta en forma sólida con un empaque que permite la compactación de los ingredientes con una dureza ideal para asegurar el correcto consumo a libre acceso. Está diseñado para proporcionar el nivel adecuado de minerales, proteínas y vitaminas para el ganado, haciendo más eficiente las fuentes de forraje que consume el ganado.',
    shortDescription: 'Suplemento mineral y proteico para ovinos en pastoreo',
    price: 3000,
    currency: 'MXN',
    inStock: true,
    featured: true,
    image: '/assets/img/products/product-box.svg',
  },
  {
    id: 10,
    name: 'DESARROLLO HIGH PERFORMANCE (DHP)',
    slug: 'desarrollo-high-performance',
    description:
      'DHP, Concentrado para bovinos en desarrollo, con el aporte adecuado de Energía, Proteína, Minerales, Vitaminas y Aditivos. DHP, es un concentrado indicado para potencializar el desarrollo y crecimiento de bovinos, el cual está científicamente diseñado y balanceado para complementar el programa de alimentación en base a forrajes de buena calidad. Contiene una combinación de granos de cereales y pastas de oleaginosas, obteniendo un balance adecuado de nutrientes degradables en el rumen y de sobrepaso. Es también fuente de minerales de alta biodisponibilidad. Aporta las vitaminas en niveles adecuados para obtener un buen desarrollo y tener buenas bases para que los animales expresen su potencial genético en su etapa productiva, es enriquecido con aditivos para potencializar el uso de los ingredientes que consumen en la dieta total.',
    shortDescription: 'Concentrado para bovinos en desarrollo y crecimiento',
    price: 3000,
    currency: 'MXN',
    inStock: true,
    featured: true,
    image: '/assets/img/products/product-box.svg',
  },
  {
    id: 11,
    name: 'PROSPECTOR',
    slug: 'prospector',
    description:
      'PROSPECTOR es un suplemento de Minerales y Vitaminas para bovinos alimentados a base de forrajes o en pastoreo. Proporciona macrominerales y vitaminas, en especial un nivel alto de Calcio y Fósforo altamente asimilables a partir del Fosfato monocálcico. Este suplemento contribuye a cubrir los requerimientos de nutrientes indispensables para lograr un buen desarrollo del feto, una adecuada producción de leche y un buen comportamiento reproductivo.',
    shortDescription: 'Suplemento de Minerales y Vitaminas para bovinos',
    price: 3000,
    currency: 'MXN',
    inStock: true,
    featured: true,
    image: '/assets/img/products/product-box.svg',
  },
  {
    id: 12,
    name: 'RANCH CUBE',
    slug: 'ranch-cube',
    description:
      'RANCH CUBE es un suplemento de Energía, Proteína, Minerales y Vitaminas, para ganado en pastoreo, cuando se requiere reforzar el aporte de nutrientes. RANCH CUBE, es un excelente método alternativo para suplementar fuentes de energía, proteína, minerales y vitaminas, en forma de cubos. En raciones a base de forrajes bajos en energía, el nitrógeno que es proveído por el BIURET® es liberado en forma gradual, el cual da un suministro uniforme a los microorganismos minerales. Se recomienda su utilización en aquellas situaciones en donde el forraje es escaso y de baja calidad. RANCH CUBE, es un diseño exclusivo de VIMIFOS para alimentar al ganado bovino en pastoreo, crecimiento, desarrollo, mantenimiento y producción. Aporta energía, proteína, minerales y vitaminas. Estimula la actividad de los microorganismos ruminales para el uso eficiente del forraje. Es de gran utilidad en el manejo de la suplementación del ganado. Ayuda a la recuperación de la condición corporal los animales, y compensa óptimamente el limitado aporte nutricional de los pastos pobres y escasos.',
    shortDescription: 'Suplemento en cubos para ganado en pastoreo',
    price: 3000,
    currency: 'MXN',
    inStock: true,
    featured: true,
    image: '/assets/img/products/product-box.svg',
  },
]

const productPictures: ProductPicture[] = [
  { id: 1, productId: 1, imageUrl: '/assets/img/products/monitoring-system.svg', displayOrder: 0 },
  { id: 2, productId: 1, imageUrl: '/assets/img/products/monitoring-system.svg', displayOrder: 1 },
  { id: 3, productId: 1, imageUrl: '/assets/img/products/monitoring-system.svg', displayOrder: 2 },
  { id: 4, productId: 2, imageUrl: '/assets/img/products/monitoring-system.svg', displayOrder: 0 },
  { id: 5, productId: 2, imageUrl: '/assets/img/products/monitoring-system.svg', displayOrder: 1 },
  { id: 6, productId: 2, imageUrl: '/assets/img/products/monitoring-system.svg', displayOrder: 2 },
  { id: 7, productId: 3, imageUrl: '/assets/img/products/product-box.svg', displayOrder: 0 },
  { id: 8, productId: 4, imageUrl: '/assets/img/products/product-box.svg', displayOrder: 0 },
  { id: 9, productId: 5, imageUrl: '/assets/img/products/product-box.svg', displayOrder: 0 },
  { id: 10, productId: 6, imageUrl: '/assets/img/products/product-box.svg', displayOrder: 0 },
  { id: 11, productId: 7, imageUrl: '/assets/img/products/product-box.svg', displayOrder: 0 },
  { id: 12, productId: 8, imageUrl: '/assets/img/products/product-box.svg', displayOrder: 0 },
  { id: 13, productId: 9, imageUrl: '/assets/img/products/product-box.svg', displayOrder: 0 },
  { id: 14, productId: 10, imageUrl: '/assets/img/products/product-box.svg', displayOrder: 0 },
  { id: 15, productId: 11, imageUrl: '/assets/img/products/product-box.svg', displayOrder: 0 },
  { id: 16, productId: 12, imageUrl: '/assets/img/products/product-box.svg', displayOrder: 0 },
]

const productCategories: ProductCategory[] = [
  { id: 1, productId: 1, categoryId: 6 },
  { id: 2, productId: 2, categoryId: 6 },
  { id: 3, productId: 3, categoryId: 6 },
  { id: 4, productId: 4, categoryId: 6 },
  { id: 5, productId: 5, categoryId: 6 },
  { id: 6, productId: 6, categoryId: 6 },
  { id: 7, productId: 7, categoryId: 6 },
  { id: 8, productId: 8, categoryId: 6 },
  { id: 9, productId: 9, categoryId: 6 },
  { id: 10, productId: 10, categoryId: 6 },
  { id: 11, productId: 11, categoryId: 6 },
  { id: 12, productId: 12, categoryId: 6 },
]

const productLabels: ProductLabel[] = [
  { id: 1, productId: 1, labelId: 19 },
  { id: 2, productId: 1, labelId: 20 },
  { id: 3, productId: 1, labelId: 21 },
  { id: 4, productId: 1, labelId: 22 },
  { id: 5, productId: 2, labelId: 23 },
  { id: 6, productId: 2, labelId: 20 },
  { id: 7, productId: 2, labelId: 24 },
  { id: 8, productId: 2, labelId: 25 },
  { id: 9, productId: 3, labelId: 20 },
  { id: 10, productId: 3, labelId: 24 },
  { id: 11, productId: 4, labelId: 20 },
  { id: 12, productId: 4, labelId: 24 },
  { id: 13, productId: 5, labelId: 20 },
  { id: 14, productId: 5, labelId: 24 },
  { id: 15, productId: 6, labelId: 20 },
  { id: 16, productId: 6, labelId: 24 },
  { id: 17, productId: 7, labelId: 20 },
  { id: 18, productId: 7, labelId: 24 },
  { id: 19, productId: 8, labelId: 20 },
  { id: 20, productId: 8, labelId: 24 },
  { id: 21, productId: 9, labelId: 20 },
  { id: 22, productId: 9, labelId: 24 },
  { id: 23, productId: 10, labelId: 20 },
  { id: 24, productId: 10, labelId: 24 },
  { id: 25, productId: 11, labelId: 20 },
  { id: 26, productId: 11, labelId: 24 },
  { id: 27, productId: 12, labelId: 20 },
  { id: 28, productId: 12, labelId: 24 },
]

const productFeatures: ProductFeature[] = [
  { id: 1, productId: 1, featureText: 'Presentación 40 kg', displayOrder: 0 },
  { id: 2, productId: 1, featureText: 'Alta biodisponibilidad de minerales', displayOrder: 1 },
  { id: 3, productId: 1, featureText: 'Incluye levaduras vivas', displayOrder: 2 },
  { id: 4, productId: 1, featureText: 'Modificadores de fermentación ruminal', displayOrder: 3 },
  { id: 5, productId: 1, featureText: 'Aporte balanceado de proteína y energía', displayOrder: 4 },
  { id: 6, productId: 1, featureText: 'Estimula desarrollo de rumen', displayOrder: 5 },
  { id: 7, productId: 1, featureText: 'Ayuda a destete más temprano', displayOrder: 6 },
  { id: 8, productId: 1, featureText: 'Mejora la ganancia de peso', displayOrder: 7 },
  { id: 9, productId: 1, featureText: 'Alta palatabilidad', displayOrder: 8 },
  { id: 10, productId: 1, featureText: 'Tecnología CitriStim, Xtract, Alkosel', displayOrder: 9 },
  { id: 11, productId: 2, featureText: 'Presentación 40 kg', displayOrder: 0 },
  { id: 12, productId: 2, featureText: 'Alto contenido energético', displayOrder: 1 },
  { id: 13, productId: 2, featureText: 'Balance ideal de proteínas degradables', displayOrder: 2 },
  { id: 14, productId: 2, featureText: 'Tecnología CitriStim, Aminosoy, d-alpha', displayOrder: 3 },
  { id: 15, productId: 2, featureText: 'Vitaminas y minerales de alta biodisponibilidad', displayOrder: 4 },
  { id: 16, productId: 2, featureText: 'Mejora la conversión alimenticia', displayOrder: 5 },
  { id: 17, productId: 2, featureText: 'Estimula el crecimiento', displayOrder: 6 },
  { id: 18, productId: 2, featureText: 'Fortalece el sistema inmunológico', displayOrder: 7 },
  { id: 19, productId: 3, featureText: 'Producto de alta calidad', displayOrder: 0 },
  { id: 20, productId: 3, featureText: 'Formulado científicamente', displayOrder: 1 },
  { id: 21, productId: 3, featureText: 'Rico en vitaminas y minerales', displayOrder: 2 },
  { id: 22, productId: 4, featureText: 'Producto de alta calidad', displayOrder: 0 },
  { id: 23, productId: 4, featureText: 'Formulado científicamente', displayOrder: 1 },
  { id: 24, productId: 4, featureText: 'Rico en vitaminas y minerales', displayOrder: 2 },
  { id: 25, productId: 5, featureText: 'Producto de alta calidad', displayOrder: 0 },
  { id: 26, productId: 5, featureText: 'Formulado científicamente', displayOrder: 1 },
  { id: 27, productId: 5, featureText: 'Rico en vitaminas y minerales', displayOrder: 2 },
  { id: 28, productId: 6, featureText: 'Producto de alta calidad', displayOrder: 0 },
  { id: 29, productId: 6, featureText: 'Formulado científicamente', displayOrder: 1 },
  { id: 30, productId: 6, featureText: 'Rico en vitaminas y minerales', displayOrder: 2 },
  { id: 31, productId: 7, featureText: 'Producto de alta calidad', displayOrder: 0 },
  { id: 32, productId: 7, featureText: 'Formulado científicamente', displayOrder: 1 },
  { id: 33, productId: 7, featureText: 'Rico en vitaminas y minerales', displayOrder: 2 },
  { id: 34, productId: 8, featureText: 'Producto de alta calidad', displayOrder: 0 },
  { id: 35, productId: 8, featureText: 'Formulado científicamente', displayOrder: 1 },
  { id: 36, productId: 8, featureText: 'Rico en vitaminas y minerales', displayOrder: 2 },
  { id: 37, productId: 9, featureText: 'Producto de alta calidad', displayOrder: 0 },
  { id: 38, productId: 9, featureText: 'Formulado científicamente', displayOrder: 1 },
  { id: 39, productId: 9, featureText: 'Rico en vitaminas y minerales', displayOrder: 2 },
  { id: 40, productId: 10, featureText: 'Producto de alta calidad', displayOrder: 0 },
  { id: 41, productId: 10, featureText: 'Formulado científicamente', displayOrder: 1 },
  { id: 42, productId: 10, featureText: 'Rico en vitaminas y minerales', displayOrder: 2 },
  { id: 43, productId: 11, featureText: 'Producto de alta calidad', displayOrder: 0 },
  { id: 44, productId: 11, featureText: 'Formulado científicamente', displayOrder: 1 },
  { id: 45, productId: 11, featureText: 'Rico en vitaminas y minerales', displayOrder: 2 },
  { id: 46, productId: 12, featureText: 'Producto de alta calidad', displayOrder: 0 },
  { id: 47, productId: 12, featureText: 'Formulado científicamente', displayOrder: 1 },
  { id: 48, productId: 12, featureText: 'Rico en vitaminas y minerales', displayOrder: 2 },
]

const productSpecifications: ProductSpecification[] = [
  { id: 1, productId: 1, specName: 'Materia seca', specValue: '88%', createdAt: '2025-07-04 05:04:17' },
  { id: 2, productId: 1, specName: 'Proteína cruda', specValue: '20%', createdAt: '2025-07-04 05:04:17' },
  { id: 3, productId: 1, specName: 'Grasa cruda', specValue: '3.5%', createdAt: '2025-07-04 05:04:17' },
  { id: 4, productId: 1, specName: 'Cenizas', specValue: '6.5%', createdAt: '2025-07-04 05:04:17' },
  { id: 5, productId: 1, specName: 'Calcio', specValue: '0.8%', createdAt: '2025-07-04 05:04:17' },
  { id: 6, productId: 1, specName: 'Fósforo', specValue: '0.7%', createdAt: '2025-07-04 05:04:17' },
  { id: 7, productId: 1, specName: 'Presentación', specValue: 'Saco de 40 kg', createdAt: '2025-07-04 05:04:17' },
  { id: 8, productId: 1, specName: 'Tecnologías', specValue: 'CitriStim, Xtract, Alkosel, d-alpha', createdAt: '2025-07-04 05:04:17' },
  { id: 9, productId: 2, specName: 'Materia seca', specValue: '89%', createdAt: '2025-07-04 05:04:19' },
  { id: 10, productId: 2, specName: 'Proteína cruda', specValue: '18%', createdAt: '2025-07-04 05:04:19' },
  { id: 11, productId: 2, specName: 'Grasa cruda', specValue: '4%', createdAt: '2025-07-04 05:04:19' },
  { id: 12, productId: 2, specName: 'Fibra cruda', specValue: '8%', createdAt: '2025-07-04 05:04:19' },
  { id: 13, productId: 2, specName: 'Cenizas', specValue: '7%', createdAt: '2025-07-04 05:04:19' },
  { id: 14, productId: 2, specName: 'Calcio', specValue: '0.9%', createdAt: '2025-07-04 05:04:19' },
  { id: 15, productId: 2, specName: 'Fósforo', specValue: '0.6%', createdAt: '2025-07-04 05:04:19' },
  { id: 16, productId: 2, specName: 'Presentación', specValue: 'Saco de 40 kg', createdAt: '2025-07-04 05:04:19' },
  { id: 17, productId: 3, specName: 'Presentación', specValue: 'Saco de 40 kg', createdAt: '2025-07-04 05:04:22' },
  { id: 18, productId: 3, specName: 'Conservación', specValue: 'Lugar fresco y seco', createdAt: '2025-07-04 05:04:22' },
  { id: 19, productId: 4, specName: 'Presentación', specValue: 'Saco de 40 kg', createdAt: '2025-07-04 05:04:22' },
  { id: 20, productId: 4, specName: 'Conservación', specValue: 'Lugar fresco y seco', createdAt: '2025-07-04 05:04:22' },
  { id: 21, productId: 5, specName: 'Presentación', specValue: 'Saco de 40 kg', createdAt: '2025-07-04 05:04:22' },
  { id: 22, productId: 5, specName: 'Conservación', specValue: 'Lugar fresco y seco', createdAt: '2025-07-04 05:04:22' },
  { id: 23, productId: 6, specName: 'Presentación', specValue: 'Saco de 40 kg', createdAt: '2025-07-04 05:04:22' },
  { id: 24, productId: 6, specName: 'Conservación', specValue: 'Lugar fresco y seco', createdAt: '2025-07-04 05:04:22' },
  { id: 25, productId: 7, specName: 'Presentación', specValue: 'Saco de 40 kg', createdAt: '2025-07-04 05:04:22' },
  { id: 26, productId: 7, specName: 'Conservación', specValue: 'Lugar fresco y seco', createdAt: '2025-07-04 05:04:22' },
  { id: 27, productId: 8, specName: 'Presentación', specValue: 'Saco de 40 kg', createdAt: '2025-07-04 05:04:22' },
  { id: 28, productId: 8, specName: 'Conservación', specValue: 'Lugar fresco y seco', createdAt: '2025-07-04 05:04:22' },
  { id: 29, productId: 9, specName: 'Presentación', specValue: 'Saco de 40 kg', createdAt: '2025-07-04 05:04:22' },
  { id: 30, productId: 9, specName: 'Conservación', specValue: 'Lugar fresco y seco', createdAt: '2025-07-04 05:04:22' },
  { id: 31, productId: 10, specName: 'Presentación', specValue: 'Saco de 40 kg', createdAt: '2025-07-04 05:04:22' },
  { id: 32, productId: 10, specName: 'Conservación', specValue: 'Lugar fresco y seco', createdAt: '2025-07-04 05:04:22' },
  { id: 33, productId: 11, specName: 'Presentación', specValue: 'Saco de 40 kg', createdAt: '2025-07-04 05:04:22' },
  { id: 34, productId: 11, specName: 'Conservación', specValue: 'Lugar fresco y seco', createdAt: '2025-07-04 05:04:22' },
  { id: 35, productId: 12, specName: 'Presentación', specValue: 'Saco de 40 kg', createdAt: '2025-07-04 05:04:22' },
  { id: 36, productId: 12, specName: 'Conservación', specValue: 'Lugar fresco y seco', createdAt: '2025-07-04 05:04:22' },
]

const productTechnicalSpecs: ProductTechnicalSpec[] = [
  { id: 1, productId: 1, specName: 'etapa de consumo', specValue: 'A partir de los 4 días de edad', createdAt: '2025-07-04 05:04:24' },
  { id: 2, productId: 1, specName: 'conservación', specValue: 'Lugar fresco y seco', createdAt: '2025-07-04 05:04:24' },
  { id: 3, productId: 1, specName: 'especie objetivo', specValue: 'Becerras', createdAt: '2025-07-04 05:04:24' },
  { id: 4, productId: 2, specName: 'etapa de consumo', specValue: 'Becerros de 3-18 meses', createdAt: '2025-07-04 05:04:24' },
  { id: 5, productId: 2, specName: 'conservación', specValue: 'Lugar fresco y seco', createdAt: '2025-07-04 05:04:24' },
  { id: 6, productId: 2, specName: 'especie objetivo', specValue: 'Becerros en crecimiento', createdAt: '2025-07-04 05:04:24' },
]

const productRelated: ProductRelated[] = [
  { productId: 1, relatedProductId: 3, createdAt: '2025-07-04 05:04:26' },
  { productId: 1, relatedProductId: 5, createdAt: '2025-07-04 05:04:26' },
  { productId: 1, relatedProductId: 6, createdAt: '2025-07-04 05:04:26' },
  { productId: 2, relatedProductId: 1, createdAt: '2025-07-04 05:04:26' },
  { productId: 2, relatedProductId: 4, createdAt: '2025-07-04 05:04:26' },
  { productId: 2, relatedProductId: 6, createdAt: '2025-07-04 05:04:26' },
  { productId: 3, relatedProductId: 1, createdAt: '2025-07-04 05:04:26' },
  { productId: 3, relatedProductId: 2, createdAt: '2025-07-04 05:04:26' },
  { productId: 4, relatedProductId: 2, createdAt: '2025-07-04 05:04:26' },
  { productId: 4, relatedProductId: 5, createdAt: '2025-07-04 05:04:26' },
  { productId: 5, relatedProductId: 1, createdAt: '2025-07-04 05:04:26' },
  { productId: 5, relatedProductId: 4, createdAt: '2025-07-04 05:04:26' },
  { productId: 6, relatedProductId: 1, createdAt: '2025-07-04 05:04:26' },
  { productId: 6, relatedProductId: 2, createdAt: '2025-07-04 05:04:26' },
]

const productSeoKeywords: ProductSeoKeyword[] = [
  { id: 1, productId: 1, keyword: 'alimento iniciador becerras', createdAt: '2025-07-04 05:04:29' },
  { id: 2, productId: 1, keyword: 'concentrado becerras', createdAt: '2025-07-04 05:04:29' },
  { id: 3, productId: 1, keyword: 'vimicalf', createdAt: '2025-07-04 05:04:29' },
  { id: 4, productId: 1, keyword: 'destete temprano', createdAt: '2025-07-04 05:04:29' },
  { id: 5, productId: 1, keyword: 'desarrollo rumen', createdAt: '2025-07-04 05:04:29' },
  { id: 6, productId: 1, keyword: 'ganancia peso becerras', createdAt: '2025-07-04 05:04:29' },
  { id: 7, productId: 1, keyword: 'alimentación becerras', createdAt: '2025-07-04 05:04:29' },
  { id: 8, productId: 1, keyword: 'vitaminas minerales becerras', createdAt: '2025-07-04 05:04:29' },
  { id: 9, productId: 1, keyword: 'levaduras vivas', createdAt: '2025-07-04 05:04:29' },
  { id: 10, productId: 1, keyword: 'citristim xtract', createdAt: '2025-07-04 05:04:29' },
  { id: 11, productId: 1, keyword: 'peletizado becerras', createdAt: '2025-07-04 05:04:29' },
  { id: 12, productId: 1, keyword: 'nutrición animal', createdAt: '2025-07-04 05:04:29' },
  { id: 13, productId: 1, keyword: 'becerras lecheras', createdAt: '2025-07-04 05:04:29' },
  { id: 14, productId: 1, keyword: 'iniciador premium', createdAt: '2025-07-04 05:04:29' },
  { id: 15, productId: 1, keyword: 'minerales orgánicos', createdAt: '2025-07-04 05:04:29' },
  { id: 16, productId: 2, keyword: 'concentrado desarrollo becerros', createdAt: '2025-07-04 05:04:32' },
  { id: 17, productId: 2, keyword: 'high performance', createdAt: '2025-07-04 05:04:32' },
  { id: 18, productId: 2, keyword: 'dhp concentrado', createdAt: '2025-07-04 05:04:32' },
  { id: 19, productId: 2, keyword: 'crecimiento bovinos', createdAt: '2025-07-04 05:04:32' },
  { id: 20, productId: 2, keyword: 'alimentación becerros', createdAt: '2025-07-04 05:04:32' },
  { id: 21, productId: 2, keyword: 'proteínas degradables', createdAt: '2025-07-04 05:04:32' },
  { id: 22, productId: 2, keyword: 'vitaminas minerales', createdAt: '2025-07-04 05:04:32' },
  { id: 23, productId: 2, keyword: 'potencial genético', createdAt: '2025-07-04 05:04:32' },
  { id: 24, productId: 2, keyword: 'forrajes calidad', createdAt: '2025-07-04 05:04:32' },
  { id: 25, productId: 2, keyword: 'desarrollo becerros', createdAt: '2025-07-04 05:04:32' },
  { id: 26, productId: 2, keyword: 'nutrición bovina', createdAt: '2025-07-04 05:04:32' },
  { id: 27, productId: 2, keyword: 'concentrado premium', createdAt: '2025-07-04 05:04:32' },
  { id: 28, productId: 3, keyword: 'alimentación animal', createdAt: '2025-07-04 05:04:35' },
  { id: 29, productId: 3, keyword: 'nutrición bovina', createdAt: '2025-07-04 05:04:35' },
  { id: 30, productId: 3, keyword: 'Bura Landeer', createdAt: '2025-07-04 05:04:35' },
  { id: 31, productId: 4, keyword: 'alimentación animal', createdAt: '2025-07-04 05:04:35' },
  { id: 32, productId: 4, keyword: 'nutrición bovina', createdAt: '2025-07-04 05:04:35' },
  { id: 33, productId: 4, keyword: 'MILK CHOICE', createdAt: '2025-07-04 05:04:35' },
  { id: 34, productId: 5, keyword: 'alimentación animal', createdAt: '2025-07-04 05:04:35' },
  { id: 35, productId: 5, keyword: 'nutrición bovina', createdAt: '2025-07-04 05:04:35' },
  { id: 36, productId: 5, keyword: 'RANGE BUSTER', createdAt: '2025-07-04 05:04:35' },
  { id: 37, productId: 6, keyword: 'alimentación animal', createdAt: '2025-07-04 05:04:35' },
  { id: 38, productId: 6, keyword: 'nutrición bovina', createdAt: '2025-07-04 05:04:35' },
  { id: 39, productId: 6, keyword: 'SHOW BOS', createdAt: '2025-07-04 05:04:35' },
  { id: 40, productId: 7, keyword: 'alimentación animal', createdAt: '2025-07-04 05:04:35' },
  { id: 41, productId: 7, keyword: 'nutrición ovina', createdAt: '2025-07-04 05:04:35' },
  { id: 42, productId: 7, keyword: 'VIMI SHEEP', createdAt: '2025-07-04 05:04:35' },
  { id: 43, productId: 8, keyword: 'alimentación animal', createdAt: '2025-07-04 05:04:35' },
  { id: 44, productId: 8, keyword: 'nutrición bovina', createdAt: '2025-07-04 05:04:35' },
  { id: 45, productId: 8, keyword: 'RANCH BLOCK', createdAt: '2025-07-04 05:04:35' },
  { id: 46, productId: 9, keyword: 'alimentación animal', createdAt: '2025-07-04 05:04:35' },
  { id: 47, productId: 9, keyword: 'nutrición ovina', createdAt: '2025-07-04 05:04:35' },
  { id: 48, productId: 9, keyword: 'SHEEP RANGE', createdAt: '2025-07-04 05:04:35' },
  { id: 49, productId: 10, keyword: 'alimentación animal', createdAt: '2025-07-04 05:04:35' },
  { id: 50, productId: 10, keyword: 'nutrición bovina', createdAt: '2025-07-04 05:04:35' },
  { id: 51, productId: 10, keyword: 'DESARROLLO HIGH PERFORMANCE', createdAt: '2025-07-04 05:04:35' },
  { id: 52, productId: 11, keyword: 'alimentación animal', createdAt: '2025-07-04 05:04:35' },
  { id: 53, productId: 11, keyword: 'nutrición bovina', createdAt: '2025-07-04 05:04:35' },
  { id: 54, productId: 11, keyword: 'PROSPECTOR', createdAt: '2025-07-04 05:04:35' },
  { id: 55, productId: 12, keyword: 'alimentación animal', createdAt: '2025-07-04 05:04:35' },
  { id: 56, productId: 12, keyword: 'nutrición bovina', createdAt: '2025-07-04 05:04:35' },
  { id: 57, productId: 12, keyword: 'RANCH CUBE', createdAt: '2025-07-04 05:04:35' },
]

const maxId = (items: { id: number }[]) => (items.length ? Math.max(...items.map((item) => item.id)) : 0)

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const findCategoryById = (id: number) => categories.find((item) => item.id === id)
const findLabelById = (id: number) => labels.find((item) => item.id === id)

const sanitizeProductInput = (input: Partial<ProductRecord>) => {
  if (!input.name) {
    throw createError({ statusCode: 400, statusMessage: 'Product name is required' })
  }

  return {
    name: input.name.trim(),
    slug: input.slug?.trim() || slugify(input.name),
    description: input.description?.trim() || '',
    shortDescription: input.shortDescription?.trim() || '',
    price: typeof input.price === 'number' ? input.price : 0,
    currency: input.currency?.trim() || 'MXN',
    inStock: input.inStock ?? true,
    featured: input.featured ?? false,
    image: input.image?.trim() || '/assets/img/products/product-box.svg',
  }
}

const buildProduct = (record: ProductRecord): Product => {
  const categoriesForProduct = productCategories
    .filter((item) => item.productId === record.id)
    .map((item) => findCategoryById(item.categoryId))
    .filter(Boolean) as Category[]

  const labelsForProduct = productLabels
    .filter((item) => item.productId === record.id)
    .map((item) => findLabelById(item.labelId))
    .filter(Boolean) as Label[]

  return {
    ...record,
    categories: categoriesForProduct,
    labels: labelsForProduct,
    pictures: productPictures.filter((item) => item.productId === record.id).sort((a, b) => a.displayOrder - b.displayOrder),
    features: productFeatures.filter((item) => item.productId === record.id).sort((a, b) => a.displayOrder - b.displayOrder),
    specifications: productSpecifications.filter((item) => item.productId === record.id),
    technicalSpecs: productTechnicalSpecs.filter((item) => item.productId === record.id),
    relatedProductIds: productRelated.filter((item) => item.productId === record.id).map((item) => item.relatedProductId),
    seoKeywords: productSeoKeywords.filter((item) => item.productId === record.id).map((item) => item.keyword),
  }
}

export const listCategories = (): Category[] => [...categories].sort((a, b) => a.name.localeCompare(b.name))

export const getCategory = (id: number): Category => {
  const category = categories.find((item) => item.id === id)
  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }
  return category
}

export const createCategory = (payload: Partial<Category>): Category => {
  if (!payload.name) {
    throw createError({ statusCode: 400, statusMessage: 'Category name is required' })
  }

  const newCategory: Category = {
    id: maxId(categories) + 1,
    name: payload.name.trim(),
    description: payload.description?.trim() || '',
  }

  categories.push(newCategory)
  return newCategory
}

export const updateCategory = (id: number, payload: Partial<Category>): Category => {
  const category = getCategory(id)
  if (payload.name) category.name = payload.name.trim()
  if (payload.description !== undefined) category.description = payload.description.trim()
  return category
}

export const deleteCategory = (id: number) => {
  const index = categories.findIndex((item) => item.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  categories.splice(index, 1)

  // Remove relations for products
  for (let i = productCategories.length - 1; i >= 0; i -= 1) {
    if (productCategories[i].categoryId === id) {
      productCategories.splice(i, 1)
    }
  }
}

export const listLabels = (): Label[] => [...labels].sort((a, b) => a.name.localeCompare(b.name))

export const getLabel = (id: number): Label => {
  const label = labels.find((item) => item.id === id)
  if (!label) {
    throw createError({ statusCode: 404, statusMessage: 'Label not found' })
  }
  return label
}

export const createLabel = (payload: Partial<Label>): Label => {
  if (!payload.name) {
    throw createError({ statusCode: 400, statusMessage: 'Label name is required' })
  }

  const newLabel: Label = {
    id: maxId(labels) + 1,
    name: payload.name.trim(),
    description: payload.description?.trim() || '',
  }

  labels.push(newLabel)
  return newLabel
}

export const updateLabel = (id: number, payload: Partial<Label>): Label => {
  const label = getLabel(id)
  if (payload.name) label.name = payload.name.trim()
  if (payload.description !== undefined) label.description = payload.description.trim()
  return label
}

export const deleteLabel = (id: number) => {
  const index = labels.findIndex((item) => item.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Label not found' })
  }

  labels.splice(index, 1)

  for (let i = productLabels.length - 1; i >= 0; i -= 1) {
    if (productLabels[i].labelId === id) {
      productLabels.splice(i, 1)
    }
  }
}

export const listProducts = (filters?: { search?: string; categoryId?: number; labelId?: number }) => {
  let result = [...products]

  if (filters?.search) {
    const term = filters.search.toLowerCase()
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.slug.toLowerCase().includes(term) ||
        item.shortDescription.toLowerCase().includes(term)
    )
  }

  if (filters?.categoryId) {
    result = result.filter((product) =>
      productCategories.some((pc) => pc.productId === product.id && pc.categoryId === filters.categoryId)
    )
  }

  if (filters?.labelId) {
    result = result.filter((product) =>
      productLabels.some((pl) => pl.productId === product.id && pl.labelId === filters.labelId)
    )
  }

  return result.map((item) => buildProduct(item))
}

export const getProduct = (id: number): Product => {
  const product = products.find((item) => item.id === id)
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }
  return buildProduct(product)
}

export const createProduct = (payload: Partial<ProductRecord> & { categoryIds?: number[]; labelIds?: number[] }) => {
  const sanitized = sanitizeProductInput(payload)

  const newProduct: ProductRecord = {
    id: maxId(products) + 1,
    ...sanitized,
  }

  products.push(newProduct)

  const categoryIds = payload.categoryIds || []
  const labelIds = payload.labelIds || []

  categoryIds.forEach((categoryId) => {
    if (!findCategoryById(categoryId)) return
    productCategories.push({ id: maxId(productCategories) + 1, productId: newProduct.id, categoryId })
  })

  labelIds.forEach((labelId) => {
    if (!findLabelById(labelId)) return
    productLabels.push({ id: maxId(productLabels) + 1, productId: newProduct.id, labelId })
  })

  return buildProduct(newProduct)
}

export const updateProduct = (id: number, payload: Partial<ProductRecord> & { categoryIds?: number[]; labelIds?: number[] }) => {
  const product = products.find((item) => item.id === id)
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  const sanitized = payload.name ? sanitizeProductInput({ ...product, ...payload }) : { ...product, ...payload }

  Object.assign(product, sanitized)

  if (payload.categoryIds) {
    for (let i = productCategories.length - 1; i >= 0; i -= 1) {
      if (productCategories[i].productId === id) productCategories.splice(i, 1)
    }
    payload.categoryIds.forEach((categoryId) => {
      if (!findCategoryById(categoryId)) return
      productCategories.push({ id: maxId(productCategories) + 1, productId: id, categoryId })
    })
  }

  if (payload.labelIds) {
    for (let i = productLabels.length - 1; i >= 0; i -= 1) {
      if (productLabels[i].productId === id) productLabels.splice(i, 1)
    }
    payload.labelIds.forEach((labelId) => {
      if (!findLabelById(labelId)) return
      productLabels.push({ id: maxId(productLabels) + 1, productId: id, labelId })
    })
  }

  return buildProduct(product)
}

export const deleteProduct = (id: number) => {
  const index = products.findIndex((item) => item.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  products.splice(index, 1)

  for (let i = productCategories.length - 1; i >= 0; i -= 1) {
    if (productCategories[i].productId === id) productCategories.splice(i, 1)
  }
  for (let i = productLabels.length - 1; i >= 0; i -= 1) {
    if (productLabels[i].productId === id) productLabels.splice(i, 1)
  }
  for (let i = productPictures.length - 1; i >= 0; i -= 1) {
    if (productPictures[i].productId === id) productPictures.splice(i, 1)
  }
  for (let i = productFeatures.length - 1; i >= 0; i -= 1) {
    if (productFeatures[i].productId === id) productFeatures.splice(i, 1)
  }
  for (let i = productSpecifications.length - 1; i >= 0; i -= 1) {
    if (productSpecifications[i].productId === id) productSpecifications.splice(i, 1)
  }
  for (let i = productTechnicalSpecs.length - 1; i >= 0; i -= 1) {
    if (productTechnicalSpecs[i].productId === id) productTechnicalSpecs.splice(i, 1)
  }
  for (let i = productRelated.length - 1; i >= 0; i -= 1) {
    if (productRelated[i].productId === id || productRelated[i].relatedProductId === id) {
      productRelated.splice(i, 1)
    }
  }
  for (let i = productSeoKeywords.length - 1; i >= 0; i -= 1) {
    if (productSeoKeywords[i].productId === id) productSeoKeywords.splice(i, 1)
  }
}
