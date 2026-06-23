// search.jsx — búsqueda global avanzada (navegación + descubrimiento)
(function () {
  const { useState, useRef, useEffect, useMemo } = React;
  const { Icon, FileGlyph, Avatar } = window;
  const { companies, docTypes, files, people, sites } = window.AppData;

  const NONE = "__none__";

  const CATEGORIES = [
    { id: "company",  icon: "building",  label: "Compañía",        placeholder: "Buscar compañía…"         },
    { id: "type",     icon: "tag",       label: "Tipo de archivo",  placeholder: "Buscar tipo de archivo…"  },
    { id: "document", icon: "file",      label: "Documento",        placeholder: "Buscar documento…"        },
    { id: "user",     icon: "user",      label: "Usuario",          placeholder: "Buscar usuario…"          },
    { id: "site",     icon: "mapPin",    label: "Sitio",            placeholder: "Buscar sitio…"            },
    { id: "folio",    icon: "hash",      label: "ID / Folio",       placeholder: "Buscar por folio o ID…"   },
    { id: "expiry",   icon: "calendar",  label: "Vencimiento",      placeholder: "Buscar vencimiento…"      },
  ];

  function GlobalSearch({ navTo, onOpen }) {
    const [open,     setOpen]     = useState(false);
    const [query,    setQuery]    = useState("");
    const [category, setCategory] = useState(null);
    const inputRef = useRef(null);
    const wrapRef  = useRef(null);

    // Cerrar al hacer clic afuera
    useEffect(() => {
      if (!open) return;
      const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) close(); };
      document.addEventListener("mousedown", h);
      return () => document.removeEventListener("mousedown", h);
    }, [open]);

    // Teclas globales
    useEffect(() => {
      const h = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          inputRef.current?.focus();
          setOpen(true);
        }
        if (e.key === "Escape") close();
      };
      document.addEventListener("keydown", h);
      return () => document.removeEventListener("keydown", h);
    }, []);

    function close() { setOpen(false); setQuery(""); setCategory(null); }

    function navigate(action) {
      close();
      if (action.type === "company")  navTo({ view: "company", companyId: action.id });
      if (action.type === "doctype")  navTo({ view: "company", companyId: action.companyId, typeCode: action.code });
      if (action.type === "document") onOpen(action.file);
    }

    const q   = query.trim().toLowerCase();
    const cat = category;
    const activeCat = cat ? CATEGORIES.find((c) => c.id === cat) : null;

    // Resultados
    const results = useMemo(() => {
      if (!q) return null;

      const matchCompanies = (!cat || cat === "company")
        ? companies.filter((c) => c.name.toLowerCase().includes(q))
        : [];

      const matchTypes = (!cat || cat === "type")
        ? docTypes.filter((d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q))
        : [];

      const matchDocs = (!cat || cat === "document" || cat === "folio")
        ? files.filter((f) => {
            if (cat === "folio") return f.folio && f.folio.toLowerCase().includes(q);
            return [f.title, f.folio, f.typeName, f.type].filter(Boolean).some((s) => s.toLowerCase().includes(q));
          }).slice(0, 8)
        : [];

      const matchUsers = (!cat || cat === "user")
        ? people.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5)
        : [];

      const matchSites = (!cat || cat === "site")
        ? sites.filter((s) => s.toLowerCase().includes(q))
        : [];

      const matchExpiry = (!cat || cat === "expiry")
        ? files.filter((f) => f.tracking && f.tracking.expires).slice(0, 5)
        : [];

      return { matchCompanies, matchTypes, matchDocs, matchUsers, matchSites, matchExpiry };
    }, [q, cat]);

    const hasResults = results && Object.values(results).some((r) => r.length > 0);
    const placeholder = activeCat ? activeCat.placeholder : "Buscar por nombre, folio, compañía o tipo\u2026";
    const recentFiles     = files.slice(0, 4);
    const recentCompanies = companies.slice(0, 3);

    return React.createElement(
      "div",
      { className: "gs-wrap", ref: wrapRef },

      // ── Input ─────────────────────────────────────────────────────
      React.createElement(
        "div",
        { className: "search" + (open ? " focused" : "") },
        cat
          ? React.createElement(
              "button",
              { className: "gs-cat-pill", onClick: () => { setCategory(null); inputRef.current?.focus(); } },
              React.createElement(Icon, { name: activeCat.icon, size: 12 }),
              activeCat.label,
              React.createElement(Icon, { name: "x", size: 11 })
            )
          : React.createElement(Icon, { name: "search", size: 17, style: { color: "var(--text-3)" } }),
        React.createElement("input", {
          ref: inputRef,
          placeholder,
          value: query,
          onChange: (e) => setQuery(e.target.value),
          onFocus:  () => setOpen(true),
        }),
        open && query
          ? React.createElement(
              "button",
              { className: "icon-btn", style: { width: 22, height: 22, color: "var(--text-3)", flexShrink: 0 },
                onMouseDown: (e) => { e.preventDefault(); setQuery(""); setCategory(null); inputRef.current?.focus(); }
              },
              React.createElement(Icon, { name: "x", size: 14 })
            )
          : !open
          ? React.createElement("span", { className: "kbd" }, "\u2318K")
          : null
      ),

      // ── Dropdown ──────────────────────────────────────────────────
      open && React.createElement(
        "div",
        { className: "gs-drop" },

        // Estado vacío: recientes + "buscar por"
        !q && React.createElement(
          React.Fragment, null,

          React.createElement("div", { className: "gs-section-label" }, "Recientes"),

          recentCompanies.map((c) =>
            React.createElement(
              "button",
              { key: "rc-" + c.id, className: "gs-row", onClick: () => navigate({ type: "company", id: c.id }) },
              React.createElement("span", { className: "gs-ico gs-ico-company" },
                React.createElement(Icon, { name: "building", size: 15 })
              ),
              React.createElement("span", { className: "gs-row-main" }, c.name),
              React.createElement("span", { className: "gs-row-sub" }, "Compa\u00f1\u00eda"),
              React.createElement(Icon, { name: "chevR", size: 13, style: { color: "var(--text-3)", marginLeft: "auto", flexShrink: 0 } })
            )
          ),

          recentFiles.map((f) => {
            const co = companies.find((c) => c.id === f.company);
            return React.createElement(
              "button",
              { key: "rf-" + f.uid, className: "gs-row", onClick: () => navigate({ type: "document", file: f }) },
              React.createElement("span", { className: "gs-ico gs-ico-doc" },
                React.createElement(FileGlyph, { ext: f.ext, sm: true })
              ),
              React.createElement("span", { className: "gs-row-main" }, f.title),
              React.createElement("span", { className: "gs-row-sub" }, co?.name),
              React.createElement(Icon, { name: "chevR", size: 13, style: { color: "var(--text-3)", marginLeft: "auto", flexShrink: 0 } })
            );
          }),

          React.createElement("div", { className: "gs-divider" }),
          React.createElement("div", { className: "gs-section-label" }, "Buscar por"),
          React.createElement(
            "div",
            { className: "gs-cat-grid" },
            CATEGORIES.map((c) =>
              React.createElement(
                "button",
                {
                  key: c.id,
                  className: "gs-cat-btn" + (cat === c.id ? " active" : ""),
                  onMouseDown: (e) => { e.preventDefault(); setCategory(c.id); setQuery(""); setTimeout(() => inputRef.current?.focus(), 0); }
                },
                React.createElement(Icon, { name: c.icon, size: 14 }),
                c.label
              )
            )
          )
        ),

        // Sin resultados
        q && !hasResults && React.createElement(
          "div",
          { className: "gs-empty" },
          React.createElement(Icon, { name: "search", size: 22 }),
          React.createElement("span", null,
            "Sin resultados para \u201c",
            React.createElement("strong", null, query),
            "\u201d"
          )
        ),

        // Resultados agrupados
        q && hasResults && React.createElement(
          React.Fragment, null,

          // Compañías
          results.matchCompanies.length > 0 && React.createElement(
            React.Fragment, null,
            React.createElement("div", { className: "gs-section-label" }, "Compa\u00f1\u00edas"),
            results.matchCompanies.map((c) =>
              React.createElement(
                "button",
                { key: c.id, className: "gs-row", onClick: () => navigate({ type: "company", id: c.id }) },
                React.createElement("span", { className: "gs-ico gs-ico-company" },
                  React.createElement(Icon, { name: "building", size: 15 })
                ),
                React.createElement("span", { className: "gs-row-main" }, c.name),
                React.createElement("span", { className: "gs-row-sub" },
                  files.filter((f) => f.company === c.id).length + " docs"
                ),
                React.createElement(Icon, { name: "chevR", size: 13, style: { color: "var(--text-3)", marginLeft: "auto", flexShrink: 0 } })
              )
            )
          ),

          // Tipos de archivo
          results.matchTypes.length > 0 && React.createElement(
            React.Fragment, null,
            React.createElement("div", { className: "gs-section-label" }, "Tipos de archivo"),
            results.matchTypes.map((d) =>
              React.createElement(
                "button",
                { key: d.code, className: "gs-row" },
                React.createElement("span", { className: "gs-ico", style: { background: "var(--surface-3)" } },
                  React.createElement(Icon, { name: "tag", size: 14 })
                ),
                React.createElement("span", { className: "gs-row-main" }, d.name),
                React.createElement("span", { className: "gs-row-sub" }, d.code)
              )
            )
          ),

          // Documentos
          results.matchDocs.length > 0 && React.createElement(
            React.Fragment, null,
            React.createElement("div", { className: "gs-section-label" }, "Documentos"),
            results.matchDocs.map((f) => {
              const co = companies.find((c) => c.id === f.company);
              const dt = docTypes.find((d) => d.code === f.type);
              return React.createElement(
                "button",
                { key: f.uid, className: "gs-row", onClick: () => navigate({ type: "document", file: f }) },
                React.createElement("span", { className: "gs-ico gs-ico-doc" },
                  React.createElement(FileGlyph, { ext: f.ext, sm: true })
                ),
                React.createElement("span", { className: "gs-row-main" }, f.title),
                React.createElement(
                  "span",
                  { className: "gs-row-ctx" },
                  co && React.createElement("span", null, co.name),
                  dt && React.createElement("span", null, dt.name)
                ),
                React.createElement(Icon, { name: "chevR", size: 13, style: { color: "var(--text-3)", marginLeft: "auto", flexShrink: 0 } })
              );
            })
          ),

          // Usuarios
          results.matchUsers.length > 0 && React.createElement(
            React.Fragment, null,
            React.createElement("div", { className: "gs-section-label" }, "Usuarios"),
            results.matchUsers.map((p) =>
              React.createElement(
                "button",
                { key: p.name, className: "gs-row" },
                React.createElement(Avatar, { person: p, size: 26 }),
                React.createElement("span", { className: "gs-row-main" }, p.name)
              )
            )
          ),

          // Sitios
          results.matchSites.length > 0 && React.createElement(
            React.Fragment, null,
            React.createElement("div", { className: "gs-section-label" }, "Sitios"),
            results.matchSites.map((s) =>
              React.createElement(
                "button",
                { key: s, className: "gs-row" },
                React.createElement("span", { className: "gs-ico" },
                  React.createElement(Icon, { name: "mapPin", size: 14 })
                ),
                React.createElement("span", { className: "gs-row-main" }, s)
              )
            )
          ),

          // Vencimientos
          results.matchExpiry.length > 0 && React.createElement(
            React.Fragment, null,
            React.createElement("div", { className: "gs-section-label" }, "Vencimientos"),
            results.matchExpiry.map((f) => {
              const co = companies.find((c) => c.id === f.company);
              return React.createElement(
                "button",
                { key: f.uid, className: "gs-row", onClick: () => navigate({ type: "document", file: f }) },
                React.createElement("span", { className: "gs-ico" },
                  React.createElement(Icon, { name: "calendar", size: 14 })
                ),
                React.createElement("span", { className: "gs-row-main" }, f.title),
                React.createElement(
                  "span",
                  { className: "gs-row-ctx" },
                  co && React.createElement("span", null, co.name),
                  f.tracking?.expires && React.createElement("span", null, "Vence: " + f.tracking.expires)
                ),
                React.createElement(Icon, { name: "chevR", size: 13, style: { color: "var(--text-3)", marginLeft: "auto", flexShrink: 0 } })
              );
            })
          )
        )
      )
    );
  }

  Object.assign(window, { GlobalSearch });
})();
