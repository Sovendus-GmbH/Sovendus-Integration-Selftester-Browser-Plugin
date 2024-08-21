/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/@floating-ui/utils@0.2.7/dist/floating-ui.utils.mjs
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
const t = ["top", "right", "bottom", "left"],
    n = ["start", "end"],
    o = t.reduce((t, o) => t.concat(o, `${o}-${n[0]}`, `${o}-${n[1]}`), []),
    r = Math.min,
    e = Math.max,
    u = Math.round,
    i = Math.floor,
    c = (t) => ({ x: t, y: t }),
    f = { left: "right", right: "left", bottom: "top", top: "bottom" },
    a = { start: "end", end: "start" };
function h(t, n, o) {
    return e(t, r(n, o));
}
function l(t, n) {
    return "function" === typeof t ? t(n) : t;
}
function p(t) {
    return t.split("-")[0];
}
function s(t) {
    return t.split("-")[1];
}
function g(t) {
    return "x" === t ? "y" : "x";
}
function m(t) {
    return "y" === t ? "height" : "width";
}
function d(t) {
    return ["top", "bottom"].includes(p(t)) ? "y" : "x";
}
function b(t) {
    return g(d(t));
}
function x(t, n, o) {
    void 0 === o && (o = !1);
    const r = s(t),
        e = b(t),
        u = m(e);
    let i =
        "x" === e
            ? r === (o ? "end" : "start")
                ? "right"
                : "left"
            : "start" === r
                ? "bottom"
                : "top";
    return n.reference[u] > n.floating[u] && (i = v(i)), [i, v(i)];
}
function y(t) {
    const n = v(t);
    return [w(t), n, w(n)];
}
function w(t) {
    return t.replace(/start|end/g, (t) => a[t]);
}
function M(t, n, o, r) {
    const e = s(t);
    let u = (function (t, n, o) {
        const r = ["left", "right"],
            e = ["right", "left"],
            u = ["top", "bottom"],
            i = ["bottom", "top"];
        switch (t) {
            case "top":
            case "bottom":
                return o ? (n ? e : r) : n ? r : e;
            case "left":
            case "right":
                return n ? u : i;
            default:
                return [];
        }
    })(p(t), "start" === o, r);
    return (
        e && ((u = u.map((t) => `${t}-${e}`)), n && (u = u.concat(u.map(w)))), u
    );
}
function v(t) {
    return t.replace(/left|right|bottom|top/g, (t) => f[t]);
}
function j(t) {
    return { top: 0, right: 0, bottom: 0, left: 0, ...t };
}
function k(t) {
    return "number" !== typeof t
        ? j(t)
        : { top: t, right: t, bottom: t, left: t };
}
function q(t) {
    const { x: n, y: o, width: r, height: e } = t;
    return {
        width: r,
        height: e,
        top: o,
        left: n,
        right: n + r,
        bottom: o + e,
        x: n,
        y: o,
    };
}
export {
    n as alignments,
    h as clamp,
    c as createCoords,
    l as evaluate,
    j as expandPaddingObject,
    i as floor,
    s as getAlignment,
    b as getAlignmentAxis,
    x as getAlignmentSides,
    m as getAxisLength,
    y as getExpandedPlacements,
    w as getOppositeAlignmentPlacement,
    g as getOppositeAxis,
    M as getOppositeAxisPlacements,
    v as getOppositePlacement,
    k as getPaddingObject,
    p as getSide,
    d as getSideAxis,
    e as max,
    r as min,
    o as placements,
    q as rectToClientRect,
    u as round,
    t as sides,
};
export default null;
