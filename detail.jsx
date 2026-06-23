// detail.jsx — panel lateral de detalle del archivo
(function () {
  const { useState } = React;
  const { Icon, TypeBadge, FileGlyph, StatusPill, trackingStatus, Avatar, Collapsible, Menu, toast, stripeStyle } = window;
  const { companies, fmtDate, daysUntil } = window.AppData;

  function FileDrawer({ file, initialTab, readOnly, onClose, onShare }) {
    const [tab, setTab] = useState(initialTab || "detalles");
    if (!file) return null;
    const company = companies.find((c) => c.id === file.company);
    const ts = trackingStatus(file.tracking);

    const allTabs = [
      { id: "detalles",    label: "Detalles",    icon: "info" },
      { id: "versiones",   label: "Versiones",   icon: "history", num: file.versions },
      { id: "compartir",   label: "Compartir",   icon: "share" },
      { id: "seguimiento", label: "Seguimiento",  icon: "calendarClock" },
    ];
    const tabs = readOnly ? allTabs.filter((t) => t.id !== "compartir" && t.id !== "seguimiento") : allTabs;

    return React.createElement(
      React.Fragment,
      null,
      React.createElement("div", { className: "overlay", onClick: onClose }),
      React.createElement(
        "div",
        { className: "drawer" },
        React.createElement(
          "div",
          { className: "drawer-head" },
          React.createElement("button", { className: "icon-btn drawer-close", onClick: onClose }, React.createElement(Icon, { name: "x", size: 18 })),
          React.createElement(
            "div",
            { style: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 } },
            React.createElement(FileGlyph, { ext: file.ext, lg: true }),
            React.createElement(
              "div",
              { style: { flex: 1, minWidth: 0 } },
              React.createElement("div", { style: { fontSize: 16.5, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.3 } }, file.title),
              React.createElement(
                "div",
                { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 7, flexWrap: "wrap" } },
                React.createElement(TypeBadge, { code: file.type, color: file.typeColor, name: file.typeName, showName: true }),
                !file.classified ? React.createElement(StatusPill, { kind: "warn", icon: "sparkles" }, "Requiere clasificar") : null
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "drawer-tabs" },
          tabs.map((t) =>
            React.createElement(
              "button",
              { key: t.id, className: "drawer-tab" + (tab === t.id ? " active" : ""), onClick: () => setTab(t.id) },
              React.createElement(Icon, { name: t.icon, size: 15 }),
              t.label,
              t.num && t.num > 1 ? React.createElement("span", { className: "tnum" }, t.num) : null
            )
          )
        ),
        React.createElement(
          "div",
          { className: "drawer-body" },
          tab === "detalles"    && React.createElement(DetailsTab,  { file, company }),
          tab === "versiones"   && React.createElement(VersionsTab,  { file }),
          tab === "compartir"   && React.createElement(ShareTab,     { file }),
          tab === "seguimiento" && React.createElement(TrackingTab,  { file })
        ),
        React.createElement(
          "div",
          { className: "drawer-foot" },
          React.createElement("button", { className: "btn btn-primary", style: { flex: 1 } }, React.createElement(Icon, { name: "eye", size: 16 }), "Abrir documento"),
          React.createElement("button", { className: "btn btn-outline", onClick: () => setTab("compartir") }, React.createElement(Icon, { name: "share", size: 15 })),
          React.createElement("button", { className: "btn btn-outline btn-icon-only", title: "Descargar" }, React.createElement(Icon, { name: "download", size: 16 }))
        )
      )
    );
  }

  // ---------- Tab: Detalles ----------
  function DetailsTab({ file, company }) {
    const { useState: uS } = React;
    const [editing, setEditing] = uS(false);
    const { companies: allCompanies, docTypes, sites } = window.AppData;
    const [editComp,    setEditComp]    = uS(String(file.company));
    const [editType,    setEditType]    = uS(file.type);
    const [editSite,    setEditSite]    = uS(file.site || "");
    const [editFolio,   setEditFolio]   = uS(file.folio || "");
    const [editComment, setEditComment] = uS(file._comment || "");

    function saveEdits() {
      file.company   = Number(editComp);
      file.type      = editType;
      file.site      = editSite || null;
      file.folio     = editFolio || null;
      file._comment  = editComment;
      const dt = docTypes.find((d) => d.code === editType);
      if (dt) { file.typeName = dt.name; file.typeColor = dt.color; }
      setEditing(false);
      toast("Datos guardados");
    }

    const dateNom = file.date.replace(/-/g, "");
    const sysFileName = (file.folio
      ? file.type + "-" + file.folio + "-" + dateNom + "-" + file.company + "." + file.ext
      : file.type + "-" + dateNom + "-" + file.company + "." + file.ext);

    const displayComp = allCompanies.find((c) => c.id === file.company);
    const rows = [
      ["Compañía", React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 7 } }, React.createElement("span", { className: "company-dot", style: { background: displayComp ? displayComp.color : company.color } }), displayComp ? displayComp.name : company.name)],
      ["Tipo de archivo", React.createElement(TypeBadge, { code: file.type, color: file.typeColor, name: file.typeName, showName: true })],
      ["Sitio", file.site || React.createElement("span", { className: "muted" }, "Sin asignar")],
      ["Folio", file.folio ? React.createElement("span", { className: "mono" }, file.folio) : React.createElement("span", { className: "muted" }, "—")],
      ["Nombre de archivo", React.createElement("span", { className: "mono", style: { fontSize: 11.5, color: "var(--text-2)", wordBreak: "break-all" } }, sysFileName)],
      ["Fecha", fmtDate(file.date)],
      ["Tamaño", file.size],
      ["Subido por", React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 7 } }, React.createElement(Avatar, { person: file.owner, size: 22 }), file.owner.name)],
      ["ID interno", React.createElement("span", { className: "mono", style: { color: "var(--text-3)" } }, file.uid)],
      ["Comentarios", file._comment ? React.createElement("span", { style: { fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.55, whiteSpace: "pre-wrap" } }, file._comment) : React.createElement("span", { className: "muted" }, "Sin comentarios")],
    ];
    return React.createElement(
      React.Fragment,
      null,
      !file.classified
        ? React.createElement(
            "div",
            { className: "attn-banner", style: { marginBottom: 18 } },
            React.createElement("div", { className: "ico" }, React.createElement(Icon, { name: "sparkles", size: 18 })),
            React.createElement(
              "div",
              { className: "txt" },
              React.createElement("b", null, "Sin clasificar"),
              React.createElement("div", null, "Este archivo aún no tiene tipo ni compañía asignados. Edita los datos para clasificarlo.")
            ),
            React.createElement("button", { className: "btn btn-sm btn-primary", onClick: () => setEditing(true) }, React.createElement(Icon, { name: "edit", size: 13 }), "Editar datos")
          )
        : null,

      editing
        ? React.createElement(
            "div", { className: "edit-fields" },
            React.createElement("div", { className: "field" },
              React.createElement("label", null, "Compañía"),
              React.createElement("select", { className: "select", value: editComp, onChange: (e) => setEditComp(e.target.value) },
                allCompanies.map((c) => React.createElement("option", { key: c.id, value: c.id }, c.name))
              )
            ),
            React.createElement("div", { className: "field" },
              React.createElement("label", null, "Tipo de archivo"),
              React.createElement("select", { className: "select", value: editType, onChange: (e) => setEditType(e.target.value) },
                docTypes.map((d) => React.createElement("option", { key: d.code, value: d.code }, d.name))
              )
            ),
            React.createElement("div", { className: "field" },
              React.createElement("label", null, "Sitio"),
              React.createElement("select", { className: "select", value: editSite, onChange: (e) => setEditSite(e.target.value) },
                React.createElement("option", { value: "" }, "Sin asignar"),
                sites.map((s) => React.createElement("option", { key: s, value: s }, s))
              )
            ),
            React.createElement("div", { className: "field" },
              React.createElement("label", null, "Folio"),
              React.createElement("input", { className: "input", placeholder: "Ej. C-0091", value: editFolio, onChange: (e) => setEditFolio(e.target.value) })
            ),
            React.createElement("div", { className: "field" },
              React.createElement("label", null, "Comentarios"),
              React.createElement("textarea", { className: "comment-input", style: { width: "100%", minHeight: 64 }, rows: 3, placeholder: "Nota sobre este archivo...", value: editComment, onChange: (e) => setEditComment(e.target.value) })
            ),
            React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 4 } },
              React.createElement("button", { className: "btn btn-primary", style: { flex: 1 }, onClick: saveEdits }, React.createElement(Icon, { name: "check", size: 14 }), "Guardar"),
              React.createElement("button", { className: "btn btn-ghost", onClick: () => setEditing(false) }, "Cancelar")
            )
          )
        : React.createElement(
            React.Fragment, null,
            React.createElement(
              "dl",
              { className: "meta-grid" },
              rows.map(([k, v], i) =>
                React.createElement(React.Fragment, { key: i }, React.createElement("dt", null, k), React.createElement("dd", null, v))
              )
            ),
            React.createElement("button", { className: "btn btn-sm btn-ghost", style: { marginTop: 8, paddingLeft: 6 }, onClick: () => setEditing(true) },
              React.createElement(Icon, { name: "edit", size: 13 }), "Editar datos")
          ),
      !editing && file.metadata
        ? React.createElement(
            "div",
            null,
            React.createElement("div", { className: "section-h" }, React.createElement(Icon, { name: "tag", size: 14 }), "Información adicional"),
            React.createElement(
              "dl",
              { className: "meta-grid" },
              Object.entries(file.metadata).map(([k, v], i) =>
                React.createElement(React.Fragment, { key: i }, React.createElement("dt", null, k), React.createElement("dd", null, v))
              )
            ),
            React.createElement("button", { className: "btn btn-sm btn-ghost", style: { marginTop: 10, paddingLeft: 6 } }, React.createElement(Icon, { name: "plus", size: 14 }), "Agregar campo")
          )
        : !editing ? React.createElement(
            "button",
            { className: "btn btn-sm btn-ghost", style: { marginTop: 16, paddingLeft: 6 } },
            React.createElement(Icon, { name: "plus", size: 14 }),
            "Agregar información adicional"
          ) : null,
      file.original
        ? React.createElement(
            "div",
            { style: { marginTop: 20, padding: "11px 13px", background: "var(--surface-2)", borderRadius: 9, border: "1px solid var(--border)", fontSize: 12 } },
            React.createElement("div", { style: { color: "var(--text-3)", marginBottom: 3, display: "flex", alignItems: "center", gap: 6 } }, React.createElement(Icon, { name: "info", size: 13 }), "Archivo de origen"),
            React.createElement("span", { className: "mono", style: { color: "var(--text-2)" } }, file.original)
          )
        : null
    );
  }

  // ---------- Campo: Comentarios (nota única del archivo) ----------
  function CommentsField({ file }) {
    const [editing, setEditing] = React.useState(false);
    const [value,   setValue]   = React.useState(file._comment || "");
    function handleSave() { file._comment = value; setEditing(false); toast("Comentario guardado"); }
    function handleCancel() { setValue(file._comment || ""); setEditing(false); }
    return React.createElement(
      "div", { style: { marginTop: 20 } },
      React.createElement(
        "div", { className: "section-h" },
        React.createElement(Icon, { name: "messageCircle", size: 14 }), "Comentarios",
        React.createElement("div", { style: { flex: 1 } }),
        !editing ? React.createElement(
          "button", { className: "btn btn-sm btn-ghost", style: { padding: "0 6px", height: 22 }, onClick: () => setEditing(true) },
          React.createElement(Icon, { name: "edit", size: 12 }), "Editar"
        ) : null
      ),
      editing
        ? React.createElement(
            React.Fragment, null,
            React.createElement("textarea", {
              className: "comment-input",
              style: { width: "100%", minHeight: 72, marginTop: 6 },
              placeholder: "Agrega una nota sobre este archivo...",
              value,
              rows: 3,
              autoFocus: true,
              onChange: (e) => setValue(e.target.value),
            }),
            React.createElement(
              "div", { style: { display: "flex", justifyContent: "flex-end", gap: 7, marginTop: 6 } },
              React.createElement("button", { className: "btn btn-ghost btn-sm", onClick: handleCancel }, "Cancelar"),
              React.createElement("button", { className: "btn btn-primary btn-sm", onClick: handleSave },
                React.createElement(Icon, { name: "check", size: 13 }), "Guardar")
            )
          )
        : React.createElement(
            "div", { style: { marginTop: 6, fontSize: 13, color: value ? "var(--text-2)" : "var(--text-3)", lineHeight: 1.55, whiteSpace: "pre-wrap" } },
            value || "Sin comentarios."
          )
    );
  }

  // ---------- Tab: Versiones ----------
  function VersionsTab({ file }) {
    const n = file.versions;
    const people = window.AppData.people;
    const versions = Array.from({ length: n }, (_, i) => {
      const vn = n - i;
      return {
        v: vn,
        current: i === 0,
        who: people[(vn + 1) % people.length],
        date: shiftDate(file.date, -i * 22),
        note: i === 0 ? "Versión actual" : ["Corrección de datos", "Documento firmado", "Anexo agregado", "Reemplazo de escaneo"][i % 4],
        size: file.size,
      };
    });
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 } },
        React.createElement("div", { style: { fontSize: 13, color: "var(--text-2)" } }, n + (n === 1 ? " versión" : " versiones") + " · siempre se comparte la actual salvo que elijas una específica"),
        React.createElement("button", { className: "btn btn-sm btn-outline", onClick: () => toast("Sube un archivo para crear v" + (n + 1)) }, React.createElement(Icon, { name: "upload", size: 14 }), "Nueva versión")
      ),
      versions.map((v, i) =>
        React.createElement(
          "div",
          { className: "vrow", key: v.v },
          React.createElement(
            "div",
            { className: "vdot" + (v.current ? " current" : "") },
            React.createElement("div", { className: "pip" }),
            i < versions.length - 1 ? React.createElement("div", { className: "line" }) : null
          ),
          React.createElement(
            "div",
            { className: "vinfo" },
            React.createElement(
              "div",
              { style: { display: "flex", alignItems: "center", gap: 8 } },
              React.createElement("span", { style: { fontWeight: 600, fontSize: 13.5 } }, "Versión " + v.v),
              v.current ? React.createElement(StatusPill, { kind: "info" }, "Actual") : null,
              React.createElement(
                "div",
                { style: { marginLeft: "auto" } },
                React.createElement(
                  Menu,
                  {
                    trigger: React.createElement("button", { className: "icon-btn", style: { width: 28, height: 28 } }, React.createElement(Icon, { name: "moreV", size: 15 })),
                    items: v.current
                      ? [{ icon: "eye", label: "Ver" }, { icon: "download", label: "Descargar" }, { icon: "share", label: "Compartir esta versión" }]
                      : [{ icon: "eye", label: "Ver" }, { icon: "download", label: "Descargar" }, { icon: "share", label: "Compartir esta versión" }, { divider: true }, { icon: "restore", label: "Restaurar como actual", onClick: () => toast("Versión " + v.v + " restaurada como actual") }],
                  }
                )
              )
            ),
            React.createElement("div", { style: { fontSize: 12.5, color: "var(--text-2)", marginTop: 2 } }, v.note),
            React.createElement(
              "div",
              { style: { display: "flex", alignItems: "center", gap: 7, marginTop: 7, fontSize: 12, color: "var(--text-3)" } },
              React.createElement(Avatar, { person: v.who, size: 19 }),
              v.who.name,
              React.createElement("span", null, "·"),
              fmtDate(v.date),
              React.createElement("span", null, "·"),
              v.size
            )
          )
        )
      )
    );
  }

  // ---------- Tab: Compartir ----------
  const SHARE_DEPTS = [
    "Operaciones","Compras","Ventas","Logística","Almacén","Recursos Humanos",
    "Finanzas","Tecnología","Auditoría Interna","Dirección","Supervisión",
    "Gerencia Media","Mantenimiento","Estación 001","Estación 002","Estación 003",
    "Estación 004","Estación 005","CEDIS Norte","CEDIS Sur","Planta A","Planta B",
  ];

  function ShareTab({ file }) {
    const [scope, setScope] = useState(file.shared ? file.shared.scope : "private");
    const [versionMode, setVersionMode] = useState("current");
    const people = window.AppData.people;
    const [selDepts, setSelDepts] = useState([]);
    const [selUsers, setSelUsers] = useState([]);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo,   setDateTo]   = useState("");
    const [limitDate, setLimitDate] = useState(false);
    const shared = file.shared ? file.shared.who : [];
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("div", { className: "section-h" }, "Departamentos"),
      React.createElement(MultiSelectField, {
        options: ["Todos", ...SHARE_DEPTS],
        allOption: "Todos",
        placeholder: "Buscar departamento...",
        selected: selDepts,
        onChange: setSelDepts,
      }),
      React.createElement("div", { className: "section-h", style: { marginTop: 14 } }, "Usuarios"),
      React.createElement(MultiSelectField, {
        options: ["Todos", ...people.map((p) => p.name)],
        allOption: "Todos",
        placeholder: "Buscar usuario...",
        selected: selUsers,
        onChange: setSelUsers,
      }),
      React.createElement("div", { className: "section-h", style: { marginTop: 14 } }, "Periodo de acceso"),
      React.createElement(
        "label", { className: "dp-toggle", style: { marginBottom: 10 } },
        React.createElement("input", { type: "checkbox", checked: limitDate, onChange: (e) => setLimitDate(e.target.checked) }),
        React.createElement("span", null, "Limitar periodo de acceso")
      ),
      limitDate ? React.createElement(
        "div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 } },
        React.createElement("div", { className: "field" },
          React.createElement("label", null, "Disponible desde"),
          React.createElement("input", { className: "input", type: "date", value: dateFrom, onChange: (e) => setDateFrom(e.target.value) })
        ),
        React.createElement("div", { className: "field" },
          React.createElement("label", null, "Disponible hasta"),
          React.createElement("input", { className: "input", type: "date", value: dateTo, min: dateFrom, onChange: (e) => setDateTo(e.target.value) })
        )
      ) : React.createElement("div", { style: { fontSize: 12.5, color: "var(--text-3)", marginBottom: 4 } }, "Sin límite — acceso permanente mientras el archivo esté activo."),
      React.createElement("div", { className: "section-h" }, "Qué se comparte"),
      React.createElement(
        "div",
        { style: { display: "grid", gap: 8, marginBottom: 8 } },
        React.createElement(ShareRadio, { active: versionMode === "current",  onClick: () => setVersionMode("current"),  icon: "refresh", title: "Versión actual (recomendado)", sub: "Quien acceda siempre verá la versión más reciente." }),
        React.createElement(ShareRadio, { active: versionMode === "all",      onClick: () => setVersionMode("all"),      icon: "layers",  title: "Todas las versiones",          sub: "El destinatario puede acceder al historial completo de versiones." }),
        React.createElement(ShareRadio, { active: versionMode === "specific", onClick: () => setVersionMode("specific"), icon: "pin",     title: "Una versión específica",       sub: file.versions > 1 ? "Fija el documento en una versión concreta." : "Disponible cuando el documento tiene varias versiones." })
      ),
      versionMode === "specific"
        ? React.createElement(
            "select",
            { className: "select", style: { marginBottom: 8 } },
            Array.from({ length: file.versions }, (_, i) => React.createElement("option", { key: i }, "Versión " + (file.versions - i) + (i === 0 ? " (actual)" : "")))
          )
        : null,
      React.createElement("div", { className: "section-h" }, "Acceso por enlace"),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 8 } },
        React.createElement("input", { className: "input mono", readOnly: true, value: "archivos.octane.mx/s/" + file.uid.toLowerCase(), style: { fontSize: 12, color: "var(--text-2)" } }),
        React.createElement("button", { className: "btn btn-outline", onClick: () => toast("Enlace copiado", "copy") }, React.createElement(Icon, { name: "copy", size: 15 }), "Copiar")
      )
    );
  }


  function MultiSelectField({ options, allOption, placeholder, selected, onChange }) {
    const { useState: uS, useRef, useEffect: uE } = React;
    const [open,   setOpen]   = uS(false);
    const [search, setSearch] = uS("");
    const ref = useRef(null);
    uE(() => {
      function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
      document.addEventListener("mousedown", h);
      return () => document.removeEventListener("mousedown", h);
    }, []);
    const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()));
    const isAll   = selected.length === 1 && selected[0] === allOption;
    function toggle(opt) {
      if (opt === allOption) { onChange([allOption]); return; }
      const next = selected.filter((s) => s !== allOption);
      const has  = next.includes(opt);
      const n    = has ? next.filter((s) => s !== opt) : [...next, opt];
      onChange(n);
    }
    const displayLabel = isAll ? "Todos"
      : selected.length === 0 ? "Ninguno seleccionado"
      : selected.length === 1 ? selected[0]
      : selected.length + " seleccionados";
    return React.createElement(
      "div", { className: "ms-wrap", ref },
      React.createElement(
        "button", { className: "ms-trigger", onClick: () => setOpen((v) => !v) },
        React.createElement("span", { className: "ms-label" + (selected.length === 0 ? " ms-placeholder" : "") }, displayLabel),
        React.createElement(Icon, { name: open ? "chevD" : "chevR", size: 13 })
      ),
      open ? React.createElement(
        "div", { className: "ms-dropdown" },
        React.createElement(
          "div", { className: "ms-search-wrap" },
          React.createElement(Icon, { name: "search", size: 13, style: { color: "var(--text-3)", flexShrink: 0 } }),
          React.createElement("input", {
            className: "ms-search", autoFocus: true, placeholder,
            value: search, onChange: (e) => setSearch(e.target.value)
          })
        ),
        React.createElement(
          "div", { className: "ms-list" },
          filtered.map((opt) => {
            const checked = opt === allOption ? isAll : selected.includes(opt);
            return React.createElement(
              "label", { key: opt, className: "ms-option" + (checked ? " checked" : "") },
              React.createElement("input", { type: "checkbox", checked, onChange: () => toggle(opt) }),
              opt === allOption ? React.createElement("strong", null, opt) : opt
            );
          })
        )
      ) : null
    );
  }

  function ShareRadio({ active, onClick, icon, title, sub }) {
    return React.createElement(
      "button",
      { onClick, style: { display: "flex", alignItems: "flex-start", gap: 11, padding: "12px 13px", borderRadius: 10, border: "1px solid " + (active ? "var(--brand)" : "var(--border)"), background: active ? "var(--brand-weak)" : "var(--surface)", textAlign: "left", width: "100%", transition: "all 0.12s" } },
      React.createElement("div", { style: { color: active ? "var(--brand)" : "var(--text-3)", marginTop: 1 } }, React.createElement(Icon, { name: icon, size: 18 })),
      React.createElement("div", { style: { flex: 1 } }, React.createElement("div", { style: { fontWeight: 500, fontSize: 13.5, color: active ? "var(--brand-text)" : "var(--text)" } }, title), React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)", marginTop: 1 } }, sub)),
      React.createElement("div", { style: { width: 18, height: 18, borderRadius: "50%", border: "2px solid " + (active ? "var(--brand)" : "var(--border-strong)"), display: "grid", placeItems: "center", flex: "none", marginTop: 1 } }, active ? React.createElement("div", { style: { width: 9, height: 9, borderRadius: "50%", background: "var(--brand)" } }) : null)
    );
  }

  // ---------- Tab: Seguimiento ----------
  function TrackingTab({ file }) {
    const has = !!file.tracking;
    const [enabled, setEnabled] = useState(has);
    const t = file.tracking || {};
    const ts = trackingStatus(file.tracking);
    if (!enabled) {
      return React.createElement(
        "div",
        { style: { textAlign: "center", padding: "30px 10px" } },
        React.createElement("div", { style: { width: 54, height: 54, borderRadius: 14, background: "var(--surface-3)", color: "var(--text-3)", display: "grid", placeItems: "center", margin: "0 auto 14px" } }, React.createElement(Icon, { name: "calendarClock", size: 24 })),
        React.createElement("div", { style: { fontWeight: 600, fontSize: 15, marginBottom: 5 } }, "Sin seguimiento"),
        React.createElement("div", { style: { fontSize: 13, color: "var(--text-2)", maxWidth: 280, margin: "0 auto 18px" } }, "Activa el seguimiento si este documento vence, requiere recordatorios o tiene costos de renovación."),
        React.createElement("button", { className: "btn btn-primary", onClick: () => setEnabled(true) }, React.createElement(Icon, { name: "plus", size: 16 }), "Activar seguimiento")
      );
    }
    return React.createElement(
      React.Fragment,
      null,
      ts
        ? React.createElement(
            "div",
            { style: { padding: "14px 16px", borderRadius: 11, marginBottom: 18, background: ts.kind === "ok" ? "var(--ok-weak)" : ts.kind === "warn" ? "var(--warn-weak)" : "var(--danger-weak)", border: "1px solid " + (ts.kind === "ok" ? "oklch(0.85 0.07 155)" : ts.kind === "warn" ? "oklch(0.85 0.07 80)" : "oklch(0.85 0.08 25)") } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 9 } }, React.createElement(StatusPill, { kind: ts.kind }, ts.label), React.createElement("span", { style: { fontSize: 12.5, color: "var(--text-2)" } }, ts.days < 0 ? "Venció hace " + Math.abs(ts.days) + " días" : "Faltan " + ts.days + " días")),
            React.createElement("div", { style: { fontSize: 22, fontWeight: 600, marginTop: 8 } }, fmtDate(t.expires)),
            (ts.kind === "warn" || ts.kind === "danger") ? React.createElement(
              "button",
              { className: "btn btn-sm btn-primary", style: { marginTop: 12, width: "100%" }, onClick: () => toast("Sube el archivo renovado para crear una nueva versión") },
              React.createElement(Icon, { name: "upload", size: 14 }), "Subir renovación"
            ) : null
          )
        : null,
      (ts && (ts.kind === "warn" || ts.kind === "danger")) ? null : null,
      React.createElement(
        "div",
        { className: "field" },
        React.createElement("label", null, "Fecha de vencimiento"),
        React.createElement("input", { className: "input", type: "date", defaultValue: t.expires })
      ),
      React.createElement(
        "div",
        { className: "field-2" },
        React.createElement("div", { className: "field" }, React.createElement("label", null, "Recordar con anticipación"), React.createElement("select", { className: "select", defaultValue: String(t.reminderDays || 30) }, ["15", "30", "45", "60", "90"].map((d) => React.createElement("option", { key: d, value: d }, d + " días antes")))),
        React.createElement("div", { className: "field" }, React.createElement("label", null, "Costo de renovación"), React.createElement("input", { className: "input", defaultValue: t.cost || "", placeholder: "$0.00" }))
      ),
      React.createElement(
        "div",
        { className: "field" },
        React.createElement("label", null, "Notificar a"),
        React.createElement(
          "div",
          { style: { display: "flex", alignItems: "center", gap: 7 } },
          React.createElement(Avatar, { person: file.owner, size: 26 }),
          React.createElement("span", { style: { fontSize: 13 } }, file.owner.name),
          React.createElement("button", { className: "btn btn-sm btn-ghost", style: { marginLeft: 4 } }, React.createElement(Icon, { name: "plus", size: 14 }), "Agregar")
        )
      ),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 9, marginTop: 6 } },
        React.createElement("button", { className: "btn btn-primary", onClick: () => toast("Seguimiento actualizado") }, "Guardar"),
        React.createElement("button", { className: "btn btn-danger", onClick: () => setEnabled(false) }, "Quitar seguimiento")
      )
    );
  }

  function CommentsTab({ file }) {
    const { people } = window.AppData;
    const seed = [
      { person: people[1], date: "2026-05-29", text: "Verificar que la fecha de vencimiento coincida con el anexo B del contrato. La versión anterior tenía una discrepancia de 15 días." },
      { person: people[3], date: "2026-06-01", text: "Confirmado con el proveedor. La fecha correcta es la que aparece en esta versión." },
      { person: people[0], date: "2026-06-03", text: "Pendiente firma del responsable de área. Se envió recordatorio por correo." },
    ];
    const [comments, setComments] = React.useState(seed);
    const [text, setText] = React.useState("");

    function submit() {
      const t = text.trim();
      if (!t) return;
      setComments([...comments, { person: people[0], date: new Date().toISOString().slice(0, 10), text: t }]);
      setText("");
    }

    return React.createElement(
      "div", { className: "comments-tab" },

      // Lista
      React.createElement(
        "div", { className: "comments-list" },
        comments.length === 0
          ? React.createElement("div", { className: "comments-empty" }, "Sin comentarios aún.")
          : comments.map((c, i) =>
              React.createElement(
                "div", { key: i, className: "comment-item" },
                React.createElement(Avatar, { person: c.person, size: 28 }),
                React.createElement(
                  "div", { className: "comment-body" },
                  React.createElement(
                    "div", { className: "comment-meta" },
                    React.createElement("span", { className: "comment-author" }, c.person.name),
                    React.createElement("span", { className: "comment-date" }, c.date)
                  ),
                  React.createElement("p", { className: "comment-text" }, c.text)
                )
              )
            )
      ),

      // Composer
      React.createElement(
        "div", { className: "comment-composer" },
        React.createElement(Avatar, { person: people[0], size: 28 }),
        React.createElement(
          "div", { className: "comment-input-wrap" },
          React.createElement("textarea", {
            className: "comment-input",
            placeholder: "Escribe un comentario...",
            value: text,
            rows: 2,
            onChange: (e) => setText(e.target.value),
            onKeyDown: (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }
          }),
          text.trim() ? React.createElement(
            "div", { className: "comment-actions" },
            React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)" } }, "⌘↵ para enviar"),
            React.createElement("button", { className: "btn btn-primary btn-sm", onClick: submit },
              React.createElement(Icon, { name: "send", size: 13 }), "Enviar")
          ) : null
        )
      )
    );
  }

  function shiftDate(dateStr, days) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  window.FileDrawer = FileDrawer;
})();
