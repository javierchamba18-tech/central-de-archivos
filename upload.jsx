// upload.jsx — flujo único de carga con modo Tabla y modo Panel lateral
(function () {
  const { useState } = React;
  const { Icon, Modal, FileGlyph, StatusPill, toast } = window;
  const { companies, docTypes, sites, costCenters } = window.AppData;

  const NONE = "__none__";
  const isSet = (v) => v !== "" && v != null && v !== NONE;

  const ENOVA_CATS = ["Contratos", "Licencias", "Permisos", "Pólizas", "Facturas", "Planos", "Normativa", "Reportes"];
  const ENOVA_SUBCATS = {
    "Contratos":  ["Marco", "Servicios", "Arrendamiento", "Compraventa"],
    "Licencias":  ["Federal", "Estatal", "Municipal", "Internacional"],
    "Permisos":   ["Operación", "Ambiental", "Construcción", "Importación"],
    "Pólizas":    ["Vida", "Daños", "Responsabilidad Civil", "Transporte"],
    "Facturas":   ["Nacional", "Internacional", "Servicios", "Productos"],
    "Planos":     ["Arquitectónico", "Estructural", "Instalaciones", "Urbanístico"],
    "Normativa":  ["NOM", "ISO", "ASTM", "Interna"],
    "Reportes":   ["Mensual", "Trimestral", "Anual", "Especial"],
  };

  const SEED_POOL = [
    { id: 0, name: "RACV-LS16-20260601-71.pdf",  ext: "pdf", type: "RACV", company: 71,   autoDetected: true  },
    { id: 1, name: "RACV-LS16-20260602-71.pdf",  ext: "pdf", type: "RACV", company: 71,   autoDetected: true  },
    { id: 2, name: "CONT-CV014-20260318-15.pdf", ext: "pdf", type: "CONT", company: 15,   autoDetected: true  },
    { id: 3, name: "escaneo_004.pdf",             ext: "pdf", type: NONE,   company: NONE, autoDetected: false },
    { id: 4, name: "IMG_4821.jpg",                ext: "jpg", type: NONE,   company: NONE, autoDetected: false },
    { id: 5, name: "POL-7781-20260115-88.pdf",   ext: "pdf", type: "POL",  company: 88,   autoDetected: true  },
    { id: 6, name: "documento (final).pdf",       ext: "pdf", type: NONE,   company: 71,   autoDetected: false },
    { id: 7, name: "PERM-3320-20260302-88.pdf",  ext: "pdf", type: "PERM", company: 88,   autoDetected: true  },
  ];

  function buildRows(count, presetCompany, presetTypeCode) {
    return SEED_POOL.slice(0, count).map((r) => {
      const company = (presetCompany && r.company === NONE) ? presetCompany : r.company;
      const type    = (presetTypeCode && r.type === NONE)   ? presetTypeCode : r.type;
      return { ...r, company, type, site: NONE, notes: "", date: new Date().toISOString().slice(0, 10) };
    });
  }

  function rowOk(r) { return isSet(r.company) && isSet(r.type); }

  // ─── Drawer panel (single / multi) ─────────────────────────────────
  function DrawerPanel({ sel, rows, enova, update, bulkSet, updateEnova, bulkEnova, setSel }) {
    const [showEnova, setShowEnova] = useState(false);
    const [showVenc,  setShowVenc]  = useState(false);
    const [showDatos, setShowDatos] = useState(false);

    const selArr   = [...sel];
    const isSingle = sel.size === 1;
    const selRow   = isSingle ? rows.find((r) => r.id === selArr[0]) : null;
    const selEnova = isSingle ? (enova[selArr[0]] || {}) : {};

    function Field({ label, children }) {
      return React.createElement("div", { className: "dp-field" },
        React.createElement("div", { className: "dp-label" }, label),
        children
      );
    }

    // Empty state
    if (sel.size === 0) {
      return React.createElement("div", { className: "upload-drawer-empty" },
        React.createElement(Icon, { name: "pointer", size: 28 }),
        React.createElement("div", { style: { fontWeight: 500 } }, "Selecciona un archivo"),
        React.createElement("div", { style: { fontSize: 12 } }, "Sus datos aparecerán aquí para editarlos")
      );
    }

    // ── Single file ─────────────────────────────────────────────────
    if (isSingle && selRow) {
      return React.createElement("div", { className: "upload-drawer-content" },
        React.createElement("div", { className: "dp-head" },
          React.createElement(FileGlyph, { ext: selRow.ext }),
          React.createElement("div", { style: { minWidth: 0 } },
            React.createElement("div", { className: "dp-filename" }, selRow.name),
            React.createElement("div", { style: { fontSize: 11, marginTop: 3, color: rowOk(selRow) ? "var(--ok)" : "var(--warn)" } },
              rowOk(selRow) ? "Clasificado" : "Requiere datos"
            )
          )
        ),
        React.createElement("div", { className: "dp-divider" }),
        React.createElement("div", { className: "dp-section-label" }, "Clasificación"),

        React.createElement(Field, { label: "Compañía" },
          React.createElement("select", {
            className: "mini-select" + (!isSet(selRow.company) ? " is-unset" : ""),
            value: selRow.company,
            onChange: (e) => update(selRow.id, "company", e.target.value === NONE ? NONE : Number(e.target.value))
          },
            React.createElement("option", { value: NONE }, "— Elegir —"),
            companies.map((c) => React.createElement("option", { key: c.id, value: c.id }, c.name))
          )
        ),
        React.createElement(Field, { label: "Tipo de archivo" },
          React.createElement("select", {
            className: "mini-select" + (!isSet(selRow.type) ? " is-unset" : ""),
            value: selRow.type,
            onChange: (e) => update(selRow.id, "type", e.target.value)
          },
            React.createElement("option", { value: NONE }, "— Elegir —"),
            docTypes.map((d) => React.createElement("option", { key: d.code, value: d.code }, d.name))
          )
        ),
        React.createElement(Field, { label: "Centro de costos" },
          React.createElement("select", {
            className: "mini-select", value: selRow.site || NONE,
            onChange: (e) => update(selRow.id, "site", e.target.value === NONE ? null : e.target.value)
          },
            React.createElement("option", { value: NONE }, "Sin asignar"),
            costCenters
              .filter((cc) => !selRow.company || cc.companyId === Number(selRow.company))
              .map((cc) => React.createElement("option", { key: cc.id, value: cc.id }, cc.id + " · " + cc.name))
          )
        ),

        // Datos colapsables
        React.createElement("div", { className: "dp-divider" }),
        React.createElement(
          "button",
          { className: "dp-collapse-toggle", onClick: () => setShowDatos((v) => !v) },
          React.createElement(Icon, { name: showDatos ? "chevD" : "chevR", size: 14 }),
          "Datos del archivo"
        ),
        !showDatos ? React.createElement("div", { className: "dp-collapse-hint-block" }, "Folio · comentarios · fecha") : null,
        showDatos ? React.createElement(React.Fragment, null,
          React.createElement(Field, { label: "Folio" },
            React.createElement("input", {
              className: "mini-input", placeholder: "Ej. C-0091",
              value: selRow.folio || "", onChange: (e) => update(selRow.id, "folio", e.target.value)
            })
          ),
          React.createElement(Field, { label: "Comentarios" },
            React.createElement("input", {
              className: "mini-input", placeholder: "Añadir comentario…",
              value: selRow.notes, onChange: (e) => update(selRow.id, "notes", e.target.value)
            })
          ),
          React.createElement(Field, { label: "Fecha del documento" },
            React.createElement("input", {
              className: "mini-input", type: "date",
              value: selRow.date || "",
              onChange: (e) => update(selRow.id, "date", e.target.value)
            })
          )
        ) : null,
        React.createElement("div", { className: "dp-divider" }),
        React.createElement("div", { className: "dp-section-label" }, "Enova"),
        React.createElement("label", { className: "dp-toggle" },
          React.createElement("input", { type: "checkbox", checked: !!selEnova.publish,
            onChange: (e) => updateEnova(selArr[0], "publish", e.target.checked)
          }),
          React.createElement("span", null, "Subir a eNova")
        ),
        selEnova.publish && React.createElement(React.Fragment, null,
          React.createElement(Field, { label: "Categoría" },
            React.createElement("select", {
              className: "mini-select", value: selEnova.category || "",
              onChange: (e) => updateEnova(selArr[0], "category", e.target.value)
            },
              React.createElement("option", { value: "" }, "— Elegir —"),
              ENOVA_CATS.map((c) => React.createElement("option", { key: c, value: c }, c))
            )
          ),
          React.createElement(Field, { label: "Subcategoría" },
            React.createElement("select", {
              className: "mini-select", value: selEnova.subcat || "",
              onChange: (e) => updateEnova(selArr[0], "subcat", e.target.value)
            },
              React.createElement("option", { value: "" }, "— Elegir —"),
              (ENOVA_SUBCATS[selEnova.category] || []).map((s) => React.createElement("option", { key: s, value: s }, s))
            )
          )
        ),

        React.createElement("div", { className: "dp-divider" }),
        React.createElement("div", { className: "dp-section-label" }, "Vencimiento"),
        React.createElement("label", { className: "dp-toggle" },
          React.createElement("input", { type: "checkbox", checked: !!selEnova.vence,
            onChange: (e) => updateEnova(selArr[0], "vence", e.target.checked)
          }),
          React.createElement("span", null, "Este documento vence")
        ),
        selEnova.vence && React.createElement(React.Fragment, null,
          React.createElement(Field, { label: "Fecha de vencimiento" },
            React.createElement("input", {
              className: "mini-input", type: "date",
              value: selEnova.fechaVencimiento || "",
              onChange: (e) => updateEnova(selArr[0], "fechaVencimiento", e.target.value)
            })
          ),
          React.createElement(Field, { label: "Costo de renovaci\u00f3n" },
            React.createElement("div", { style: { display: "flex", gap: 6 } },
              React.createElement("span", { style: { display: "flex", alignItems: "center", padding: "0 8px", background: "var(--surface-3)", border: "1px solid var(--border-strong)", borderRadius: "7px 0 0 7px", fontSize: 12.5, color: "var(--text-2)", borderRight: "none" } }, "$"),
              React.createElement("input", {
                className: "mini-input", type: "number", min: "0", placeholder: "0.00",
                style: { borderRadius: "0 7px 7px 0" },
                value: selEnova.costoRenovacion || "",
                onChange: (e) => updateEnova(selArr[0], "costoRenovacion", e.target.value)
              })
            )
          )
        )
      );
    }

    // \u2500\u2500 Multi selection ──────────────────────────────────────────────
    return React.createElement("div", { className: "upload-drawer-content" },
      React.createElement("div", { className: "dp-multi-head" },
        React.createElement("div", { className: "dp-multi-count" }, sel.size),
        React.createElement("div", null,
          React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, "Edición masiva"),
          React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 1 } }, sel.size + " archivos seleccionados")
        )
      ),
      React.createElement("div", { className: "dp-divider" }),
      React.createElement("div", { style: { fontSize: 12.5, color: "var(--brand-text)", background: "var(--brand-weak)", border: "1px solid var(--brand-weak-2)", borderRadius: 8, padding: "9px 11px", marginBottom: 12, lineHeight: 1.5, display: "flex", gap: 8, alignItems: "flex-start" } },
        React.createElement(Icon, { name: "info", size: 14, style: { color: "var(--brand)", flexShrink: 0, marginTop: 1 } }),
        React.createElement("span", null,
          "Los valores que elijas aquí se aplicarán a los ", React.createElement("strong", null, sel.size + " archivos"), " seleccionados. Cada campo se actualiza al seleccionar una opción."
        )
      ),
      React.createElement("div", { className: "dp-section-label" }, "Clasificación"),

      React.createElement("div", { className: "dp-field" },
        React.createElement("div", { className: "dp-label" }, "Compañía"),
        React.createElement("select", {
          className: "mini-select", defaultValue: NONE,
          onChange: (e) => { if (isSet(e.target.value)) { bulkSet("company", Number(e.target.value)); e.target.value = NONE; } }
        },
          React.createElement("option", { value: NONE }, "— Sin cambio —"),
          companies.map((c) => React.createElement("option", { key: c.id, value: c.id }, c.name))
        )
      ),
      React.createElement("div", { className: "dp-field" },
        React.createElement("div", { className: "dp-label" }, "Tipo de archivo"),
        React.createElement("select", {
          className: "mini-select", defaultValue: NONE,
          onChange: (e) => { if (isSet(e.target.value)) { bulkSet("type", e.target.value); e.target.value = NONE; } }
        },
          React.createElement("option", { value: NONE }, "— Sin cambio —"),
          docTypes.map((d) => React.createElement("option", { key: d.code, value: d.code }, d.name))
        )
      ),
      React.createElement("div", { className: "dp-field" },
        React.createElement("div", { className: "dp-label" }, "Centro de costos"),
        React.createElement("select", {
          className: "mini-select", defaultValue: NONE,
          onChange: (e) => { if (isSet(e.target.value)) { bulkSet("site", e.target.value); e.target.value = NONE; } }
        },
          React.createElement("option", { value: NONE }, "— Sin cambio —"),
          costCenters.map((cc) => React.createElement("option", { key: cc.id, value: cc.id }, cc.id + " · " + cc.name))
        )
      ),

      React.createElement("div", { className: "dp-divider" }),
      React.createElement(
        "button",
        { className: "dp-collapse-toggle", onClick: () => setShowDatos((v) => !v) },
        React.createElement(Icon, { name: showDatos ? "chevD" : "chevR", size: 14 }),
        "Datos del archivo"
      ),
      !showDatos ? React.createElement("div", { className: "dp-collapse-hint-block" }, "Folio · fecha") : null,
      showDatos ? React.createElement(React.Fragment, null,
        React.createElement("div", { className: "dp-field" },
          React.createElement("div", { className: "dp-label" }, "Folio"),
          React.createElement("input", {
            className: "mini-input", placeholder: "Aplicar folio a todos…",
            onChange: (e) => { if (e.target.value) bulkSet("folio", e.target.value); }
          })
        ),
        React.createElement("div", { className: "dp-field" },
          React.createElement("div", { className: "dp-label" }, "Fecha del documento"),
          React.createElement("input", {
            className: "mini-input", type: "date",
            onChange: (e) => { if (e.target.value) bulkSet("date", e.target.value); }
          })
        )
      ) : null,
      React.createElement("div", { className: "dp-divider" }),
      React.createElement("div", { className: "dp-section-label" }, "Enova"),
      React.createElement("label", { className: "dp-toggle" },
        React.createElement("input", { type: "checkbox",
          onChange: (e) => { bulkEnova("publish", e.target.checked); setShowEnova(e.target.checked); }
        }),
        React.createElement("span", null, "Subir a eNova")
      ),
      showEnova && React.createElement(React.Fragment, null,
        React.createElement("div", { className: "dp-field" },
          React.createElement("div", { className: "dp-label" }, "Categoría"),
          React.createElement("select", {
            className: "mini-select", defaultValue: "",
            onChange: (e) => { if (e.target.value) { bulkEnova("category", e.target.value); e.target.value = ""; } }
          },
            React.createElement("option", { value: "" }, "— Sin cambio —"),
            ENOVA_CATS.map((c) => React.createElement("option", { key: c, value: c }, c))
          )
        ),
        React.createElement("div", { className: "dp-field" },
          React.createElement("div", { className: "dp-label" }, "Subcategoría"),
          React.createElement("select", {
            className: "mini-select", defaultValue: "",
            onChange: (e) => { if (e.target.value) { bulkEnova("subcat", e.target.value); e.target.value = ""; } }
          },
            React.createElement("option", { value: "" }, "— Sin cambio —"),
            ENOVA_CATS.flatMap((c) => ENOVA_SUBCATS[c] || []).filter((v,i,a) => a.indexOf(v) === i)
              .map((s) => React.createElement("option", { key: s, value: s }, s))
          )
        )
      ),

      React.createElement("div", { className: "dp-divider" }),
      React.createElement("div", { className: "dp-section-label" }, "Vencimiento"),
      React.createElement("label", { className: "dp-toggle" },
        React.createElement("input", { type: "checkbox",
          onChange: (e) => { bulkEnova("vence", e.target.checked); setShowVenc(e.target.checked); }
        }),
        React.createElement("span", null, "Este documento vence")
      ),
      showVenc && React.createElement(React.Fragment, null,
        React.createElement("div", { className: "dp-field" },
          React.createElement("div", { className: "dp-label" }, "Fecha de vencimiento"),
          React.createElement("input", {
            className: "mini-input", type: "date",
            onChange: (e) => { if (e.target.value) bulkEnova("fechaVencimiento", e.target.value); }
          })
        ),
        React.createElement("div", { className: "dp-field" },
          React.createElement("div", { className: "dp-label" }, "Costo de renovaci\u00f3n"),
          React.createElement("div", { style: { display: "flex", gap: 6 } },
            React.createElement("span", { style: { display: "flex", alignItems: "center", padding: "0 8px", background: "var(--surface-3)", border: "1px solid var(--border-strong)", borderRadius: "7px 0 0 7px", fontSize: 12.5, color: "var(--text-2)", borderRight: "none" } }, "$"),
            React.createElement("input", {
              className: "mini-input", type: "number", min: "0", placeholder: "0.00",
              style: { borderRadius: "0 7px 7px 0" },
              onChange: (e) => { if (e.target.value) bulkEnova("costoRenovacion", e.target.value); }
            })
          )
        )
      )
    );
  }

  // ─── Modal principal ─────────────────────────────────────────────────
  function UploadModal({ presetCompany, presetTypeCode, onClose }) {
    const [phase,      setPhase]      = useState("drop");
    const [rows,       setRows]       = useState([]);
    const [sel,        setSel]        = useState(new Set());
    const [over,       setOver]       = useState(false);
    
    const [enova,      setEnova]      = useState({});

    const presetCo   = companies.find((c) => c.id === presetCompany);
    const presetType = docTypes.find((d) => d.code === presetTypeCode);

    function loadFiles(count) {
      setRows(buildRows(count, presetCompany, presetTypeCode));
      setPhase("review");
    }

    function update(id, key, val) {
      setRows((rs) => rs.map((r) => r.id !== id ? r : { ...r, [key]: val }));
    }

    function bulkSet(key, val) {
      if (!sel.size) return;
      setRows((rs) => rs.map((r) => sel.has(r.id) ? { ...r, [key]: val } : r));
      toast("Aplicado a " + sel.size + " archivos");
    }

    function updateEnova(id, key, val) {
      setEnova((e) => ({ ...e, [id]: { ...e[id], [key]: val } }));
    }

    function bulkEnova(key, val) {
      if (!sel.size) return;
      setEnova((e) => {
        const next = { ...e };
        sel.forEach((id) => { next[id] = { ...next[id], [key]: val }; });
        return next;
      });
      toast("Enova: aplicado a " + sel.size + " archivos");
    }

    function toggleSel(id) {
      setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
    }

    function removeRow(id) {
      setRows((rs) => rs.filter((r) => r.id !== id));
      setSel((s) => { const n = new Set(s); n.delete(id); return n; });
    }

    // ── DROP phase ────────────────────────────────────────────────────
    if (phase === "drop") {
      return React.createElement(
        Modal, { title: "Subir archivos", icon: "upload", onClose },
        (presetCo || presetType) ? React.createElement(
          "div", { style: { display: "flex", alignItems: "center", gap: 9, padding: "10px 13px", borderRadius: 9, background: "var(--brand-weak)", border: "1px solid var(--brand-weak-2)", marginBottom: 16 } },
          React.createElement(Icon, { name: "folderOpen", size: 15, style: { color: "var(--brand)", flexShrink: 0 } }),
          React.createElement("span", { style: { fontSize: 13, color: "var(--brand-text)" } },
            "Se clasificar\u00e1n en\u00a0",
            React.createElement("strong", null, (presetCo?.name || "\u2014") + (presetType ? " / " + presetType.name : ""))
          )
        ) : null,
        React.createElement("div", {
          className: "dropzone" + (over ? " over" : ""),
          style: { cursor: "pointer" },
          onDragOver: (e) => { e.preventDefault(); setOver(true); },
          onDragLeave: () => setOver(false),
          onDrop: (e) => { e.preventDefault(); setOver(false); loadFiles(8); },
          onClick: () => loadFiles(8),
        },
          React.createElement("div", { className: "dz-ico" }, React.createElement(Icon, { name: "upload", size: 26 })),
          React.createElement("div", { style: { fontWeight: 600, fontSize: 15 } }, "Arrastra archivos aqu\u00ed"),
          React.createElement("div", { style: { fontSize: 12.5, color: "var(--text-2)", marginTop: 4 } },
            "o haz clic para seleccionarlos desde tu equipo \u00b7 PDF, im\u00e1genes, Office, DWG"
          )
        ),
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 16 } },
          React.createElement("span", { style: { fontSize: 12, color: "var(--text-3)" } }, "Simular:"),
          React.createElement("button", { className: "btn btn-sm btn-outline", onClick: () => loadFiles(1) }, React.createElement(Icon, { name: "file", size: 13 }), "1 archivo"),
          React.createElement("button", { className: "btn btn-sm btn-outline", onClick: () => loadFiles(4) }, React.createElement(Icon, { name: "files", size: 13 }), "4 archivos"),
          React.createElement("button", { className: "btn btn-sm btn-outline", onClick: () => loadFiles(8) }, React.createElement(Icon, { name: "layers", size: 13 }), "8 archivos")
        )
      );
    }

    // ── REVIEW phase ──────────────────────────────────────────────────
    const ready   = rows.filter((r) =>  rowOk(r)).length;
    const attn    = rows.filter((r) => !rowOk(r)).length;
    const allSel  = rows.length > 0 && rows.every((r) => sel.has(r.id));
    const someSel = rows.some((r) => sel.has(r.id));

    const contextBanner = (presetCo || presetType)
      ? React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 9, padding: "9px 13px", borderRadius: 9, background: "var(--brand-weak)", border: "1px solid var(--brand-weak-2)", marginBottom: 12 } },
          React.createElement(Icon, { name: "folderOpen", size: 14, style: { color: "var(--brand)", flexShrink: 0 } }),
          React.createElement("span", { style: { fontSize: 12.5, color: "var(--brand-text)" } },
            "Destino:\u00a0",
            React.createElement("strong", null, (presetCo?.name || "\u2014") + (presetType ? " / " + presetType.name : "")),
            " \u2014 los campos precompletados pueden ajustarse."
          )
        )
      : null;

    const attnBanner = attn > 0
      ? React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 9, background: "var(--warn-weak)", border: "1px solid oklch(0.85 0.07 80)", marginBottom: 12 } },
          React.createElement(Icon, { name: "sparkles", size: 15, style: { color: "oklch(0.55 0.12 60)", flexShrink: 0 } }),
          React.createElement("span", { style: { fontSize: 13 } },
            React.createElement("strong", null, ready + " de " + rows.length + " clasificados autom\u00e1ticamente. "),
            "Haz clic en una fila para editarla en el panel lateral."
          )
        )
      : null;

    const modalFoot = React.createElement(
      React.Fragment, null,
      attn > 0
        ? React.createElement("span", { style: { fontSize: 13, color: "var(--text-2)", display: "inline-flex", alignItems: "center", gap: 6 } },
            React.createElement(Icon, { name: "alert", size: 14, style: { color: "var(--warn)" } }), attn + " sin clasificar \u00b7 ",
            React.createElement("span", { style: { color: "var(--text-3)", fontWeight: 400 } }, "se recomienda clasificar antes de subir los archivos"))
        : React.createElement("span", { style: { fontSize: 13, color: "var(--ok)", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 } },
            React.createElement(Icon, { name: "checkCircle", size: 14 }), "Todo listo para subir"),
      React.createElement("div", { style: { flex: 1 } }),
      React.createElement("button", { className: "btn btn-ghost", onClick: onClose }, "Cancelar"),
      React.createElement("button", {
        className: "btn btn-primary",
        onClick: () => { toast(rows.length + " documento" + (rows.length === 1 ? " subido" : "s subidos"), "fileCheck"); onClose(); }
      }, React.createElement(Icon, { name: "upload", size: 15 }), "Subir " + rows.length + (rows.length === 1 ? " archivo" : " archivos"))
    );

    // Mini dropzone — siempre visible en la tabla
    const miniDropzone = React.createElement(
      "div",
      {
        className: "mini-dropzone",
        onClick: () => loadFiles(rows.length < 8 ? rows.length + 1 : 8),
        onDragOver: (e) => { e.preventDefault(); e.currentTarget.classList.add("over"); },
        onDragLeave: (e) => e.currentTarget.classList.remove("over"),
        onDrop: (e) => { e.preventDefault(); e.currentTarget.classList.remove("over"); loadFiles(rows.length < 8 ? rows.length + 2 : 8); },
      },
      React.createElement(Icon, { name: "plus", size: 15, style: { color: "var(--brand)", flexShrink: 0 } }),
      React.createElement("span", null, "Agregar m\u00e1s archivos"),
      React.createElement("span", { style: { fontSize: 12, color: "var(--text-3)", marginLeft: "auto" } }, "Arrastra o haz clic")
    );


    const drawerCols = "28px minmax(200px,1fr) 82px 30px";
    return React.createElement(Modal, {
      title: rows.length === 1 ? "Clasificar archivo" : "Clasificar " + rows.length + " archivos",
      sub: ready + " listos" + (attn > 0 ? " \u00b7 " + attn + " requieren datos" : " \u00b7 todo clasificado \u2713"),
      icon: "layers", xl: true, onClose, foot: modalFoot,
      bodyStyle: { display: "flex", padding: 0, overflow: "hidden" },
    },

      // Left — simplified table
      React.createElement("div", { className: "upload-table-panel" },
        contextBanner, attnBanner, miniDropzone,
        React.createElement("div", { className: "rtable" },
          React.createElement("div", { className: "rtable-head", style: { gridTemplateColumns: drawerCols } },
            React.createElement(window.Checkbox, { checked: allSel && rows.length > 0, mixed: someSel && !allSel, onClick: () => setSel(allSel ? new Set() : new Set(rows.map((r) => r.id))) }),
            React.createElement("div", null, "Archivo"),
            React.createElement("div", null, "Estado"),
            React.createElement("div", null, "")
          ),
          rows.map((r) => {
            const needsAttn = !rowOk(r);
            const co = companies.find((c) => c.id === r.company);
            const dt = docTypes.find((d) => d.code === r.type);
            return React.createElement("div", {
              key: r.id,
              className: "rtable-row" + (needsAttn ? " attn" : "") + (sel.has(r.id) ? " selected" : ""),
              style: { gridTemplateColumns: drawerCols, minHeight: 52, cursor: "pointer" },
              onClick: () => toggleSel(r.id),
            },
              React.createElement("div", { onClick: (e) => e.stopPropagation() },
                React.createElement(window.Checkbox, { checked: sel.has(r.id), onClick: () => toggleSel(r.id) })
              ),
              React.createElement("div", { style: { minWidth: 0, display: "flex", alignItems: "center", gap: 9 } },
                React.createElement(FileGlyph, { ext: r.ext }),
                React.createElement("div", { style: { minWidth: 0 } },
                  React.createElement("div", { className: "mono", style: { fontSize: 11.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, r.name),
                  React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
                    co ? co.name : "Sin compa\u00f1\u00eda",
                    dt ? " \u00b7 " + dt.name : ""
                  )
                )
              ),
              needsAttn ? React.createElement(StatusPill, { kind: "warn", icon: "sparkles" }, "Pendiente") : r.autoDetected ? React.createElement(StatusPill, { kind: "ok" }, "Auto") : React.createElement(StatusPill, { kind: "info" }, "Listo"),
              React.createElement("button", { className: "icon-btn", style: { width: 28, height: 28, color: "var(--text-3)" }, title: "Quitar", onClick: (e) => { e.stopPropagation(); removeRow(r.id); } }, React.createElement(Icon, { name: "x", size: 14 }))
            );
          })
        )
      ),

      // Right — contextual drawer
      React.createElement("div", { className: "upload-drawer" },
        React.createElement(DrawerPanel, { sel, rows, enova, update, bulkSet, updateEnova, bulkEnova, setSel })
      )
    );
  }


  // ─── Modal de reclasificación (archivos ya subidos) ─────────────────
  function ReclassifyModal({ files: inputFiles, onClose, onSave }) {
    const [rows, setRows] = useState(() =>
      inputFiles.map((f) => ({
        id: f.uid, name: f.title, ext: f.ext,
        type: f.type, company: f.company,
        site: f.site || NONE, folio: f.folio || "", notes: f.notes || "",
        autoDetected: false,
      }))
    );
    const [focused, setFocused] = useState(null); // ID of focused row (null = bulk all)
    const [enova,   setEnova]   = useState({});

    function rowOk(r) { return isSet(r.company) && isSet(r.type); }

    function update(id, key, val) {
      setRows((rs) => rs.map((r) => r.id !== id ? r : { ...r, [key]: val }));
    }
    function bulkSet(key, val) {
      const allIds = new Set(rows.map((r) => r.id));
      setRows((rs) => rs.map((r) => allIds.has(r.id) ? { ...r, [key]: val } : r));
      toast("Aplicado a " + rows.length + " archivos");
    }
    function updateEnova(id, key, val) {
      setEnova((e) => ({ ...e, [id]: { ...e[id], [key]: val } }));
    }
    function bulkEnova(key, val) {
      setEnova((e) => {
        const next = { ...e };
        rows.forEach(({ id }) => { next[id] = { ...next[id], [key]: val }; });
        return next;
      });
      toast("Enova: aplicado a " + rows.length + " archivos");
    }

    // drawerSel: focused row → single edit; null → bulk edit all
    const drawerSel = focused
      ? new Set([focused])
      : new Set(rows.map((r) => r.id));
    const dummySetSel = () => {};  // no-op — drawer doesn't clear selection here

    const ready = rows.filter((r) =>  rowOk(r)).length;
    const attn  = rows.filter((r) => !rowOk(r)).length;
    const cols  = "minmax(1fr,1fr) 82px";

    const foot = React.createElement(
      React.Fragment, null,
      attn > 0
        ? React.createElement("span", { style: { fontSize: 13, color: "var(--text-2)", display: "inline-flex", alignItems: "center", gap: 6 } },
            React.createElement(Icon, { name: "alert", size: 14, style: { color: "var(--warn)" } }), attn + " sin clasificar \u00b7 ",
            React.createElement("span", { style: { color: "var(--text-3)", fontWeight: 400 } }, "se recomienda clasificar antes de subir los archivos"))
        : React.createElement("span", { style: { fontSize: 13, color: "var(--ok)", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 } },
            React.createElement(Icon, { name: "checkCircle", size: 14 }), "Todo listo"),
      React.createElement("div", { style: { flex: 1 } }),
      React.createElement("button", { className: "btn btn-ghost", onClick: onClose }, "Cancelar"),
      React.createElement("button", {
        className: "btn btn-primary",
        onClick: () => { toast("Cambios guardados en " + rows.length + " archivo" + (rows.length === 1 ? "" : "s"), "checkCircle"); (onSave || onClose)(); }
      }, React.createElement(Icon, { name: "checkCircle", size: 15 }), "Guardar cambios")
    );

    return React.createElement(Modal, {
      title: rows.length === 1 ? "Editar archivo" : "Editar " + rows.length + " archivos",
      sub: ready + " listos" + (attn > 0 ? " \u00b7 " + attn + " requieren datos" : " \u00b7 todo clasificado \u2713"),
      icon: "tag", xl: true, onClose, foot,
      bodyStyle: { display: "flex", padding: 0, overflow: "hidden" },
    },

      // Tabla (sin checkboxes — todos ya están seleccionados)
      React.createElement("div", { className: "upload-table-panel" },
        React.createElement("div", { style: { fontSize: 12.5, color: "var(--text-3)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 } },
          React.createElement(Icon, { name: "pointer", size: 13 }),
          focused
            ? "Editando individualmente \u2014 haz clic de nuevo para volver a edici\u00f3n de lote"
            : rows.length > 1
            ? "Edici\u00f3n de lote \u2014 haz clic en un archivo para editarlo individualmente"
            : "Haz clic en el archivo para editarlo en el panel lateral"
        ),

        React.createElement("div", { className: "rtable" },
          React.createElement("div", { className: "rtable-head", style: { gridTemplateColumns: "1fr 82px" } },
            React.createElement("div", null, "Archivo"),
            React.createElement("div", null, "Estado")
          ),
          rows.map((r) => {
            const needsAttn = !rowOk(r);
            const co = companies.find((c) => c.id === r.company);
            const dt = docTypes.find((d) => d.code === r.type);
            const isFocused = focused === r.id;
            return React.createElement("div", {
              key: r.id,
              className: "rtable-row" + (needsAttn ? " attn" : "") + (isFocused ? " selected" : ""),
              style: { gridTemplateColumns: "1fr 82px", minHeight: 52, cursor: "pointer" },
              onClick: () => setFocused(isFocused ? null : r.id),
            },
              React.createElement("div", { style: { minWidth: 0, display: "flex", alignItems: "center", gap: 9 } },
                React.createElement(FileGlyph, { ext: r.ext }),
                React.createElement("div", { style: { minWidth: 0 } },
                  React.createElement("div", { className: "mono", style: { fontSize: 11.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, r.name),
                  React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
                    co ? co.name : "Sin compa\u00f1\u00eda", dt ? " \u00b7 " + dt.name : ""
                  )
                )
              ),
              needsAttn
                ? React.createElement(StatusPill, { kind: "warn", icon: "sparkles" }, "Pendiente")
                : React.createElement(StatusPill, { kind: "info" }, "Clasificado")
            );
          })
        )
      ),

      // Drawer
      React.createElement("div", { className: "upload-drawer" },
        React.createElement(DrawerPanel, {
          sel: drawerSel, rows, enova,
          update, bulkSet, updateEnova, bulkEnova,
          setSel: dummySetSel,
        })
      )
    );
  }

  Object.assign(window, {
    UploadModal,
    ReclassifyModal,
    UploadMenu:       UploadModal,
    UploadIndividual: UploadModal,
    UploadBulk:       UploadModal,
  });
})();