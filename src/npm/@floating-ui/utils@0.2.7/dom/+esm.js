/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/@floating-ui/utils@0.2.7/dist/floating-ui.utils.dom.mjs
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
function n(n) {
    return o(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function t(n) {
    var t;
    return (
        (null == n || null == (t = n.ownerDocument) ? void 0 : t.defaultView) ||
        window
    );
}
function e(n) {
    var t;
    return null == (t = (o(n) ? n.ownerDocument : n.document) || window.document)
        ? void 0
        : t.documentElement;
}
function o(n) {
    return n instanceof Node || n instanceof t(n).Node;
}
function r(n) {
    return n instanceof Element || n instanceof t(n).Element;
}
function u(n) {
    return n instanceof HTMLElement || n instanceof t(n).HTMLElement;
}
function c(n) {
    return (
        "undefined" !== typeof ShadowRoot &&
        (n instanceof ShadowRoot || n instanceof t(n).ShadowRoot)
    );
}
function l(n) {
    const { overflow: t, overflowX: e, overflowY: o, display: r } = m(n);
    return (
        /auto|scroll|overlay|hidden|clip/.test(t + o + e) &&
        !["inline", "contents"].includes(r)
    );
}
function i(t) {
    return ["table", "td", "th"].includes(n(t));
}
function f(n) {
    return [":popover-open", ":modal"].some((t) => {
        try {
            return n.matches(t);
        } catch (n) {
            return !1;
        }
    });
}
function s(n) {
    const t = d(),
        e = r(n) ? m(n) : n;
    return (
        "none" !== e.transform ||
        "none" !== e.perspective ||
        (!!e.containerType && "normal" !== e.containerType) ||
        (!t && !!e.backdropFilter && "none" !== e.backdropFilter) ||
        (!t && !!e.filter && "none" !== e.filter) ||
        ["transform", "perspective", "filter"].some((n) =>
            (e.willChange || "").includes(n),
        ) ||
        ["paint", "layout", "strict", "content"].some((n) =>
            (e.contain || "").includes(n),
        )
    );
}
function a(n) {
    let t = v(n);
    for (; u(t) && !p(t);) {
        if (s(t)) {
            return t;
        }
        if (f(t)) {
            return null;
        }
        t = v(t);
    }
    return null;
}
function d() {
    return (
        !("undefined" === typeof CSS || !CSS.supports) &&
        CSS.supports("-webkit-backdrop-filter", "none")
    );
}
function p(t) {
    return ["html", "body", "#document"].includes(n(t));
}
function m(n) {
    return t(n).getComputedStyle(n);
}
function w(n) {
    return r(n)
        ? { scrollLeft: n.scrollLeft, scrollTop: n.scrollTop }
        : { scrollLeft: n.scrollX, scrollTop: n.scrollY };
}
function v(t) {
    if ("html" === n(t)) {
        return t;
    }
    const o = t.assignedSlot || t.parentNode || (c(t) && t.host) || e(t);
    return c(o) ? o.host : o;
}
function y(n) {
    const t = v(n);
    return p(t)
        ? n.ownerDocument
            ? n.ownerDocument.body
            : n.body
        : u(t) && l(t)
            ? t
            : y(t);
}
function h(n, e, o) {
    var r;
    void 0 === e && (e = []), void 0 === o && (o = !0);
    const u = y(n),
        c = u === (null == (r = n.ownerDocument) ? void 0 : r.body),
        i = t(u);
    if (c) {
        const n = S(i);
        return e.concat(
            i,
            i.visualViewport || [],
            l(u) ? u : [],
            n && o ? h(n) : [],
        );
    }
    return e.concat(u, h(u, [], o));
}
function S(n) {
    return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
export {
    m as getComputedStyle,
    a as getContainingBlock,
    e as getDocumentElement,
    S as getFrameElement,
    y as getNearestOverflowAncestor,
    n as getNodeName,
    w as getNodeScroll,
    h as getOverflowAncestors,
    v as getParentNode,
    t as getWindow,
    s as isContainingBlock,
    r as isElement,
    u as isHTMLElement,
    p as isLastTraversableNode,
    o as isNode,
    l as isOverflowElement,
    c as isShadowRoot,
    i as isTableElement,
    f as isTopLayer,
    d as isWebKit,
};
export default null;
