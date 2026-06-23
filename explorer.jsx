// explorer.jsx — sidebar, topbar, explorador (lista/cuadrícula)
(function () {
  const { useState, useMemo, useEffect } = React;
  const { Icon, Checkbox, TypeBadge, FileGlyph, StatusPill, trackingStatus, Avatar, Menu } = window;
  const { companies, docTypes, files, costCenters, fmtDate, fmtDateShort, reqCatalog, companyRequirements, reqFulfillments, daysUntil } = window.AppData;

  // ---------- Sidebar ----------
  function Sidebar({ view, companyId, costCenterId, typeCode, onNav, counts }) {
    const [expanded, setExpanded] = useState(() =>
      companyId ? new Set([companyId]) : new Set()
    );
    const [expandedCC, setExpandedCC] = useState(new Set());

    useEffect(() => {
      if (companyId) {
        setExpanded((s) => { const n = new Set(s); n.add(companyId); return n; });
      }
    }, [companyId]);

    function toggleExpandCC(id, e) {
      e && e.stopPropagation();
      setExpandedCC((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
    }
    function toggleExpand(id, e) {
      e.stopPropagation();
      setExpanded((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
    }

    const navItem = (id, icon, label, count) =>
      React.createElement(
        "button",
        { className: "sb-item" + (view === id && !companyId ? " active" : ""), onClick: () => onNav({ view: id }) },
        React.createElement(Icon, { name: icon, size: 17 }),
        label,
        count != null ? React.createElement("span", { className: "count" }, count) : null
      );

    return React.createElement(
      "aside",
      { className: "sidebar" },

      // Brand
      React.createElement(
        "div",
        { className: "brand-block" },
        React.createElement("div", { className: "brand-mark" }, React.createElement(Icon, { name: "layers", size: 18 })),
        React.createElement(
          "div",
          null,
          React.createElement("div", { className: "brand-name" }, "Central de archivos"),
          React.createElement("div", { className: "brand-sub" }, "Octane Systems")
        )
      ),

      // MI ESPACIO — fijo, sin scroll
      React.createElement(
        "div",
        { className: "sb-static" },
        React.createElement("div", { className: "sb-label" }, "Mi espacio"),
        navItem("recientes", "clock", "Recientes"),
        navItem("misArchivos", "files", "Mis archivos", counts.myFiles),
        navItem("favoritos", "star", "Favoritos", counts.starred),
        navItem("compartidos", "share2", "Compartidos", counts.shared)
      ),

      // EXPLORADOR — solo esta sección scrollea
      React.createElement(
        "div",
        { className: "sb-explorer" },
        React.createElement(
          "div",
          { className: "sb-label", style: { display: "flex", alignItems: "center", marginBottom: 4 } },
          React.createElement("span", { style: { flex: 1 } }, "Explorador"),
          React.createElement(
            "button",
            {
              className: "icon-btn",
              style: { width: 20, height: 20, color: "var(--text-3)" },
              title: companies.every((c) => expanded.has(c.id)) ? "Colapsar todas" : "Expandir todas",
              onClick: () => {
                const allOpen = companies.every((c) => expanded.has(c.id));
                setExpanded(allOpen ? new Set() : new Set(companies.map((c) => c.id)));
              },
            },
            React.createElement(Icon, {
              name: companies.every((c) => expanded.has(c.id)) ? "foldAll" : "unfoldAll",
              size: 13,
            })
          )
        ),
        companies.map((c) => {
          const isOpen = expanded.has(c.id);
          const isActiveCompany = view === "company" && companyId === c.id;
          const compFiles = files.filter((f) => f.company === c.id);
          const typesHere = docTypes.filter((d) => compFiles.some((f) => f.type === d.code));

          return React.createElement(
            "div",
            { key: c.id },
            React.createElement(
              "div",
              { className: "sb-company-row" + (isActiveCompany ? " has-active" : "") },
              React.createElement(
                "button",
                { className: "sb-expand-btn", onClick: (e) => toggleExpand(c.id, e), title: isOpen ? "Colapsar" : "Expandir" },
                React.createElement(
                  "span",
                  { className: "sb-expand-chevron" + (isOpen ? " open" : "") },
                  React.createElement(Icon, { name: "chevR", size: 13 })
                )
              ),
              React.createElement(
                "button",
                {
                  className: "sb-company-btn",
                  onClick: () => {
                    onNav({ view: "company", companyId: c.id });
                    setExpanded((s) => { const n = new Set(s); n.add(c.id); return n; });
                  },
                },
                React.createElement(Icon, { name: isOpen ? "folderOpen" : "folder", size: 16, style: { color: "oklch(0.62 0.09 75)", flexShrink: 0 } }),
                React.createElement("span", { className: "company-name" }, c.name)
              )
            ),
            isOpen ? React.createElement(
                "div", null,
                // Centros de costos
                costCenters.filter((cc) => cc.companyId === c.id).map((cc) => {
                  const ccFiles = files.filter((f) => f.company === c.id && f.ccId === cc.id);
                  const ccTypes = docTypes.filter((d) => ccFiles.some((f) => f.type === d.code));
                  const ccOpen  = expandedCC.has(cc.id);
                  const ccActive = view === "company" && companyId === c.id && costCenterId === cc.id && !typeCode;
                  return React.createElement("div", { key: cc.id },
                    React.createElement("div", { className: "sb-cc-row" },
                      React.createElement("button", { className: "sb-expand-btn sb-cc-chevron", onClick: (e) => toggleExpandCC(cc.id, e) },
                        React.createElement("span", { className: "sb-expand-chevron" + (ccOpen ? " open" : "") },
                          React.createElement(Icon, { name: "chevR", size: 12 }))),
                      React.createElement("button", {
                        className: "sb-tree-type sb-cc-btn" + (ccActive ? " active" : ""),
                        style: { flex: 1 },
                        onClick: () => { onNav({ view: "company", companyId: c.id, costCenterId: cc.id }); setExpandedCC((s) => { const n = new Set(s); n.add(cc.id); return n; }); }
                      },
                        React.createElement(Icon, { name: ccOpen ? "folderOpen" : "folder", size: 13, style: { color: "oklch(0.62 0.09 75)", flexShrink: 0 } }),
                        React.createElement("span", { style: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" } },
                          React.createElement("span", { className: "sb-cc-id" }, cc.id + " · "),
                          cc.name
                        )
                      )
                    ),
                    ccOpen ? React.createElement("div", null,
                      // Documentos requeridos dentro del CC
                      React.createElement("button", {
                        className: "sb-tree-type sb-cc-type sb-obligatorio" + (view === "obligatorios" && companyId === c.id && costCenterId === cc.id ? " active" : ""),
                        onClick: () => onNav({ view: "obligatorios", companyId: c.id, costCenterId: cc.id }),
                      },
                        React.createElement(Icon, { name: "alert", size: 13, style: { color: "oklch(0.62 0.09 75)", flexShrink: 0 } }),
                        "Documentos requeridos"
                      ),
                      ccTypes.map((d) => {
                        const isActiveType = view === "company" && companyId === c.id && costCenterId === cc.id && typeCode === d.code;
                        return React.createElement("button", {
                          key: d.code,
                          className: "sb-tree-type sb-cc-type" + (isActiveType ? " active" : ""),
                          onClick: () => onNav({ view: "company", companyId: c.id, costCenterId: cc.id, typeCode: d.code }),
                        },
                          React.createElement(Icon, { name: "folder", size: 13, style: { color: "oklch(0.68 0.07 75)", flexShrink: 0, opacity: 0.9 } }),
                          d.name
                        );
                      })
                    ) : null
                  );
                })
              ) : null
          );
        })
      ),

      // SISTEMA — footer fijo
      React.createElement(
        "div",
        { className: "sb-footer" },
        navItem("seguimiento",  "calendarClock", "Seguimiento", counts.tracking),
        navItem("requisitos",   "clipboardList",  "Documentos requeridos"),
        navItem("tipos", "tag", "Tipos de archivo"),
        navItem("permisos", "shield", "Permisos"),
        navItem("papelera", "trash", "Papelera")
      )
    );
  }

  // ---------- Topbar ----------
  function Topbar({ onUpload, navTo, onOpen }) {
    const { GlobalSearch } = window;
    return React.createElement(
      "header",
      { className: "topbar" },
      React.createElement(GlobalSearch, { navTo, onOpen }),
      React.createElement(
        "div",
        { className: "topbar-right" },
        React.createElement(
          "button",
          { className: "btn btn-primary", onClick: onUpload },
          React.createElement(Icon, { name: "upload", size: 16 }),
          "Subir"
        ),
        React.createElement(
          "button",
          { className: "icon-btn", title: "Notificaciones" },
          React.createElement(Icon, { name: "bell", size: 19 }),
          React.createElement("span", { className: "dot" })
        ),
        React.createElement(Avatar, { person: { initials: "MO", color: "oklch(0.5 0.13 256)" }, size: 34 })
      )
    );
  }

  // ---------- Explorer file row / card ----------
  function fileStatusEls(f) {
    const els = [];
    if (!f.classified) {
      els.push(React.createElement(StatusPill, { kind: "warn", icon: "sparkles", key: "c" }, "Requiere clasificar"));
    }
    const ts = trackingStatus(f.tracking);
    if (ts && ts.kind !== "ok") els.push(React.createElement(StatusPill, { kind: ts.kind, key: "t" }, ts.label));
    return els;
  }

  function FileRow({ f, selected, onSelect, onOpen, hasSelection, starred, onToggleStar }) {
    return React.createElement(
      "div",
      { className: "frow" + (selected ? " selected" : ""), onClick: () => onOpen(f) },
      React.createElement(
        "div",
        { className: "fmain" },
        React.createElement("div", { className: "row-check" }, React.createElement(Checkbox, { checked: selected, onClick: () => onSelect(f.uid) })),
        React.createElement(FileGlyph, { ext: f.ext }),
        React.createElement(
          "div",
          { className: "fmeta" },
          React.createElement(
            "div",
            { className: "fname" },
            f.title,
            f.starred ? React.createElement(Icon, { name: "star", size: 13, style: { color: "var(--warn)", fill: "var(--warn)", marginLeft: 6, verticalAlign: "-2px" } }) : null
          ),
          React.createElement(
            "div",
            { className: "fsub" },
            f.folio ? React.createElement("span", { className: "mono" }, React.createElement("span", { style: { fontSize: 10.5, fontFamily: "var(--font)", fontWeight: 500, color: "var(--text-3)", letterSpacing: "0.03em", textTransform: "uppercase", marginRight: 3 } }, "Folio:"), f.folio) : null,
            f.versions > 1 ? React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 3 } }, React.createElement(Icon, { name: "history", size: 12 }), "v" + f.versions) : null
          )
        )
      ),
      React.createElement(TypeBadge, { code: f.type, color: f.typeColor, name: f.typeName }),
      React.createElement("div", { className: "fcol", style: { overflow: "hidden" } },
        f.site ? React.createElement("span", { className: "mono", style: { fontSize: 12.5 } }, f.site)
               : React.createElement("span", { className: "muted", style: { fontSize: 12 } }, "—")
      ),
      React.createElement(
        "div",
        { className: "fcol", style: { display: "flex", gap: 6, flexWrap: "wrap" } },
        fileStatusEls(f).length ? fileStatusEls(f) : React.createElement("span", { className: "muted", style: { fontSize: 12 } }, "—")
      ),
      React.createElement("div", { className: "fcol num" }, fmtDate(f.date)),
      React.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 } },
        React.createElement(
          "div",
          { className: "row-actions" },
          React.createElement("button", { className: "icon-btn", style: { width: 30, height: 30 }, title: "Descargar", onClick: (e) => { e.stopPropagation(); toast("Descargando " + f.title); } }, React.createElement(Icon, { name: "download", size: 15 })),
          React.createElement("button", {
            className: "icon-btn", style: { width: 30, height: 30, color: starred ? "var(--warn)" : undefined },
            title: starred ? "Quitar de favoritos" : "Agregar a favoritos",
            onClick: (e) => { e.stopPropagation(); if (onToggleStar) onToggleStar(f.uid); }
          }, React.createElement(Icon, { name: "star", size: 15, style: starred ? { fill: "var(--warn)", color: "var(--warn)" } : {} })),
          React.createElement(
            Menu,
            {
              trigger: React.createElement("button", { className: "icon-btn", style: { width: 30, height: 30 } }, React.createElement(Icon, { name: "moreV", size: 16 })),
              items: [
                { icon: "eye",      label: "Abrir detalle",        onClick: () => onOpen(f) },
                { icon: "download", label: "Descargar" },
                { icon: "share",    label: "Compartir",            onClick: () => onOpen(f, "compartir") },
                { icon: "star", label: starred ? "Quitar de favoritos" : "Agregar a favoritos", onClick: () => { if (onToggleStar) onToggleStar(f.uid); } },
                { icon: "history",  label: "Ver versiones",        onClick: () => onOpen(f, "versiones") },
                { divider: true },
                { icon: "edit",     label: "Editar" },
                { divider: true },
                { icon: "trash",    label: "Enviar a papelera",    danger: true },
              ],
            }
          )
        )
      )
    );
  }

  function FileCard({ f, selected, onSelect, onOpen }) {
    const ts = trackingStatus(f.tracking);
    return React.createElement(
      "div",
      { className: "fcard" + (selected ? " selected" : ""), onClick: () => onOpen(f) },
      React.createElement("div", { className: "fcard-check" }, React.createElement(Checkbox, { checked: selected, onClick: () => onSelect(f.uid) })),
      React.createElement(
        "div",
        { className: "fcard-badge" },
        !f.classified
          ? React.createElement(StatusPill, { kind: "warn", icon: "sparkles" }, "Clasificar")
          : ts && ts.kind !== "ok"
          ? React.createElement(StatusPill, { kind: ts.kind }, ts.label)
          : null
      ),
      React.createElement(
        "div",
        { className: "fcard-preview" },
        React.createElement("div", { className: "stripes", style: stripeStyle(f.typeColor) }),
        React.createElement(FileGlyph, { ext: f.ext, lg: true })
      ),
      React.createElement(
        "div",
        { className: "fcard-body" },
        React.createElement("div", { className: "fname" }, f.title),
        React.createElement(
          "div",
          { className: "fcard-foot" },
          React.createElement(TypeBadge, { code: f.type, color: f.typeColor, name: f.typeName }),
          f.versions > 1 ? React.createElement("span", { className: "muted", style: { fontSize: 11, display: "inline-flex", alignItems: "center", gap: 3 } }, React.createElement(Icon, { name: "history", size: 12 }), "v" + f.versions) : null,
          React.createElement("span", { style: { marginLeft: "auto", fontSize: 11, color: "var(--text-3)" } }, fmtDateShort(f.date))
        )
      )
    );
  }

  function stripeStyle(color) {
    return {
      backgroundImage:
        "repeating-linear-gradient(135deg, color-mix(in oklch, " + color + " 7%, white) 0 9px, transparent 9px 18px)",
    };
  }

  Object.assign(window, { Sidebar, Topbar, FileRow, FileCard, fileStatusEls, stripeStyle });
})();
