/* turn.js | turnjs.com | (c) 2012 Emmanuel Garcia | MIT Licensed  */
 (function(h) {
    var D = Math.PI,
    B = D / 2,
    G = "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix,
    u = "Touch" in window,
    K = {
        backward: ["bl", "tl"],
        forward: ["br", "tr"],
        all: ["tl", "bl", "tr", "br"]
    },
    L = {
        page: 1,
        shadows: !0,
        duration: 600,
        acceleration: !0
    },
    M = {
        back: null,
        corners: "forward",
        cornerSize: 100,
        shadows: !0,
        duration: 600,
        acceleration: !0
    },
    v = function(a, b, c, d) {
        return {
            css: {
                position: "absolute",
                top: a,
                left: b,
                overflow: d || "hidden",
                "z-index": c || "auto"
            }
        }
    },
    I = function(a, b, c, d, e) {
        var i = 1 - e,
        g = i * i * i;
        mu3 = e * e * e;
        return f(Math.round(g * a.x + 
        3 * e * i * i * b.x + 3 * e * e * i * c.x + mu3 * d.x), Math.round(g * a.y + 3 * e * i * i * b.y + 3 * e * e * i * c.y + mu3 * d.y))
    },
    f = function(a, b) {
        return {
            x: a,
            y: b
        }
    },
    o = function(a, b, c) {
        return G && c ? " translate3d(" + a + "px," + b + "px, 0px) ": " translate(" + a + "px, " + b + "px) "
    },
    q = function(a) {
        return " rotate(" + a + "deg) "
    },
    j = {
        init: function(a) {
            var b,
            c,
            d = this.data();
            c = this.children();
            var e = c.length,
            a = h.extend({
                width: this.width(),
                height: this.height()
            },
            L, a);
            d.opt = a;
            d.pageObjs = {};
            d.pages = {};
            d.pageWrap = {};
            d.pagePlace = {};
            d.pageMv = [];
            d.totalPages = e;
            this.css({
                position: "relative"
            });
            G && !u && a.acceleration && this.transform(o(0, 0, !0));
            for (b = 1; b <= e; b++) d.pagePlace[b] = b,
            d.pageObjs[b] = h(c[b - 1]).addClass("turn-page p" + b),
            d.pageWrap[b] = h("<div/>", {
                "class": "turn-page-wrapper",
                css: {
                    position: "absolute"
                }
            }).attr("page", b).appendTo(this).prepend(d.pageObjs[b]);
            for (b = 1; b <= e; b++) c = b % 2 == 0,
            d.pages[b] = d.pageWrap[b].css(c ? {
                top: 0,
                left: 0
            }: {
                top: 0,
                right: 0
            }).children(":first").flip({
                next: c ? b - 1: b + 1,
                page: b,
                turn: this,
                duration: a.duration,
                acceleration: a.acceleration,
                corners: c ? "backward": "forward",
                back: c ? d.pageObjs[b - 
                1] : d.pageObjs[b + 1],
                backShadow: a.shadows && b != 2 && b != e - 1,
                frontShadow: a.shadows
            }).bind("pressed", j._pressed).bind("released", j._released).bind("start", j._start).bind("end", j._end).bind("flip", j._flip);
            j.page.call(this, a.page);
            d.done = !0;
            this.turn("size", a.width, a.height);
            return this
        },
        size: function(a, b) {
            if (a && b) {
                var c = this.data(),
                d = a / 2,
                e;
                this.css({
                    width: a,
                    height: b
                });
                for (e = 1; e <= c.totalPages; e++) c.pageWrap[e].css({
                    width: d,
                    height: b
                }),
                c.pages[e] && c.pages[e].css({
                    width: d,
                    height: b
                });
                this.turn("resize");
                return this
            } else return {
                width: this.width(),
                height: this.height()
            }
        },
        _visiblePages: function(a) {
            a = a || this.data().page;
            return a % 2 == 0 ? [a, a + 1] : [a - 1, a]
        },
        _removeMv: function(a) {
            var b,
            c = this.data();
            for (b = 0; b < c.pageMv.length; b++) c.pageMv[b] == a && (c.pageMv.splice(b, 1), b--)
        },
        _addMv: function(a) {
            var b = this.data();
            j._removeMv.call(this, a);
            b.pageMv.push(a)
        },
        view: function(a) {
            var b = this.data(),
            a = j._visiblePages.call(this, a);
            return [b.pages[a[0]] ? a[0] : 0, b.pages[a[1]] ? a[1] : 0]
        },
        stop: function() {
            var a = this.data(),
            b;
            a.pageMv = [];
            if (a.tpage) a.page = a.tpage,
            delete a.tpage;
            this.turn("update");
            for (b = 1; b <= a.totalPages; b++) {
                var c = a.pages[b].data().pageFlip.opt;
                a.pages[b].flip("hideThumbIndex");
                g._moveBackPage.call(a.pages[b], null);
                a.pagePlace[c.next] = c.next;
                if (c.force) c.next = c.page % 2 == 0 ? c.page - 1: c.page + 1,
                a.pages[b].flip("setBackPage", a.pageObjs[c.next]),
                delete c.force
            }
            return this
        },
        page: function(a) {
            var b = this.data(),
            c = this.turn("view");
            if (pg = b.pages[a]) if (!b.done || (!c[0] || a >= c[0]) && (!c[1] || a <= c[1])) b.tpage = a,
            this.turn("stop"),
            this.trigger("turned", [a, pg]);
            else {
                b.tpage = 
                a;
                this.turn("stop");
                var d,
                e,
                i = this.turn("view", a);
                c[1] && a > c[1] ? (d = c[1], e = i[0]) : c[0] && a < c[0] && (d = c[0], e = i[1]);
                a = b.pages[d].data().pageFlip.opt;
                b.tpage = e;
                if (a.next != e) a.next = e,
                b.pagePlace[a.next] = a.page,
                a.force = !0,
                g._moveBackPage.call(b.pages[d], !1),
                b.pages[d].flip("setBackPage", b.pageObjs[e]);
                b.pages[d].flip("turnPage")
            } else return c[0] || c[1];
            return this
        },
        next: function() {
            j._moveTo.call(this, 1);
            return this
        },
        previous: function() {
            j._moveTo.call(this, -1);
            return this
        },
        _moveTo: function(a) {
            var b,
            c = this.data(),
            d = j._visiblePages.call(this, c.tpage || c.page)[a == 1 ? 1: 0],
            a = d + a,
            e = function(a) {
                return c.pages[a].data().pageFlip
            };
            for (b = 0; b < c.pageMv.length; b++) if (e(c.pageMv[b]).opt.force) {
                this.turn("stop");
                break
            }
            if (c.pages[a] && c.pages[a]) if (c.pages[a].flip("moving") || c.pagePlace[d] == a) b = e(a).opt,
            j._removeMv.call(this, b.pageMv),
            j._addMv.call(this, d),
            c.tpage = a,
            b.pageMv = d,
            c.pages[a].flip("hideThumbIndex", !0),
            c.pages[d].trigger("flip"),
            this.turn("update");
            else {
                c.tpage = a;
                if (e(d).fwrapper.is(":visible")) b = e(d).opt,
                j._removeMv.call(this, 
                b.pageMv),
                j._addPage.call(c.pages[d]);
                c.pages[d].flip("turnPage")
            }
        },
        _addPage: function() {
            var a = h(this).data().pageFlip.opt,
            b = a.turn,
            c = b.data();
            a.pageMv = a.page;
            j._addMv.call(b, a.pageMv);
            c.pagePlace[a.next] = a.page;
            b.turn("update")
        },
        _start: function(a) {
            var b = h(this).data().pageFlip.opt;
            a.stopPropagation();
            j._addPage.call(this);
            b.turn.trigger("start", [b.page])
        },
        _end: function(a, b) {
            a.stopPropagation();
            var c = h(this),
            d = c.data().pageFlip.opt,
            e = d.turn,
            i = e.data();
            if (b || i.tpage) {
                if (i.tpage == d.next || i.pageMv.length == 
                0) i.page = i.tpage || d.next,
                delete i.tpage,
                e.turn("page", i.page);
                if (d.force) d.next = d.page % 2 == 0 ? d.page - 1: d.page + 1,
                c.flip("setBackPage", e.data().pageObjs[d.next]),
                delete d.force
            } else j._removeMv.call(e, d.pageMv),
            e.turn("update");
            e.trigger("end", [d.page, this])
        },
        resize: function() {
            var a = this.data();
            for (p = 1; p <= a.totalPages; p++) a.pages[p].flip("resize", !0)
        },
        calculateZ: function(a) {
            var b = this,
            c = this.data(),
            d,
            e,
            i,
            g = c.totalPages,
            h = a.length,
            f = {
                pageZ: {},
                partZ: {},
                pageV: {}
            },
            s = function(a) {
                a = b.turn("view", a);
                a[0] && (f.pageV[a[0]] = 
                !0);
                a[1] && (f.pageV[a[1]] = !0)
            };
            i = this.turn("view");
            for (var j = i[0] || i[1], k = 0; k < h; k++) d = a[k],
            e = c.pages[d].data().pageFlip.opt.next,
            i = c.pagePlace[d],
            s(d),
            s(e),
            d = c.pagePlace[e] == e ? e: d,
            e = c.totalPages - Math.abs(j - d),
            f.pageZ[d] = e,
            f.partZ[i] = c.totalPages * 2 + Math.abs(j - d),
            d % 2 != 0 && c.pages[d - 1] ? (e -= h - 1, f.pageZ[d - 1] = e) : d % 2 == 0 && c.pages[d + 1] && (e -= d - 1, f.pageZ[d + 1] = e),
            e < g && (g = e);
            for (var m in f.pageV) f.pageZ[m] || (f.pageZ[m] = --g);
            return f
        },
        update: function() {
            var a,
            b = this.data();
            if (b.pageMv.length) {
                var c = this.turn("calculateZ", 
                b.pageMv),
                d = this.turn("view", b.tpage),
                e;
                b.pagePlace[d[0]] == d[0] ? e = d[0] : b.pagePlace[d[1]] == d[1] && (e = d[1]);
                for (a = 1; a <= b.totalPages; a++) b.pageWrap[a].css({
                    display: c.pageV[a] ? "": "none",
                    "z-index": c.pageZ[a] || 0
                }),
                b.pages[a].flip("z", c.partZ[a] || null),
                c.pageV[a] && b.pages[a].flip("resize"),
                b.tpage && b.pages[a].flip("disable", a != e)
            } else {
                d = this.turn("view");
                for (a = 1; a <= b.totalPages; a++)(c = a == d[0] || a == d[1]) ? b.pageWrap[a].css({
                    "z-index": b.totalPages,
                    display: ""
                }) : a == d[0] - 2 || a == d[1] + 2 ? b.pageWrap[a].css({
                    "z-index": b.totalPages - 
                    1,
                    display: ""
                }) : b.pageWrap[a].css({
                    "z-index": 0,
                    display: "none"
                }),
                b.pages[a].flip("z", null),
                b.pages[a].flip("disable", !c)
            }
        },
        _pressed: function() {
            var a,
            b = h(this).data().pageFlip,
            c = b.opt.page,
            b = b.opt.turn.data().pages;
            for (a in b) a != c && b[a].flip("disable", !0);
            return this.time = (new Date).getTime()
        },
        _released: function(a, b) {
            var c = h(this),
            d = (new Date).getTime() - this.time,
            e = c.data().pageFlip;
            if (d < 200 || b.x < 0 || b.x > h(this).width()) a.stopPropagation(),
            e.opt.turn.data().tpage = e.opt.next,
            e.opt.turn.turn("update"),
            h(c).flip("turnPage")
        },
        _flip: function() {
            var a = h(this).data().pageFlip.opt;
            a.turn.trigger("turning", [a.next])
        },
        disable: function(a) {
            var b = this.data(),
            a = typeof a == "undefined" ? !0: a === !0;
            for (p = 1; p <= b.totalPages; p++) b.pages[p].flip("disable", a)
        }
    },
    g = {
        init: function(a) {
            if (a.shadows) a.frontShadow = !0,
            a.backShadow = !0;
            g.setData.call(this, {
                opt: h.extend({},
                M, a)
            });
            g._addEvents.call(this);
            g._addPageWrapper.call(this);
            return this
        },
        setData: function(a) {
            var b = this.data();
            b.pageFlip = h.extend(b.pageFlip || {},
            a)
        },
        _cAllowed: function() {
            return K[this.data().pageFlip.opt.corners] || 
            this.data().pageFlip.opt.corners
        },
        _cornerActivated: function(a) {
            var a = u ? a.originalEvent.touches: [a],
            b;
            b = this.data().pageFlip;
            var c = b.parent.offset(),
            d = this.width(),
            e = this.height(),
            i = Math.max(0, a[0].pageX - c.left),
            a = Math.max(0, a[0].pageY - c.top),
            f = b.opt.cornerSize,
            c = g._cAllowed.call(this);
            if (!b.opt.back || i <= 0 || a <= 0 || i >= d || a >= e) b = !1;
            else if (i <= f && a <= f) b = "tl";
            else if (i >= d - f && a <= f) b = "tr";
            else if (i <= f && a >= e - f) b = "bl";
            else if (i >= d - f && a >= e - f) b = "br";
            else return ! 1;
            return jQuery.inArray(b, c) != -1 ? {
                corner: b,
                x: i,
                y: a
            }: !1
        },
        _c: function(a, b) {
            b = b || 0;
            return {
                tl: f(b, b),
                tr: f(this.width() - b, b),
                bl: f(b, this.height() - b),
                br: f(this.width() - b, this.height() - b)
            } [a]
        },
        _c2: function(a) {
            return {
                tl: f(this.width() * 2, 0),
                tr: f( - this.width(), 0),
                bl: f(this.width() * 2, this.height()),
                br: f( - this.width(), this.height())
            } [a]
        },
        z: function(a) {
            var b = this.data().pageFlip;
            b.opt["z-index"] = a;
            b.fwrapper.css({
                "z-index": a || parseInt(b.parent.css("z-index")) || 0
            })
        },
        resize: function(a) {
            var b = this.data().pageFlip,
            c = this.width(),
            d = this.height(),
            e = Math.round(Math.sqrt(Math.pow(c, 
            2) + Math.pow(d, 2)));
            a && (b.wrapper.css({
                width: e,
                height: e
            }), b.fwrapper.css({
                width: e,
                height: e
            }).children(":first-child").css({
                width: c,
                height: d
            }), b.fpage.css({
                width: d,
                height: c
            }), b.opt.frontShadow && b.ashadow.css({
                width: d,
                height: c
            }), b.opt.backShadow && b.bshadow.css({
                width: c,
                height: d
            }));
            b.parent.is(":visible") && (b.fwrapper.css({
                top: b.parent.offset().top,
                left: b.parent.offset().left
            }), b.opt.turn && b.fparent.css({
                top: -b.opt.turn.offset().top,
                left: -b.opt.turn.offset().left
            }));
            this.flip("z", b.opt["z-index"])
        },
        _addPageWrapper: function() {
            var a = 
            this.data().pageFlip,
            b = this.parent();
            if (!a.wrapper) {
                this.css("left");
                this.css("top");
                this.width();
                this.height();
                a.parent = b;
                a.fparent = a.opt.turn ? a.opt.turn.data().fparent: h("#turn-fwrappers");
                if (!a.fparent) {
                    var c = h("<div/>").hide();
                    c.data().flips = 0;
                    a.opt.turn ? (c.css(v( - a.opt.turn.offset().top, -a.opt.turn.offset().left, "auto", "visible").css).appendTo(a.opt.turn), a.opt.turn.data().fparent = c) : c.css(v(0, 0, "auto", "visible").css).attr("id", "turn-fwrappers").appendTo(h("body"));
                    a.fparent = c
                }
                this.css({
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: "auto",
                    right: "auto"
                });
                a.wrapper = h("<div/>", v(0, 0, this.css("z-index"))).appendTo(b).prepend(this);
                a.fwrapper = h("<div/>", v(b.offset().top, b.offset().left)).hide().appendTo(a.fparent);
                a.fpage = h("<div/>", {
                    css: {
                        cursor: "default"
                    }
                }).appendTo(h("<div/>", v(0, 0, 0, "visible")).appendTo(a.fwrapper));
                if (a.opt.frontShadow) a.ashadow = h("<div/>", v(0, 0, 1)).appendTo(a.fpage);
                if (a.opt.backShadow) a.bshadow = h("<div/>", v(0, 0, 1)).css({
                    position: ""
                }).appendTo(b);
                g.setData.call(this, a);
                g.resize.call(this, 
                !0)
            }
        },
        _displayCorner: function(a) {
            var b = this,
            c = 0,
            d = 0,
            e,
            i,
            h,
            j,
            E,
            s = f(0, 0),
            H = f(0, 0),
            k = f(0, 0),
            m = this.width(),
            r = this.height(),
            l = this.data().pageFlip,
            w = l.opt.acceleration,
            v = l.wrapper.height(),
            u = g._c.call(this, a.corner),
            A = a.corner.substr(0, 1) == "t",
            x = a.corner.substr(1, 1) == "l",
            C = function() {
                var n = f(u.x ? u.x - a.x: a.x, u.y ? u.y - a.y: a.y),
                y = Math.atan2(n.y, n.x),
                t;
                d = B - y;
                c = d / D * 180;
                t = f(x ? m - n.x / 2: a.x + n.x / 2, n.y / 2);
                var z = Math.max(0, Math.sin(d - Math.atan2(t.y, t.x)) * Math.sqrt(Math.pow(t.x, 2) + Math.pow(t.y, 2)));
                k = f(z * Math.sin(d), 
                z * Math.cos(d));
                if (d > B && (k.x += Math.abs(k.y * Math.tan(y)), k.y = 0, Math.round(k.x * Math.tan(D - d)) < r)) {
                    a.y = Math.sqrt(Math.pow(r, 2) + 2 * t.x * n.x);
                    if (A) a.y = r - a.y;
                    return C()
                }
                e = Math.round(k.y / Math.tan(d) + k.x);
                x && (e = m - e);
                n = x ? e: m - e;
                y = n * Math.cos(d * 2);
                t = n * Math.sin(d * 2);
                n *= Math.sin(d);
                z = g._c2.call(b, a.corner);
                z = Math.sqrt(Math.pow(z.x - a.x, 2) + Math.pow(z.y - a.y, 2));
                H = f(Math.round(e + (x ? -y: y)), Math.round(A ? t: r - t));
                E = z < m ? z / m: 1;
                if (d > B) {
                    y = D - d;
                    t = v - r / Math.sin(y);
                    s = f(Math.round(t * Math.cos(y)), Math.round(t * Math.sin(y)));
                    if (x) s.x = 
                    -s.x;
                    if (A) s.y = -s.y
                }
                if (l.opt.frontShadow) {
                    j = n > 100 ? (n - 100) / n: 0;
                    i = f(n * Math.sin(B - d) / r * 100, n * Math.cos(B - d) / m * 100);
                    if (A) i.y = 100 - i.y;
                    if (x) i.x = 100 - i.x
                }
                if (l.opt.backShadow) {
                    h = f(n * Math.sin(d) / m * 100, n * Math.cos(d) / r * 100);
                    if (!x) h.x = 100 - h.x;
                    if (!A) h.y = 100 - h.y
                }
                k.x = Math.round(k.x);
                k.y = Math.round(k.y);
                return ! 0
            },
            F = function(a, c, d, e) {
                var f = ["0", "auto"],
                g = (m - v) * d[0] / 100,
                k = (r - v) * d[1] / 100,
                d = d[0] + "% " + d[1] + "%",
                c = {
                    left: f[c[0]],
                    top: f[c[1]],
                    right: f[c[2]],
                    bottom: f[c[3]]
                };
                b.css(c).transform(q(e) + o(a.x, a.y, w), d);
                l.fpage.parent().css(c);
                l.wrapper.transform(o( - a.x + g, -a.y + k, w) + q( - e), d);
                l.fwrapper.transform(o( - a.x + s.x + g, -a.y + s.y + k, w) + q( - e), d);
                l.fpage.parent().transform(q(e) + o(a.x + H.x - s.x, a.y + H.y - s.y, w), d);
                l.opt.frontShadow && l.ashadow.css({
                    "background-image": "-webkit-gradient(linear, " + (x ? 100: 0) + "% " + (A ? 100: 0) + "%, " + i.x + "% " + i.y + "%, color-stop(" + j + ",rgba(0,0,0,0)), color-stop(" + ((1 - j) * 0.8 + j) + ",rgba(0,0,0," + 0.2 * E + ")), to(rgba(255,255,255," + 0.2 * E + ")) )"
                });
                l.opt.backShadow && l.bshadow.css({
                    "background-image": "-webkit-gradient(linear, " + 
                    (x ? 0: 100) + "% " + (A ? 0: 100) + "%, " + h.x + "% " + h.y + "%,  color-stop(0.8,rgba(0,0,0,0)), color-stop(1, rgba(0,0,0," + 0.2 * E + ")), to(rgba(0,0,0,0)) )"
                })
            };
            switch (a.corner) {
            case "tl":
                a.x = Math.max(a.x, 1);
                C();
                F(k, [1, 0, 0, 1], [100, 0], c);
                l.fpage.transform(o( - r, -m, w) + q(90 - c * 2), "100% 100%");
                l.opt.back.transform(q(90) + o(0, -r, w), "0% 0%");
                break;
            case "tr":
                a.x = Math.min(a.x, m - 1);
                C();
                F(f( - k.x, k.y), [0, 0, 0, 1], [0, 0], -c);
                l.fpage.transform(o(0, -m, w) + q( - 90 + c * 2), "0% 100%");
                l.opt.back.transform(q(270) + o( - m, 0, w), "0% 0%");
                break;
            case "bl":
                a.x = 
                Math.max(a.x, 1);
                C();
                F(f(k.x, -k.y), [1, 1, 0, 0], [100, 100], -c);
                l.fpage.transform(o( - r, 0, w) + q( - 90 + c * 2), "100% 0%");
                l.opt.back.transform(q(270) + o( - m, 0, w), "0% 0%");
                break;
            case "br":
                a.x = Math.min(a.x, m - 1),
                C(),
                F(f( - k.x, -k.y), [0, 1, 1, 0], [0, 100], c),
                l.fpage.transform(q(90 - c * 2), "0% 0%"),
                l.opt.back.transform(q(90) + o(0, -r, w), "0% 0%")
            }
            l.p = a
        },
        setBackPage: function(a) {
            var b = this.data().pageFlip;
            b.opt.back = a;
            b.backParent = a.parent()
        },
        _moveBackPage: function(a) {
            var b = this.data().pageFlip;
            if (b.opt.back) {
                var c = navigator.userAgent;
                if (c.indexOf("Chrome/17.") != -1 || c.indexOf("Chrome/18.") != -1) c = b.opt.back.css("background-image"),
                b.opt.back.css({
                    "background-image": ""
                }).css({
                    "background-image": c
                });
                if (a) {
                    if (! ((b.ashadow ? "1": "0") in b.fpage.children())) g.setData.call(this, {
                        backParent: b.opt.back.parent()
                    }),
                    b.fpage.prepend(b.opt.back)
                } else b.backParent && b.backParent.prepend(b.opt.back)
            }
        },
        _showThumbIndex: function(a, b) {
            var c = this.data(),
            d = c.pageFlip;
            if (d.opt.back) {
                if (b) {
                    var e = this,
                    c = d.p || g._c.call(this, a.corner, 1);
                    this.animatef({
                        from: [c.x, 
                        c.y],
                        to: [a.x, a.y],
                        duration: 500,
                        frame: function(b) {
                            g._displayCorner.call(e, {
                                corner: a.corner,
                                x: b[0],
                                y: b[1]
                            })
                        }
                    })
                } else g._displayCorner.call(this, a),
                c.effect && !c.effect.turning && this.animatef(!1);
                d.fwrapper.is(":visible") || (d.fparent.show().data().flips++, g._moveBackPage.call(this, !0), d.fwrapper.show(), d.opt.backShadow && d.bshadow.show(), this.trigger("start"))
            }
        },
        hide: function() {
            var a = this.data().pageFlip; --a.fparent.data().flips == 0 && a.fparent.hide();
            this.css({
                left: 0,
                top: 0,
                right: "auto",
                bottom: "auto"
            }).transform("", 
            "0% 100%");
            a.wrapper.transform("", "0% 100%");
            a.fwrapper.hide();
            a.opt.backShadow && a.bshadow.hide();
            a.opt.back.transform("", "0% 0%")
        },
        hideThumbIndex: function(a) {
            var b = this.data().pageFlip;
            if (b.p) {
                var c = this,
                d = b.p,
                e = function() {
                    b.p = null;
                    c.flip("hide");
                    c.trigger("end", [!1])
                };
                if (a) {
                    var i,
                    h,
                    j = g._c.call(this, d.corner),
                    a = d.corner.substr(0, 1) == "t",
                    o = Math.abs((d.y - j.y) / 2);
                    i = f(d.x, d.y + o);
                    h = f(j.x, a ? j.y + o: j.y - o);
                    this.animatef({
                        from: 0,
                        to: 1,
                        frame: function(a) {
                            a = I(d, i, h, j, a);
                            a.corner = d.corner;
                            g._displayCorner.call(c, 
                            a)
                        },
                        complete: e,
                        duration: 800,
                        hiding: !0
                    })
                } else this.animatef(!1),
                e()
            }
        },
        turnPage: function() {
            var a = this,
            b = this.data().pageFlip,
            c = b.cornerActivated ? b.cornerActivated.corner: g._cAllowed.call(this)[0],
            d = b.p || g._c.call(this, c),
            e = g._c2.call(this, c);
            this.trigger("flip");
            this.animatef({
                from: 0,
                to: 1,
                frame: function(b) {
                    b = I(d, d, e, e, b);
                    b.corner = c;
                    g._showThumbIndex.call(a, b)
                },
                complete: function() {
                    a.trigger("end", [!0])
                },
                duration: b.opt.duration,
                turning: !0
            });
            b.cornerActivated = null
        },
        moving: function() {
            return "effect" in this.data()
        },
        isTurning: function() {
            return this.flip("moving") && this.data().effect.turning
        },
        _addEvents: function() {
            var a = this,
            b = u ? {
                start: "touchstart",
                move: "touchmove",
                end: "touchend"
            }: {
                start: "mousedown",
                move: "mousemove",
                end: "mouseup"
            };
            h(document).bind(b.start, 
            function() {
                return g._eventStart.apply(a, arguments)
            }).bind(b.move, 
            function() {
                g._eventMove.apply(a, arguments)
            }).bind(b.end, 
            function() {
                g._eventEnd.apply(a, arguments)
            })
        },
        _eventStart: function(a) {
            var b = this.data().pageFlip;
            if (!b.disabled && !this.flip("isTurning") && 
            (b.cornerActivated = g._cornerActivated.call(this, a), b.cornerActivated)) return g._moveBackPage.call(this, !0),
            this.trigger("pressed", [b.p]),
            !1
        },
        _eventMove: function(a) {
            var b = this.data(),
            c = b.pageFlip,
            a = u ? a.originalEvent.touches: [a];
            c.disabled || (c.cornerActivated ? (b = c.parent.offset(), g._showThumbIndex.call(this, {
                corner: c.cornerActivated.corner,
                x: a[0].pageX - b.left,
                y: a[0].pageY - b.top
            })) : !b.effect && !u && ((corner = g._cornerActivated.call(this, a[0])) ? (a = g._c.call(this, corner.corner, c.opt.cornerSize / 2), g._showThumbIndex.call(this, 
            {
                corner: corner.corner,
                x: a.x,
                y: a.y
            },
            !0)) : g.hideThumbIndex.call(this, !0)))
        },
        _eventEnd: function() {
            var a = this.data().pageFlip;
            if (!a.disabled && a.cornerActivated) {
                var b = jQuery.Event("released");
                this.trigger(b, [a.p]);
                b.isPropagationStopped() || g.hideThumbIndex.call(this, !0)
            }
            a.cornerActivated = null
        },
        disable: function(a) {
            g.setData.call(this, {
                disabled: a
            })
        }
    },
    J = function(a, b, c) {
        if (!c[0] || typeof c[0] == "object") return b.init.apply(a, c);
        else if (b[c[0]] && c[0].toString().substr(0, 1) != "_") return b[c[0]].apply(a, Array.prototype.slice.call(c, 
        1));
        else throw c[0] + " is an invalid value";
    };
    h.extend(h.fn, {
        flip: function(a, b) {
            return J(this, g, arguments)
        },
        turn: function(a) {
            return J(this, j, arguments)
        },
        transform: function(a, b) {
            b && this.css({
                "transform-origin": b,
                "-moz-transform-origin": b,
                "-o-transform-origin": b,
                "-webkit-transform-origin": b,
                "-ms-transform-origin": b
            });
            return this.css({
                transform: a,
                "-moz-transform": a,
                "-o-transform": a,
                "-webkit-transform": a,
                "-ms-transform": a
            })
        },
        animatef: function(a) {
            var b = this.data();
            b.effect && clearInterval(b.effect.handle);
            if (a) {
                if (!a.to.length) a.to = [a.to];
                if (!a.from.length) a.from = [a.from];
                if (!a.easing) a.easing = function(a, b, c, d, e) {
                    return d * Math.sqrt(1 - (b = b / e - 1) * b) + c
                };
                var c,
                d = [],
                e = a.to.length,
                f = this,
                g = a.fps || 30,
                h = -g,
                j = function() {
                    var c,
                    j = [];
                    h = Math.min(a.duration, h + g);
                    for (c = 0; c < e; c++) j.push(a.easing(1, h, a.from[c], d[c], a.duration));
                    a.frame(e == 1 ? j[0] : j);
                    h == a.duration && (clearInterval(b.effect.handle), delete b.effect, f.data(b), a.complete && a.complete())
                };
                for (c = 0; c < e; c++) d.push(a.to[c] - a.from[c]);
                b.effect = a;
                b.effect.handle = 
                setInterval(j, g);
                this.data(b);
                j()
            } else delete b.effect
        }
    });
    h.has3d = G;
    h.isTouch = u
})(jQuery);