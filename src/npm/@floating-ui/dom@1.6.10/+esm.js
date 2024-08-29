/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/@floating-ui/dom@1.6.10/dist/floating-ui.dom.mjs
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
import {
    arrow as s,
    autoPlacement as n,
    computePosition as u,
    detectOverflow as t,
    flip as o,
    hide as l,
    inline as c,
    limitShift as f,
    offset as e,
    rectToClientRect as h,
    shift as i,
    size as r,
} from "/npm/@floating-ui/core@1.6.7/+esm.js";
import {
    createCoords as a,
    floor as m,
    max as g,
    min as p,
    round as d,
} from "/npm/@floating-ui/utils@0.2.7/+esm.js";
import {
    getComputedStyle as R,
    getContainingBlock as C,
    getDocumentElement as x,
    getFrameElement as L,
    getNodeName as F,
    getNodeScroll as O,
    getOverflowAncestors as w,
    getParentNode as W,
    getWindow as b,
    isContainingBlock as A,
    isElement as y,
    isHTMLElement as v,
    isLastTraversableNode as H,
    isOverflowElement as E,
    isTableElement as z,
    isTopLayer as T,
    isWebKit as P,
} from "/npm/@floating-ui/utils@0.2.7/dom/+esm.js";
export { getOverflowAncestors } from "/npm/@floating-ui/utils@0.2.7/dom/+esm.js";
function B(t) {
    const e = R(t);
    let n = parseFloat(e.width) || 0,
        i = parseFloat(e.height) || 0;
    const o = v(t),
        r = o ? t.offsetWidth : n,
        l = o ? t.offsetHeight : i,
        s = d(n) !== r || d(i) !== l;
    return s && ((n = r), (i = l)), { width: n, height: i, $: s };
}
function D(t) {
    return y(t) ? t : t.contextElement;
}
function V(t) {
    const e = D(t);
    if (!v(e)) {
        return a(1);
    }
    const n = e.getBoundingClientRect(),
        { width: i, height: o, $: r } = B(e);
    let l = (r ? d(n.width) : n.width) / i,
        s = (r ? d(n.height) : n.height) / o;
    return (
        (l && Number.isFinite(l)) || (l = 1),
        (s && Number.isFinite(s)) || (s = 1),
        { x: l, y: s }
    );
}
const S = a(0);
function I(t) {
    const e = b(t);
    return P() && e.visualViewport
        ? { x: e.visualViewport.offsetLeft, y: e.visualViewport.offsetTop }
        : S;
}
function q(t, e, n, i) {
    void 0 === e && (e = !1), void 0 === n && (n = !1);
    const o = t.getBoundingClientRect(),
        r = D(t);
    let l = a(1);
    e && (i ? y(i) && (l = V(i)) : (l = V(t)));
    const s = (function (t, e, n) {
        return void 0 === e && (e = !1), !(!n || (e && n !== b(t))) && e;
    })(r, n, i)
        ? I(r)
        : a(0);
    let c = (o.left + s.x) / l.x,
        f = (o.top + s.y) / l.y,
        u = o.width / l.x,
        d = o.height / l.y;
    if (r) {
        const t = b(r),
            e = i && y(i) ? b(i) : i;
        let n = t,
            o = L(n);
        for (; o && i && e !== n;) {
            const t = V(o),
                e = o.getBoundingClientRect(),
                i = R(o),
                r = e.left + (o.clientLeft + parseFloat(i.paddingLeft)) * t.x,
                l = e.top + (o.clientTop + parseFloat(i.paddingTop)) * t.y;
            (c *= t.x),
                (f *= t.y),
                (u *= t.x),
                (d *= t.y),
                (c += r),
                (f += l),
                (n = b(o)),
                (o = L(n));
        }
    }
    return h({ width: u, height: d, x: c, y: f });
}
function M(t) {
    return q(x(t)).left + O(t).scrollLeft;
}
function N(t, e, n) {
    let i;
    if ("viewport" === e) {
        i = (function (t, e) {
            const n = b(t),
                i = x(t),
                o = n.visualViewport;
            let r = i.clientWidth,
                l = i.clientHeight,
                s = 0,
                c = 0;
            if (o) {
                (r = o.width), (l = o.height);
                const t = P();
                (!t || (t && "fixed" === e)) && ((s = o.offsetLeft), (c = o.offsetTop));
            }
            return { width: r, height: l, x: s, y: c };
        })(t, n);
    } else if ("document" === e) {
        i = (function (t) {
            const e = x(t),
                n = O(t),
                i = t.ownerDocument.body,
                o = g(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth),
                r = g(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
            let l = -n.scrollLeft + M(t);
            const s = -n.scrollTop;
            return (
                "rtl" === R(i).direction && (l += g(e.clientWidth, i.clientWidth) - o),
                { width: o, height: r, x: l, y: s }
            );
        })(x(t));
    } else if (y(e)) {
        i = (function (t, e) {
            const n = q(t, !0, "fixed" === e),
                i = n.top + t.clientTop,
                o = n.left + t.clientLeft,
                r = v(t) ? V(t) : a(1);
            return {
                width: t.clientWidth * r.x,
                height: t.clientHeight * r.y,
                x: o * r.x,
                y: i * r.y,
            };
        })(e, n);
    } else {
        const n = I(t);
        i = { ...e, x: e.x - n.x, y: e.y - n.y };
    }
    return h(i);
}
function $(t, e) {
    const n = W(t);
    return !(n === e || !y(n) || H(n)) && ("fixed" === R(n).position || $(n, e));
}
function _(t, e, n) {
    const i = v(e),
        o = x(e),
        r = "fixed" === n,
        l = q(t, !0, r, e);
    let s = { scrollLeft: 0, scrollTop: 0 };
    const c = a(0);
    if (i || (!i && !r)) {
        if ((("body" !== F(e) || E(o)) && (s = O(e)), i)) {
            const t = q(e, !0, r, e);
            (c.x = t.x + e.clientLeft), (c.y = t.y + e.clientTop);
        } else {
            o && (c.x = M(o));
        }
    }
    return {
        x: l.left + s.scrollLeft - c.x,
        y: l.top + s.scrollTop - c.y,
        width: l.width,
        height: l.height,
    };
}
function j(t) {
    return "static" === R(t).position;
}
function k(t, e) {
    return v(t) && "fixed" !== R(t).position ? (e ? e(t) : t.offsetParent) : null;
}
function G(t, e) {
    const n = b(t);
    if (T(t)) {
        return n;
    }
    if (!v(t)) {
        let e = W(t);
        for (; e && !H(e);) {
            if (y(e) && !j(e)) {
                return e;
            }
            e = W(e);
        }
        return n;
    }
    let i = k(t, e);
    for (; i && z(i) && j(i);) {
        i = k(i, e);
    }
    return i && H(i) && j(i) && !A(i) ? n : i || C(t) || n;
}
const J = {
    convertOffsetParentRelativeRectToViewportRelativeRect: function (t) {
        let { elements: e, rect: n, offsetParent: i, strategy: o } = t;
        const r = "fixed" === o,
            l = x(i),
            s = !!e && T(e.floating);
        if (i === l || (s && r)) {
            return n;
        }
        let c = { scrollLeft: 0, scrollTop: 0 },
            f = a(1);
        const u = a(0),
            h = v(i);
        if ((h || (!h && !r)) && (("body" !== F(i) || E(l)) && (c = O(i)), v(i))) {
            const t = q(i);
            (f = V(i)), (u.x = t.x + i.clientLeft), (u.y = t.y + i.clientTop);
        }
        return {
            width: n.width * f.x,
            height: n.height * f.y,
            x: n.x * f.x - c.scrollLeft * f.x + u.x,
            y: n.y * f.y - c.scrollTop * f.y + u.y,
        };
    },
    getDocumentElement: x,
    getClippingRect: function (t) {
        let { element: e, boundary: n, rootBoundary: i, strategy: o } = t;
        const r = [
            ...("clippingAncestors" === n
                ? T(e)
                    ? []
                    : (function (t, e) {
                        const n = e.get(t);
                        if (n) {
                            return n;
                        }
                        let i = w(t, [], !1).filter((t) => y(t) && "body" !== F(t)),
                            o = null;
                        const r = "fixed" === R(t).position;
                        let l = r ? W(t) : t;
                        for (; y(l) && !H(l);) {
                            const e = R(l),
                                n = A(l);
                            n || "fixed" !== e.position || (o = null),
                                (
                                    r
                                        ? !n && !o
                                        : (!n &&
                                            "static" === e.position &&
                                            o &&
                                            ["absolute", "fixed"].includes(o.position)) ||
                                        (E(l) && !n && $(t, l))
                                )
                                    ? (i = i.filter((t) => t !== l))
                                    : (o = e),
                                (l = W(l));
                        }
                        return e.set(t, i), i;
                    })(e, this._c)
                : [].concat(n)),
            i,
        ],
            l = r[0],
            s = r.reduce(
                (t, n) => {
                    const i = N(e, n, o);
                    return (
                        (t.top = g(i.top, t.top)),
                        (t.right = p(i.right, t.right)),
                        (t.bottom = p(i.bottom, t.bottom)),
                        (t.left = g(i.left, t.left)),
                        t
                    );
                },
                N(e, l, o),
            );
        return {
            width: s.right - s.left,
            height: s.bottom - s.top,
            x: s.left,
            y: s.top,
        };
    },
    getOffsetParent: G,
    getElementRects: async function (t) {
        const e = this.getOffsetParent || G,
            n = this.getDimensions,
            i = await n(t.floating);
        return {
            reference: _(t.reference, await e(t.floating), t.strategy),
            floating: { x: 0, y: 0, width: i.width, height: i.height },
        };
    },
    getClientRects: function (t) {
        return Array.from(t.getClientRects());
    },
    getDimensions: function (t) {
        const { width: e, height: n } = B(t);
        return { width: e, height: n };
    },
    getScale: V,
    isElement: y,
    isRTL: function (t) {
        return "rtl" === R(t).direction;
    },
};
function K(t, e, n, i) {
    void 0 === i && (i = {});
    const {
        ancestorScroll: o = !0,
        ancestorResize: r = !0,
        elementResize: l = "function" === typeof ResizeObserver,
        layoutShift: s = "function" === typeof IntersectionObserver,
        animationFrame: c = !1,
    } = i,
        f = D(t),
        u = o || r ? [...(f ? w(f) : []), ...w(e)] : [];
    u.forEach((t) => {
        o && t.addEventListener("scroll", n, { passive: !0 }),
            r && t.addEventListener("resize", n);
    });
    const h =
        f && s
            ? (function (t, e) {
                let n,
                    i = null;
                const o = x(t);
                function r() {
                    var t;
                    clearTimeout(n), null == (t = i) || t.disconnect(), (i = null);
                }
                return (
                    (function l(s, c) {
                        void 0 === s && (s = !1), void 0 === c && (c = 1), r();
                        const {
                            left: f,
                            top: u,
                            width: h,
                            height: a,
                        } = t.getBoundingClientRect();
                        if ((s || e(), !h || !a)) {
                            return;
                        }
                        const d = {
                            rootMargin: `${-m(u)}px ${-m(o.clientWidth - (f + h))}px ${-m(o.clientHeight - (u + a))}px ${-m(f)}px`,
                            threshold: g(0, p(1, c)) || 1,
                        };
                        let x = !0;
                        function y(t) {
                            const e = t[0].intersectionRatio;
                            if (e !== c) {
                                if (!x) {
                                    return l();
                                }
                                e
                                    ? l(!1, e)
                                    : (n = setTimeout(() => {
                                        l(!1, 1e-7);
                                    }, 1e3));
                            }
                            x = !1;
                        }
                        try {
                            i = new IntersectionObserver(y, {
                                ...d,
                                root: o.ownerDocument,
                            });
                        } catch (t) {
                            i = new IntersectionObserver(y, d);
                        }
                        i.observe(t);
                    })(!0),
                    r
                );
            })(f, n)
            : null;
    let a,
        d = -1,
        y = null;
    l &&
        ((y = new ResizeObserver((t) => {
            let [i] = t;
            i &&
                i.target === f &&
                y &&
                (y.unobserve(e),
                    cancelAnimationFrame(d),
                    (d = requestAnimationFrame(() => {
                        var t;
                        null == (t = y) || t.observe(e);
                    }))),
                n();
        })),
            f && !c && y.observe(f),
            y.observe(e));
    let v = c ? q(t) : null;
    return (
        c &&
        (function e() {
            const i = q(t);
            !v ||
                (i.x === v.x &&
                    i.y === v.y &&
                    i.width === v.width &&
                    i.height === v.height) ||
                n();
            (v = i), (a = requestAnimationFrame(e));
        })(),
        n(),
        () => {
            var t;
            u.forEach((t) => {
                o && t.removeEventListener("scroll", n),
                    r && t.removeEventListener("resize", n);
            }),
                null == h || h(),
                null == (t = y) || t.disconnect(),
                (y = null),
                c && cancelAnimationFrame(a);
        }
    );
}
const Q = t,
    U = e,
    X = n,
    Y = i,
    Z = o,
    tt = r,
    et = l,
    nt = s,
    it = c,
    ot = f,
    rt = (t, e, n) => {
        const i = new Map(),
            o = { platform: J, ...n },
            r = { ...o.platform, _c: i };
        return u(t, e, { ...o, platform: r });
    };
export {
    nt as arrow,
    X as autoPlacement,
    K as autoUpdate,
    rt as computePosition,
    Q as detectOverflow,
    Z as flip,
    et as hide,
    it as inline,
    ot as limitShift,
    U as offset,
    J as platform,
    Y as shift,
    tt as size,
};
export default null;