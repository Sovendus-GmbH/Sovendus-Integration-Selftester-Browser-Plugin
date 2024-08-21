/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/@floating-ui/core@1.6.7/dist/floating-ui.core.mjs
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
import {
    clamp as a,
    evaluate as e,
    getAlignment as l,
    getAlignmentAxis as i,
    getAlignmentSides as f,
    getAxisLength as r,
    getExpandedPlacements as d,
    getOppositeAlignmentPlacement as y,
    getOppositeAxis as p,
    getOppositeAxisPlacements as g,
    getOppositePlacement as u,
    getPaddingObject as t,
    getSide as c,
    getSideAxis as m,
    max as h,
    min as o,
    placements as s,
    rectToClientRect as n,
    sides as w,
} from "/npm/@floating-ui/utils@0.2.7/+esm.js";
export { rectToClientRect } from "/npm/@floating-ui/utils@0.2.7/+esm.js";
function x(e, t, n) {
    let { reference: o, floating: a } = e;
    const s = m(t),
        f = i(t),
        u = r(f),
        d = c(t),
        g = "y" === s,
        p = o.x + o.width / 2 - a.width / 2,
        h = o.y + o.height / 2 - a.height / 2,
        y = o[u] / 2 - a[u] / 2;
    let w;
    switch (d) {
        case "top":
            w = { x: p, y: o.y - a.height };
            break;
        case "bottom":
            w = { x: p, y: o.y + o.height };
            break;
        case "right":
            w = { x: o.x + o.width, y: h };
            break;
        case "left":
            w = { x: o.x - a.width, y: h };
            break;
        default:
            w = { x: o.x, y: o.y };
    }
    switch (l(t)) {
        case "start":
            w[f] -= y * (n && g ? -1 : 1);
            break;
        case "end":
            w[f] += y * (n && g ? -1 : 1);
    }
    return w;
}
const v = async (e, t, n) => {
    const {
        placement: i = "bottom",
        strategy: r = "absolute",
        middleware: o = [],
        platform: a,
    } = n,
        l = o.filter(Boolean),
        s = await (null == a.isRTL ? void 0 : a.isRTL(t));
    let f = await a.getElementRects({ reference: e, floating: t, strategy: r }),
        { x: c, y: m } = x(f, i, s),
        u = i,
        d = {},
        g = 0;
    for (let n = 0; n < l.length; n++) {
        const { name: o, fn: p } = l[n],
            {
                x: h,
                y: y,
                data: w,
                reset: v,
            } = await p({
                x: c,
                y: m,
                initialPlacement: i,
                placement: u,
                strategy: r,
                middlewareData: d,
                rects: f,
                platform: a,
                elements: { reference: e, floating: t },
            });
        (c = null != h ? h : c),
            (m = null != y ? y : m),
            (d = { ...d, [o]: { ...d[o], ...w } }),
            v &&
            g <= 50 &&
            (g++,
                "object" === typeof v &&
                (v.placement && (u = v.placement),
                    v.rects &&
                    (f =
                        !0 === v.rects
                            ? await a.getElementRects({
                                reference: e,
                                floating: t,
                                strategy: r,
                            })
                            : v.rects),
                    ({ x: c, y: m } = x(f, u, s))),
                (n = -1));
    }
    return { x: c, y: m, placement: u, strategy: r, middlewareData: d };
};
async function b(i, r) {
    var o;
    void 0 === r && (r = {});
    const { x: a, y: l, platform: s, rects: f, elements: c, strategy: m } = i,
        {
            boundary: u = "clippingAncestors",
            rootBoundary: d = "viewport",
            elementContext: g = "floating",
            altBoundary: p = !1,
            padding: h = 0,
        } = e(r, i),
        y = t(h),
        w = c[p ? ("floating" === g ? "reference" : "floating") : g],
        x = n(
            await s.getClippingRect({
                element:
                    null == (o = await (null == s.isElement ? void 0 : s.isElement(w))) ||
                        o
                        ? w
                        : w.contextElement ||
                        (await (null == s.getDocumentElement
                            ? void 0
                            : s.getDocumentElement(c.floating))),
                boundary: u,
                rootBoundary: d,
                strategy: m,
            }),
        ),
        v =
            "floating" === g
                ? { x: a, y: l, width: f.floating.width, height: f.floating.height }
                : f.reference,
        b = await (null == s.getOffsetParent
            ? void 0
            : s.getOffsetParent(c.floating)),
        A = ((await (null == s.isElement ? void 0 : s.isElement(b))) &&
            (await (null == s.getScale ? void 0 : s.getScale(b)))) || { x: 1, y: 1 },
        R = n(
            s.convertOffsetParentRelativeRectToViewportRelativeRect
                ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
                    elements: c,
                    rect: v,
                    offsetParent: b,
                    strategy: m,
                })
                : v,
        );
    return {
        top: (x.top - R.top + y.top) / A.y,
        bottom: (R.bottom - x.bottom + y.bottom) / A.y,
        left: (x.left - R.left + y.left) / A.x,
        right: (R.right - x.right + y.right) / A.x,
    };
}
const A = (n) => ({
    name: "arrow",
    options: n,
    async fn(s) {
        const {
            x: f,
            y: c,
            placement: m,
            rects: u,
            platform: d,
            elements: g,
            middlewareData: p,
        } = s,
            { element: h, padding: y = 0 } = e(n, s) || {};
        if (null == h) {
            return {};
        }
        const w = t(y),
            x = { x: f, y: c },
            v = i(m),
            b = r(v),
            A = await d.getDimensions(h),
            R = "y" === v,
            P = R ? "top" : "left",
            D = R ? "bottom" : "right",
            T = R ? "clientHeight" : "clientWidth",
            E = u.reference[b] + u.reference[v] - x[v] - u.floating[b],
            O = x[v] - u.reference[v],
            L = await (null == d.getOffsetParent ? void 0 : d.getOffsetParent(h));
        let k = L ? L[T] : 0;
        (k && (await (null == d.isElement ? void 0 : d.isElement(L)))) ||
            (k = g.floating[T] || u.floating[b]);
        const C = E / 2 - O / 2,
            B = k / 2 - A[b] / 2 - 1,
            H = o(w[P], B),
            S = o(w[D], B),
            F = H,
            V = k - A[b] - S,
            W = k / 2 - A[b] / 2 + C,
            j = a(F, W, V),
            z =
                !p.arrow &&
                null != l(m) &&
                W !== j &&
                u.reference[b] / 2 - (W < F ? H : S) - A[b] / 2 < 0,
            q = z ? (W < F ? W - F : W - V) : 0;
        return {
            [v]: x[v] + q,
            data: {
                [v]: j,
                centerOffset: W - j - q,
                ...(z && { alignmentOffset: q }),
            },
            reset: z,
        };
    },
});
const R = function (t) {
    return (
        void 0 === t && (t = {}),
        {
            name: "autoPlacement",
            options: t,
            async fn(n) {
                var i, r, o;
                const {
                    rects: a,
                    middlewareData: m,
                    placement: u,
                    platform: d,
                    elements: g,
                } = n,
                    {
                        crossAxis: p = !1,
                        alignment: h,
                        allowedPlacements: w = s,
                        autoAlignment: x = !0,
                        ...v
                    } = e(t, n),
                    A =
                        void 0 !== h || w === s
                            ? (function (e, t, n) {
                                return (
                                    e
                                        ? [
                                            ...n.filter((t) => l(t) === e),
                                            ...n.filter((t) => l(t) !== e),
                                        ]
                                        : n.filter((e) => c(e) === e)
                                ).filter((n) => !e || l(n) === e || (!!t && y(n) !== n));
                            })(h || null, x, w)
                            : w,
                    R = await b(n, v),
                    P = (null == (i = m.autoPlacement) ? void 0 : i.index) || 0,
                    D = A[P];
                if (null == D) {
                    return {};
                }
                const T = f(
                    D,
                    a,
                    await (null == d.isRTL ? void 0 : d.isRTL(g.floating)),
                );
                if (u !== D) {
                    return { reset: { placement: A[0] } };
                }
                const E = [R[c(D)], R[T[0]], R[T[1]]],
                    O = [
                        ...((null == (r = m.autoPlacement) ? void 0 : r.overflows) || []),
                        { placement: D, overflows: E },
                    ],
                    L = A[P + 1];
                if (L) {
                    return {
                        data: { index: P + 1, overflows: O },
                        reset: { placement: L },
                    };
                }
                const k = O.map((e) => {
                    const t = l(e.placement);
                    return [
                        e.placement,
                        t && p
                            ? e.overflows.slice(0, 2).reduce((e, t) => e + t, 0)
                            : e.overflows[0],
                        e.overflows,
                    ];
                }).sort((e, t) => e[1] - t[1]),
                    C =
                        (null ==
                            (o = k.filter((e) =>
                                e[2].slice(0, l(e[0]) ? 2 : 3).every((e) => e <= 0),
                            )[0])
                            ? void 0
                            : o[0]) || k[0][0];
                return C !== u
                    ? { data: { index: P + 1, overflows: O }, reset: { placement: C } }
                    : {};
            },
        }
    );
},
    P = function (t) {
        return (
            void 0 === t && (t = {}),
            {
                name: "flip",
                options: t,
                async fn(n) {
                    var i, r;
                    const {
                        placement: o,
                        middlewareData: a,
                        rects: l,
                        initialPlacement: s,
                        platform: p,
                        elements: h,
                    } = n,
                        {
                            mainAxis: y = !0,
                            crossAxis: w = !0,
                            fallbackPlacements: x,
                            fallbackStrategy: v = "bestFit",
                            fallbackAxisSideDirection: A = "none",
                            flipAlignment: R = !0,
                            ...P
                        } = e(t, n);
                    if (null != (i = a.arrow) && i.alignmentOffset) {
                        return {};
                    }
                    const D = c(o),
                        T = m(s),
                        E = c(s) === s,
                        O = await (null == p.isRTL ? void 0 : p.isRTL(h.floating)),
                        L = x || (E || !R ? [u(s)] : d(s)),
                        k = "none" !== A;
                    !x && k && L.push(...g(s, R, A, O));
                    const C = [s, ...L],
                        B = await b(n, P),
                        H = [];
                    let S = (null == (r = a.flip) ? void 0 : r.overflows) || [];
                    if ((y && H.push(B[D]), w)) {
                        const e = f(o, l, O);
                        H.push(B[e[0]], B[e[1]]);
                    }
                    if (
                        ((S = [...S, { placement: o, overflows: H }]),
                            !H.every((e) => e <= 0))
                    ) {
                        var F, V;
                        const e = ((null == (F = a.flip) ? void 0 : F.index) || 0) + 1,
                            t = C[e];
                        if (t) {
                            return {
                                data: { index: e, overflows: S },
                                reset: { placement: t },
                            };
                        }
                        let n =
                            null ==
                                (V = S.filter((e) => e.overflows[0] <= 0).sort(
                                    (e, t) => e.overflows[1] - t.overflows[1],
                                )[0])
                                ? void 0
                                : V.placement;
                        if (!n) {
                            switch (v) {
                                case "bestFit": {
                                    var W;
                                    const e =
                                        null ==
                                            (W = S.filter((e) => {
                                                if (k) {
                                                    const t = m(e.placement);
                                                    return t === T || "y" === t;
                                                }
                                                return !0;
                                            })
                                                .map((e) => [
                                                    e.placement,
                                                    e.overflows
                                                        .filter((e) => e > 0)
                                                        .reduce((e, t) => e + t, 0),
                                                ])
                                                .sort((e, t) => e[1] - t[1])[0])
                                            ? void 0
                                            : W[0];
                                    e && (n = e);
                                    break;
                                }
                                case "initialPlacement":
                                    n = s;
                            }
                        }
                        if (o !== n) {
                            return { reset: { placement: n } };
                        }
                    }
                    return {};
                },
            }
        );
    };
function D(e, t) {
    return {
        top: e.top - t.height,
        right: e.right - t.width,
        bottom: e.bottom - t.height,
        left: e.left - t.width,
    };
}
function T(e) {
    return w.some((t) => e[t] >= 0);
}
const E = function (t) {
    return (
        void 0 === t && (t = {}),
        {
            name: "hide",
            options: t,
            async fn(n) {
                const { rects: i } = n,
                    { strategy: r = "referenceHidden", ...o } = e(t, n);
                switch (r) {
                    case "referenceHidden": {
                        const e = D(
                            await b(n, { ...o, elementContext: "reference" }),
                            i.reference,
                        );
                        return {
                            data: { referenceHiddenOffsets: e, referenceHidden: T(e) },
                        };
                    }
                    case "escaped": {
                        const e = D(await b(n, { ...o, altBoundary: !0 }), i.floating);
                        return { data: { escapedOffsets: e, escaped: T(e) } };
                    }
                    default:
                        return {};
                }
            },
        }
    );
};
function O(e) {
    const t = o(...e.map((e) => e.left)),
        n = o(...e.map((e) => e.top));
    return {
        x: t,
        y: n,
        width: h(...e.map((e) => e.right)) - t,
        height: h(...e.map((e) => e.bottom)) - n,
    };
}
const L = function (i) {
    return (
        void 0 === i && (i = {}),
        {
            name: "inline",
            options: i,
            async fn(r) {
                const {
                    placement: a,
                    elements: l,
                    rects: s,
                    platform: f,
                    strategy: u,
                } = r,
                    { padding: d = 2, x: g, y: p } = e(i, r),
                    y = Array.from(
                        (await (null == f.getClientRects
                            ? void 0
                            : f.getClientRects(l.reference))) || [],
                    ),
                    w = (function (e) {
                        const t = e.slice().sort((e, t) => e.y - t.y),
                            i = [];
                        let r = null;
                        for (let e = 0; e < t.length; e++) {
                            const n = t[e];
                            !r || n.y - r.y > r.height / 2
                                ? i.push([n])
                                : i[i.length - 1].push(n),
                                (r = n);
                        }
                        return i.map((e) => n(O(e)));
                    })(y),
                    x = n(O(y)),
                    v = t(d);
                const b = await f.getElementRects({
                    reference: {
                        getBoundingClientRect: function () {
                            if (
                                2 === w.length &&
                                w[0].left > w[1].right &&
                                null != g &&
                                null != p
                            ) {
                                return (
                                    w.find(
                                        (e) =>
                                            g > e.left - v.left &&
                                            g < e.right + v.right &&
                                            p > e.top - v.top &&
                                            p < e.bottom + v.bottom,
                                    ) || x
                                );
                            }
                            if (w.length >= 2) {
                                if ("y" === m(a)) {
                                    const e = w[0],
                                        t = w[w.length - 1],
                                        n = "top" === c(a),
                                        i = e.top,
                                        r = t.bottom,
                                        o = n ? e.left : t.left,
                                        l = n ? e.right : t.right;
                                    return {
                                        top: i,
                                        bottom: r,
                                        left: o,
                                        right: l,
                                        width: l - o,
                                        height: r - i,
                                        x: o,
                                        y: i,
                                    };
                                }
                                const e = "left" === c(a),
                                    t = h(...w.map((e) => e.right)),
                                    n = o(...w.map((e) => e.left)),
                                    i = w.filter((i) => (e ? i.left === n : i.right === t)),
                                    r = i[0].top,
                                    l = i[i.length - 1].bottom;
                                return {
                                    top: r,
                                    bottom: l,
                                    left: n,
                                    right: t,
                                    width: t - n,
                                    height: l - r,
                                    x: n,
                                    y: r,
                                };
                            }
                            return x;
                        },
                    },
                    floating: l.floating,
                    strategy: u,
                });
                return s.reference.x !== b.reference.x ||
                    s.reference.y !== b.reference.y ||
                    s.reference.width !== b.reference.width ||
                    s.reference.height !== b.reference.height
                    ? { reset: { rects: b } }
                    : {};
            },
        }
    );
};
const k = function (t) {
    return (
        void 0 === t && (t = 0),
        {
            name: "offset",
            options: t,
            async fn(n) {
                var i, r;
                const { x: o, y: a, placement: s, middlewareData: f } = n,
                    u = await (async function (t, n) {
                        const { placement: i, platform: r, elements: o } = t,
                            a = await (null == r.isRTL ? void 0 : r.isRTL(o.floating)),
                            s = c(i),
                            f = l(i),
                            u = "y" === m(i),
                            d = ["left", "top"].includes(s) ? -1 : 1,
                            g = a && u ? -1 : 1,
                            p = e(n, t);
                        let {
                            mainAxis: h,
                            crossAxis: y,
                            alignmentAxis: w,
                        } = "number" === typeof p
                                ? { mainAxis: p, crossAxis: 0, alignmentAxis: null }
                                : { mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...p };
                        return (
                            f && "number" === typeof w && (y = "end" === f ? -1 * w : w),
                            u ? { x: y * g, y: h * d } : { x: h * d, y: y * g }
                        );
                    })(n, t);
                return s === (null == (i = f.offset) ? void 0 : i.placement) &&
                    null != (r = f.arrow) &&
                    r.alignmentOffset
                    ? {}
                    : { x: o + u.x, y: a + u.y, data: { ...u, placement: s } };
            },
        }
    );
},
    C = function (t) {
        return (
            void 0 === t && (t = {}),
            {
                name: "shift",
                options: t,
                async fn(n) {
                    const { x: i, y: r, placement: o } = n,
                        {
                            mainAxis: l = !0,
                            crossAxis: s = !1,
                            limiter: f = {
                                fn: (e) => {
                                    let { x: t, y: n } = e;
                                    return { x: t, y: n };
                                },
                            },
                            ...u
                        } = e(t, n),
                        d = { x: i, y: r },
                        g = await b(n, u),
                        h = m(c(o)),
                        y = p(h);
                    let w = d[y],
                        x = d[h];
                    if (l) {
                        const e = "y" === y ? "bottom" : "right",
                            t = w + g["y" === y ? "top" : "left"],
                            n = w - g[e];
                        w = a(t, w, n);
                    }
                    if (s) {
                        const e = "y" === h ? "bottom" : "right",
                            t = x + g["y" === h ? "top" : "left"],
                            n = x - g[e];
                        x = a(t, x, n);
                    }
                    const v = f.fn({ ...n, [y]: w, [h]: x });
                    return { ...v, data: { x: v.x - i, y: v.y - r } };
                },
            }
        );
    },
    B = function (t) {
        return (
            void 0 === t && (t = {}),
            {
                options: t,
                fn(n) {
                    const { x: i, y: r, placement: o, rects: a, middlewareData: l } = n,
                        { offset: s = 0, mainAxis: f = !0, crossAxis: u = !0 } = e(t, n),
                        d = { x: i, y: r },
                        g = m(o),
                        h = p(g);
                    let y = d[h],
                        w = d[g];
                    const x = e(s, n),
                        v =
                            "number" === typeof x
                                ? { mainAxis: x, crossAxis: 0 }
                                : { mainAxis: 0, crossAxis: 0, ...x };
                    if (f) {
                        const e = "y" === h ? "height" : "width",
                            t = a.reference[h] - a.floating[e] + v.mainAxis,
                            n = a.reference[h] + a.reference[e] - v.mainAxis;
                        y < t ? (y = t) : y > n && (y = n);
                    }
                    if (u) {
                        var b, A;
                        const e = "y" === h ? "width" : "height",
                            t = ["top", "left"].includes(c(o)),
                            n =
                                a.reference[g] -
                                a.floating[e] +
                                ((t && (null == (b = l.offset) ? void 0 : b[g])) || 0) +
                                (t ? 0 : v.crossAxis),
                            i =
                                a.reference[g] +
                                a.reference[e] +
                                (t ? 0 : (null == (A = l.offset) ? void 0 : A[g]) || 0) -
                                (t ? v.crossAxis : 0);
                        w < n ? (w = n) : w > i && (w = i);
                    }
                    return { [h]: y, [g]: w };
                },
            }
        );
    },
    H = function (t) {
        return (
            void 0 === t && (t = {}),
            {
                name: "size",
                options: t,
                async fn(n) {
                    const { placement: i, rects: r, platform: a, elements: s } = n,
                        { apply: f = () => { }, ...u } = e(t, n),
                        d = await b(n, u),
                        g = c(i),
                        p = l(i),
                        y = "y" === m(i),
                        { width: w, height: x } = r.floating;
                    let v, A;
                    "top" === g || "bottom" === g
                        ? ((v = g),
                            (A =
                                p ===
                                    ((await (null == a.isRTL ? void 0 : a.isRTL(s.floating)))
                                        ? "start"
                                        : "end")
                                    ? "left"
                                    : "right"))
                        : ((A = g), (v = "end" === p ? "top" : "bottom"));
                    const R = x - d.top - d.bottom,
                        P = w - d.left - d.right,
                        D = o(x - d[v], R),
                        T = o(w - d[A], P),
                        E = !n.middlewareData.shift;
                    let O = D,
                        L = T;
                    if (
                        (y ? (L = p || E ? o(T, P) : P) : (O = p || E ? o(D, R) : R),
                            E && !p)
                    ) {
                        const e = h(d.left, 0),
                            t = h(d.right, 0),
                            n = h(d.top, 0),
                            i = h(d.bottom, 0);
                        y
                            ? (L = w - 2 * (0 !== e || 0 !== t ? e + t : h(d.left, d.right)))
                            : (O = x - 2 * (0 !== n || 0 !== i ? n + i : h(d.top, d.bottom)));
                    }
                    await f({ ...n, availableWidth: L, availableHeight: O });
                    const k = await a.getDimensions(s.floating);
                    return w !== k.width || x !== k.height
                        ? { reset: { rects: !0 } }
                        : {};
                },
            }
        );
    };
export {
    A as arrow,
    R as autoPlacement,
    v as computePosition,
    b as detectOverflow,
    P as flip,
    E as hide,
    L as inline,
    B as limitShift,
    k as offset,
    C as shift,
    H as size,
};
export default null;
