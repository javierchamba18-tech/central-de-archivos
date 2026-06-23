// ui.jsx — primitivas compartidas
(function () {
  const { useState, useEffect, useRef } = React;
  const { Icon } = window;

  function Checkbox({ checked, mixed, onChange, onClick }) {
    return React.createElement(
      "div",
      {
        className: "checkbox" + (checked ? " checked" : "") + (mixed ? " mixed" : ""),
        onClick: (e) => { e.stopPropagation(); (onClick || onChange)?.(e); },
      },
      checked ? React.createElement(Icon, { name: "check", size: 13, stroke: 3 })
        : mixed ? React.createElement(Icon, { name: "minus", size: 13, stroke: 3 }) : null
    );
  }

  function TypeBadge({ code, color, name, showName }) {
    const label = name || code;
    return React.createElement(
      "span",
      { className: "type-badge", style: { background: "color-mix(in oklch, " + color + " 13%, white)", color: "color-mix(in oklch, " + color + " 78%, black 8%)" }, title: label },
      React.createElement("span", { className: "sq", style: { background: color, flexShrink: 0 } }),
      React.createElement("span", { className: "type-badge-label" }, label)
    );
  }

  function FileGlyph({ ext, lg, sm }) {
    const t = window.AppData.ftypeFor(ext);
    return React.createElement("div", { className: "ftype " + t.cls + (lg ? " lg" : sm ? " sm" : "") }, t.label);
  }

  function StatusPill({ kind, children, icon }) {
    return React.createElement(
      "span",
      { className: "status-pill st-" + kind },
      icon ? React.createElement(Icon, { name: icon, size: 12 }) : React.createElement("span", { className: "pip" }),
      children
    );
  }

  // Tracking status from a tracking object
  function trackingStatus(tracking) {
    if (!tracking || !tracking.expires) return null;
    const d = window.AppData.daysUntil(tracking.expires);
    if (d < 0) return { kind: "danger", label: "Vencido", days: d };
    if (d <= 15) return { kind: "danger", label: "Vence en " + d + "d", days: d };
    if (d <= 45) return { kind: "warn", label: "Vence en " + d + "d", days: d };
    return { kind: "ok", label: "Vigente", days: d };
  }

  function Avatar({ person, size = 28 }) {
    return React.createElement(
      "div",
      { className: "avatar", style: { width: size, height: size, background: person.color, fontSize: size * 0.42 } },
      person.initials
    );
  }

  // Popover menu anchored to a trigger — portal so overflow:hidden parents don't clip it
  function Menu({ trigger, items, align = "right" }) {
    const [open, setOpen] = useState(false);
    const [pos, setPos]   = useState({ top: 0, left: 0 });
    const triggerRef      = useRef(null);
    const menuRef         = useRef(null);

    useEffect(() => {
      if (!open) return;
      const h = (e) => {
        if (
          triggerRef.current && !triggerRef.current.contains(e.target) &&
          menuRef.current    && !menuRef.current.contains(e.target)
        ) setOpen(false);
      };
      document.addEventListener("mousedown", h);
      return () => document.removeEventListener("mousedown", h);
    }, [open]);

    function openMenu(e) {
      e.stopPropagation();
      const r = triggerRef.current.getBoundingClientRect();
      setPos(align === "right"
        ? { top: r.bottom + 5, left: r.right }
        : { top: r.bottom + 5, left: r.left }
      );
      setOpen((o) => !o);
    }

    const popover = open && ReactDOM.createPortal(
      React.createElement(
        "div",
        {
          ref: menuRef,
          className: "popover",
          style: {
            position: "fixed",
            top: pos.top,
            ...(align === "right" ? { right: window.innerWidth - pos.left } : { left: pos.left }),
            zIndex: 300,
          },
          onClick: (e) => e.stopPropagation(),
        },
        items.map((it, i) =>
          it.divider
            ? React.createElement("div", { className: "pop-div", key: i })
            : React.createElement(
                "button",
                { key: i, className: "pop-item" + (it.danger ? " danger" : ""), onClick: () => { setOpen(false); it.onClick?.(); } },
                it.icon ? React.createElement(Icon, { name: it.icon, size: 16 }) : null,
                it.label
              )
        )
      ),
      document.body
    );

    return React.createElement(
      React.Fragment, null,
      React.createElement(
        "div",
        { ref: triggerRef, style: { display: "inline-flex" }, onClick: openMenu },
        trigger
      ),
      popover
    );
  }

  // Toast system
  let _pushToast = null;
  function ToastHost() {
    const [toasts, setToasts] = useState([]);
    useEffect(() => {
      _pushToast = (msg, icon) => {
        const id = Math.random();
        setToasts((t) => [...t, { id, msg, icon }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
      };
    }, []);
    return React.createElement(
      "div",
      { className: "toast-wrap" },
      toasts.map((t) =>
        React.createElement(
          "div",
          { className: "toast", key: t.id },
          React.createElement(Icon, { name: t.icon || "checkCircle", size: 16, className: "t-ico" }),
          t.msg
        )
      )
    );
  }
  function toast(msg, icon) { _pushToast?.(msg, icon); }

  function Collapsible({ title, sub, icon, defaultOpen, badge, children }) {
    const [open, setOpen] = useState(!!defaultOpen);
    return React.createElement(
      "div",
      { className: "collapse" + (open ? " open" : "") },
      React.createElement(
        "button",
        { className: "collapse-head", onClick: () => setOpen((o) => !o) },
        icon ? React.createElement("div", { style: { color: "var(--text-3)" } }, React.createElement(Icon, { name: icon, size: 17 })) : null,
        React.createElement(
          "div",
          null,
          React.createElement("div", { className: "ch-title" }, title),
          sub ? React.createElement("div", { className: "ch-sub" }, sub) : null
        ),
        badge || null,
        React.createElement("span", { className: "chev" }, React.createElement(Icon, { name: "chevR", size: 16 }))
      ),
      open ? React.createElement("div", { className: "collapse-body" }, children) : null
    );
  }

  function Modal({ title, sub, icon, wide, xl, onClose, foot, children, bodyStyle }) {
    useEffect(() => {
      const h = (e) => { if (e.key === "Escape") onClose?.(); };
      document.addEventListener("keydown", h);
      return () => document.removeEventListener("keydown", h);
    }, []);
    return React.createElement(
      "div",
      { className: "modal-wrap", onMouseDown: (e) => { if (e.target === e.currentTarget) onClose?.(); } },
      React.createElement(
        "div",
        { className: "modal" + (xl ? " xl" : wide ? " wide" : "") },
        React.createElement(
          "div",
          { className: "modal-head" },
          icon ? React.createElement("div", { style: { width: 38, height: 38, borderRadius: 9, background: "var(--brand-weak)", color: "var(--brand)", display: "grid", placeItems: "center", flex: "none" } }, React.createElement(Icon, { name: icon, size: 20 })) : null,
          React.createElement(
            "div",
            { style: { flex: 1, minWidth: 0 } },
            React.createElement("div", { className: "modal-title" }, title),
            sub ? React.createElement("div", { className: "modal-sub" }, sub) : null
          ),
          React.createElement("button", { className: "icon-btn", onClick: onClose, style: { width: 34, height: 34 } }, React.createElement(Icon, { name: "x", size: 18 }))
        ),
        React.createElement("div", { className: "modal-body", style: bodyStyle }, children),
        foot ? React.createElement("div", { className: "modal-foot" }, foot) : null
      )
    );
  }

  function TableSearch({ value, onChange, placeholder }) {
    return React.createElement(
      "div", { className: "table-search" },
      React.createElement(Icon, { name: "search", size: 13, style: { color: "var(--text-3)", flexShrink: 0 } }),
      React.createElement("input", {
        type: "text",
        placeholder: placeholder || "Buscar...",
        value: value,
        onChange: (e) => onChange(e.target.value),
      }),
      value ? React.createElement(
        "button",
        { className: "ts-clear", onClick: () => onChange("") },
        React.createElement(Icon, { name: "x", size: 12 })
      ) : null
    );
  }

  Object.assign(window, {
    Checkbox, TypeBadge, FileGlyph, StatusPill, trackingStatus, Avatar, Menu, ToastHost, toast, Collapsible, Modal, TableSearch,
  });
})();
