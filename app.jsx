// app.jsx — aplicación principal
(function () {
  const { useState, useMemo, useEffect } = React;
  const { Icon, Checkbox, TypeBadge, FileGlyph, StatusPill, trackingStatus, Avatar, Menu, toast, ToastHost, TableSearch } = window;
  const { Sidebar, Topbar, FileRow, FileCard } = window;
  const { FileDrawer } = window;
  const { UploadModal, ReclassifyModal } = window;
  const { TrackingView, SharedView } = window;
  const { PermissionsView } = window;
  const { ObligatoriosView, RequisitosCatalogView } = window;
  const { companies, docTypes, files, sharedWithMe, fmtDate } = window.AppData;

  function App() {
    const [nav, setNav] = useState({ view: "misArchivos", companyId: null, costCenterId: null, typeCode: null });
    const [query, setQuery] = useState("");
    const [viewMode, setViewMode] = useState("list");
    const [sel, setSel] = useState(new Set());
    const [drawer, setDrawer] = useState(null); // {file, tab}
    const [upload,     setUpload]     = useState(null);
    const [reclassify, setReclassify] = useState(null);
    const [sortKey, setSortKey] = useState("date");

    // counts for sidebar
    const counts = useMemo(() => {
      const currentUser = window.AppData.people[0];
      const byCompany = {};
      companies.forEach((c) => (byCompany[c.id] = files.filter((f) => f.company === c.id).length));
      return {
        myFiles: files.filter((f) => f.owner.name === currentUser.name).length,
        tracking: files.filter((f) => f.tracking && f.tracking.expires).length,
        shared: files.filter((f) => f.shared).length,
        starred: files.filter((f) => f.starred).length,
        byCompany,
      };
    }, []);

    function navTo(n) {
      setNav({ companyId: null, costCenterId: null, typeCode: null, ...n });
      setSel(new Set());
    }

    const [starredSet, setStarredSet] = useState(() => new Set(files.filter((f) => f.starred).map((f) => f.uid)));
    function toggleStar(uid) {
      setStarredSet((s) => { const n = new Set(s); n.has(uid) ? n.delete(uid) : n.add(uid); return n; });
    }

    function openFile(f, tab, opts) {
      setDrawer({ file: f, tab: tab || "detalles", readOnly: !!(opts && opts.readOnly) });
    }

    function toggleSel(uid) {
      setSel((s) => { const n = new Set(s); n.has(uid) ? n.delete(uid) : n.add(uid); return n; });
    }

    // keyboard: cmd+k focus search (visual), esc clear selection
    useEffect(() => {
      const h = (e) => {
        if (e.key === "Escape") { setSel(new Set()); }
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); document.querySelector(".search input")?.focus(); }
      };
      document.addEventListener("keydown", h);
      return () => document.removeEventListener("keydown", h);
    }, []);

    const isExplorer = ["misArchivos", "company", "recientes", "favoritos"].includes(nav.view);
    const isOblOrReq = nav.view === "obligatorios" || nav.view === "requisitos";

    return React.createElement(
      "div",
      { className: "app" },
      React.createElement(Sidebar, { view: nav.view, companyId: nav.companyId, costCenterId: nav.costCenterId, typeCode: nav.typeCode, onNav: navTo, counts }),
      React.createElement(
        "div",
        { className: "main" },
        React.createElement(Topbar, { onUpload: () => setUpload("upload"), navTo, onOpen: openFile }),
        React.createElement(
          "div",
          { className: "content" + (nav.view === "permisos" ? " content-split" : "") },
          nav.view === "obligatorios"
            ? React.createElement(ObligatoriosView, { companyId: nav.companyId, navTo })
            : nav.view === "requisitos"
            ? React.createElement(RequisitosCatalogView, { openNew: !!nav.openNew })
            : nav.view === "seguimiento"
            ? React.createElement(TrackingView, { onOpen: openFile })
            : nav.view === "compartidos"
            ? React.createElement(SharedView, { onOpen: openFile })
            : nav.view === "tipos"
            ? React.createElement(TiposView, null)
            : nav.view === "permisos"
            ? React.createElement(PermissionsView, null)
            : nav.view === "papelera"
            ? React.createElement(PlaceholderView, { icon: "trash", title: "Papelera", desc: "Los documentos eliminados se conservan 30 días antes de borrarse definitivamente." })
            : React.createElement(ExplorerView, {
                nav, query, viewMode, setViewMode, sel, toggleSel, setSel, openFile, sortKey, setSortKey, onUpload: () => setUpload("upload"), navTo, starredSet, toggleStar,
              })
        )
      ),
      // selection bar
      sel.size > 0 && isExplorer ? React.createElement(SelectionBar, {
        count: sel.size,
        onClear: () => setSel(new Set()),
        onReclassify: () => {
          const selFiles = files.filter((f) => sel.has(f.uid));
          setReclassify(selFiles);
        }
      }) : null,
      // drawer
      drawer ? React.createElement(FileDrawer, { file: drawer.file, initialTab: drawer.tab, readOnly: drawer.readOnly, onClose: () => setDrawer(null) }) : null,
      // upload modals
      reclassify ? React.createElement(ReclassifyModal, { files: reclassify, onClose: () => setReclassify(null), onSave: () => { setReclassify(null); setSel(new Set()); } }) : null,
      upload === "upload" ? React.createElement(UploadModal, { presetCompany: nav.companyId, presetTypeCode: nav.typeCode, onClose: () => setUpload(null) }) : null,
React.createElement(ToastHost, null)
    );
  }

  // ---------- Explorer view ----------
  function ExplorerView({ nav, query, viewMode, setViewMode, sel, toggleSel, setSel, openFile, sortKey, setSortKey, onUpload, navTo, starredSet, toggleStar }) {
    const [localQuery, setLocalQuery] = useState("");
    const [page, setPage]           = useState(1);
    const [pageSize, setPageSize]   = useState(10);
    const company = nav.companyId ? companies.find((c) => c.id === nav.companyId) : null;
    const activeDocType = nav.typeCode ? docTypes.find((d) => d.code === nav.typeCode) : null;
    const currentUser = window.AppData.people[0];

    let list = files.slice();
    if (nav.view === "company")     list = list.filter((f) => f.company === nav.companyId);
    if (nav.costCenterId)            list = list.filter((f) => f.ccId === nav.costCenterId);
    if (nav.view === "misArchivos") list = list.filter((f) => f.owner.name === currentUser.name);
    if (nav.view === "favoritos")   list = list.filter((f) => starredSet && starredSet.has(f.uid));
    if (nav.view === "recientes")   list = list.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);
    if (nav.typeCode) list = list.filter((f) => f.type === nav.typeCode);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((f) => [f.title, f.folio, f.site, f.typeName, f.type].filter(Boolean).some((s) => s.toLowerCase().includes(q)));
    }
    list.sort((a, b) => {
      if (sortKey === "name") return a.title.localeCompare(b.title);
      if (sortKey === "type") return a.type.localeCompare(b.type);
      return b.date.localeCompare(a.date);
    });
    // Reset page on filter change (useMemo deps cover this via re-render)
    if (localQuery.trim()) {
      const lq = localQuery.toLowerCase();
      list = list.filter((f) => [f.title, f.folio, f.site, f.typeName, f.type].filter(Boolean).some((s) => s.toLowerCase().includes(lq)));
    }

    const allSel = list.length > 0 && list.every((f) => sel.has(f.uid));
    const someSel = list.some((f) => sel.has(f.uid));

    const totalCount = list.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const safePage   = Math.min(page, totalPages);
    const pagedList  = list.slice((safePage - 1) * pageSize, safePage * pageSize);
    const cols = "minmax(280px, 1.7fr) 170px 140px minmax(160px, 1fr) 130px 80px";

    const title =
      nav.typeCode               ? activeDocType.name :
      nav.view === "company"     ? company.name :
      nav.view === "misArchivos" ? "Mis archivos" :
      nav.view === "favoritos"   ? "Favoritos" :
      nav.view === "recientes"   ? "Recientes" : "Archivos";

    const titleIcon =
      nav.view === "favoritos"   ? "star" :
      nav.view === "recientes"   ? "clock" :
      nav.view === "misArchivos" ? "files" :
      nav.typeCode               ? "file"  : "building";

    const companyTypeCount = company && !nav.typeCode
      ? docTypes.filter((d) => files.filter((f) => f.company === nav.companyId).some((f) => f.type === d.code)).length
      : 0;

    const desc =
      nav.view === "misArchivos" ? "Documentos que has subido o administrado" :
      nav.view === "recientes"   ? "\u00daltimos " + list.length + " documentos activos" :
      nav.view === "favoritos"   ? list.length + " documentos marcados como favorito" :
      list.length + " documentos" + (companyTypeCount > 0 ? " \u00b7 " + companyTypeCount + " tipos de archivo" : "");

    return React.createElement(
      "div",
      { className: "page" },

      // Breadcrumb
      React.createElement(
        "div",
        { className: "breadcrumb" },
        React.createElement("button", { onClick: () => navTo({ view: "misArchivos" }) }, "Archivos"),
        nav.view === "company"
          ? React.createElement(
              React.Fragment, null,
              React.createElement("span", { className: "sep" }, "/"),
              // Compañía
              (nav.costCenterId || nav.typeCode)
                ? React.createElement("button", { onClick: () => navTo({ view: "company", companyId: nav.companyId }) }, company.name)
                : React.createElement("span", { style: { color: "var(--text-2)" } }, company.name),
              // Centro de costos
              nav.costCenterId ? React.createElement(
                React.Fragment, null,
                React.createElement("span", { className: "sep" }, "/"),
                nav.typeCode
                  ? React.createElement("button", { onClick: () => navTo({ view: "company", companyId: nav.companyId, costCenterId: nav.costCenterId }) },
                      (() => { const cc = window.AppData.costCenters.find((c) => c.id === nav.costCenterId); return cc ? cc.id + " · " + cc.name : nav.costCenterId; })())
                  : React.createElement("span", { style: { color: "var(--text-2)" } },
                      (() => { const cc = window.AppData.costCenters.find((c) => c.id === nav.costCenterId); return cc ? cc.id + " · " + cc.name : nav.costCenterId; })())
              ) : null
            )
          : (nav.view === "recientes" || nav.view === "favoritos")
          ? React.createElement(
              React.Fragment, null,
              React.createElement("span", { className: "sep" }, "/"),
              React.createElement("span", { style: { color: "var(--text-2)" } }, title)
            )
          : null,
        nav.typeCode
          ? React.createElement(
              React.Fragment, null,
              React.createElement("span", { className: "sep" }, "/"),
              React.createElement("span", { style: { color: "var(--text-2)" } }, activeDocType.name)
            )
          : null
      ),

      // Encabezado
      React.createElement(
        "div",
        { className: "page-head" },
        React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { className: "page-title" },
            (company && !nav.typeCode)
              ? React.createElement("span", { className: "company-dot", style: { background: company.color, width: 14, height: 14, borderRadius: 4 } })
              : React.createElement(Icon, { name: titleIcon, size: 22, style: { color: "var(--brand)" } }),
            title
          ),
          React.createElement("div", { className: "page-desc" }, desc)
        )
      ),

      // Barra de herramientas
      React.createElement(
        "div",
        { className: "toolbar" },
        React.createElement("button", { className: "btn btn-primary btn-sm", onClick: onUpload },
          React.createElement(Icon, { name: "upload", size: 14 }), "Subir aqu\u00ed"),
        React.createElement("div", { style: { flex: 1 } }),
        React.createElement(TableSearch, { value: localQuery, onChange: setLocalQuery, placeholder: "Buscar en lista..." }),
        React.createElement(
          Menu,
          {
            align: "right",
            trigger: React.createElement("button", { className: "chip" }, React.createElement(Icon, { name: "sort", size: 14 }), "Ordenar"),
            items: [
              { icon: "calendar", label: "M\u00e1s recientes",  onClick: () => setSortKey("date") },
              { icon: "slash",    label: "Nombre (A\u2013Z)", onClick: () => setSortKey("name") },
              { icon: "tag",      label: "Tipo de archivo",    onClick: () => setSortKey("type") },
            ],
          }
        ),
        React.createElement("button", {
          className: "chip",
          style: { color: "oklch(0.42 0.12 155)", borderColor: "oklch(0.82 0.09 155)", background: "oklch(0.96 0.04 155)" },
          onClick: () => toast("Exportando a Excel...")
        },
          React.createElement(Icon, { name: "fileSpreadsheet", size: 14 }), "Exportar"
        ),
        React.createElement(
          "div",
          { className: "segmented" },
          React.createElement("button", { className: viewMode === "list" ? "active" : "", onClick: () => setViewMode("list"), title: "Lista" },
            React.createElement(Icon, { name: "list", size: 15 })),
          React.createElement("button", { className: viewMode === "grid" ? "active" : "", onClick: () => setViewMode("grid"), title: "Cuadr\u00edcula" },
            React.createElement(Icon, { name: "grid", size: 15 }))
        )
      ),

      // Contenido
      list.length === 0
        ? React.createElement(
            "div", { className: "empty" },
            React.createElement("div", { className: "e-ico" }, React.createElement(Icon, { name: "folderOpen", size: 28 })),
            React.createElement("h3", null, "Sin documentos"),
            (query || localQuery) ? "No encontramos resultados para \u201c" + (localQuery || query) + "\u201d." : "Sube documentos para empezar a organizarlos."
          )
        : React.createElement(
            "div", { className: "flist-wrap" + (viewMode === "grid" ? " flist-wrap-grid" : "") },
            viewMode === "list"
              ? React.createElement(
                  "div",
                  { className: "flist" + (someSel ? " has-selection" : ""), style: { "--cols": cols } },
                  React.createElement(
                    "div",
                    { className: "flist-head" },
                    React.createElement(
                      "div",
                      { style: { display: "flex", alignItems: "center", gap: 12 } },
                      React.createElement(Checkbox, { checked: allSel, mixed: someSel && !allSel, onClick: () => setSel(allSel ? new Set() : new Set(list.map((f) => f.uid))) }),
                      "Documento"
                    ),
                    React.createElement("div", null, "Tipo"),
                    React.createElement("div", null, "Sitio"),
                    React.createElement("div", null, "Estado"),
                    React.createElement("div", null, "Fecha"),
                    React.createElement("div", { style: { textAlign: "right" } }, "")
                  ),
                  pagedList.map((f) => React.createElement(FileRow, { key: f.uid, f, selected: sel.has(f.uid), onSelect: toggleSel, onOpen: openFile, hasSelection: someSel, starred: starredSet ? starredSet.has(f.uid) : f.starred, onToggleStar: toggleStar }))
                )
              : React.createElement(
                  "div",
                  { className: "fgrid" + (someSel ? " has-selection" : "") },
                  pagedList.map((f) => React.createElement(FileCard, { key: f.uid, f, selected: sel.has(f.uid), onSelect: toggleSel, onOpen: openFile }))
                ),
            totalCount > 0 ? React.createElement(FilePaginationBar, { page: safePage, totalPages, totalCount, pageSize, onPage: (p) => setPage(p), onPageSize: (s) => { setPageSize(s); setPage(1); } }) : null
          )
    );
  }

  // ---------- Pagination bar ----------
  function FilePaginationBar({ page, totalPages, totalCount, pageSize, onPage, onPageSize }) {
    const start = (page - 1) * pageSize + 1;
    const end   = Math.min(page * pageSize, totalCount);
    function getPages() {
      if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
      if (page <= 4)              return [1, 2, 3, 4, 5, "...", totalPages];
      if (page >= totalPages - 3) return [1, "...", totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages];
      return [1, "...", page-1, page, page+1, "...", totalPages];
    }
    return React.createElement(
      "div", { className: "file-pagination" },
      React.createElement(
        "div", { className: "fp-left" },
        React.createElement("span", { style: { fontSize: 12.5, color: "var(--text-3)" } }, "Mostrar"),
        React.createElement("select", {
          className: "fp-size-select",
          value: pageSize,
          onChange: (e) => onPageSize(Number(e.target.value))
        },
          [10, 25, 50].map((n) => React.createElement("option", { key: n, value: n }, n))
        ),
        React.createElement("span", { style: { fontSize: 12.5, color: "var(--text-3)" } }, "por p\u00e1gina"),
        React.createElement("span", { className: "fp-count" }, "Mostrando " + start + "\u2013" + end + " de " + totalCount)
      ),
      React.createElement(
        "div", { className: "fp-pages" },
        React.createElement("button", { className: "icon-btn fp-nav", disabled: page <= 1, onClick: () => onPage(page - 1) }, React.createElement(Icon, { name: "chevL", size: 14 })),
        getPages().map((p, i) =>
          p === "..." ? React.createElement("span", { key: "e"+i, className: "fp-ellipsis" }, "...") :
          React.createElement("button", { key: p, className: "fp-page-btn" + (p === page ? " active" : ""), onClick: () => onPage(p) }, p)
        ),
        React.createElement("button", { className: "icon-btn fp-nav", disabled: page >= totalPages, onClick: () => onPage(page + 1) }, React.createElement(Icon, { name: "chevR", size: 14 }))
      )
    );
  }

  // ---------- Selection bar ----------
  function SelectionBar({ count, onClear, onReclassify }) {
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const btn = (icon, label, onClick) =>
      React.createElement("button", { className: "selbar-btn", onClick: onClick || (() => toast("Acción aplicada a " + count + " documentos")) }, React.createElement(Icon, { name: icon, size: 16 }), label);
    return React.createElement(
      React.Fragment, null,
      React.createElement(
        "div",
        { className: "selbar" },
        React.createElement("span", { className: "selcount" }, count, React.createElement("span", null, " seleccionados")),
        btn("tag", "Editar", onReclassify),
        btn("download", "Descargar"),
        btn("share", "Compartir"),
        React.createElement("span", { className: "div" }),
        React.createElement("button", { className: "selbar-btn selbar-btn-danger", onClick: () => setConfirmDelete(true) }, React.createElement(Icon, { name: "trash", size: 16 }), "Eliminar"),
        React.createElement("span", { className: "div" }),
        React.createElement("button", { className: "selbar-btn", onClick: onClear }, React.createElement(Icon, { name: "x", size: 16 }))
      ),
      confirmDelete ? React.createElement(
        React.Fragment, null,
        React.createElement("div", { className: "overlay", onClick: () => setConfirmDelete(false) }),
        React.createElement(
          "div", { className: "confirm-modal" },
          React.createElement("div", { className: "confirm-modal-ico" }, React.createElement(Icon, { name: "trash", size: 22, style: { color: "var(--danger)" } })),
          React.createElement("div", { className: "confirm-modal-title" }, "Eliminar " + count + " documento" + (count !== 1 ? "s" : "")),
          React.createElement("div", { className: "confirm-modal-desc" }, "Esta acción no se puede deshacer. Los archivos seleccionados se eliminarán permanentemente del sistema."),
          React.createElement(
            "div", { className: "confirm-modal-actions" },
            React.createElement("button", { className: "btn btn-ghost", onClick: () => setConfirmDelete(false) }, "Cancelar"),
            React.createElement("button", {
              className: "btn btn-danger",
              onClick: () => { setConfirmDelete(false); onClear(); toast("Eliminados " + count + " documentos"); }
            }, React.createElement(Icon, { name: "trash", size: 15 }), "Eliminar")
          )
        )
      ) : null
    );
  }

  // ---------- Tipos de archivo (config TI) ----------
  function TiposView() {
    const [localQuery, setLocalQuery] = useState("");
    const [page, setPage] = useState(1);
    const [restrictedSet, setRestrictedSet] = useState(() => new Set(["POL", "CONT", "LIC"]));
    const [editingType, setEditingType] = useState(null);
    function toggleRestricted(code) {
      setRestrictedSet((prev) => { const n = new Set(prev); n.has(code) ? n.delete(code) : n.add(code); return n; });
    }
    const PAGE_SZ = 10;
    const visibleTypes = localQuery.trim()
      ? docTypes.filter((d) => (d.code + " " + d.name).toLowerCase().includes(localQuery.toLowerCase()))
      : docTypes;
    const totalPages = Math.max(1, Math.ceil(visibleTypes.length / PAGE_SZ));
    const safePage   = Math.min(page, totalPages);
    const pagedTypes = visibleTypes.slice((safePage - 1) * PAGE_SZ, safePage * PAGE_SZ);
    return React.createElement(
      "div",
      { className: "page" },
      React.createElement(
        "div",
        { className: "page-head" },
        React.createElement("div", null,
          React.createElement("div", { className: "page-title" }, React.createElement(Icon, { name: "tag", size: 22, style: { color: "var(--brand)" } }), "Tipos de archivo"),
          React.createElement("div", { className: "page-desc" }, "Categorías del sistema para clasificar documentos.")),
        React.createElement("div", { className: "page-head-actions" },
          React.createElement("button", { className: "btn btn-primary", onClick: () => setEditingType({ code: "", name: "", restricted: false, isNew: true }) }, React.createElement(Icon, { name: "plus", size: 16 }), "Nuevo tipo"))
      ),
      React.createElement(
        "div", { className: "toolbar" },
        React.createElement(TableSearch, { value: localQuery, onChange: (v) => { setLocalQuery(v); setPage(1); }, placeholder: "Buscar tipo..." }),
        React.createElement("div", { style: { flex: 1 } })
      ),
      React.createElement(
        "div", { className: "flist-wrap" },
        React.createElement(
        "div",
        { className: "flist", style: { "--cols": "90px minmax(200px,1fr) 120px 40px" } },
        React.createElement("div", { className: "flist-head" },
          React.createElement("div", null, "Código"),
          React.createElement("div", null, "Nombre"),
          React.createElement("div", null, ""),
          React.createElement("div", null, "")),
        visibleTypes.length === 0
          ? React.createElement("div", { className: "empty" }, React.createElement("div", { className: "e-ico" }, React.createElement(Icon, { name: "tag", size: 26 })), React.createElement("h3", null, "Sin resultados"), "Ningún tipo coincide con \u201c" + localQuery + "\u201d.")
          : pagedTypes.map((d) =>
              React.createElement(
                "div",
                { className: "frow", key: d.code, style: { cursor: "default" } },
                React.createElement("div", null, React.createElement(TypeBadge, { code: d.code, color: d.color })),
                React.createElement("div", { className: "fname" }, d.name),
                React.createElement("div", null,
                  restrictedSet.has(d.code)
                    ? React.createElement("span", { className: "restricted-badge" }, React.createElement(Icon, { name: "lock", size: 11 }), "Restringido")
                    : null
                ),
                React.createElement("div", { style: { textAlign: "right" } },
                  React.createElement("button", {
                    className: "icon-btn", style: { width: 30, height: 30 },
                    onClick: (e) => { e.stopPropagation(); setEditingType({ ...d, isNew: false, restricted: restrictedSet.has(d.code) }); }
                  }, React.createElement(Icon, { name: "settings", size: 15 })))
              )
            )
        ),
        React.createElement(FilePaginationBar, { page: safePage, totalPages, totalCount: visibleTypes.length, pageSize: PAGE_SZ, onPage: setPage, onPageSize: () => {} })
      ),
      editingType ? ReactDOM.createPortal(
        React.createElement(TypeEditModal, {
          typeData: editingType,
          onClose: () => setEditingType(null),
          onSave: (code, restricted) => {
            if (restricted) setRestrictedSet((s) => { const n = new Set(s); n.add(code); return n; });
            else             setRestrictedSet((s) => { const n = new Set(s); n.delete(code); return n; });
            setEditingType(null);
            toast("Tipo guardado");
          },
        }),
        document.body
      ) : null
    );
  }

  function TypeEditModal({ typeData, onClose, onSave }) {
    const [code,       setCode]       = useState(typeData.code || "");
    const [name,       setName]       = useState(typeData.name || "");
    const [restricted, setRestricted] = useState(!!typeData.restricted);
    return React.createElement(
      "div", { className: "modal-wrap", onClick: onClose },
      React.createElement(
        "div", { className: "modal", style: { maxWidth: 420 }, onClick: (e) => e.stopPropagation() },
        React.createElement(
          "div", { className: "modal-head" },
          React.createElement("div", { className: "modal-ico" }, React.createElement(Icon, { name: "tag", size: 18 })),
          React.createElement("div", null,
            React.createElement("div", { className: "modal-title" }, typeData.isNew ? "Nuevo tipo de archivo" : "Editar tipo"),
            React.createElement("div", { className: "modal-sub" }, typeData.isNew ? "Configura el nuevo tipo" : typeData.name)
          ),
          React.createElement("button", { className: "icon-btn drawer-close", onClick: onClose }, React.createElement(Icon, { name: "x", size: 16 }))
        ),
        React.createElement(
          "div", { className: "modal-body", style: { display: "flex", flexDirection: "column", gap: 14 } },
          React.createElement("div", { className: "field" },
            React.createElement("label", null, "Código identificador"),
            React.createElement("input", { className: "input", placeholder: "Ej. CONT", value: code, onChange: (e) => setCode(e.target.value.toUpperCase()) })
          ),
          React.createElement("div", { className: "field" },
            React.createElement("label", null, "Nombre del tipo"),
            React.createElement("input", { className: "input", placeholder: "Ej. Contrato", value: name, onChange: (e) => setName(e.target.value) })
          ),
          React.createElement(
            "div", { style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 9, padding: "13px 14px" } },
            React.createElement(
              "label", { style: { display: "flex", alignItems: "flex-start", gap: 11, cursor: "pointer" } },
              React.createElement("input", { type: "checkbox", checked: restricted, onChange: (e) => setRestricted(e.target.checked), style: { marginTop: 2, accentColor: "var(--warn)", flexShrink: 0 } }),
              React.createElement("div", null,
                React.createElement("div", { style: { fontWeight: 600, fontSize: 13.5 } }, "Tipo restringido"),
                React.createElement("div", { style: { fontSize: 12.5, color: "var(--text-3)", marginTop: 3, lineHeight: 1.5 } }, "Los tipos restringidos solamente podrán ser visualizados por permisos que tengan habilitado el acceso a contenido restringido.")
              )
            )
          )
        ),
        React.createElement(
          "div", { className: "modal-foot" },
          React.createElement("div", { style: { flex: 1 } }),
          React.createElement("button", { className: "btn btn-ghost", onClick: onClose }, "Cancelar"),
          React.createElement("button", {
            className: "btn btn-primary",
            disabled: !code.trim() || !name.trim(),
            onClick: () => onSave(code.trim(), restricted)
          }, React.createElement(Icon, { name: "check", size: 14 }), typeData.isNew ? "Crear tipo" : "Guardar")
        )
      )
    );
  }

  function PlaceholderView({ icon, title, desc }) {
    return React.createElement(
      "div",
      { className: "page" },
      React.createElement("div", { className: "page-head" }, React.createElement("div", null, React.createElement("div", { className: "page-title" }, React.createElement(Icon, { name: icon, size: 22, style: { color: "var(--brand)" } }), title), React.createElement("div", { className: "page-desc" }, desc))),
      React.createElement("div", { className: "empty" }, React.createElement("div", { className: "e-ico" }, React.createElement(Icon, { name: icon, size: 28 })), React.createElement("h3", null, "Vacío"), "No hay elementos aquí por ahora.")
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
})();
