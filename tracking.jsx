// tracking.jsx — vistas Seguimiento y Compartidos
(function () {
  const { useState } = React;
  const { Icon, TypeBadge, FileGlyph, StatusPill, trackingStatus, Avatar, Menu, toast, TableSearch } = window;
  const { companies, files, sharedWithMe, fmtDate, daysUntil } = window.AppData;

  // ---------- Seguimiento ----------
  function TrackingView({ onOpen }) {
    const [filter, setFilter] = useState("all");
    const [localQuery, setLocalQuery] = useState("");
    const [page, setPage] = useState(1);
    const TRACK_PAGE_SIZE = 10;
    const tracked = files.filter((f) => f.tracking && f.tracking.expires).map((f) => ({ f, days: daysUntil(f.tracking.expires) })).sort((a, b) => a.days - b.days);

    const vencidos = tracked.filter((t) => t.days < 0);
    const proximos = tracked.filter((t) => t.days >= 0 && t.days <= 30);
    const masTarde = tracked.filter((t) => t.days > 30);
    const totalCost = tracked.length;

    const filtered = filter === "vencidos" ? vencidos : filter === "proximos" ? proximos : filter === "vigentes" ? masTarde : tracked;
    const display = localQuery.trim()
      ? filtered.filter(({ f }) => { const lq = localQuery.toLowerCase(); const co = companies.find((c) => c.id === f.company); return [f.title, f.typeName, f.type, co ? co.name : ""].some((s) => s.toLowerCase().includes(lq)); })
      : filtered;

    const totalTPages = Math.max(1, Math.ceil(display.length / TRACK_PAGE_SIZE));
    const safeTPage   = Math.min(page, totalTPages);
    const pagedDisplay = display.slice((safeTPage-1)*TRACK_PAGE_SIZE, safeTPage*TRACK_PAGE_SIZE);

    const stat = (icon, color, num, label, foot, f) =>
      React.createElement(
        "button",
        { className: "stat-card", style: { textAlign: "left", border: filter === f ? "1px solid var(--brand)" : "1px solid var(--border)", boxShadow: filter === f ? "0 0 0 3px var(--brand-weak)" : "none" }, onClick: () => { setFilter(f); setPage(1); } },
        React.createElement("div", { className: "stat-top" }, React.createElement("div", { className: "stat-ico", style: { background: color.bg, color: color.fg } }, React.createElement(Icon, { name: icon, size: 16 })), label),
        React.createElement("div", { className: "stat-num" }, num),
        React.createElement("div", { className: "stat-foot" }, foot)
      );

    return React.createElement(
      "div",
      { className: "page" },
      React.createElement(
        "div",
        { className: "page-head" },
        React.createElement(
          "div",
          null,
          React.createElement("div", { className: "page-title" }, React.createElement(Icon, { name: "calendarClock", size: 24, style: { color: "var(--brand)" } }), "Seguimiento documental"),
          React.createElement("div", { className: "page-desc" }, "Vencimientos, recordatorios y renovaciones de los documentos que lo requieren")
        ),
        React.createElement("div", { className: "page-head-actions" }, React.createElement("button", { className: "btn btn-outline" }, React.createElement(Icon, { name: "calendar", size: 16 }), "Ver calendario"))
      ),
      React.createElement(
        "div",
        { className: "stat-grid" },
        stat("alert", { bg: "var(--danger-weak)", fg: "var(--danger)" }, vencidos.length, "Vencidos", vencidos.length ? "Acción inmediata" : "Nada vencido", "vencidos"),
        stat("clock", { bg: "var(--warn-weak)", fg: "oklch(0.55 0.12 60)" }, proximos.length, "Próximos 30 días", "Por renovar pronto", "proximos"),
        stat("checkCircle", { bg: "var(--ok-weak)", fg: "var(--ok)" }, masTarde.length, "Vigentes", "Más de 30 días", "vigentes"),
        stat("files", { bg: "var(--brand-weak)", fg: "var(--brand)" }, totalCost, "Con seguimiento", "Total monitoreado", "all")
      ),
      React.createElement("div", { className: "toolbar", style: { marginBottom: 14 } },
        React.createElement(TableSearch, { value: localQuery, onChange: (v) => { setLocalQuery(v); setPage(1); }, placeholder: "Buscar en seguimiento..." }),
        React.createElement("div", { style: { flex: 1 } })
      ),
      React.createElement(
        "div", { className: "flist-wrap" },
        React.createElement(
        "div",
        { className: "flist", style: { "--cols": "1fr 130px 150px 160px 120px 40px" } },
        React.createElement(
          "div",
          { className: "flist-head" },
          React.createElement("div", null, "Documento"),
          React.createElement("div", null, "Tipo"),
          React.createElement("div", null, "Vence"),
          React.createElement("div", null, "Estado"),
          React.createElement("div", null, "Renovación"),
          React.createElement("div", null, "")
        ),
        display.length === 0
          ? React.createElement("div", { className: "empty" }, React.createElement("div", { className: "e-ico" }, React.createElement(Icon, { name: "checkCircle", size: 26 })), React.createElement("h3", null, "Nada por aquí"), "No hay documentos en esta categoría.")
          : pagedDisplay.map(({ f, days }) => {
              const ts = trackingStatus(f.tracking);
              const company = companies.find((c) => c.id === f.company);
              return React.createElement(
                "div",
                { className: "frow", key: f.uid, onClick: () => onOpen(f, "seguimiento") },
                React.createElement(
                  "div",
                  { className: "fmain" },
                  React.createElement(FileGlyph, { ext: f.ext }),
                  React.createElement("div", { className: "fmeta" }, React.createElement("div", { className: "fname" }, f.title), React.createElement("div", { className: "fsub" }, React.createElement("span", { className: "company-dot", style: { background: company.color, width: 7, height: 7 } }), company.name))
                ),
                React.createElement("div", null, React.createElement(TypeBadge, { code: f.type, color: f.typeColor, name: f.typeName })),
                React.createElement("div", { className: "fcol num" }, fmtDate(f.tracking.expires)),
                React.createElement("div", null, React.createElement(StatusPill, { kind: ts.kind }, days < 0 ? "Venció hace " + Math.abs(days) + "d" : days === 0 ? "Vence hoy" : "En " + days + " días")),
                React.createElement("div", { className: "fcol" }, f.tracking.cost && f.tracking.cost !== "—" ? f.tracking.cost : React.createElement("span", { className: "muted" }, "—")),
                React.createElement("div", { style: { textAlign: "right" } }, React.createElement(Menu, { trigger: React.createElement("button", { className: "icon-btn", style: { width: 30, height: 30 } }, React.createElement(Icon, { name: "moreV", size: 16 })), items: [{ icon: "calendarClock", label: "Editar seguimiento", onClick: () => onOpen(f, "seguimiento") }, { icon: "refresh", label: "Marcar como renovado", onClick: () => toast("Documento marcado como renovado") }, { icon: "bell", label: "Posponer recordatorio" }, { divider: true }, { icon: "eye", label: "Abrir documento", onClick: () => onOpen(f) }] }))
              );
            })
      ),
        React.createElement(SharedPagination, { page: safeTPage, totalPages: totalTPages, onPage: setPage })
      )
    );
  }

  // ---------- Compartidos ----------
  const SHARED_PAGE_SIZE = 10;

  function SharedPagination({ page, totalPages, onPage }) {
    if (totalPages <= 1) return null;
    function pages() {
      if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
      if (page <= 4)              return [1, 2, 3, 4, 5, "...", totalPages];
      if (page >= totalPages - 3) return [1, "...", totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages];
      return [1, "...", page-1, page, page+1, "...", totalPages];
    }
    return React.createElement(
      "div", { className: "file-pagination" },
      React.createElement("div", { style: { fontSize: 12.5, color: "var(--text-3)" } }, "P\u00e1gina " + page + " de " + totalPages),
      React.createElement(
        "div", { className: "fp-pages" },
        React.createElement("button", { className: "icon-btn fp-nav", disabled: page <= 1, onClick: () => onPage(page - 1) }, React.createElement(Icon, { name: "chevL", size: 14 })),
        pages().map((p, i) => p === "..." ? React.createElement("span", { key: "e"+i, className: "fp-ellipsis" }, "...") :
          React.createElement("button", { key: p, className: "fp-page-btn" + (p === page ? " active" : ""), onClick: () => onPage(p) }, p)),
        React.createElement("button", { className: "icon-btn fp-nav", disabled: page >= totalPages, onClick: () => onPage(page + 1) }, React.createElement(Icon, { name: "chevR", size: 14 }))
      )
    );
  }

  function SharedView({ onOpen }) {
    const [tab, setTab] = useState("by-me");
    const [localQuery, setLocalQuery] = useState("");
    const [page, setPage] = useState(1);
    const byMe = files.filter((f) => f.shared);
    const filteredByMe = localQuery.trim() ? byMe.filter((f) => { const lq = localQuery.toLowerCase(); return [f.title, f.typeName, f.type].some((s) => s && s.toLowerCase().includes(lq)); }) : byMe;
    const filteredWithMe = localQuery.trim() ? sharedWithMe.filter((f) => { const lq = localQuery.toLowerCase(); return [f.title, f.typeName, f.type, f.sharedBy.name].some((s) => s && s.toLowerCase().includes(lq)); }) : sharedWithMe;
    const activeList = tab === "by-me" ? filteredByMe : filteredWithMe;
    const totalPages = Math.max(1, Math.ceil(activeList.length / SHARED_PAGE_SIZE));
    const safePage   = Math.min(page, totalPages);
    const pagedByMe   = filteredByMe.slice((safePage-1)*SHARED_PAGE_SIZE, safePage*SHARED_PAGE_SIZE);
    const pagedWithMe = filteredWithMe.slice((safePage-1)*SHARED_PAGE_SIZE, safePage*SHARED_PAGE_SIZE);

    return React.createElement(
      "div",
      { className: "page" },
      React.createElement(
        "div",
        { className: "page-head" },
        React.createElement(
          "div",
          null,
          React.createElement("div", { className: "page-title" }, React.createElement(Icon, { name: "share2", size: 23, style: { color: "var(--brand)" } }), "Compartidos"),
          React.createElement("div", { className: "page-desc" }, "Gestiona los accesos que diste y los recursos que compartieron contigo")
        )
      ),
      React.createElement(
        "div",
        { className: "segmented", style: { marginBottom: 10 } },
        React.createElement("button", { className: tab === "by-me" ? "active" : "", onClick: () => { setTab("by-me"); setLocalQuery(""); setPage(1); } }, React.createElement(Icon, { name: "share", size: 14 }), "Compartidos por mí"),
        React.createElement("button", { className: tab === "with-me" ? "active" : "", onClick: () => { setTab("with-me"); setLocalQuery(""); setPage(1); } }, React.createElement(Icon, { name: "inbox", size: 14 }), "Compartidos conmigo")
      ),
      React.createElement("div", { className: "toolbar", style: { marginBottom: 14 } },
        React.createElement(TableSearch, { value: localQuery, onChange: setLocalQuery, placeholder: "Buscar en compartidos..." }),
        React.createElement("div", { style: { flex: 1 } })
      ),
      tab === "by-me"
        ? React.createElement(
            "div", { className: "flist-wrap" },
            React.createElement(
            "div",
            { className: "flist", style: { "--cols": "1fr 120px 200px 150px 40px" } },
            React.createElement("div", { className: "flist-head" }, React.createElement("div", null, "Documento"), React.createElement("div", null, "Tipo"), React.createElement("div", null, "Compartido con"), React.createElement("div", null, "Alcance"), React.createElement("div", null, "")),
            pagedByMe.map((f) => {
              const who = f.shared.who || [];
              return React.createElement(
                "div",
                { className: "frow", key: f.uid, onClick: () => onOpen(f, "compartir") },
                React.createElement("div", { className: "fmain" }, React.createElement(FileGlyph, { ext: f.ext }), React.createElement("div", { className: "fmeta" }, React.createElement("div", { className: "fname" }, f.title), React.createElement("div", { className: "fsub" }, f.folio ? React.createElement("span", { className: "mono" }, f.folio) : null, React.createElement("span", null, fmtDate(f.date))))),
                React.createElement("div", null, React.createElement(TypeBadge, { code: f.type, color: f.typeColor, name: f.typeName })),
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, f.shared.scope === "link" ? React.createElement(StatusPill, { kind: "info", icon: "globe" }, "Por enlace") : React.createElement(React.Fragment, null, who.slice(0, 3).map((p, i) => React.createElement("div", { key: i, style: { marginLeft: i ? -8 : 0 } }, React.createElement(Avatar, { person: p, size: 26 }))), React.createElement("span", { style: { fontSize: 12.5, color: "var(--text-2)", marginLeft: 6 } }, who.length + (who.length === 1 ? " persona" : " personas")))),
                React.createElement("div", null, React.createElement(StatusPill, { kind: "neutral" }, "Versión actual")),
                React.createElement("div", { style: { textAlign: "right" } }, React.createElement(Menu, { trigger: React.createElement("button", { className: "icon-btn", style: { width: 30, height: 30 } }, React.createElement(Icon, { name: "moreV", size: 16 })), items: [{ icon: "users", label: "Gestionar accesos", onClick: () => onOpen(f, "compartir") }, { icon: "copy", label: "Copiar enlace", onClick: () => toast("Enlace copiado", "copy") }, { divider: true }, { icon: "x", label: "Dejar de compartir", danger: true, onClick: () => toast("Se dejó de compartir") }] }))
              );
            })
          ),
            React.createElement(SharedPagination, { page: safePage, totalPages, onPage: setPage })
          )
        : React.createElement(
            "div", { className: "flist-wrap" },
            React.createElement(
            "div",
            { className: "flist", style: { "--cols": "1fr 120px 180px 140px 40px" } },
            React.createElement("div", { className: "flist-head" }, React.createElement("div", null, "Documento"), React.createElement("div", null, "Tipo"), React.createElement("div", null, "Compartido por"), React.createElement("div", null, "Acceso"), React.createElement("div", null, "")),
            pagedWithMe.map((f, idx) =>
              React.createElement(
                "div",
                { className: "frow", key: idx, onClick: () => onOpen(f, "detalles", { readOnly: true }) },
                React.createElement("div", { className: "fmain" }, React.createElement(FileGlyph, { ext: f.ext }), React.createElement("div", { className: "fmeta" }, React.createElement("div", { className: "fname" }, f.title), React.createElement("div", { className: "fsub" }, f.version ? React.createElement(StatusPill, { kind: "neutral", icon: "pin" }, f.version) : React.createElement("span", null, "Versión actual"), React.createElement("span", null, "· " + fmtDate(f.sharedAt))))),
                React.createElement("div", null, React.createElement(TypeBadge, { code: f.type, color: f.typeColor, name: f.typeName })),
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 7 } }, React.createElement(Avatar, { person: f.sharedBy, size: 26 }), React.createElement("span", { style: { fontSize: 12.5 } }, f.sharedBy.name)),
                React.createElement("div", null, React.createElement(StatusPill, { kind: f.access === "Puede editar" ? "info" : "neutral" }, f.access)),
                React.createElement("div", { style: { textAlign: "right" } }, React.createElement("button", { className: "icon-btn", style: { width: 30, height: 30 }, onClick: (e) => { e.stopPropagation(); onOpen(f); } }, React.createElement(Icon, { name: "arrowRight", size: 16 })))
              )
            )
          ),
            React.createElement(SharedPagination, { page: safePage, totalPages, onPage: setPage })
          )
    );
  }

  Object.assign(window, { TrackingView, SharedView });
})();
