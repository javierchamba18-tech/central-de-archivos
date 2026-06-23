// permissions.jsx — Administración de permisos
(function () {
  const { useState, useRef, useEffect } = React;
  const { Icon, TypeBadge, Avatar, Checkbox, StatusPill, toast, TableSearch } = window;
  const { docTypes, companies, people, costCenters } = window.AppData;

  const ACTIONS = [
    { key: "consultar", label: "Consultar",         group: "docs"  },
    { key: "cargar",    label: "Cargar",             group: "docs"  },
    { key: "editar",    label: "Editar",             group: "docs"  },
    { key: "eliminar",  label: "Eliminar",           group: "docs"  },
    { key: "compartir", label: "Compartir",          group: "docs"  },
    { key: "gestionar",    label: "Gestionar permisos",    group: "admin"    },
    { key: "restringidos", label: "Ver tipos restringidos", group: "security" },
  ];

  const DEPARTMENTS = [
    "Operaciones", "Compras", "Ventas", "Logística", "Almacén",
    "Recursos Humanos", "Finanzas", "Tecnología", "Auditoría Interna",
    "Dirección", "Supervisión", "Gerencia Media", "Mantenimiento",
    "Estación 001", "Estación 002", "Estación 003", "Estación 004",
    "Estación 005", "Estación 006", "Estación 007",
    "CEDIS Norte", "CEDIS Sur", "Planta A", "Planta B", "Patio Central",
  ];

  const EXTRA_DOC_TYPES = [
    { code: "CONV",   name: "Convenio",                       color: "var(--t-blue)"   },
    { code: "PODER",  name: "Poder Notarial",                 color: "var(--t-violet)" },
    { code: "CSF",    name: "Constancia Fiscal",              color: "var(--t-amber)"  },
    { code: "IMSS",   name: "Alta IMSS",                      color: "var(--t-teal)"   },
    { code: "INE",    name: "Identificación Oficial",         color: "var(--t-rose)"   },
    { code: "CEDU",   name: "Cédula Profesional",             color: "var(--t-slate)"  },
    { code: "CERT",   name: "Certificado",                    color: "var(--t-blue)"   },
    { code: "AUT",    name: "Autorización",                   color: "var(--t-violet)" },
    { code: "DECL",   name: "Declaración Fiscal",             color: "var(--t-teal)"   },
    { code: "NOMI",   name: "Nómina",                         color: "var(--t-teal)"   },
    { code: "CARTA",  name: "Carta Compromiso",               color: "var(--t-green)"  },
    { code: "OFIC",   name: "Oficio",                         color: "var(--t-rose)"   },
    { code: "BALG",   name: "Balance General",                color: "var(--t-blue)"   },
    { code: "ERESUL", name: "Estado de Resultados",           color: "var(--t-violet)" },
    { code: "INVENT", name: "Inventario",                     color: "var(--t-blue)"   },
    { code: "BITAC",  name: "Bitácora",                       color: "var(--t-violet)" },
    { code: "MANUAL", name: "Manual de Operaciones",          color: "var(--t-amber)"  },
    { code: "PROC",   name: "Procedimiento",                  color: "var(--t-teal)"   },
    { code: "AUDIT",  name: "Informe de Auditoría",           color: "var(--t-slate)"  },
    { code: "REPORT", name: "Reporte Ejecutivo",              color: "var(--t-violet)" },
    { code: "JUICIO", name: "Expediente Judicial",            color: "var(--t-green)"  },
    { code: "TRAN",   name: "Comprobante de Transferencia",   color: "var(--t-rose)"   },
    { code: "NSS",    name: "Número de Seguridad Social",     color: "var(--t-slate)"  },
    { code: "COTIZ",  name: "Cotización",                     color: "var(--t-amber)"  },
    { code: "PEDIDO", name: "Orden de Compra",                color: "var(--t-teal)"   },
    { code: "RECI",   name: "Recibo",                         color: "var(--t-slate)"  },
    { code: "PROP",   name: "Título de Propiedad",            color: "var(--t-green)"  },
    { code: "AVA",    name: "Avalúo",                         color: "var(--t-rose)"   },
    { code: "POLV",   name: "Póliza de Vida",                 color: "var(--t-slate)"  },
    { code: "SEGM",   name: "Seguro Médico",                  color: "var(--t-blue)"   },
    { code: "DENU",   name: "Denuncia",                       color: "var(--t-violet)" },
    { code: "NOT",    name: "Nota de Crédito",                color: "var(--t-rose)"   },
    { code: "DIAGR",  name: "Diagrama",                       color: "var(--t-blue)"   },
    { code: "ESTUD",  name: "Estudio de Crédito",             color: "var(--t-amber)"  },
    { code: "MARC",   name: "Marca Registrada",               color: "var(--t-teal)"   },
    { code: "ENCUE",  name: "Encuesta de Satisfacción",       color: "var(--t-blue)"   },
    { code: "POLIC",  name: "Política Interna",               color: "var(--t-green)"  },
    { code: "RIESGO", name: "Análisis de Riesgo",             color: "var(--t-rose)"   },
    { code: "RESOL",  name: "Resolución",                     color: "var(--t-amber)"  },
    { code: "FLUJO",  name: "Flujo de Efectivo",              color: "var(--t-amber)"  },
    { code: "MEMOR",  name: "Memorando",                      color: "var(--t-slate)"  },
    { code: "PROP2",  name: "Propuesta Comercial",            color: "var(--t-blue)"   },
    { code: "PODER2", name: "Poder Especial",                 color: "var(--t-violet)" },
  ];

  let _PERMS = [
    {
      id: "op",
      name: "Usuarios Operativos",
      description: "Acceso de consulta y carga para personal operativo de planta.",
      actions: ["consultar", "cargar"],
      allCompanies: false, companyIds: [71, 42, 88, 15, 93],
      allDocTypes:  false, docTypeCodes: ["RACV", "FACT"],
      allDepts:     false, departments: ["Operaciones", "Logística", "Almacén"],
      allUsers:     false, userIdx: [1, 2, 4],
    },
    {
      id: "sup",
      name: "Supervisores",
      description: "Gestión documental completa para supervisores de área.",
      actions: ["consultar", "cargar", "editar", "compartir"],
      allCompanies: false, companyIds: [71, 42, 88, 15, 93, 27, 10, 11, 12],
      allDocTypes:  false, docTypeCodes: ["RACV", "CONT", "PERM", "POL", "LIC", "FACT"],
      allDepts:     false, departments: ["Supervisión", "Gerencia Media"],
      allUsers:     false, userIdx: [1, 3],
    },
    {
      id: "aud",
      name: "Auditores",
      description: "Solo consulta sin posibilidad de modificar ni compartir.",
      actions: ["consultar"],
      allCompanies: true,  companyIds: [],
      allDocTypes:  false, docTypeCodes: ["CONT", "POL", "LIC", "PERM"],
      allDepts:     false, departments: ["Auditoría Interna"],
      allUsers:     false, userIdx: [2],
    },
    {
      id: "adm",
      name: "Administradores",
      description: "Acceso total al sistema incluyendo gestión de permisos.",
      actions: ["consultar", "cargar", "editar", "eliminar", "compartir", "gestionar"],
      allCompanies: true, companyIds: [],
      allDocTypes:  true, docTypeCodes: [],
      allDepts:     true, departments: [],
      allUsers:     true, userIdx: [],
    },
  ];

  // ────────────────────────────────────────────────────────────
  //  Root
  // ────────────────────────────────────────────────────────────
  function PermissionsView() {
    const [perms, setPerms]       = useState(_PERMS);
    const [selectedId, setSelectedId] = useState(null);
    const [query, setQuery]       = useState("");
    const editorRef = useRef(null);

    const perm = perms.find((p) => p.id === selectedId);

    useEffect(() => {
      if (!selectedId || !editorRef.current) return;
      window.requestAnimationFrame(() => {
        const el = editorRef.current;
        if (!el) return;
        const content = el.closest(".content") || document.querySelector(".content");
        if (!content) return;
        // position of el relative to content scroll container
        const elRect = el.getBoundingClientRect();
        const ctRect = content.getBoundingClientRect();
        const target = content.scrollTop + (elRect.top - ctRect.top) - 20;
        const start  = content.scrollTop;
        const dist   = target - start;
        const dur    = 420;
        let t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          const elapsed = ts - t0;
          const prog    = Math.min(elapsed / dur, 1);
          // ease-in-out cubic
          const ease = prog < 0.5 ? 4 * prog * prog * prog : 1 - Math.pow(-2 * prog + 2, 3) / 2;
          content.scrollTop = start + dist * ease;
          if (prog < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, [selectedId]);

    const filtered = query.trim()
      ? perms.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      : perms;

    return React.createElement(
      "div", { className: "page perms-page" },

      // Encabezado
      React.createElement(
        "div", { className: "page-head" },
        React.createElement("div", null,
          React.createElement("div", { className: "page-title" },
            React.createElement(Icon, { name: "shield", size: 22, style: { color: "var(--brand)" } }), "Permisos"),
          React.createElement("div", { className: "page-desc" }, "Configura los perfiles de acceso del sistema.")),
        React.createElement("div", { className: "page-head-actions" },
          React.createElement("button", { className: "btn btn-primary", onClick: () => toast("Nuevo permiso") },
            React.createElement(Icon, { name: "plus", size: 16 }), "Nuevo permiso"))
      ),

      // Catálogo
      React.createElement(PermCatalog, { perms: filtered, selectedId, onSelect: setSelectedId, query, setQuery }),

      // Editor
      React.createElement("div", { ref: editorRef }),
      perm
        ? React.createElement(PermDetail, { key: selectedId, perm })
        : React.createElement(
            "div", { className: "perms-empty-editor" },
            React.createElement(Icon, { name: "shield", size: 28, style: { color: "var(--text-3)" } }),
            React.createElement("div", null, "Selecciona un permiso para ver y editar su configuración")
          )
    );
  }

  // ────────────────────────────────────────────────────────────
  //  Catálogo — tabla superior
  // ────────────────────────────────────────────────────────────
  const CATALOG_COLS = "minmax(160px,1.2fr) minmax(220px,2fr) 130px 150px 130px 110px";

  function PermCatalog({ perms, selectedId, onSelect, query, setQuery }) {
    return React.createElement(
      "div", { className: "flist-wrap", style: { marginBottom: 20 } },

      // Toolbar
      React.createElement(
        "div", { className: "perms-catalog-toolbar" },
        React.createElement(TableSearch, { value: query, onChange: setQuery, placeholder: "Buscar permiso..." }),
        React.createElement("span", { style: { fontSize: 12, color: "var(--text-3)" } }, perms.length + " permiso" + (perms.length !== 1 ? "s" : ""))
      ),

      // Tabla
      React.createElement(
        "div", { className: "flist", style: { "--cols": CATALOG_COLS } },
        React.createElement(
          "div", { className: "flist-head" },
          React.createElement("div", null, "Nombre"),
          React.createElement("div", null, "Acciones"),
          React.createElement("div", null, "Compañías"),
          React.createElement("div", null, "Departamentos"),
          React.createElement("div", null, "Usuarios"),
          React.createElement("div", null, "Estado")
        ),
        perms.length === 0
          ? React.createElement("div", { className: "empty" },
              React.createElement("div", { className: "e-ico" }, React.createElement(Icon, { name: "shield", size: 22 })),
              React.createElement("h3", null, "Sin resultados"),
              "Ningún permiso coincide con la búsqueda.")
          : perms.map((p) => {
              const active = p.id === selectedId;
              const isGlobal = p.allCompanies && p.allDocTypes && p.allDepts && p.allUsers;
              const compLabel = p.allCompanies ? "Todas" : p.companyIds.length + " seleccionadas";
              const deptLabel = p.allDepts ? "Todos" : (p.departments || []).length + " seleccionados";
              const userLabel = p.allUsers  ? "Todos" : (p.userIdx    || []).length + " seleccionados";
              return React.createElement(
                "div",
                { key: p.id, className: "frow" + (active ? " selected" : ""), onClick: () => onSelect(active ? null : p.id) },
                // Nombre
                React.createElement(
                  "div", { className: "fmeta" },
                  React.createElement("div", { className: "fname", style: { fontSize: 13.5 } }, p.name),
null
                ),
                // Acciones
                React.createElement(
                  "div", { style: { display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" } },
                  p.actions.map((a) => {
                    const def = ACTIONS.find((x) => x.key === a);
                    return def ? React.createElement("span", { key: a, className: "perm-action-pill" }, def.label) : null;
                  })
                ),
                // Compañías
                React.createElement("div", { className: "fcol", style: { fontSize: 13 } }, compLabel),
                // Departamentos
                React.createElement("div", { className: "fcol", style: { fontSize: 13 } }, deptLabel),
                // Usuarios
                React.createElement("div", { className: "fcol", style: { fontSize: 13 } }, userLabel),
                // Estado
                React.createElement("div", null,
                  isGlobal
                    ? React.createElement(StatusPill, { kind: "ok",   icon: "globe"  }, "Global")
                    : React.createElement(StatusPill, { kind: "info", icon: "filter" }, "Restringido")
                )
              );
            })
      )
    );
  }

  // ────────────────────────────────────────────────────────────
  //  Editor del permiso
  // ────────────────────────────────────────────────────────────
  function PermDetail({ perm }) {
    const [compMode, setCompMode] = useState(perm.allCompanies ? "all" : "specific");
    const [selComps, setSelComps] = useState(() => new Set(perm.companyIds));
    const [typeMode, setTypeMode] = useState(perm.allDocTypes  ? "all" : "specific");
    const [selTypes, setSelTypes] = useState(() => new Set(perm.docTypeCodes));
    const [deptMode, setDeptMode] = useState(perm.allDepts ? "all" : (perm.departments && perm.departments.length > 0 ? "specific" : "none"));
    const [selDepts, setSelDepts] = useState(() => new Set(perm.departments || []));
    const [userMode, setUserMode] = useState(perm.allUsers ? "all" : (perm.userIdx && perm.userIdx.length > 0 ? "specific" : "none"));
    const [selUsers, setSelUsers] = useState(() => new Set(perm.userIdx || []));
    const [actions,  setActions]  = useState(() => new Set(perm.actions));
    const toggleAction = (key) => setActions((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
    const [ccMode,  setCcMode]  = useState("all");
    const [selCCs,  setSelCCs]  = useState(() => new Set());

    const handleDeptMode = (m) => { setDeptMode(m); if (m === "all" && userMode === "all") setUserMode("none"); };
    const handleUserMode = (m) => { setUserMode(m); if (m === "all" && deptMode === "all") setDeptMode("none"); };

    const allDocTypes = [...docTypes, ...EXTRA_DOC_TYPES];
    const compCount = compMode === "all" ? companies.length    : selComps.size;
    const ccCount   = ccMode   === "all" ? costCenters.length  : selCCs.size;
    const typeCount = typeMode === "all" ? allDocTypes.length  : selTypes.size;
    const deptCount = deptMode === "all" ? DEPARTMENTS.length  : deptMode === "none" ? 0 : selDepts.size;
    const userCount = userMode === "all" ? people.length       : userMode === "none" ? 0 : selUsers.size;

    const companyItems = companies.map((c) => ({ id: c.id,    label: c.name,  meta: c }));
    const ccItems      = costCenters.map((cc) => ({ id: cc.id, label: cc.id + " · " + cc.name }));
    const typeItems    = allDocTypes.map((d) => ({ id: d.code, label: d.name, meta: d }));
    const deptItems    = DEPARTMENTS.map((d) => ({ id: d, label: d }));
    const userItems    = people.map((p, i) => ({ id: i, label: p.name, meta: p }));

    return React.createElement(
      "div", { className: "perms-editor" },

      // Encabezado del editor
      React.createElement(
        "div", { className: "perms-editor-head" },
        React.createElement("div", { className: "perms-detail-ico" }, React.createElement(Icon, { name: "shield", size: 18 })),
        React.createElement(
          "div", { style: { flex: 1, minWidth: 0 } },
          React.createElement("div", { style: { fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" } }, perm.name),
null
        ),
        React.createElement(
          "div", { style: { display: "flex", gap: 8, flexShrink: 0 } },
          React.createElement("button", { className: "icon-btn", title: "Eliminar permiso", onClick: () => toast("Permiso eliminado") },
            React.createElement(Icon, { name: "trash", size: 16 })),
          React.createElement("button", { className: "btn btn-primary btn-sm", onClick: () => toast("Cambios guardados") },
            React.createElement(Icon, { name: "check", size: 14 }), "Guardar")
        )
      ),

      // Resumen
      React.createElement(
        "div", { className: "perms-summary" },
        SummaryItem("building", compMode === "all" ? companies.length + " compañías (todas)" : compCount + " compañías seleccionadas", "Alcance"),
        SummaryItem("folder",   ccMode   === "all" ? costCenters.length + " centros (todos)" : ccCount   + " centros seleccionados", "Centros de costos"),
        SummaryItem("tag",      typeMode === "all" ? allDocTypes.length + " tipos (todos)" : typeCount + " tipos seleccionados", "Alcance"),
        SummaryItem("users",    deptMode === "none" ? "No aplica" : deptCount + " dpto." + (deptMode === "all" ? "s (todos)" : "s seleccionados"), "Departamentos"),
        SummaryItem("user",     userMode === "none" ? "No aplica" : userCount + " usuario" + (userMode === "all" ? "s (todos)" : "s seleccionados"), "Usuarios")
      ),

      // Bloques de configuración
      React.createElement(
        "div", { className: "perms-blocks" },
        React.createElement(ActionBlock, { actions, onToggle: toggleAction }),
        React.createElement(SelectorBlock, {
          title: "Tipos de archivo", icon: "tag", fullWidth: true,
          modes: [{ value: "all", label: "Todos los tipos" }, { value: "specific", label: "Tipos específicos" }],
          mode: typeMode, onModeChange: setTypeMode,
          items: typeItems, selectedIds: selTypes, onToggle: setSelTypes,
          searchPlaceholder: "Buscar tipo...",
          renderRow: (item) => React.createElement("span", { style: { fontSize: 13.5, fontWeight: 500 } }, item.label),
        }),
        React.createElement(SelectorBlock, {
          title: "Compañías permitidas", icon: "building", fullWidth: true,
          modes: [{ value: "all", label: "Todas las compañías" }, { value: "specific", label: "Compañías específicas" }],
          mode: compMode, onModeChange: setCompMode,
          items: companyItems, selectedIds: selComps, onToggle: setSelComps,
          searchPlaceholder: "Buscar compañía...",
          renderRow: (item) => React.createElement("span", { style: { fontSize: 13.5, fontWeight: 500 } }, item.label),
        }),
        React.createElement(SelectorBlock, {
          title: "Centros de costos permitidos", icon: "folder", fullWidth: true,
          modes: [{ value: "all", label: "Todos los centros de costos" }, { value: "specific", label: "Centros específicos" }],
          mode: ccMode, onModeChange: setCcMode,
          items: ccItems, selectedIds: selCCs,
          onToggle: (id) => setSelCCs((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }),
          searchPlaceholder: "Buscar centro de costos...",
          renderRow: (item) => React.createElement("span", { style: { fontSize: 13.5, fontWeight: 500 } }, item.label),
        }),

        // ── Separador de sección ──
        React.createElement("div", { className: "perms-section-divider" },
          React.createElement("div", { className: "perms-section-divider-line" }),
          React.createElement("div", { className: "perms-section-divider-label" },
            React.createElement(Icon, { name: "users", size: 13 }),
            "Asignación del permiso"
          ),
          React.createElement("div", { className: "perms-section-divider-line" })
        ),

        React.createElement(SelectorBlock, {
          title: "Departamentos / Estaciones", icon: "users", fullWidth: true,
          modes: [{ value: "all", label: "Todos los departamentos y estaciones" }, { value: "specific", label: "Específicos" }, { value: "none", label: "No aplicar" }],
          mode: deptMode, onModeChange: handleDeptMode,
          items: deptItems, selectedIds: selDepts, onToggle: setSelDepts,
          searchPlaceholder: "Buscar departamento o estación...",
          renderRow: (item) => React.createElement("span", { style: { fontSize: 13.5, fontWeight: 500 } }, item.label),
        }),
        React.createElement(SelectorBlock, {
          title: "Usuarios", icon: "user", fullWidth: true,
          modes: [{ value: "all", label: "Todos los usuarios" }, { value: "specific", label: "Selección manual" }, { value: "none", label: "No aplicar" }],
          mode: userMode, onModeChange: handleUserMode,
          items: userItems, selectedIds: selUsers, onToggle: setSelUsers,
          searchPlaceholder: "Buscar usuario...",
          renderRow: (item) => React.createElement(
            "div", { style: { display: "flex", alignItems: "center", gap: 9 } },
            React.createElement(Avatar, { person: item.meta, size: 24 }),
            React.createElement("span", { style: { fontSize: 13.5, fontWeight: 500 } }, item.label)
          ),
        })
      )
    );
  }

  // ────────────────────────────────────────────────────────────
  //  ActionBlock
  // ────────────────────────────────────────────────────────────
  function ActionBlock({ actions, onToggle }) {
    const docsActions     = ACTIONS.filter((a) => a.group === "docs");
    const adminActions    = ACTIONS.filter((a) => a.group === "admin");
    const securityActions = ACTIONS.filter((a) => a.group === "security");
    return React.createElement(
      "div", { className: "perms-block perms-block-full" },
      React.createElement("div", { className: "perms-block-head" },
        React.createElement(Icon, { name: "lock", size: 15, style: { color: "var(--text-3)" } }),
        React.createElement("span", { className: "perms-block-title" }, "Permisos")),
      React.createElement(
        "div", { className: "perms-block-body" },
        React.createElement("div", { className: "perms-action-group-label" }, "Documentos"),
        React.createElement("div", { className: "perms-actions" },
          docsActions.map((a) => ActionChip(a.key, a.label, actions.has(a.key), () => onToggle(a.key)))),
        React.createElement("div", { className: "perms-action-group-label", style: { marginTop: 14 } }, "Administración"),
        React.createElement("div", { className: "perms-actions" },
          adminActions.map((a) => ActionChip(a.key, a.label, actions.has(a.key), () => onToggle(a.key)))),
        React.createElement("div", { className: "perms-divider" }),
        React.createElement("div", { className: "perms-action-group-label", style: { display: "flex", alignItems: "center", gap: 6 } },
          React.createElement(Icon, { name: "shield", size: 12, style: { color: "var(--warn)" } }), "Seguridad"),
        React.createElement("div", { className: "perms-actions" },
          securityActions.map((a) => ActionChip(a.key, a.label, actions.has(a.key), () => onToggle(a.key), "security")))
      )
    );
  }

  // ────────────────────────────────────────────────────────────
  //  SelectorBlock — radio + tabla paginada
  // ────────────────────────────────────────────────────────────
  const PAGE_SIZE = 10;

  function SelectorBlock({ title, icon, modes, mode, onModeChange, items, selectedIds, onToggle, searchPlaceholder, fullWidth, renderRow }) {
    const [search,     setSearch]     = useState("");
    const [viewFilter, setViewFilter] = useState("all");
    const [page,       setPage]       = useState(1);

    const filtered = items.filter((item) => {
      if (search && !item.label.toLowerCase().includes(search.toLowerCase())) return false;
      if (viewFilter === "checked"   && !selectedIds.has(item.id)) return false;
      if (viewFilter === "unchecked" &&  selectedIds.has(item.id)) return false;
      return true;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage   = Math.min(page, totalPages);
    const pageItems  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const allChecked  = filtered.length > 0 && filtered.every((i) => selectedIds.has(i.id));
    const someChecked = !allChecked && filtered.some((i) => selectedIds.has(i.id));

    function changeSearch(v)  { setSearch(v);     setPage(1); }
    function changeFilter(v)  { setViewFilter(v); setPage(1); }

    function toggle(id) {
      const n = new Set(selectedIds);
      n.has(id) ? n.delete(id) : n.add(id);
      onToggle(n);
    }
    function toggleAll() {
      const n = new Set(selectedIds);
      if (allChecked) filtered.forEach((i) => n.delete(i.id));
      else            filtered.forEach((i) => n.add(i.id));
      onToggle(n);
    }

    const vBtn = (val, label) => React.createElement(
      "button",
      { key: val, className: "sel-view-btn" + (viewFilter === val ? " active" : ""), onClick: () => changeFilter(val) },
      label
    );

    return React.createElement(
      "div", { className: "perms-block" + (fullWidth ? " perms-block-full" : "") },
      React.createElement("div", { className: "perms-block-head" },
        React.createElement(Icon, { name: icon, size: 15, style: { color: "var(--text-3)" } }),
        React.createElement("span", { className: "perms-block-title" }, title)),
      React.createElement(
        "div", { className: "perms-block-body" },
        React.createElement("div", { className: "perms-radio-group" },
          modes.map((opt) => RadioOpt(opt.value, opt.label, mode, onModeChange))
        ),
        mode === "none" ? React.createElement(
          "div", { style: { fontSize: 13, color: "var(--text-3)", paddingTop: 4 } },
          "Esta dimensión no aplica para este permiso."
        ) : null,
        mode === "specific" ? React.createElement(
          "div", { className: "selector-table" },
          React.createElement(
            "div", { className: "selector-toolbar" },
            React.createElement(
              "div", { className: "table-search", style: { flex: 1 } },
              React.createElement(Icon, { name: "search", size: 13, style: { color: "var(--text-3)", flexShrink: 0 } }),
              React.createElement("input", { type: "text", placeholder: searchPlaceholder || "Buscar...", value: search, onChange: (e) => changeSearch(e.target.value) }),
              search ? React.createElement("button", { className: "ts-clear", onClick: () => changeSearch("") }, React.createElement(Icon, { name: "x", size: 12 })) : null
            ),
            React.createElement(
              "div", { className: "sel-view-group" },
              vBtn("all",       "Todas"),
              vBtn("checked",   "Marcadas"),
              vBtn("unchecked", "No marcadas")
            )
          ),
          React.createElement(
            "div", { className: "selector-head-row" },
            React.createElement(Checkbox, { checked: allChecked, mixed: someChecked, onClick: toggleAll }),
            React.createElement("span", { className: "selector-head-label" },
              filtered.length + " elemento" + (filtered.length !== 1 ? "s" : "") +
              (search || viewFilter !== "all" ? " filtrados" : ""))
          ),
          React.createElement(
            "div", { className: "selector-body" },
            filtered.length === 0
              ? React.createElement("div", { className: "selector-empty" }, "Sin resultados")
              : pageItems.map((item) => {
                  const checked = selectedIds.has(item.id);
                  return React.createElement(
                    "div",
                    { key: String(item.id), className: "selector-row" + (checked ? " checked" : ""), onClick: () => toggle(item.id) },
                    React.createElement(Checkbox, { checked, onClick: () => toggle(item.id) }),
                    renderRow(item)
                  );
                })
          ),
          totalPages > 1 ? React.createElement(PaginationBar, { page: safePage, totalPages, onPage: setPage }) : null
        ) : null
      )
    );
  }

  // ────────────────────────────────────────────────────────────
  //  PaginationBar
  // ────────────────────────────────────────────────────────────
  function PaginationBar({ page, totalPages, onPage }) {
    function getPages() {
      if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
      if (page <= 4)              return [1, 2, 3, 4, 5, "...", totalPages];
      if (page >= totalPages - 3) return [1, "...", totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages];
      return [1, "...", page-1, page, page+1, "...", totalPages];
    }
    return React.createElement(
      "div", { className: "selector-pagination" },
      React.createElement("button", { className: "icon-btn sel-page-nav", disabled: page <= 1, onClick: () => onPage(page - 1) },
        React.createElement(Icon, { name: "chevL", size: 14 })),
      getPages().map((p, i) =>
        p === "..."
          ? React.createElement("span", { key: "e" + i, className: "sel-page-ellipsis" }, "...")
          : React.createElement("button", { key: p, className: "sel-page-btn" + (p === page ? " active" : ""), onClick: () => onPage(p) }, p)
      ),
      React.createElement("button", { className: "icon-btn sel-page-nav", disabled: page >= totalPages, onClick: () => onPage(page + 1) },
        React.createElement(Icon, { name: "chevR", size: 14 }))
    );
  }

  // ────────────────────────────────────────────────────────────
  //  Helpers
  // ────────────────────────────────────────────────────────────
  function RadioOpt(value, label, current, onChange) {
    return React.createElement(
      "label", { className: "perms-radio-option", key: value },
      React.createElement("input", { type: "radio", checked: current === value, onChange: () => onChange(value) }),
      label
    );
  }

  function ActionChip(key, label, active, onClick, variant) {
    const cls = "action-chip" + (active ? " active" : "") + (variant === "security" ? " security" : "");
    return React.createElement(
      "button", { key, className: cls, onClick },
      React.createElement(Icon, { name: active ? "check" : "minus", size: 12, stroke: active ? 3 : 2 }),
      label
    );
  }

  function SummaryItem(icon, value, label) {
    return React.createElement(
      "div", { className: "perms-summary-item" },
      React.createElement(Icon, { name: icon, size: 16, style: { color: "var(--brand)", flexShrink: 0 } }),
      React.createElement(
        "div", null,
        React.createElement("div", { style: { fontSize: 13.5, fontWeight: 600 } }, value),
        React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-3)" } }, label)
      )
    );
  }

  Object.assign(window, { PermissionsView });
})();
