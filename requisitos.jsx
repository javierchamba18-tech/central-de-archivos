// requisitos.jsx — Documentos Obligatorios + Catálogo de Requisitos
(function () {
  const { useState } = React;
  const { Icon, StatusPill, FileGlyph, TypeBadge, toast, TableSearch } = window;
  const { companies, reqCatalog, companyRequirements, reqFulfillments, daysUntil, fmtDate } = window.AppData;

  // ────────────────────────────────────────────────────────────
  //  Helpers
  // ────────────────────────────────────────────────────────────
  function reqStatus(fulfillment, req) {
    if (!fulfillment || fulfillment.fileIds.length === 0) return "pending";
    const hasExp = fulfillment.hasExpiry !== undefined ? fulfillment.hasExpiry : req.hasExpiry;
    if (!hasExp || !fulfillment.expiryDate)        return "ok";
    const days = daysUntil(fulfillment.expiryDate);
    if (days < 0)  return "expired";
    if (days <= 30) return "warning";
    return "ok";
  }

  function ReqStatusPill({ status }) {
    const cfg = {
      pending: { kind: "neutral", label: "No cargado" },
      ok:      { kind: "ok",      label: "Vigente"    },
      warning: { kind: "warn",    label: "Por vencer" },
      expired: { kind: "danger",  label: "Vencida"    },
    }[status] || { kind: "neutral", label: "—" };
    return React.createElement(StatusPill, { kind: cfg.kind }, cfg.label);
  }

  // ────────────────────────────────────────────────────────────
  //  ObligatoriosView — por compañía
  // ────────────────────────────────────────────────────────────
  function ObligatoriosView({ companyId, navTo }) {
    const [query,        setQuery]        = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [openReq, setOpenReq] = useState(null);
    const [localFulf,    setLocalFulf]    = useState(() => ({ ...reqFulfillments }));
    const [page,         setPage]         = useState(1);
    const PAGE_SZ = 10;

    const company  = companies.find((c) => c.id === companyId);
    const reqIds   = companyRequirements[companyId] || [];
    const reqs     = reqIds.map((id) => reqCatalog.find((r) => r.id === id)).filter(Boolean);

    const enriched = reqs.map((req) => {
      const key  = companyId + "-" + req.id;
      const fulf = localFulf[key] || { fileIds: [], expiryDate: null };
      return { req, fulf, key, status: reqStatus(fulf, req) };
    });

    const statusOrder = { expired: 0, warning: 1, pending: 2, ok: 3 };
    let filtered = enriched.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    if (query.trim()) filtered = filtered.filter(({ req }) => req.name.toLowerCase().includes(query.toLowerCase()));
    if (statusFilter !== "all") filtered = filtered.filter(({ status }) => status === statusFilter);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SZ));
    const safePage   = Math.min(page, totalPages);
    const paged      = filtered.slice((safePage - 1) * PAGE_SZ, safePage * PAGE_SZ);

    const counts = {
      expired: enriched.filter((e) => e.status === "expired").length,
      warning: enriched.filter((e) => e.status === "warning").length,
      pending: enriched.filter((e) => e.status === "pending").length,
      ok:      enriched.filter((e) => e.status === "ok").length,
    };

    const selItem = openReq ? enriched.find((e) => e.key === openReq) : null;

    return React.createElement(
      "div", { className: "page" },

      // Encabezado
      React.createElement(
        "div", { className: "page-head" },
        React.createElement("div", null,
          React.createElement("div", { className: "page-title" },
            React.createElement(Icon, { name: "clipboardList", size: 22, style: { color: "var(--brand)" } }),
            company ? company.name + " — Obligatorios" : "Documentos Obligatorios"),
          React.createElement("div", { className: "page-desc" }, reqIds.length + " requisitos configurados para esta compañía")
        ),
        React.createElement("div", { className: "page-head-actions" },
          React.createElement("button", { className: "btn btn-primary", onClick: () => setShowAddModal(true) },
            React.createElement(Icon, { name: "plus", size: 16 }), "Agregar requisito"))
      ),

      // Stats rápidos (clickables — actúan como filtros)
      React.createElement(
        "div", { className: "req-stats" },
        StatCard("alert",       "var(--danger-weak)",  "var(--danger)",        counts.expired, "Vencidos",     "expired", statusFilter, (v) => { setStatusFilter(statusFilter === v ? "all" : v); setPage(1); }),
        StatCard("clock",       "var(--warn-weak)",    "oklch(0.55 0.12 60)",  counts.warning, "Por vencer",   "warning", statusFilter, (v) => { setStatusFilter(statusFilter === v ? "all" : v); setPage(1); }),
        StatCard("slash",       "var(--surface-3)",    "var(--text-3)",        counts.pending, "No cargados",  "pending", statusFilter, (v) => { setStatusFilter(statusFilter === v ? "all" : v); setPage(1); }),
        StatCard("checkCircle", "var(--ok-weak)",      "var(--ok)",            counts.ok,      "Vigentes",     "ok",      statusFilter, (v) => { setStatusFilter(statusFilter === v ? "all" : v); setPage(1); })
      ),

      // Toolbar
      React.createElement(
        "div", { className: "toolbar" },
        React.createElement(TableSearch, { value: query, onChange: (v) => { setQuery(v); setPage(1); }, placeholder: "Buscar requisito..." }),
        React.createElement("div", { style: { flex: 1 } })
      ),

      // Tabla
      React.createElement(
        "div", { className: "flist-wrap" },
        React.createElement(
          "div", { className: "flist", style: { "--cols": "minmax(200px,2fr) 140px 130px 160px 40px" } },
          React.createElement("div", { className: "flist-head" },
            React.createElement("div", null, "Requisito"),
            React.createElement("div", null, "Estado"),
            React.createElement("div", null, "Vencimiento"),
            React.createElement("div", null, "Evidencias"),
            React.createElement("div", null, "")),

          filtered.length === 0
            ? React.createElement("div", { className: "empty" },
                React.createElement("div", { className: "e-ico" }, React.createElement(Icon, { name: "clipboardList", size: 26 })),
                React.createElement("h3", null, "Sin resultados"),
                "Ajusta los filtros o la búsqueda.")
            : paged.map(({ req, fulf, key, status }) => {
                const active = openReq === key;
                return React.createElement(
                  "div",
                  { key, className: "frow" + (active ? " selected" : ""), onClick: () => setOpenReq(active ? null : key) },
                  React.createElement(
                    "div", { className: "fmeta" },
                    React.createElement("div", { className: "fname", style: { fontSize: 13.5 } }, req.name),
                    req.desc ? React.createElement("div", { className: "fsub" }, req.desc.slice(0, 60) + (req.desc.length > 60 ? "…" : "")) : null
                  ),
                  React.createElement("div", null, React.createElement(ReqStatusPill, { status })),
                  React.createElement("div", { className: "fcol" },
                    req.hasExpiry && fulf.expiryDate
                      ? React.createElement("span", { style: { fontSize: 13 } }, fmtDate(fulf.expiryDate))
                      : React.createElement("span", { className: "muted" }, req.hasExpiry ? "Sin fecha" : "No aplica")),
                  React.createElement("div", { className: "fcol" },
                    fulf.fileIds.length > 0
                      ? React.createElement("span", { style: { fontSize: 13, fontWeight: 500 } }, fulf.fileIds.length + " archivo" + (fulf.fileIds.length !== 1 ? "s" : ""))
                      : React.createElement("span", { className: "muted" }, "—")),
                  React.createElement("div", { style: { textAlign: "right" } },
                    React.createElement("button", { className: "icon-btn", style: { width: 30, height: 30 }, title: "Subir evidencia", onClick: (e) => { e.stopPropagation(); toast("Subir evidencia para " + req.name); } },
                      React.createElement(Icon, { name: "upload", size: 15 })))
                );
              })
        ),
        // Paginación inline
        totalPages > 1 ? React.createElement(ReqPagination, { page: safePage, totalPages, onPage: setPage }) : null
      ),

      // Modal agregar requisito del catálogo
      showAddModal ? ReactDOM.createPortal(
        React.createElement(AddReqModal, {
          companyId,
          assignedIds: reqIds,
          onClose: () => setShowAddModal(false),
          onAdd:   () => { toast("Requisito agregado"); setShowAddModal(false); },
          onNewReq: () => { setShowAddModal(false); navTo && navTo({ view: "requisitos", openNew: true }); },
        }),
        document.body
      ) : null,

      // Panel de detalle del requisito seleccionado
      selItem ? ReactDOM.createPortal(
        React.createElement(ReqDrawer, {
          item: selItem,
          onClose: () => setOpenReq(null),
          onUpdate: (key, patch) => setLocalFulf((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } })),
        }),
        document.body
      ) : null
    );
  }

  // ────────────────────────────────────────────────────────────
  //  ReqDrawer — mismo patrón visual que FileDrawer
  // ────────────────────────────────────────────────────────────
  function ReqDrawer({ item, onClose, onUpdate }) {
    const { req, fulf, key, status } = item;
    const [hasExpiry,  setHasExpiry]  = useState(fulf.hasExpiry !== undefined ? fulf.hasExpiry : req.hasExpiry);
    const [editPeriod, setEditPeriod] = useState(fulf.periodicity || req.periodicity || "Anual");
    const [editExpiry, setEditExpiry] = useState(fulf.expiryDate || "");
    const [editCost,   setEditCost]   = useState(fulf.renewalCost || req.renewalCost || "");
    const [editObs,    setEditObs]    = useState(fulf.observations || req.notes || "");
    const isFechaLibre = editPeriod === "Fecha libre";
    const dateLabel = isFechaLibre ? "Fecha de vencimiento" : "Fecha de inicio del período";

    return React.createElement(
      React.Fragment, null,
      React.createElement("div", { className: "overlay", onClick: onClose }),
      React.createElement(
        "div", { className: "drawer" },

        // Head
        React.createElement(
          "div", { className: "drawer-head" },
          React.createElement("button", { className: "icon-btn drawer-close", onClick: onClose }, React.createElement(Icon, { name: "x", size: 18 })),
          React.createElement(
            "div", { style: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 } },
            React.createElement("div", { className: "req-detail-ico" }, React.createElement(Icon, { name: "clipboardList", size: 20 })),
            React.createElement(
              "div", { style: { flex: 1, minWidth: 0 } },
              React.createElement("div", { style: { fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.3 } }, req.name),
              React.createElement("div", { style: { marginTop: 6 } }, React.createElement(ReqStatusPill, { status }))
            )
          ),
          req.desc ? React.createElement("div", { style: { fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.5 } }, req.desc) : null
        ),

        // Body
        React.createElement(
          "div", { className: "drawer-body" },

          // Vencimiento
          React.createElement("div", { className: "section-h" }, React.createElement(Icon, { name: "calendar", size: 14 }), "Vencimiento"),
          // Toggle ¿tiene vencimiento?
          React.createElement(
            "label", { style: { display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 13.5, marginBottom: 14 } },
            React.createElement("input", { type: "checkbox", checked: hasExpiry, onChange: (e) => setHasExpiry(e.target.checked), style: { accentColor: "var(--brand)" } }),
            "Este requisito tiene fecha de vencimiento"
          ),
          hasExpiry ? React.createElement(
            React.Fragment, null,
            React.createElement("div", { className: "field" },
              React.createElement("label", null, "Periodicidad"),
              React.createElement("select", { className: "select", value: editPeriod, onChange: (e) => setEditPeriod(e.target.value) },
                React.createElement("option", null, "Mensual"),
                React.createElement("option", null, "Trimestral"),
                React.createElement("option", null, "Anual"),
                React.createElement("option", null, "Fecha libre")
              )
            ),
            React.createElement(
              "div", { className: "field-2" },
              React.createElement("div", { className: "field" },
                React.createElement("label", null, dateLabel),
                React.createElement("input", { className: "input", type: "date", value: editExpiry, onChange: (e) => setEditExpiry(e.target.value) })
              ),
              React.createElement("div", { className: "field" },
                React.createElement("label", null, "Costo de renovaci\u00f3n"),
                React.createElement("input", { className: "input", placeholder: "$0.00", value: editCost, onChange: (e) => setEditCost(e.target.value) })
              )
            )
          ) : null,

          // Evidencias
          React.createElement("div", { className: "section-h" }, React.createElement(Icon, { name: "fileCheck", size: 14 }), "Evidencias"),
          fulf.fileIds.length === 0
            ? React.createElement("div", { className: "req-evidence-empty", style: { marginBottom: 12 } },
                React.createElement(Icon, { name: "slash", size: 20, style: { color: "var(--text-3)" } }),
                React.createElement("div", null, "Sin evidencias cargadas"))
            : React.createElement(
                "div", { className: "req-evidence-list", style: { marginBottom: 12 } },
                (fulf.evidenceNames || fulf.fileIds).map((name, i) =>
                  React.createElement(
                    "div", { key: i, className: "req-evidence-row" },
                    React.createElement(FileGlyph, { ext: "pdf", sm: true }),
                    React.createElement("span", { className: "fname", style: { fontSize: 13 } }, name),
                    React.createElement("button", { className: "btn btn-sm btn-ghost", onClick: () => toast("Abriendo " + name) },
                      React.createElement(Icon, { name: "eye", size: 13 }))
                  )
                )
              ),
          React.createElement("button", { className: "btn btn-outline", style: { width: "100%" }, onClick: () => toast("Seleccionar archivo de evidencia") },
            React.createElement(Icon, { name: "upload", size: 15 }), "Subir evidencia"),

          // Observaciones
          React.createElement("div", { className: "section-h", style: { marginTop: 20 } }, React.createElement(Icon, { name: "messageCircle", size: 14 }), "Observaciones"),
          React.createElement("textarea", {
            className: "comment-input", style: { width: "100%", minHeight: 72 }, rows: 3,
            placeholder: "Notas internas sobre este requisito en esta compañía...",
            value: editObs, onChange: (e) => setEditObs(e.target.value)
          })
        ),

        // Foot
        React.createElement(
          "div", { className: "drawer-foot" },
          React.createElement("button", { className: "btn btn-primary", style: { flex: 1 }, onClick: () => { onUpdate(key, { periodicity: editPeriod, renewalCost: editCost, observations: editObs }); toast("Configuración guardada"); } },
            React.createElement(Icon, { name: "check", size: 15 }), "Guardar cambios"),
          React.createElement("button", { className: "btn btn-outline", onClick: onClose }, "Cerrar")
        )
      )
    );
  }

  // ────────────────────────────────────────────────────────────
  //  AddReqModal — buscar en catálogo y asignar a compañía
  // ────────────────────────────────────────────────────────────
  function AddReqModal({ companyId, assignedIds, onClose, onAdd, onNewReq }) {
    const [search, setSearch] = useState("");
    const available = reqCatalog.filter((r) =>
      !assignedIds.includes(r.id) &&
      (search.trim() === "" || (r.name + " " + r.desc).toLowerCase().includes(search.toLowerCase()))
    );
    return React.createElement(
      "div", { className: "modal-wrap", onClick: onClose },
      React.createElement(
        "div", { className: "modal", style: { maxWidth: 480 }, onClick: (e) => e.stopPropagation() },
        React.createElement("div", { className: "modal-head" },
          React.createElement("div", { className: "modal-ico" }, React.createElement(Icon, { name: "clipboardList", size: 18 })),
          React.createElement("div", null,
            React.createElement("div", { className: "modal-title" }, "Agregar requisito"),
            React.createElement("div", { className: "modal-sub" }, "Selecciona del cat\u00e1logo global")),
          React.createElement("button", { className: "icon-btn drawer-close", onClick: onClose }, React.createElement(Icon, { name: "x", size: 16 }))
        ),
        React.createElement(
          "div", { className: "modal-body", style: { padding: 0 } },
          // Buscador
          React.createElement(
            "div", { style: { padding: "12px 16px", borderBottom: "1px solid var(--border)" } },
            React.createElement(
              "div", { className: "table-search", style: { width: "100%" } },
              React.createElement(Icon, { name: "search", size: 13, style: { color: "var(--text-3)", flexShrink: 0 } }),
              React.createElement("input", {
                type: "text", autoFocus: true, style: { flex: 1, width: "auto" },
                placeholder: "Buscar en el cat\u00e1logo...",
                value: search, onChange: (e) => setSearch(e.target.value)
              }),
              search ? React.createElement("button", { className: "ts-clear", onClick: () => setSearch("") }, React.createElement(Icon, { name: "x", size: 12 })) : null
            )
          ),
          // Resultados
          React.createElement(
            "div", { style: { maxHeight: 320, overflowY: "auto" } },
            available.length === 0 && !search.trim()
              ? React.createElement("div", { style: { padding: "20px 16px", textAlign: "center", color: "var(--text-3)", fontSize: 13 } }, "Todos los requisitos ya est\u00e1n asignados a esta compa\u00f1\u00eda.")
              : available.length === 0
              ? React.createElement("div", { style: { padding: "20px 16px", textAlign: "center", color: "var(--text-3)", fontSize: 13 } }, "Sin resultados para \u201c" + search + "\u201d.")
              : available.map((r) =>
                  React.createElement(
                    "button", {
                      key: r.id,
                      className: "add-req-row",
                      onClick: () => onAdd(r.id)
                    },
                    React.createElement(
                      "div", { style: { flex: 1, minWidth: 0, textAlign: "left" } },
                      React.createElement("div", { style: { fontWeight: 600, fontSize: 13.5 } }, r.name),
                      r.desc ? React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 } }, r.desc.slice(0, 80) + (r.desc.length > 80 ? "\u2026" : "")) : null
                    ),
                    React.createElement(Icon, { name: "plus", size: 15, style: { color: "var(--brand)", flexShrink: 0 } })
                  )
                )
          )
        ),
        React.createElement(
          "div", { className: "modal-foot" },
          React.createElement("button", { className: "btn btn-ghost", style: { marginRight: "auto" }, onClick: onNewReq },
            React.createElement(Icon, { name: "plus", size: 14 }), "Nuevo requisito"),
          React.createElement("button", { className: "btn btn-outline", onClick: onClose }, "Cerrar")
        )
      )
    );
  }

  // ────────────────────────────────────────────────────────────
  //  RequisitosCatalogView — admin global
  // ────────────────────────────────────────────────────────────
  function RequisitosCatalogView({ openNew }) {
    const [query, setQuery] = useState("");
    const [editingReq, setEditingReq] = useState(() => openNew ? { id: "", name: "", desc: "", isNew: true } : null);
    const visible = query.trim()
      ? reqCatalog.filter((r) => (r.name + " " + r.desc).toLowerCase().includes(query.toLowerCase()))
      : reqCatalog;

    return React.createElement(
      "div", { className: "page" },
      React.createElement(
        "div", { className: "page-head" },
        React.createElement("div", null,
          React.createElement("div", { className: "page-title" },
            React.createElement(Icon, { name: "clipboardList", size: 22, style: { color: "var(--brand)" } }), "Catálogo de Requisitos"),
          React.createElement("div", { className: "page-desc" }, "Requisitos documentales reutilizables disponibles para todas las compañías.")
        ),
        React.createElement("div", { className: "page-head-actions" },
          React.createElement("button", { className: "btn btn-primary", onClick: () => setEditingReq({ id: "", name: "", desc: "", hasExpiry: false, periodicity: "", renewalCost: "", notes: "", isNew: true }) },
            React.createElement(Icon, { name: "plus", size: 16 }), "Nuevo requisito"))
      ),
      React.createElement(
        "div", { className: "toolbar" },
        React.createElement(TableSearch, { value: query, onChange: setQuery, placeholder: "Buscar requisito..." }),
        React.createElement("div", { style: { flex: 1 } })
      ),
      React.createElement(
        "div", { className: "flist-wrap" },
        React.createElement(
          "div", { className: "flist", style: { "--cols": "minmax(200px,1fr) minmax(250px,2fr) 40px" } },
          React.createElement("div", { className: "flist-head" },
            React.createElement("div", null, "Nombre"),
            React.createElement("div", null, "Descripción"),
            React.createElement("div", null, "")),
          visible.length === 0
            ? React.createElement("div", { className: "empty" }, React.createElement("div", { className: "e-ico" }, React.createElement(Icon, { name: "clipboardList", size: 26 })), React.createElement("h3", null, "Sin resultados"))
            : visible.map((r) =>
                React.createElement(
                  "div", { key: r.id, className: "frow" },
                  React.createElement(
                    "div", { className: "fmeta" },
                    React.createElement("div", { className: "fname", style: { fontSize: 13.5 } }, r.name)
                  ),
                  React.createElement("div", { className: "fcol", style: { fontSize: 12.5, color: "var(--text-2)" } }, r.desc ? r.desc.slice(0, 90) + (r.desc.length > 90 ? "…" : "") : "—"),
                  React.createElement("div", { style: { textAlign: "right" } },
                    React.createElement("button", { className: "icon-btn", style: { width: 30, height: 30 }, onClick: () => setEditingReq({ ...r }) },
                      React.createElement(Icon, { name: "settings", size: 15 })))
                )
              )
        )
      ),
      editingReq ? ReactDOM.createPortal(
        React.createElement(ReqEditModal, { req: editingReq, onClose: () => setEditingReq(null) }),
        document.body
      ) : null
    );
  }

  // ────────────────────────────────────────────────────────────
  //  ReqEditModal
  // ────────────────────────────────────────────────────────────
  function ReqEditModal({ req, onClose }) {
    const [name, setName] = useState(req.name);
    const [desc, setDesc] = useState(req.desc || "");

    return React.createElement(
      "div", { className: "modal-wrap", onClick: onClose },
      React.createElement(
        "div", { className: "modal", style: { maxWidth: 440 }, onClick: (e) => e.stopPropagation() },
        React.createElement("div", { className: "modal-head" },
          React.createElement("div", { className: "modal-ico" }, React.createElement(Icon, { name: "clipboardList", size: 18 })),
          React.createElement("div", null,
            React.createElement("div", { className: "modal-title" }, req.isNew ? "Nuevo requisito" : "Editar requisito"),
            React.createElement("div", { className: "modal-sub" }, req.isNew ? "Agregar al catálogo global" : req.name)),
          React.createElement("button", { className: "icon-btn drawer-close", onClick: onClose }, React.createElement(Icon, { name: "x", size: 16 }))
        ),
        React.createElement(
          "div", { className: "modal-body", style: { display: "flex", flexDirection: "column", gap: 12 } },
          React.createElement("div", { className: "field" }, React.createElement("label", null, "Nombre"), React.createElement("input", { className: "input", placeholder: "Ej. Acta Constitutiva", value: name, onChange: (e) => setName(e.target.value) })),
          React.createElement("div", { className: "field" }, React.createElement("label", null, "Descripción"), React.createElement("textarea", { className: "comment-input", rows: 3, style: { width: "100%" }, placeholder: "Descripción breve del requisito...", value: desc, onChange: (e) => setDesc(e.target.value) }))
        ),
        React.createElement("div", { className: "modal-foot" },
          React.createElement("div", { style: { flex: 1 } }),
          React.createElement("button", { className: "btn btn-ghost", onClick: onClose }, "Cancelar"),
          React.createElement("button", { className: "btn btn-primary", disabled: !name.trim(), onClick: () => { toast("Requisito guardado"); onClose(); } },
            React.createElement(Icon, { name: "check", size: 14 }), req.isNew ? "Crear" : "Guardar")
        )
      )
    );
  }

  // ────────────────────────────────────────────────────────────
  //  Pagination for requirements table
  // ────────────────────────────────────────────────────────────
  function ReqPagination({ page, totalPages, onPage }) {
    function getPages() {
      if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
      if (page <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
      if (page >= totalPages - 3) return [1, "...", totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages];
      return [1, "...", page-1, page, page+1, "...", totalPages];
    }
    return React.createElement(
      "div", { className: "file-pagination" },
      React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)" } }, "Página " + page + " de " + totalPages),
      React.createElement(
        "div", { className: "fp-pages" },
        React.createElement("button", { className: "icon-btn fp-nav", disabled: page <= 1, onClick: () => onPage(page - 1) }, React.createElement(Icon, { name: "chevL", size: 14 })),
        getPages().map((p, i) => p === "..." ? React.createElement("span", { key: "e"+i, className: "fp-ellipsis" }, "...") :
          React.createElement("button", { key: p, className: "fp-page-btn" + (p === page ? " active" : ""), onClick: () => onPage(p) }, p)),
        React.createElement("button", { className: "icon-btn fp-nav", disabled: page >= totalPages, onClick: () => onPage(page + 1) }, React.createElement(Icon, { name: "chevR", size: 14 }))
      )
    );
  }

  // ────────────────────────────────────────────────────────────
  //  Helpers
  // ────────────────────────────────────────────────────────────
  function StatCard(icon, bg, fg, count, label, filterVal, activeFilter, onFilter) {
    const isActive = filterVal && activeFilter === filterVal;
    const clickable = !!onFilter;
    return React.createElement(
      "div", {
        className: "stat-card" + (isActive ? " active" : ""),
        style: clickable ? { cursor: "pointer", outline: isActive ? "2px solid var(--brand)" : "none", outlineOffset: 2 } : {},
        onClick: clickable ? () => onFilter(filterVal) : undefined,
        title: clickable ? (isActive ? "Quitar filtro" : "Filtrar: " + label) : undefined,
      },
      React.createElement("div", { className: "stat-top" },
        React.createElement("div", { className: "stat-ico", style: { background: bg, color: fg } }, React.createElement(Icon, { name: icon, size: 16 })),
        label),
      React.createElement("div", { className: "stat-num" }, count)
    );
  }

  Object.assign(window, { ObligatoriosView, RequisitosCatalogView });
})();
