// data.jsx — datos de demostración + helpers
(function () {
  // --- Compañías ---
  const companies = [
    { id: 71, name: "Log\u00edstica Santos S.A. de C.V.", color: "var(--t-blue)", code: "LS" },
    { id: 42, name: "Constructora Vega S.A. de C.V.", color: "var(--t-amber)", code: "CV" },
    { id: 88, name: "Transportes del Baj\u00edo S.A. de C.V.", color: "var(--t-teal)", code: "TB" },
    { id: 15, name: "Inmobiliaria Cumbre S.A. de C.V.", color: "var(--t-violet)", code: "IC" },
    { id: 93, name: "Agroindustrias Norte S.A. de C.V.", color: "var(--t-green)", code: "AN" },
    { id: 27, name: "Servicios Metropol S.A. de C.V.", color: "var(--t-rose)", code: "SM" },
    { id: 10, name: "Distribuidora Nacional del Centro S.A. de C.V.", color: "var(--t-blue)", code: "DN" },
    { id: 11, name: "Grupo Industrial Bajío S.A. de C.V.", color: "var(--t-amber)", code: "GI" },
    { id: 12, name: "Operaciones Metropolitanas S.A. de C.V.", color: "var(--t-teal)", code: "OM" },
    { id: 13, name: "Servicios Integrales del Norte S.A. de C.V.", color: "var(--t-violet)", code: "SI" },
    { id: 14, name: "Comercializadora Atlas S.A. de C.V.", color: "var(--t-green)", code: "CA" },
    { id: 16, name: "Proyectos y Obras del Golfo S.A. de C.V.", color: "var(--t-rose)", code: "PO" },
    { id: 17, name: "Industrias Monterrey S.A. de C.V.", color: "var(--t-slate)", code: "IM" },
    { id: 18, name: "Arrendadora Central S.A. de C.V.", color: "var(--t-blue)", code: "AC" },
    { id: 19, name: "Corporativo Delta S.A. de C.V.", color: "var(--t-amber)", code: "CD" },
    { id: 20, name: "Multiservicios Veracruz S.A. de C.V.", color: "var(--t-teal)", code: "MV" },
    { id: 21, name: "Desarrollos Inmobiliarios del Sur S.A. de C.V.", color: "var(--t-violet)", code: "DI" },
    { id: 22, name: "Transportadora Express S.A. de C.V.", color: "var(--t-green)", code: "TE" },
    { id: 23, name: "Constructora Integral Juárez S.A. de C.V.", color: "var(--t-rose)", code: "CJ" },
    { id: 24, name: "Agrícola del Noroeste S.A. de C.V.", color: "var(--t-slate)", code: "AG" },
    { id: 25, name: "Distribuciones Industriales Monterrey S.A. de C.V.", color: "var(--t-blue)", code: "DM" },
    { id: 26, name: "Operadora Logística Nacional S.A. de C.V.", color: "var(--t-amber)", code: "OL" },
    { id: 28, name: "Servicios Especializados Guadalajara S.A. de C.V.", color: "var(--t-teal)", code: "SG" },
    { id: 29, name: "Inmobiliaria y Constructora del Golfo S.A. de C.V.", color: "var(--t-violet)", code: "IC" },
    { id: 30, name: "Manufactura Integral Queretaro S.A. de C.V.", color: "var(--t-green)", code: "MQ" },
    { id: 31, name: "Empresa de Transportes Rápidos S.A. de C.V.", color: "var(--t-rose)", code: "ET" },
    { id: 32, name: "Alimentos y Bebidas del Norte S.A. de C.V.", color: "var(--t-slate)", code: "AB" },
    { id: 33, name: "Grupo Constructor Veracruzano S.A. de C.V.", color: "var(--t-blue)", code: "GC" },
    { id: 34, name: "Logística Especializada del Centro S.A. de C.V.", color: "var(--t-amber)", code: "LE" },
    { id: 35, name: "Holding Empresarial Mexicano S.A. de C.V.", color: "var(--t-teal)", code: "HE" },
    { id: 36, name: "Infraestructura y Obras Nacionales S.A. de C.V.", color: "var(--t-violet)", code: "IO" },
    { id: 37, name: "Consultores Asociados del Bajío S.A. de C.V.", color: "var(--t-green)", code: "CB" },
    { id: 38, name: "Materiales y Construcción del Pacífico S.A. de C.V.", color: "var(--t-rose)", code: "MC" },
    { id: 39, name: "Fletes y Acarreos Internacionales S.A. de C.V.", color: "var(--t-slate)", code: "FA" },
    { id: 40, name: "Servicios Corporativos Nacionales S.A. de C.V.", color: "var(--t-blue)", code: "SC" },
    { id: 41, name: "Transportes y Soluciones Logísticas S.A. de C.V.", color: "var(--t-amber)", code: "TL" },
    { id: 43, name: "Distribuidora de Materias Primas S.A. de C.V.", color: "var(--t-teal)", code: "DP" },
    { id: 44, name: "Servicios de Mantenimiento Industrial S.A. de C.V.", color: "var(--t-violet)", code: "SM" },
    { id: 45, name: "Arrendamiento y Gestión de Activos S.A. de C.V.", color: "var(--t-green)", code: "GA" },
    { id: 46, name: "Ingeniería y Proyectos Especializados S.A. de C.V.", color: "var(--t-rose)", code: "IP" },
    { id: 47, name: "Operaciones Logísticas Integradas S.A. de C.V.", color: "var(--t-slate)", code: "OI" },
    { id: 48, name: "Construcciones y Edificaciones del Norte S.A. de C.V.", color: "var(--t-blue)", code: "CE" },
    { id: 49, name: "Distribución y Comercio Exterior S.A. de C.V.", color: "var(--t-amber)", code: "DC" },
    { id: 50, name: "Industrias Alimentarias del Centro S.A. de C.V.", color: "var(--t-teal)", code: "IA" },
    { id: 51, name: "Servicios Ambientales y Ecología S.A. de C.V.", color: "var(--t-violet)", code: "SA" },
    { id: 52, name: "Grupo Automotriz Mexicano S.A. de C.V.", color: "var(--t-green)", code: "GA" },
    { id: 53, name: "Soluciones Tecnológicas Industriales S.A. de C.V.", color: "var(--t-rose)", code: "ST" },
    { id: 54, name: "Transporte Especializado de Carga S.A. de C.V.", color: "var(--t-slate)", code: "TC" },
    { id: 55, name: "Desarrolladora Habitacional del Bajío S.A. de C.V.", color: "var(--t-blue)", code: "DH" },
    { id: 56, name: "Corporación Minera del Norte S.A. de C.V.", color: "var(--t-amber)", code: "CM" },
  ];

  // --- Tipos documentales (configurables) ---
  const docTypes = [
    { code: "RACV", name: "Responsiva de Acceso", color: "var(--t-blue)", tracking: false },
    { code: "CONT", name: "Contrato", color: "var(--t-violet)", tracking: true },
    { code: "PERM", name: "Permiso", color: "var(--t-amber)", tracking: true },
    { code: "POL", name: "Póliza de Seguro", color: "var(--t-teal)", tracking: true },
    { code: "LIC", name: "Licencia", color: "var(--t-green)", tracking: true },
    { code: "FACT", name: "Factura", color: "var(--t-rose)", tracking: false },
    { code: "PLAN", name: "Plano", color: "var(--t-slate)", tracking: false },
    { code: "ACTA", name: "Acta", color: "var(--t-amber)", tracking: false },
    { code: "CERT", name: "Certificado", color: "var(--t-green)", tracking: true },
  ];

  const sites = ["10001", "20034", "30001", "40012", "50007", "60003", "70180"];

  // --- Centros de costos ---
  const costCenters = [
    // Logística Santos (71)
    { id: "51001", name: "Patio Central CDMX",         companyId: 71 },
    { id: "51002", name: "Almacén Toluca",             companyId: 71 },
    { id: "51003", name: "Estación La Pajarita",       companyId: 71 },
    { id: "51004", name: "Administración General",     companyId: 71 },
    // Constructora Vega (42)
    { id: "42001", name: "Obra Reforma 180",           companyId: 42 },
    { id: "42002", name: "Oficinas Corporativas",      companyId: 42 },
    { id: "42003", name: "Bodega Materiales Norte",    companyId: 42 },
    // Transportes del Bajío (88)
    { id: "88001", name: "Terminal Guadalajara",       companyId: 88 },
    { id: "88002", name: "Terminal Monterrey",         companyId: 88 },
    { id: "88003", name: "Flotilla CDMX",              companyId: 88 },
    // Inmobiliaria Cumbre (15)
    { id: "15001", name: "Desarrollo Sur",             companyId: 15 },
    { id: "15002", name: "Torre Norte",                companyId: 15 },
    // Agroindustrias Norte (93)
    { id: "93001", name: "Campo Hermosillo",           companyId: 93 },
    { id: "93002", name: "Planta Procesadora Sonora",  companyId: 93 },
    // Servicios Metropol (27)
    { id: "27001", name: "Operaciones Vallejo",        companyId: 27 },
    { id: "27002", name: "Limpieza Industrial Zona Sur", companyId: 27 },
  ];


  const people = [
    { name: "Mariana Olvera", initials: "MO", color: "oklch(0.55 0.13 256)" },
    { name: "Diego Fuentes", initials: "DF", color: "oklch(0.55 0.12 300)" },
    { name: "Paola Cervantes", initials: "PC", color: "oklch(0.56 0.1 160)" },
    { name: "Ricardo Lema", initials: "RL", color: "oklch(0.58 0.12 40)" },
    { name: "Sofía Alarcón", initials: "SA", color: "oklch(0.56 0.11 200)" },
  ];

  function ftypeFor(ext) {
    if (ext === "pdf") return { cls: "ft-pdf", label: "PDF" };
    if (["jpg", "jpeg", "png"].includes(ext)) return { cls: "ft-img", label: ext.toUpperCase().slice(0, 3) };
    if (["doc", "docx"].includes(ext)) return { cls: "ft-doc", label: "DOC" };
    if (["xls", "xlsx"].includes(ext)) return { cls: "ft-xls", label: "XLS" };
    if (ext === "dwg") return { cls: "ft-dwg", label: "DWG" };
    return { cls: "ft-other", label: ext.toUpperCase().slice(0, 3) };
  }

  // helper to build a file
  let _seq = 4800;
  function mk(o) {
    _seq += 1;
    const dt = docTypes.find((d) => d.code === o.type) || { name: o.type, color: "var(--t-slate)" };
    return {
      uid: "DOC-" + _seq,
      title: o.title,
      ext: o.ext,
      type: o.type,
      typeName: dt.name,
      typeColor: dt.color,
      company: o.company,
      site: o.site || null,
      ccId: o.ccId || null,
      folio: o.folio || null,
      date: o.date,
      size: o.size,
      classified: o.classified !== false,
      starred: !!o.starred,
      owner: o.owner || people[0],
      versions: o.versions || 1,
      shared: o.shared || null, // {scope:'link'|'people', who:[]}
      tracking: o.tracking || null, // {expires, reminderDays, cost}
      metadata: o.metadata || null,
      ...o,
    };
  }

  // --- Archivos ---
  const files = [
    mk({ title: "Responsiva de Acceso a Instalaciones — J. Medina — Mayo 2026", ext: "pdf", type: "RACV", company: 71, ccId: "51001", site: "20034", folio: "LS16", date: "2026-05-28", size: "412 KB", owner: people[0], versions: 1, original: "RACV-LS16-20260528-71.pdf" }),
    mk({ title: "Contrato de Arrendamiento de Patio de Maniobras — Grupo Patrimonial SA — C-2024-0091", ext: "pdf", type: "CONT", company: 71, ccId: "51003", site: "60003", folio: "C-0091", date: "2026-04-12", size: "1.8 MB", owner: people[1], versions: 3, starred: true,
      tracking: { expires: "2026-07-01", reminderDays: 30, cost: "$48,000 / año" },
      metadata: { "Responsable": "Diego Fuentes", "Proveedor": "Grupo Patrimonial SA", "No. de contrato": "C-2024-0091" },
      shared: { scope: "people", who: [people[3]] } }),
    mk({ title: "Permiso de Operación de Autotransporte Federal de Carga — SCT-3320-26", ext: "pdf", type: "PERM", company: 88, ccId: "88001", site: "40012", folio: "P-3320", date: "2026-03-02", size: "640 KB", owner: people[2], versions: 2,
      tracking: { expires: "2026-06-20", reminderDays: 45, cost: "$12,300" },
      metadata: { "Autoridad": "SICT", "No. de permiso": "SCT-3320-26", "Inspector": "L. Paredes" } }),
    mk({ title: "Póliza de Seguro de Flotilla Vehicular — Cobertura Amplia — Ejercicio 2026 — Qualitas", ext: "pdf", type: "POL", company: 88, ccId: "88003", site: "30001", folio: "POL-7781", date: "2026-01-15", size: "2.1 MB", owner: people[0], versions: 1,
      tracking: { expires: "2026-06-14", reminderDays: 30, cost: "$184,500 / año" },
      metadata: { "Aseguradora": "Qualitas", "No. de póliza": "7781-FL", "Cobertura": "Amplia" } }),
    mk({ title: "IMG_20260518_scan.jpg", ext: "jpg", type: "RACV", company: 71, ccId: "51004", date: "2026-05-18", size: "3.4 MB", classified: false, owner: people[4], versions: 1 }),
    mk({ title: "documento_final (2).pdf", ext: "pdf", type: "CONT", company: 42, ccId: "42002", date: "2026-05-09", size: "905 KB", classified: false, owner: people[1], versions: 1 }),
    mk({ title: "Licencia de Construcción — Torre B — Proyecto Reforma 180 — Delegación Cuauhtémoc — LC-2210-26", ext: "pdf", type: "LIC", company: 42, ccId: "42001", site: "70180", folio: "LC-2210", date: "2026-02-20", size: "1.1 MB", owner: people[3], versions: 4, starred: true,
      tracking: { expires: "2026-08-30", reminderDays: 60, cost: "$96,000" },
      metadata: { "Municipio": "Cuauhtémoc", "No. de licencia": "LC-2210-26", "Inspector": "A. Ríos", "M2 autorizados": "8,400" } }),
    mk({ title: "Plano Estructural Nivel 4 — Torre B — Reforma 180 — Rev. 2", ext: "dwg", type: "PLAN", company: 42, ccId: "42001", site: "70180", folio: "PL-4N", date: "2026-04-30", size: "5.7 MB", owner: people[3], versions: 2 }),
    mk({ title: "Factura de Proveedor — Aceros del Valle SA de CV — Suministro de Acero Estructural — F-88120", ext: "xlsx", type: "FACT", company: 42, ccId: "42001", site: "70180", folio: "F-88120", date: "2026-05-22", size: "78 KB", owner: people[2], versions: 1,
      metadata: { "Proveedor": "Aceros del Valle", "RFC": "AVA920817K12", "Importe": "$1,240,500" } }),
    mk({ title: "Responsiva de Acceso para Visitas Externas — Almacén Sur — Mayo 2026", ext: "pdf", type: "RACV", company: 88, ccId: "88001", site: "40012", folio: "LS22", date: "2026-05-30", size: "388 KB", owner: people[4], versions: 1 }),
    mk({ title: "escaneo0042.pdf", ext: "pdf", type: "PERM", company: 15, ccId: "15002", date: "2026-05-25", size: "1.2 MB", classified: false, owner: people[0], versions: 1 }),
    mk({ title: "Contrato de Compraventa de Local Comercial No. 14 — Inmobiliaria Cumbre SA — Notaría 142 CDMX", ext: "pdf", type: "CONT", company: 15, ccId: "15001", site: "50007", folio: "CV-014", date: "2026-03-18", size: "2.4 MB", owner: people[1], versions: 2,
      tracking: { expires: "2026-09-15", reminderDays: 30, cost: "—" },
      metadata: { "Notaría": "No. 142 CDMX", "Comprador": "Inmobiliaria Cumbre", "Folio real": "1129-44" } }),
    mk({ title: "Póliza de Seguro de Inmueble — Sucursal Polanco — GNP — No. 2290-IN — 2026", ext: "pdf", type: "POL", company: 15, ccId: "15001", site: "50007", folio: "POL-2290", date: "2026-02-01", size: "1.6 MB", owner: people[0], versions: 1,
      tracking: { expires: "2026-06-11", reminderDays: 15, cost: "$72,000 / año" },
      metadata: { "Aseguradora": "GNP", "No. de póliza": "2290-IN" } }),
    mk({ title: "Permiso Fitosanitario Lote 12 — SENASICA — Cultivo de Aguacate — FS-1200", ext: "pdf", type: "PERM", company: 93, ccId: "93001", site: "10001", folio: "FS-1200", date: "2026-04-08", size: "520 KB", owner: people[2], versions: 1,
      tracking: { expires: "2026-07-22", reminderDays: 30, cost: "$8,900" },
      metadata: { "Autoridad": "SENASICA", "Cultivo": "Aguacate" } }),
    mk({ title: "Factura CFE — Suministro de Energía Eléctrica — Planta Norte — Abril 2026", ext: "pdf", type: "FACT", company: 93, ccId: "93001", site: "10001", folio: "CFE-0440", date: "2026-05-05", size: "210 KB", owner: people[4], versions: 1 }),
    mk({ title: "Contrato de Servicios de Fumigación y Control de Plagas — AgroClean — C-FUM-7", ext: "docx", type: "CONT", company: 93, ccId: "93001", site: "10001", folio: "C-FUM-7", date: "2026-01-28", size: "96 KB", owner: people[1], versions: 5,
      tracking: { expires: "2026-12-31", reminderDays: 30, cost: "$54,000 / año" },
      metadata: { "Proveedor": "AgroClean", "Responsable": "Paola Cervantes" } }),
    mk({ title: "WhatsApp Image 2026-05-30.jpeg", ext: "jpeg", type: "RACV", company: 27, ccId: "27001", date: "2026-05-30", size: "1.9 MB", classified: false, owner: people[0], versions: 1 }),
    mk({ title: "Licencia de Funcionamiento — Sucursal Miguel Hidalgo — Giro Servicios — LF-009-26", ext: "pdf", type: "LIC", company: 27, ccId: "27001", site: "30001", folio: "LF-009", date: "2026-03-11", size: "740 KB", owner: people[3], versions: 1,
      tracking: { expires: "2026-06-09", reminderDays: 30, cost: "$15,200" },
      metadata: { "Municipio": "Miguel Hidalgo", "Giro": "Servicios", "No. de licencia": "LF-009-26" } }),
    mk({ title: "Responsiva de Entrega de Equipo de Cómputo — Oficinas Centrales — Mayo 2026", ext: "pdf", type: "RACV", company: 27, ccId: "27002", site: "30001", folio: "LS31", date: "2026-05-14", size: "455 KB", owner: people[4], versions: 1, starred: true }),
    mk({ title: "Plano de Instalación Eléctrica — CEDIS Querétaro — Actualización 2026", ext: "dwg", type: "PLAN", company: 71, ccId: "51002", site: "20034", folio: "PL-ELE", date: "2026-04-19", size: "4.2 MB", owner: people[3], versions: 1 }),

    mk({ title: "Póliza 2,008 - Asamblea General Extraordinaria - 23-septiembre-2019", ext: "pdf", type: "POL", company: 71, ccId: "51001", site: "20034", folio: "POL-2008", date: "2019-09-23", size: "3.2 MB", owner: people[1], versions: 2,
      tracking: { expires: "2026-09-23", reminderDays: 60, cost: "$28,000 / año" },
      metadata: { "Notaría": "No. 88 Querétaro", "Acto": "Asamblea Extraordinaria" } }),
    mk({ title: "Contrato de Prestación de Servicios Profesionales de Consultoría en Materia de Seguridad e Higiene Industrial", ext: "pdf", type: "CONT", company: 88, ccId: "88002", site: "10001", folio: "C-SH-2024-047", date: "2024-03-15", size: "2.8 MB", owner: people[2], versions: 1,
      tracking: { expires: "2026-12-31", reminderDays: 45, cost: "$180,000 / año" },
      metadata: { "Proveedor": "Consultoría Integral HSE", "Responsable": "Diego Fuentes" } }),
    mk({ title: "Licencia Ambiental Única - Actualización Anual - Ejercicio Fiscal 2025-2026 - Planta Norte", ext: "pdf", type: "LIC", company: 93, ccId: "93002", site: "10001", folio: "LAU-25-0441", date: "2025-01-10", size: "5.1 MB", owner: people[3], versions: 3,
      tracking: { expires: "2026-12-31", reminderDays: 90, cost: "$64,500" },
      metadata: { "Autoridad": "SEMARNAT", "No. licencia": "LAU-25-0441" } }),
    mk({ title: "Acta de Entrega-Recepción de Obra Civil — Torre B Nivel 4 al 8 — Reforma 180 CDMX", ext: "pdf", type: "ACTA", company: 42, ccId: "42001", site: "70180", folio: "ER-TB-4-8", date: "2026-05-01", size: "1.3 MB", owner: people[3], versions: 1,
      metadata: { "Contratista": "Grupo Constructor Eje", "Supervisor": "A. Ríos" } }),
    mk({ title: "Dictamen de Seguridad Estructural Post-Sismo - Edificio Corporativo - Enero 2025", ext: "pdf", type: "CERT", company: 15, ccId: "15002", site: "30001", folio: "DSE-2025-01", date: "2025-01-20", size: "4.7 MB", owner: people[0], versions: 2,
      metadata: { "Perito": "Ing. R. Castillo", "Municipio": "Miguel Hidalgo" } }),
    mk({ title: "archivo_sin_nombre.pdf", ext: "pdf", type: "FACT", company: 71, ccId: "51004", date: "2026-06-02", size: "1.1 MB", classified: false, owner: people[2], versions: 1 }),
    mk({ title: "Contrato de Transporte Dedicado — Cadena Comercial — Patio de Maniobras — C-TR-44", ext: "pdf", type: "CONT", company: 88, ccId: "88003", site: "60003", folio: "C-TR-44", date: "2026-02-26", size: "1.4 MB", owner: people[1], versions: 2,
      tracking: { expires: "2026-06-30", reminderDays: 30, cost: "$220,000 / año" },
      metadata: { "Cliente": "Cadena Comercial", "Responsable": "Diego Fuentes" } }),

    mk({ title: "Responsiva de Acceso — Turno Noche — Almacén Toluca — Jun 2026", ext: "pdf", type: "RACV", company: 71, ccId: "51002", date: "2026-06-01", size: "390 KB", owner: people[4], versions: 1 }),
    mk({ title: "Contrato de Servicio de Limpieza — Patio Central CDMX — C-LMP-2026", ext: "pdf", type: "CONT", company: 71, ccId: "51001", folio: "C-LMP-2026", date: "2026-01-05", size: "870 KB", owner: people[1], versions: 2,
      tracking: { expires: "2026-12-31", reminderDays: 30, cost: "$36,000 / año" } }),
    mk({ title: "Póliza de Seguro de Equipo — Montacargas — Patio CDMX — POL-EQ-001", ext: "pdf", type: "POL", company: 71, ccId: "51001", folio: "POL-EQ-001", date: "2026-02-10", size: "1.1 MB", owner: people[0], versions: 1,
      tracking: { expires: "2026-12-31", reminderDays: 30, cost: "$28,500 / año" } }),
    mk({ title: "Factura de Arrendamiento — Bodega Almacén Toluca — Abril 2026", ext: "pdf", type: "FACT", company: 71, ccId: "51002", folio: "FAC-ARR-04", date: "2026-04-30", size: "95 KB", owner: people[2], versions: 1 }),
    mk({ title: "Permiso de Uso de Suelo — Estación La Pajarita — PUS-0321", ext: "pdf", type: "PERM", company: 71, ccId: "51003", folio: "PUS-0321", date: "2025-11-15", size: "650 KB", owner: people[3], versions: 1,
      tracking: { expires: "2026-11-15", reminderDays: 60, cost: "$9,200" } }),
    mk({ title: "Acta de Asamblea Ordinaria — Logística Santos — Ejercicio 2025", ext: "pdf", type: "ACTA", company: 71, ccId: "51004", date: "2026-03-28", size: "1.8 MB", owner: people[0], versions: 1 }),
    mk({ title: "Contrato de Obra — Cimentación Torre Norte — Inmobiliaria Cumbre", ext: "pdf", type: "CONT", company: 15, ccId: "15002", folio: "CO-TN-001", date: "2026-01-20", size: "3.1 MB", owner: people[1], versions: 2,
      tracking: { expires: "2027-01-20", reminderDays: 60, cost: "$4,200,000" } }),
    mk({ title: "Plano Arquitectónico — Torre Norte — Planta Baja", ext: "dwg", type: "PLAN", company: 15, ccId: "15002", folio: "PL-TN-PB", date: "2026-02-14", size: "8.3 MB", owner: people[3], versions: 4 }),
    mk({ title: "Permiso de Construcción — Torre Norte — PC-7821-26", ext: "pdf", type: "PERM", company: 15, ccId: "15002", folio: "PC-7821", date: "2026-02-01", size: "1.4 MB", owner: people[0], versions: 1,
      tracking: { expires: "2027-02-01", reminderDays: 90, cost: "$85,000" } }),
    mk({ title: "Factura — Suministro de Materiales — Desarrollo Sur — Mayo 2026", ext: "pdf", type: "FACT", company: 15, ccId: "15001", date: "2026-05-15", size: "120 KB", owner: people[2], versions: 1 }),
    mk({ title: "Permiso de Operación Terminal Monterrey — SCT-MTY-881", ext: "pdf", type: "PERM", company: 88, ccId: "88002", folio: "SCT-MTY-881", date: "2026-01-08", size: "720 KB", owner: people[2], versions: 1,
      tracking: { expires: "2027-01-08", reminderDays: 45, cost: "$18,500" } }),
    mk({ title: "Contrato de Operación Flotilla CDMX — Unidades 2026", ext: "pdf", type: "CONT", company: 88, ccId: "88003", folio: "C-FL-2026", date: "2026-01-01", size: "2.0 MB", owner: people[1], versions: 1,
      tracking: { expires: "2026-12-31", reminderDays: 30, cost: "$640,000 / año" } }),
    mk({ title: "Responsiva Operador — Flotilla CDMX — R. Torres — Jun 2026", ext: "pdf", type: "RACV", company: 88, ccId: "88003", date: "2026-06-02", size: "380 KB", owner: people[4], versions: 1 }),
    mk({ title: "Plano de Distribución — Bodega Materiales Norte — Rev. 3", ext: "dwg", type: "PLAN", company: 42, ccId: "42003", folio: "PL-BMN-3", date: "2026-03-10", size: "6.1 MB", owner: people[3], versions: 3 }),
    mk({ title: "Contrato de Suministro — Bodega Materiales Norte — Proveedor ACE", ext: "pdf", type: "CONT", company: 42, ccId: "42003", folio: "C-SUM-ACE", date: "2026-02-01", size: "1.5 MB", owner: people[1], versions: 1,
      tracking: { expires: "2026-12-31", reminderDays: 30, cost: "$980,000 / año" } }),
    mk({ title: "Factura — Oficinas Corporativas — Renta Marzo 2026", ext: "pdf", type: "FACT", company: 42, ccId: "42002", date: "2026-03-31", size: "88 KB", owner: people[2], versions: 1 }),
    mk({ title: "Licencia Sanitaria — Planta Procesadora Sonora — LS-SON-2026", ext: "pdf", type: "LIC", company: 93, ccId: "93002", folio: "LS-SON-2026", date: "2026-01-15", size: "890 KB", owner: people[0], versions: 2,
      tracking: { expires: "2026-12-31", reminderDays: 60, cost: "$22,000" } }),
    mk({ title: "Contrato de Acopio de Frutas y Hortalizas — Campo Hermosillo — Temporada 2026", ext: "pdf", type: "CONT", company: 93, ccId: "93001", folio: "C-ACO-2026", date: "2026-01-10", size: "1.1 MB", owner: people[1], versions: 1 }),
    mk({ title: "Responsiva de Operaciones en Campo — Campo Hermosillo — Temporada Verano 2026", ext: "pdf", type: "RACV", company: 93, ccId: "93001", date: "2026-05-01", size: "445 KB", owner: people[4], versions: 1 }),
    mk({ title: "Contrato de Servicio de Limpieza Industrial — Zona Sur — C-LI-27-001", ext: "pdf", type: "CONT", company: 27, ccId: "27002", folio: "C-LI-27-001", date: "2026-01-15", size: "760 KB", owner: people[1], versions: 1,
      tracking: { expires: "2026-12-31", reminderDays: 30, cost: "$120,000 / año" } }),
    mk({ title: "Factura — Operaciones Vallejo — Servicio Mayo 2026", ext: "pdf", type: "FACT", company: 27, ccId: "27001", date: "2026-05-31", size: "95 KB", owner: people[2], versions: 1 }),
    mk({ title: "Permiso de Residuos — Operaciones Vallejo — PRMN-2026-008", ext: "pdf", type: "PERM", company: 27, ccId: "27001", folio: "PRMN-2026-008", date: "2026-02-28", size: "530 KB", owner: people[0], versions: 1,
      tracking: { expires: "2026-12-31", reminderDays: 45, cost: "$12,000" } }),
  ];

  // Compartidos conmigo (de otras personas)
  const sharedWithMe = [
    { ...files[1], sharedBy: people[3], sharedAt: "2026-06-01", access: "Puede ver" },
    { ...files[6], sharedBy: people[2], sharedAt: "2026-05-29", access: "Puede editar" },
    { ...files[3], sharedBy: people[0], sharedAt: "2026-05-20", access: "Puede ver", version: "v1 (específica)" },
  ];

  function daysUntil(dateStr) {
    const today = new Date("2026-06-09");
    const d = new Date(dateStr);
    return Math.round((d - today) / 86400000);
  }
  function fmtDate(dateStr) {
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const d = new Date(dateStr);
    return d.getUTCDate() + " " + months[d.getUTCMonth()] + " " + d.getUTCFullYear();
  }
  function fmtDateShort(dateStr) {
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const d = new Date(dateStr);
    return d.getUTCDate() + " " + months[d.getUTCMonth()];
  }

  // --- Catálogo global de requisitos documentales ---
  const reqCatalog = [
    { id: "acta",   name: "Acta Constitutiva",           desc: "Documento legal que acredita la creación y objeto social de la empresa.",      hasExpiry: false, periodicity: null,     renewalCost: null,    notes: "" },
    { id: "csat",   name: "Constancia de Situación Fiscal", desc: "Constancia emitida por el SAT que acredita la situación fiscal vigente.",  hasExpiry: true,  periodicity: "Anual",   renewalCost: null,    notes: "Actualizar cada año." },
    { id: "rfc",    name: "Cédula de RFC",                desc: "Documento de registro ante el SAT.",                                           hasExpiry: false, periodicity: null,     renewalCost: null,    notes: "" },
    { id: "segrc",  name: "Seguro de Responsabilidad Civil", desc: "Póliza de seguro que cubre daños a terceros.",                           hasExpiry: true,  periodicity: "Anual",   renewalCost: "$84,000 / año", notes: "" },
    { id: "poder",  name: "Poder Notarial del Representante", desc: "Poder otorgado al representante legal ante Notario Público.",           hasExpiry: false, periodicity: null,     renewalCost: null,    notes: "Verificar vigencia de la representación." },
    { id: "licmun", name: "Licencia Municipal de Funcionamiento", desc: "Licencia emitida por el municipio para operar el establecimiento.", hasExpiry: true,  periodicity: "Anual",   renewalCost: "$15,200", notes: "" },
    { id: "infonavit", name: "Constancia INFONAVIT",     desc: "Constancia de cumplimiento de obligaciones ante INFONAVIT.",                   hasExpiry: true,  periodicity: "Semestral", renewalCost: null, notes: "" },
    { id: "imss",   name: "Alta y Opinión IMSS",         desc: "Opinión de cumplimiento de obligaciones de seguridad social.",                 hasExpiry: true,  periodicity: "Mensual", renewalCost: null,    notes: "" },
    { id: "permamb",name: "Permiso Ambiental",           desc: "Autorización de impacto ambiental emitida por SEMARNAT o autoridad local.",    hasExpiry: true,  periodicity: "Anual",   renewalCost: "$64,500", notes: "" },
    { id: "repse",  name: "Registro REPSE",              desc: "Registro de prestadoras de servicios especializados ante STPS.",               hasExpiry: true,  periodicity: "3 años",  renewalCost: null,    notes: "Obligatorio para contratistas." },
    { id: "ine",    name: "Identificación del Representante", desc: "INE o pasaporte vigente del representante legal.",                      hasExpiry: true,  periodicity: "10 años", renewalCost: null,    notes: "" },
    { id: "cont17", name: "Contrato de Arrendamiento",   desc: "Contrato vigente del local o inmueble donde opera la empresa.",               hasExpiry: true,  periodicity: "Variable", renewalCost: null,   notes: "" },
  ];

  // --- Asignación de requisitos por compañía ---
  const companyRequirements = {
    71:  ["acta", "csat", "rfc", "segrc", "poder", "imss"],
    42:  ["acta", "csat", "rfc", "poder", "licmun", "permamb", "cont17"],
    88:  ["acta", "csat", "rfc", "segrc", "imss", "repse"],
    15:  ["acta", "csat", "rfc", "poder", "licmun", "cont17"],
    93:  ["acta", "csat", "rfc", "segrc", "permamb", "imss", "infonavit"],
    27:  ["acta", "csat", "rfc", "poder", "licmun"],
  };

  // --- Cumplimiento de requisitos (qué archivos los satisfacen) ---
  const reqFulfillments = {
    "71-acta":    { fileIds: [], expiryDate: null },
    "71-csat":    { fileIds: [], expiryDate: "2026-06-20" },
    "71-rfc":     { fileIds: [], expiryDate: null },
    "71-segrc":   { fileIds: [], expiryDate: "2026-12-31" },
    "71-poder":   { fileIds: [], expiryDate: null },
    "71-imss":    { fileIds: [], expiryDate: "2026-06-15" },
    "42-acta":    { fileIds: [], expiryDate: null },
    "42-csat":    { fileIds: [], expiryDate: "2026-09-30" },
    "42-rfc":     { fileIds: [], expiryDate: null },
    "42-poder":   { fileIds: [], expiryDate: null },
    "42-licmun":  { fileIds: [], expiryDate: "2026-08-15" },
    "42-permamb": { fileIds: [], expiryDate: "2026-12-31" },
    "42-cont17":  { fileIds: [], expiryDate: "2027-03-01" },
    "88-acta":    { fileIds: [], expiryDate: null },
    "88-csat":    { fileIds: [], expiryDate: "2026-07-01" },
    "88-rfc":     { fileIds: [], expiryDate: null },
    "88-segrc":   { fileIds: [], expiryDate: "2026-06-09" },
    "88-imss":    { fileIds: [], expiryDate: "2026-06-30" },
    "88-repse":   { fileIds: [], expiryDate: "2028-01-01" },
    "15-acta":    { fileIds: [], expiryDate: null },
    "15-csat":    { fileIds: [], expiryDate: "2026-08-01" },
    "15-rfc":     { fileIds: [], expiryDate: null },
    "15-poder":   { fileIds: [], expiryDate: null },
    "15-licmun":  { fileIds: [], expiryDate: "2026-09-15" },
    "15-cont17":  { fileIds: [], expiryDate: "2027-01-01" },
    "93-acta":    { fileIds: [], expiryDate: null },
    "93-csat":    { fileIds: [], expiryDate: "2026-10-01" },
    "93-rfc":     { fileIds: [], expiryDate: null },
    "93-segrc":   { fileIds: [], expiryDate: null },
    "93-permamb": { fileIds: [], expiryDate: "2026-12-31" },
    "93-imss":    { fileIds: [], expiryDate: "2026-06-30" },
    "93-infonavit": { fileIds: [], expiryDate: "2026-09-01" },
    "27-acta":    { fileIds: [], expiryDate: null },
    "27-csat":    { fileIds: [], expiryDate: "2026-07-15" },
    "27-rfc":     { fileIds: [], expiryDate: null },
    "27-poder":   { fileIds: [], expiryDate: null },
    "27-licmun":  { fileIds: [], expiryDate: "2026-06-09" },
  };

  // Agregar evidencia dummy a algunos requisitos
  const addEvidence = (key, ...titles) => {
    if (!reqFulfillments[key]) return;
    reqFulfillments[key].fileIds = titles.map((t, i) => "REQ-" + key + "-" + i);
    reqFulfillments[key].evidenceNames = titles;
  };
  addEvidence("71-acta",  "Acta_Constitutiva_LogisticaSantos.pdf");
  addEvidence("71-csat",  "CSF_2026_LogisticaSantos.pdf");
  addEvidence("71-rfc",   "Cedula_RFC_LS.pdf");
  addEvidence("71-segrc", "Poliza_SeguroRC_2026_Qualitas.pdf");
  addEvidence("42-acta",  "ActaConstitutiva_ConstructoraVega.pdf");
  addEvidence("42-csat",  "CSF_2026_CV.pdf");
  addEvidence("42-licmun","LicMunicipal_2026_CV.pdf", "LicMunicipal_2025_CV.pdf");
  addEvidence("88-acta",  "Acta_TS_2018.pdf");
  addEvidence("88-csat",  "CSF_TS_2026.pdf");
  addEvidence("88-repse", "RegistroREPSE_TS.pdf");
  addEvidence("15-acta",  "Acta_InmobCumbre.pdf");
  addEvidence("15-csat",  "CSF_Cumbre_2026.pdf");
  addEvidence("93-acta",  "Acta_AgroFit.pdf");
  addEvidence("93-permamb","Permiso_Ambiental_2026_SEMARNAT.pdf");

  window.AppData = {
    companies, docTypes, sites, costCenters, people, files, sharedWithMe,
    reqCatalog, companyRequirements, reqFulfillments,
    ftypeFor, daysUntil, fmtDate, fmtDateShort,
  };
})();
