(function($,require){
    
    $(document).ready(function(){
      var content = document.getElementById("content");

        if(content !== undefined && content!== null){

        require.def("core/lib", ["core/trace"],
                function(a) {
                    var b = {},
                        c = navigator.userAgent.toLowerCase();
                    b.isFirefox = /firefox/.test(c),
                        b.isOpera = /opera/.test(c), b.isWebkit = /webkit/.test(c),
                        b.isSafari = /webkit/.test(c),
                        b.isIE = /msie/.test(c) && !/opera/.test(c),
                        b.isIE6 = /msie 6/i.test(navigator.appVersion),
                        b.browserVersion = (c.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) ||
                            [0, "0"])[1],
                        b.isIElt8 = b.isIE && b.browserVersion - 0 < 8,
                        b.extend = function d(a, c) {
                            var d = {};
                            b.append(d, a), b.append(d, c);
                            return d;
                        },
                        b.append = function(a, b) {
                            for (var c in b)
                                a[c] = b[c];
                            return a;
                        },
                        b.bind = function() {
                            var a = b.cloneArray(arguments),
                                c = a.shift(),
                                d = a.shift();
                            return function() {
                                return c.apply(d, b.arrayInsert(b.cloneArray(a), 0,
                                    arguments));
                            }
                        },
                        b.bindFixed = function() {
                            var a = b.cloneArray(arguments),
                                c = a.shift(),
                                d = a.shift();
                            return function() {
                                return c.apply(d, a);
                            }
                        },
                        b.dispatch = function(b, c, d) {
                            for (var e = 0; b && e < b.length; e++) {
                                var f = b[e];
                                if (f[c])
                                    try {
                                        f[c].apply(f, d);
                                    }
                                catch (g) {
                                    a.exception(g);
                                }
                            }
                        },
                        b.dispatch2 = function(b, c, d) {
                            for (var e = 0; e < b.length; e++) {
                                var f = b[e];
                                if (f[c]) {
                                    try {
                                        var g = f[c].apply(f, d);
                                        if (g)
                                            return g;
                                    } catch (h) {
                                        a.exception(h);
                                    }
                                }
                            }
                        };
                    var e = Object.prototype.toString,
                        f = /^\s*function(\s+[\w_$][\w\d_$]*)?\s*\(/;
                    b.isArray = function(a) {
                            return e.call(a) === "[object Array]"
                        },
                        b.isFunction = function(a) {
                            if (!a) {
                                return !1;
                            }
                            return e.call(a) === "[object Function]" || b.isIE &&
                                typeof a != "string" && f.test("" + a);
                        },
                        b.isAncestor = function(a, b) {
                            for (var c = a; c; c = c.parentNode) {
                                if (c == b)
                                    return !0;
                            }
                            return !1;
                        },
                        b.fixEvent = function(a) {
                            return jQuery.event.fix(a || window.event);
                        },
                        b.fireEvent = function(a, b) {
                            if (document.createEvent) {
                                var c = document.createEvent("Events");
                                c.initEvent(b, !0, !1);
                                return !a.dispatchEvent(c);
                            }
                        },
                        b.cancelEvent = function(a) {
                            var c = b.fixEvent(a);
                            c.stopPropagation();
                            c.preventDefault();
                        },
                        b.addEventListener = function(a, b, c, d) {
                            d = d || !1, a.addEventListener ? a.addEventListener(b, c,
                                d) : a.attachEvent("on" + b, c);
                        },
                        b.removeEventListener = function(a, b, c, d) {
                            d = d || !1, a.removeEventListener ? a.removeEventListener(
                                b, c, d) : a.detachEvent("on" + b, c);
                        },
                        b.isLeftClick = function(a) {
                            return a.button == 0 && b.noKeyModifiers(a);
                        },
                        b.noKeyModifiers = function(a) {
                            return !a.ctrlKey && !a.shiftKey && !a.altKey && !a.metaKey;
                        },
                        b.isControlClick = function(a) {
                            return a.button == 0 && b.isControl(a);
                        },
                        b.isShiftClick = function(a) {
                            return a.button == 0 && b.isShift(a);
                        },
                        b.isControl = function(a) {
                            return (a.metaKey || a.ctrlKey) && !a.shiftKey && !a.altKey;
                        },
                        b.isAlt = function(a) {
                            return a.altKey && !a.ctrlKey && !a.shiftKey && !a.metaKey;
                        },
                        b.isAltClick = function(a) {
                            return a.button == 0 && b.isAlt(a);
                        },
                        b.isControlShift = function(a) {
                            return (a.metaKey || a.ctrlKey) && a.shiftKey && !a.altKey;
                        },
                        b.isShift = function(a) {
                            return a.shiftKey && !a.metaKey && !a.ctrlKey && !a.altKey;
                        },
                        b.inflateRect = function(a, b, c) {
                            return {
                                top: a.top - c,
                                left: a.left - b,
                                height: a.height + 2 * c,
                                width: a.width + 2 * b
                            };
                        },
                        b.pointInRect = function(a, b, c) {
                            return c >= a.top && c <= a.top + a.height && b >= a.left &&
                                b <= a.left + a.width;
                        },
                        b.cloneArray = function(a, b) {
                            var c = [];
                            if (b)
                                for (var d = 0; d < a.length; ++d)
                                    c.push(b(a[d]));
                            else
                                for (var d = 0; d < a.length; ++d)
                                    c.push(a[d]);
                            return c;
                        },
                        b.arrayInsert = function(a, b, c) {
                            for (var d = 0; d < c.length; ++d)
                                a.splice(d + b, 0, c[d]);
                            return a;
                        },
                        b.remove = function(a, b) {
                            for (var c = 0; c < a.length; ++c)
                                if (a[c] == b) {
                                    a.splice(c, 1);
                                    return !0;
                                }
                            return !1;
                        },
                        b.formatSize = function(a) {
                            var b = 1;
                            b = b > 2 ? 2 : b, b = b < -1 ? -1 : b;
                            if (b == -1)
                                return a + " B";
                            var c = Math.pow(10, b);
                            return a == -1 || a == undefined ? "?" : a == 0 ? "0" : a <
                                1024 ? a + " B" : a < 1048576 ? Math.round(a / 1024 * c) /
                                c + " KB" : Math.round(a / 1048576 * c) / c + " MB";
                        },
                        b.formatTime = function(a) {
                            return a == -1 ? "-" : a < 1e3 ? a + "ms" : a < 6e4 ? Math.ceil(
                                    a / 10) / 100 + "s" : Math.ceil(a / 6e4 * 100) /
                                100 + "m";
                        },
                        b.formatNumber = function(a) {
                            a += "";
                            var b = a.split("."),
                                c = b[0],
                                d = b.length > 1 ? "." + b[1] : "",
                                e = /(\d+)(\d{3})/;
                            while (e.test(c))
                                c = c.replace(e, "$1 $2");
                            return c + d;
                        },
                        b.formatString = function(a) {
                            var c = b.cloneArray(arguments),
                                a = c.shift();
                            for (var d = 0; d < c.length; d++) {
                                var e = c[d].toString();
                                a = a.replace("%S", e)
                            }
                            return a;
                        },
                        b.parseISO8601 = function(a) {
                            var c = b.fromISOString(a);
                            return c ? c.getTime() : null;
                        },
                        b.fromISOString = function(a) {
                            if (!a)
                                return null;
                            var b =
                                /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/,
                                c = new RegExp(b),
                                d = a.toString().match(new RegExp(b));
                            if (!d)
                                return null;
                            var e = new Date;
                            e.setUTCDate(1),
                                e.setUTCFullYear(parseInt(d[1], 10)),
                                e.setUTCMonth(parseInt(d[3], 10) - 1),
                                e.setUTCDate(parseInt(d[5], 10)),
                                e.setUTCHours(parseInt(d[7], 10)),
                                e.setUTCMinutes(parseInt(d[9], 10)),
                                e.setUTCSeconds(parseInt(d[11], 10)),
                                d[12] ? e.setUTCMilliseconds(parseFloat(d[12]) * 1e3) :
                                e.setUTCMilliseconds(0);
                            if (d[13] != "Z") {
                                var f = d[15] * 60 + parseInt(d[17], 10);
                                f *= d[14] == "-" ? -1 : 1,
                                    e.setTime(e.getTime() - f * 60 * 1e3);
                            }
                            return e;
                        },
                        b.toISOString = function(a) {
                            function b(a, b) {
                                b || (b = 2);
                                var c = new String(a);
                                while (c.length < b)
                                    c = "0" + c;
                                return c;
                            }
                            var c = a.getUTCFullYear() + "-" + b(a.getMonth() + 1) +
                                "-" + b(a.getDate()) + "T" + b(a.getHours()) + ":" + b(
                                    a.getMinutes()) + ":" + b(a.getSeconds()) + "." + b(
                                    a.getMilliseconds(), 3),
                                d = a.getTimezoneOffset(),
                                e = Math.floor(d / 60),
                                f = Math.floor(d % 60),
                                g = (d > 0 ? "-" : "+") + b(Math.abs(e)) + ":" + b(Math
                                    .abs(f));
                            return c + g;
                        },
                        b.getFileName = function(c) {
                            try {
                                var d = b.splitURLBase(c);
                                return d.name;
                            } catch (e) {
                                a.log(unescape(c));
                            }
                            return c;
                        },
                        b.getFileExtension = function(a) {
                            if (!a)
                                return null;
                            var b = a.indexOf("?");
                            b != -1 && (a = a.substr(0, b));
                            var c = a.lastIndexOf(".");
                            return a.substr(c + 1);
                        },
                        b.splitURLBase = function(a) {
                            if (b.isDataURL(a))
                                return b.splitDataURL(a);
                            return b.splitURLTrue(a);
                        },
                        b.isDataURL = function(a) {
                            return a && a.substr(0, 5) == "data:";
                        },
                        b.splitDataURL = function(a) {
                            var c = a.indexOf(":", 3);
                            if (c != 4)
                                return !1;
                            var d = a.indexOf(",", c + 1);
                            if (d < c)
                                return !1;
                            var e = {
                                    encodedContent: a.substr(d + 1)
                                },
                                f = a.substr(c + 1, d),
                                g = f.split(";");
                            for (var h = 0; h < g.length; h++) {
                                var i = g[h].split("=");
                                i.length == 2 && (e[i[0]] = i[1])
                            }
                            if (e.hasOwnProperty("fileName")) {
                                var j = decodeURIComponent(e.fileName),
                                    k = b.splitURLTrue(j);
                                if (e.hasOwnProperty("baseLineNumber")) {
                                    e.path = k.path,
                                        e.line = e.baseLineNumber;
                                    var l = decodeURIComponent(e.encodedContent.substr(
                                        0, 200)).replace(/\s*$/, "");
                                    e.name = "eval->" + l;
                                } else {
                                    e.name = k.name;
                                    e.path = k.path;
                                }
                            } else {
                                e.hasOwnProperty("path") || (e.path = "data:");
                                e.hasOwnProperty("name") || (e.name =
                                    decodeURIComponent(e.encodedContent.substr(0,
                                        200)).replace(/\s*$/, ""));
                            }
                            return e;
                        },
                        b.splitURLTrue = function(a) {
                            var b = /:\/{1,3}(.*?)\/([^\/]*?)\/?($|\?.*)/,
                                c = b.exec(a);
                            return c ? c[2] ? {
                                path: c[1],
                                name: c[2] + c[3]
                            } : {
                                path: c[1],
                                name: c[1]
                            } : {
                                name: a,
                                path: a
                            };
                        },
                        b.getURLParameter = function(a) {
                            var b = window.location.search.substring(1),
                                c = b.split("&");
                            for (var d = 0; d < c.length; d++) {
                                var e = c[d].split("=");
                                if (e[0] == a)
                                    return unescape(e[1])
                            }

                            return null;
                        },
                        b.getURLParameters = function(a) {
                            var b = [],
                                c = window.location.search.substring(1),
                                d = c.split("&");

                            for (var e = 0; e < d.length; e++) {
                                var f = d[e].split("=");
                                f[0] == a && b.push(unescape(f[1]))
                            }
                            return b;
                        },
                        b.parseURLParams = function(a) {
                            var c = a ? a.indexOf("?") : -1;
                            if (c == -1)
                                return [];
                            var d = a.substr(c + 1),
                                e = d.lastIndexOf("#");
                            e != -1 && (d = d.substr(0, e));
                            if (!d)
                                return [];
                            return b.parseURLEncodedText(d);
                        },
                        b.parseURLEncodedText = function(a, c) {
                            function f(a) {
                                try {
                                    return decodeURIComponent(a);
                                } catch (b) {
                                    return decodeURIComponent(unescape(a));
                                }
                            }
                            var d = 25e3,
                                e = [];

                            if (a == "")
                                return e;
                            a = a.replace(/\+/g, " ");
                            var g = a.split("&");
                            for (var h = 0; h < g.length; ++h)
                                try {
                                    var i = g[h].indexOf("=");
                                    if (i != -1) {
                                        var j = g[h].substring(0, i),
                                            k = g[h].substring(i + 1);
                                        k.length > d && !c && (k = b.$STR("LargeData")),
                                            e.push({
                                                name: f(j),
                                                value: f(k)
                                            })
                                    } else {
                                        var j = g[h];
                                        e.push({
                                            name: f(j),
                                            value: ""
                                        })
                                    }
                                }
                            catch (l) {}
                            e.sort(function(a, b) {
                                return a.name <= b.name ? -1 : 1
                            });
                            return e;
                        },
                        b.getBody = function(a) {
                            if (a.body)
                                return a.body;
                            var b = a.getElementsByTagName("body")[0];
                            if (b)
                                return b;
                            return null;
                        },
                        b.getHead = function(a) {
                            return a.getElementsByTagName("head")[0];
                        },
                        b.getAncestorByClass = function(a, c) {
                            for (var d = a; d; d = d.parentNode)
                                if (b.hasClass(d, c))
                                    return d;
                            return null;
                        },
                        b.$ = function() {
                            return b.getElementByClass.apply(this, arguments);
                        },
                        b.getElementByClass = function(a, c) {
                            if (!a)
                                return null;
                            var d = b.cloneArray(arguments);
                            d.splice(0, 1);
                            for (var e = a.firstChild; e; e = e.nextSibling) {
                                var f = b.cloneArray(d);
                                f.unshift(e);
                                if (b.hasClass.apply(this, f))
                                    return e;
                                var g = b.getElementByClass.apply(this, f);
                                if (g) return g;
                            }
                            return null;
                        },
                        b.getElementsByClass = function(a, c) {
                            function f(a, c, d) {
                                for (var e = a.firstChild; e; e = e.nextSibling) {
                                    var g = b.cloneArray(c);
                                    g.unshift(e), b.hasClass.apply(null, g) && d.push(e),
                                        f(e, c, d)
                                }
                            }
                            if (a.querySelectorAll) {
                                var d = b.cloneArray(arguments);
                                d.shift();
                                var e = "." + d.join(".");
                                return a.querySelectorAll(e);
                            }
                            var g = [],
                                d = b.cloneArray(arguments);
                            d.shift(),
                                f(a, d, g);
                            return g;
                        },
                        b.getChildByClass = function(a) {
                            for (var c = 1; c < arguments.length; ++c) {
                                var d = arguments[c],
                                    e = a.firstChild;
                                a = null;
                                for (; e; e = e.nextSibling)
                                    if (b.hasClass(e, d)) {
                                        a = e;
                                        break;
                                    }
                            }
                            return a;
                        },
                        b.eraseNode = function(a) {
                            while (a.lastChild)
                                a.removeChild(a.lastChild);
                        },
                        b.clearNode = function(a) {
                            a.innerHTML = "";
                        },
                        b.hasClass = function(a, b) {
                            if (a && a.nodeType == 1) {
                                for (var c = 1; c < arguments.length; ++c) {
                                    var b = arguments[c],
                                        d = a.className;
                                    if (!d || d.indexOf(b + " ") == -1)
                                        return !1;
                                }
                                return !0;
                            }
                            return !1;
                        },
                        b.setClass = function(a, c) {
                            a && !b.hasClass(a, c) && (a.className += " " + c + " ");
                        },
                        b.removeClass = function(a, b) {
                            if (a && a.className) {
                                var c = a.className.indexOf(b);
                                if (c >= 0) {
                                    var d = b.length;
                                    a.className = a.className.substr(0, c - 1) + a.className
                                        .substr(c + d);
                                }
                            }
                        },
                        b.toggleClass = function(a, c) {
                            if (b.hasClass(a, c)) {
                                b.removeClass(a, c);
                                return !1;
                            }
                            b.setClass(a, c);
                            return !0;
                        },
                        b.setClassTimed = function(a, c, d) {
                            d || (d = 1300),
                                a.__setClassTimeout ? clearTimeout(a.__setClassTimeout) :
                                b.setClass(a, c),
                                a.__setClassTimeout = setTimeout(function() {
                                    delete a.__setClassTimeout,
                                        b.removeClass(a, c)
                                }, d)
                        },
                        b.trim = function(a) {
                            return a.replace(/^\s*|\s*$/g, "");
                        },
                        b.wrapText = function(a, c) {
                            var d = /[^A-Za-z_$0-9'"-]/,
                                e = [],
                                f = 100,
                                g = b.splitLines(a);

                            for (var h = 0; h < g.length; ++h) {
                                var i = g[h];
                                while (i.length > f) {
                                    var j = d.exec(i.substr(f, 100)),
                                        k = f + (j ? j.index : 0),
                                        l = i.substr(0, k);
                                    i = i.substr(k),
                                        c || e.push("<pre>"),
                                        e.push(c ? l : b.escapeHTML(l)),
                                        c || e.push("</pre>")
                                }
                                c || e.push("<pre>"),
                                    e.push(c ? i : b.escapeHTML(i)),
                                    c || e.push("</pre>")
                            }
                            return e.join(c ? "\n" : "");
                        },
                        b.insertWrappedText = function(a, c, d) {
                            c.innerHTML = "<pre>" + b.wrapText(a, d) + "</pre>";
                        },
                        b.splitLines = function(a) {
                            var b = /\r\n|\r|\n/;
                            if (!a) return [];
                            if (a.split) return a.split(b);
                            var c = a + "",
                                d = c.split(b);
                            return d;
                        },
                        b.getPrettyDomain = function(a) {
                            var b = /[^:]+:\/{1,3}(www\.)?([^\/]+)/.exec(a);
                            return b ? b[2] : "";
                        },
                        b.escapeHTML = function(a) {
                            function b(a) {
                                switch (a) {
                                    case "<":
                                        return "&lt;";
                                    case ">":
                                        return "&gt;";
                                    case "&":
                                        return "&amp;";
                                    case "'":
                                        return "&#39;";
                                    case '"':
                                        return "&quot;";
                                }
                                return "?";
                            }
                            return String(a).replace(/[<>&"']/g, b);
                        },
                        b.cropString = function(a, c) {
                            a = a + "";
                            if (c) var d = c / 2;
                            else var d = 50;
                            return a.length > c ? b.escapeNewLines(a.substr(0, d) +
                                "..." + a.substr(a.length - d)) : b.escapeNewLines(
                                a)
                        }, b.escapeNewLines = function(a) {
                            return a.replace(/\r/g, "\\r").replace(/\n/g, "\\n")
                        }, b.cloneJSON = function(b) {
                            if (b == null || typeof b != "object") return b;
                            try {
                                var c = b.constructor();
                                for (var d in b) c[d] = cloneJSON(b[d]);
                                return c
                            } catch (e) {
                                a.exception(b)
                            }
                            return null
                        }, b.getOverflowParent = function(a) {
                            for (var b = a.parentNode; b; b = b.offsetParent)
                                if (b.scrollHeight > b.offsetHeight) return b
                        }, b.getElementBox = function(a) {
                            var c = {};
                            if (a.getBoundingClientRect) {
                                var d = a.getBoundingClientRect(),
                                    e = b.isIE ? document.body.clientTop || document.documentElement
                                    .clientTop : 0,
                                    f = b.getWindowScrollPosition();
                                c.top = Math.round(d.top - e + f.top), c.left = Math.round(
                                    d.left - e + f.left), c.height = Math.round(d.bottom -
                                    d.top), c.width = Math.round(d.right - d.left)
                            } else {
                                var g = b.getElementPosition(a);
                                c.top = g.top, c.left = g.left, c.height = a.offsetHeight,
                                    c.width = a.offsetWidth
                            }
                            return c
                        }, b.getElementPosition = function(a) {
                            var b = 0,
                                c = 0;
                            do b += a.offsetLeft, c += a.offsetTop; while (a = a.offsetParent);
                            return {
                                left: b,
                                top: c
                            }
                        }, b.getWindowSize = function() {
                            var a = 0,
                                b = 0,
                                c;
                            typeof window.innerWidth == "number" ? (a = window.innerWidth,
                                    b = window.innerHeight) : (c = document.documentElement) &&
                                (c.clientHeight || c.clientWidth) ? (a = c.clientWidth,
                                    b = c.clientHeight) : (c = document.body) && (c.clientHeight ||
                                    c.clientWidth) && (a = c.clientWidth, b = c.clientHeight);
                            return {
                                width: a,
                                height: b
                            }
                        }, b.getWindowScrollSize = function() {
                            var a = 0,
                                c = 0,
                                d;
                            !b.isIEQuiksMode && (d = document.documentElement) && (d.scrollHeight ||
                                    d.scrollWidth) && (a = d.scrollWidth, c = d.scrollHeight),
                                (d = document.body) && (d.scrollHeight || d.scrollWidth) &&
                                (d.scrollWidth > a || d.scrollHeight > c) && (a = d.scrollWidth,
                                    c = d.scrollHeight);
                            return {
                                width: a,
                                height: c
                            }
                        }, b.getWindowScrollPosition = function() {
                            var a = 0,
                                b = 0,
                                c;
                            typeof window.pageYOffset == "number" ? (a = window.pageYOffset,
                                b = window.pageXOffset) : (c = document.body) && (c
                                .scrollTop || c.scrollLeft) ? (a = c.scrollTop, b =
                                c.scrollLeft) : (c = document.documentElement) && (
                                c.scrollTop || c.scrollLeft) && (a = c.scrollTop, b =
                                c.scrollLeft);
                            return {
                                top: a,
                                left: b
                            }
                        }, b.scrollIntoCenterView = function(a, c, d, e) {
                            if (a) {
                                c || (c = b.getOverflowParent(a));
                                if (!c) return;
                                var f = b.getClientOffset(a);
                                if (!e) {
                                    var g = f.y - c.scrollTop,
                                        h = c.scrollTop + c.clientHeight - (f.y + a.offsetHeight);
                                    if (g < 0 || h < 0) {
                                        var i = f.y - c.clientHeight / 2;
                                        c.scrollTop = i
                                    }
                                }
                                if (!d) {
                                    var j = f.x - c.scrollLeft,
                                        k = c.scrollLeft + c.clientWidth - (f.x + a.clientWidth);
                                    if (j < 0 || k < 0) {
                                        var l = f.x - c.clientWidth / 2;
                                        c.scrollLeft = l
                                    }
                                }
                            }
                        }, b.getClientOffset = function(a) {
                            function b(a, c, d) {
                                var e = a.offsetParent,
                                    f = d.getComputedStyle(a, "");
                                a.offsetLeft && (c.x += a.offsetLeft + parseInt(f.borderLeftWidth)),
                                    a.offsetTop && (c.y += a.offsetTop + parseInt(f.borderTopWidth)),
                                    e ? e.nodeType == 1 && b(e, c, d) : a.ownerDocument
                                    .defaultView.frameElement && b(a.ownerDocument.defaultView
                                        .frameElement, c, a.ownerDocument.defaultView)
                            }
                            var c = {
                                x: 0,
                                y: 0
                            };
                            if (a) {
                                var d = a.ownerDocument.defaultView;
                                b(a, c, d)
                            }
                            return c
                        }, b.addStyleSheet = function(a, c) {
                            if (!a.getElementById(c)) {
                                var d = a.createElement("link");
                                d.type = "text/css", d.rel = "stylesheet", d.href = c,
                                    d.setAttribute("id", c);
                                var e = b.getHead(a);
                                e.appendChild(d)
                            }
                        }, b.selectElementText = function(a, b, c) {
                            var d = window,
                                e = d.document;
                            if (d.getSelection && e.createRange) {
                                var f = d.getSelection(),
                                    g = e.createRange();
                                g.setStart(a, b), g.setEnd(a, c), f.removeAllRanges(),
                                    f.addRange(g)
                            } else e.body.createTextRange && (g = e.body.createTextRange(),
                                g.moveToElementText(a), g.select())
                        };
                    return b
                }), require.def("core/cookies", ["core/lib"], function(a) {
                var b = {
                    getCookie: function(b) {
                        var c = document.cookie.split(";");
                        for (var d = 0; d < c.length; d++) {
                            var e = c[d].split("=");
                            if (a.trim(e[0]) == b) return e[1].length ?
                                unescape(a.trim(e[1])) : null
                        }
                    },
                    setCookie: function(a, b, c, d, e, f) {
                        var g = new Date;
                        g.setTime(g.getTime()), c && (c = c * 1e3 * 60 * 60 *
                            24);
                        var h = new Date(g.getTime() + c);
                        document.cookie = a + "=" + escape(b) + (c ?
                            ";expires=" + h.toGMTString() : "") + (d ?
                            ";path=" + d : "") + (e ? ";domain=" + e :
                            "") + (f ? ";secure" : "")
                    },
                    removeCookie: function(a, b, c) {
                        this.getCookie(a) && (document.cookie = a + "=" + (
                                b ? ";path=" + b : "") + (c ?
                                ";domain=" + c : "") +
                            ";expires=Thu, 01-Jan-1970 00:00:01 GMT")
                    },
                    toggleCookie: function(a) {
                        var b = this.getBooleanCookie(a);
                        this.setCookie(a, !b)
                    },
                    getBooleanCookie: function(a) {
                        var b = this.getCookie(a);
                        return !b || b == "false" ? !1 : !0
                    }
                };
                return b
            }),
            function() {
                function c(a, b, c, d, e) {
                    var f = d + b + "/" + e;
                    require._fileExists(a.nameToUrl(f, null)) && c.push(f)
                }

                function b(a, b, c, d, e, f) {
                    b[a] && (c.push(a), (b[a] === !0 || b[a] === 1) && d.push(e + a +
                        "/" + f))
                }
                var a = /(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/;
                define("i18n", {
                    version: "0.24.0",
                    load: function(d, e, f, g) {
                        g = g || {};
                        var h, i = a.exec(d),
                            j = i[1],
                            k = i[4],
                            l = i[5],
                            m = k.split("-"),
                            n = [],
                            o = {},
                            p, q, r = "";
                        i[5] ? (j = i[1], h = j + l) : (h = d, l = i[4], k =
                            g.locale || (g.locale = typeof navigator ===
                                "undefined" ? "root" : (navigator.language ||
                                    navigator.userLanguage || "root").toLowerCase()
                            ), m = k.split("-"));
                        if (g.isBuild) {
                            n.push(h), c(e, "root", n, j, l);
                            for (p = 0; q = m[p]; p++) r += (r ? "-" : "") +
                                q, c(e, r, n, j, l);
                            e(n), f()
                        } else e([h], function(a) {
                            var c = [];
                            b("root", a, c, n, j, l);
                            for (p = 0; q = m[p]; p++) r += (r ?
                                "-" : "") + q, b(r, a, c, n, j,
                                l);
                            e(n, function() {
                                var b, d;
                                for (b = c.length - 1; b >
                                    -1 && (q = c[b]); b--) {
                                    d = a[q];
                                    if (d === !0 || d ===
                                        1) d = e(j + q +
                                        "/" + l);
                                    require.mixin(o, d)
                                }
                                f(o)
                            })
                        })
                    }
                })
            }(), define("nls/requestList", {
                root: {
                    fromCache: "From Cache",
                    menuBreakLayout: "Break Timeline Layout",
                    menuOpenRequestInWindow: "Open Request in New Window",
                    menuOpenResponseInWindow: "Open Response in New Window",
                    request: "Request",
                    requests: "Requests",
                    tooltipSize: "%S (%S bytes)",
                    tooltipZippedSize: "%S (%S bytes) - compressed",
                    tooltipUnzippedSize: "%S (%S bytes) - uncompressed",
                    unknownSize: "Unknown size",
                    "request.Started": "Request start time since the beginning",
                    "request.phases.label": "Request phases start and elapsed time relative to the request start:",
                    "request.phase.Resolving": "DNS Lookup",
                    "request.phase.Connecting": "Connecting",
                    "request.phase.Blocking": "Blocking",
                    "request.phase.Sending": "Sending",
                    "request.phase.Waiting": "Waiting",
                    "request.phase.Receiving": "Receiving",
                    "request.timings.label": "Event timing relative to the request start:",
                    ContentLoad: "DOM Loaded",
                    WindowLoad: "Page Loaded",
                    "page.event.Load": "Page Loaded",
                    menuBreakTimeline: "Break Timeline Layout",
                    menuOpenRequest: "Open Request in New Window",
                    menuOpenResponse: "Open Response in New Window"
                }
            }), require.def("preview/jsonSchema", [], function() {
                var a = {
                    validate: function(a, b) {
                        return this._validate(a, b, !1)
                    },
                    checkPropertyChange: function(a, b, c) {
                        return this._validate(a, b, c || "property")
                    },
                    _validate: function(a, b, c) {
                        function f(a, b, f, g) {
                            if (typeof b == "object") {
                                (typeof a != "object" || a instanceof Array) &&
                                d.push({
                                    property: f,
                                    message: "an object is required"
                                });
                                for (var h in b)
                                    if (b.hasOwnProperty(h) && (h.charAt(0) !=
                                            "_" || h.charAt(1) != "_")) {
                                        var i = a[h],
                                            j = b[h];
                                        e(i, j, f, h)
                                    }
                            }
                            for (h in a) {
                                a.hasOwnProperty(h) && (h.charAt(0) != "_" ||
                                        h.charAt(1) != "_") && b && !b[h] &&
                                    g === !1 && d.push({
                                        property: f,
                                        message: typeof i +
                                            "The property " + h +
                                            " is not defined in the schema and the schema does not allow additional properties"
                                    });
                                var k = b && b[h] && b[h].requires;
                                k && !(k in a) && d.push({
                                        property: f,
                                        message: "the presence of the property " +
                                            h + " requires that " + k +
                                            " also be present"
                                    }), i = a[h], b && typeof b == "object" &&
                                    !(h in b) && e(i, g, f, h), !c && i &&
                                    i.$schema && (d = d.concat(e(i, i.$schema,
                                        f, h)))
                            }
                            return d
                        }

                        function e(a, b, g, h) {
                            function k(a, b) {
                                if (a) {
                                    if (typeof a == "string" && a != "any" &&
                                        (a == "null" ? b !== null : typeof b !=
                                            a) && !(b instanceof Array && a ==
                                            "array") && (a != "integer" ||
                                            b % 1 !== 0)) return [{
                                        property: g,
                                        message: typeof b +
                                            " value found, but a " +
                                            a + " is required"
                                    }];
                                    if (a instanceof Array) {
                                        var c = [];
                                        for (var f = 0; f < a.length; f++)
                                            if (!(c = k(a[f], b)).length)
                                                break;
                                        if (c.length) return c
                                    } else if (typeof a == "object") {
                                        var h = d;
                                        d = [], e(b, a, g);
                                        var i = d;
                                        d = h;
                                        return i
                                    }
                                }
                                return []
                            }

                            function j(a) {
                                d.push({
                                    property: g,
                                    message: a
                                })
                            }
                            var i;
                            g += g ? typeof h == "number" ? "[" + h + "]" :
                                typeof h == "undefined" ? "" : "." + h : h;
                            if ((typeof b != "object" || b instanceof Array) &&
                                (g || typeof b != "function")) {
                                typeof b == "function" ? a instanceof b ||
                                    j(
                                        "is not an instance of the class/constructor " +
                                        b.name) : b && j(
                                        "Invalid schema/property definition " +
                                        b);
                                return null
                            }
                            c && b.readonly && j(
                                "is a readonly field, it can not be changed"
                            ), b["extends"] && e(a, b["extends"], g, h);
                            if (a === undefined) b.optional || j(
                                "is missing and it is not optional");
                            else {
                                d = d.concat(k(b.type, a)), b.disallow && !
                                    k(b.disallow, a).length && j(
                                        " disallowed value was matched");
                                if (a !== null) {
                                    if (a instanceof Array) {
                                        if (b.items)
                                            if (b.items instanceof Array)
                                                for (h = 0, i = a.length; h <
                                                    i; h++) d.concat(e(a[h],
                                                    b.items[h], g,
                                                    h));
                                            else
                                                for (h = 0, i = a.length; h <
                                                    i; h++) d.concat(e(a[h],
                                                    b.items, g, h));
                                        b.minItems && a.length < b.minItems &&
                                            j("There must be a minimum of " +
                                                b.minItems +
                                                " in the array"), b.maxItems &&
                                            a.length > b.maxItems && j(
                                                "There must be a maximum of " +
                                                b.maxItems +
                                                " in the array")
                                    } else b.properties && d.concat(f(a, b.properties,
                                        g, b.additionalProperties));
                                    b.pattern && typeof a == "string" && !a
                                        .match(b.pattern) && j(
                                            "does not match the regex pattern " +
                                            b.pattern), b.maxLength &&
                                        typeof a == "string" && a.length >
                                        b.maxLength && j("may only be " + b
                                            .maxLength + " characters long"
                                        ), b.minLength && typeof a ==
                                        "string" && a.length < b.minLength &&
                                        j("must be at least " + b.minLength +
                                            " characters long"), typeof b.minimum !==
                                        undefined && typeof a == typeof b.minimum &&
                                        b.minimum > a && j(
                                            "must have a minimum value of " +
                                            b.minimum), typeof b.maximum !==
                                        undefined && typeof a == typeof b.maximum &&
                                        b.maximum < a && j(
                                            "must have a maximum value of " +
                                            b.maximum);
                                    if (b["enum"]) {
                                        var l = b["enum"];
                                        i = l.length;
                                        var m;
                                        for (var n = 0; n < i; n++)
                                            if (l[n] === a) {
                                                m = 1;
                                                break
                                            }
                                        m || j(
                                            "does not have a value in the enumeration " +
                                            l.join(", "))
                                    }
                                    typeof b.maxDecimal == "number" && a.toString()
                                        .match(new RegExp("\\.[0-9]{" + (b.maxDecimal +
                                            1) + ",}")) && j(
                                            "may only have " + b.maxDecimal +
                                            " digits of decimal places")
                                }
                            }
                            return null
                        }
                        var d = [];
                        b && e(a, b, "", c || ""), !c && a && a.$schema &&
                            e(a, a.$schema, "", "");
                        return {
                            valid: !d.length,
                            errors: d
                        }
                    }
                };
                return a
            }), require.def("preview/ref", ["core/lib"], function(a) {
                var b = {
                    resolveJson: function(b, c) {
                        function n(o, p, q, r, s) {
                            var t, u, v = d in o ? o[d] : q;
                            v !== undefined && (v = (e + v).replace(k,
                                "$2$3"));
                            var w = s || o;
                            if (v !== undefined) {
                                f && (o.__id = v), c.schemas && !(o instanceof Array) &&
                                    (u = v.match(/^(.+\/)[^\.\[]*$/)) && (r =
                                        c.schemas[u[1]]);
                                if (g[v] && o instanceof Array == g[v] instanceof Array)
                                    w = g[v], delete w.$ref, t = !0;
                                else {
                                    var x = r && r.prototype;
                                    x && (m.prototype = x, w = new m)
                                }
                                g[v] = w, h && (h[v] = c.time)
                            }
                            var y = r && r.properties,
                                z = o.length;
                            for (var A in o) {
                                if (A == z) break;
                                if (o.hasOwnProperty(A)) {
                                    u = o[A];
                                    var B = y && y[A];
                                    if (B && B.format == "date-time" &&
                                        typeof u == "string") u = a.fromISOString(
                                        u);
                                    else if (typeof u == "object" && u && !
                                        (u instanceof Date)) {
                                        i = u.$ref;
                                        if (i) {
                                            delete o[A];
                                            var C = i.replace(
                                                /(#)([^\.\[])/, "$1.$2"
                                            ).match(
                                                /(^([^\[]*\/)?[^#\.\[]*)#?([\.\[].*)?/
                                            );
                                            if (i = C[1] == "$" || C[1] ==
                                                "this" || C[1] == "" ? b :
                                                g[(e + C[1]).replace(k,
                                                    "$2$3")]) C[3] && C[3].replace(
                                                /(\[([^\]]+)\])|(\.?([^\.\[]+))/g,
                                                function(a, b, c, d, e) {
                                                    i = i && i[c ? c.replace(
                                                        /[\"\'\\]/,
                                                        "") : e]
                                                });
                                            if (i) u = i;
                                            else if (p) u = n(u, !1, u.$ref,
                                                B), u._loadObject = c.loader;
                                            else {
                                                var D;
                                                D || j.push(w), D = !0
                                            }
                                        } else p || (u = n(u, j == o, v &&
                                            l(v, A), B, w != o &&
                                            typeof w[A] == "object" &&
                                            w[A]))
                                    }
                                    o[A] = u;
                                    if (w != o && !w.__isDirty) {
                                        var E = w[A];
                                        w[A] = u, t && u !== E && !w._loadObject &&
                                            !(u instanceof Date && E instanceof Date &&
                                                u.getTime() == E.getTime()) &&
                                            (typeof u != "function" ||
                                                typeof E != "function" || u
                                                .toString() != E.toString()
                                            ) && g.onUpdate && g.onUpdate(w,
                                                A, E, u)
                                    }
                                }
                            }
                            if (t) {
                                for (A in w)
                                    if (!w.__isDirty && w.hasOwnProperty(A) &&
                                        !o.hasOwnProperty(A) && A != "__id" &&
                                        A != "__clientId" && !(w instanceof Array &&
                                            isNaN(A))) {
                                        g.onUpdate && A != "_loadObject" &&
                                            A != "_idAttr" && g.onUpdate(w,
                                                A, w[A], undefined), delete w[
                                                A];
                                        while (w instanceof Array && w.length &&
                                            w[w.length - 1] === undefined) w
                                            .length--
                                    }
                            } else g.onLoad && g.onLoad(w);
                            return w
                        }
                        c = c || {};
                        var d = c.idAttribute || "id",
                            e = c.idPrefix || "",
                            f = c.assignAbsoluteIds,
                            g = c.index || {},
                            h = c.timeStamps,
                            i, j = [],
                            k =
                            /^(.*\/)?(\w+:\/\/)|[^\/\.]+\/\.\.\/|^.*\/(\/)/,
                            l = this._addProp,
                            m = function() {};
                        b && typeof b == "object" && (b = n(b, !1, c.defaultId),
                            n(j, !1));
                        return b
                    },
                    _addProp: function(a, b) {
                        return a + (a.match(/#/) ? a.length == 1 ? "" : "." :
                            "#") + b
                    }
                };
                return b
            }), require.def("preview/harSchema", [], function() {
                function r() {}
                var a =
                    /^(\d{4})(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/,
                    b = {
                        logType: {
                            id: "logType",
                            description: "HTTP Archive structure.",
                            type: "object",
                            properties: {
                                log: {
                                    type: "object",
                                    properties: {
                                        version: {
                                            type: "string"
                                        },
                                        creator: {
                                            $ref: "creatorType"
                                        },
                                        browser: {
                                            $ref: "browserType"
                                        },
                                        pages: {
                                            type: "array",
                                            optional: !0,
                                            items: {
                                                $ref: "pageType"
                                            }
                                        },
                                        entries: {
                                            type: "array",
                                            items: {
                                                $ref: "entryType"
                                            }
                                        },
                                        comment: {
                                            type: "string",
                                            optional: !0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    c = {
                        creatorType: {
                            id: "creatorType",
                            description: "Name and version info of the log creator app.",
                            type: "object",
                            properties: {
                                name: {
                                    type: "string"
                                },
                                version: {
                                    type: "string"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    d = {
                        browserType: {
                            id: "browserType",
                            description: "Name and version info of used browser.",
                            type: "object",
                            optional: !0,
                            properties: {
                                name: {
                                    type: "string"
                                },
                                version: {
                                    type: "string"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    e = {
                        pageType: {
                            id: "pageType",
                            description: "Exported web page",
                            optional: !0,
                            properties: {
                                startedDateTime: {
                                    type: "string",
                                    format: "date-time",
                                    pattern: a
                                },
                                id: {
                                    type: "string",
                                    unique: !0
                                },
                                title: {
                                    type: "string"
                                },
                                pageTimings: {
                                    $ref: "pageTimingsType"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    f = {
                        pageTimingsType: {
                            id: "pageTimingsType",
                            description: "Timing info about page load",
                            properties: {
                                onContentLoad: {
                                    type: "number",
                                    optional: !0,
                                    min: -1
                                },
                                onLoad: {
                                    type: "number",
                                    optional: !0,
                                    min: -1
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    g = {
                        entryType: {
                            id: "entryType",
                            description: "Request and Response related info",
                            optional: !0,
                            properties: {
                                pageref: {
                                    type: "string",
                                    optional: !0
                                },
                                startedDateTime: {
                                    type: "string",
                                    format: "date-time",
                                    pattern: a
                                },
                                time: {
                                    type: "integer",
                                    min: 0
                                },
                                request: {
                                    $ref: "requestType"
                                },
                                response: {
                                    $ref: "responseType"
                                },
                                cache: {
                                    $ref: "cacheType"
                                },
                                timings: {
                                    $ref: "timingsType"
                                },
                                serverIPAddress: {
                                    type: "string",
                                    optional: !0
                                },
                                connection: {
                                    type: "string",
                                    optional: !0
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    h = {
                        requestType: {
                            id: "requestType",
                            description: "Monitored request",
                            properties: {
                                method: {
                                    type: "string"
                                },
                                url: {
                                    type: "string"
                                },
                                httpVersion: {
                                    type: "string"
                                },
                                cookies: {
                                    type: "array",
                                    items: {
                                        $ref: "cookieType"
                                    }
                                },
                                headers: {
                                    type: "array",
                                    items: {
                                        $ref: "recordType"
                                    }
                                },
                                queryString: {
                                    type: "array",
                                    items: {
                                        $ref: "recordType"
                                    }
                                },
                                postData: {
                                    $ref: "postDataType"
                                },
                                headersSize: {
                                    type: "integer"
                                },
                                bodySize: {
                                    type: "integer"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    j = {
                        recordType: {
                            id: "recordType",
                            description: "Helper name-value pair structure.",
                            properties: {
                                name: {
                                    type: "string"
                                },
                                value: {
                                    type: "string"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    k = {
                        responseType: {
                            id: "responseType",
                            description: "Monitored Response.",
                            properties: {
                                status: {
                                    type: "integer"
                                },
                                statusText: {
                                    type: "string"
                                },
                                httpVersion: {
                                    type: "string"
                                },
                                cookies: {
                                    type: "array",
                                    items: {
                                        $ref: "cookieType"
                                    }
                                },
                                headers: {
                                    type: "array",
                                    items: {
                                        $ref: "recordType"
                                    }
                                },
                                content: {
                                    $ref: "contentType"
                                },
                                redirectURL: {
                                    type: "string"
                                },
                                headersSize: {
                                    type: "integer"
                                },
                                bodySize: {
                                    type: "integer"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    l = {
                        cookieType: {
                            id: "cookieType",
                            description: "Cookie description.",
                            properties: {
                                name: {
                                    type: "string"
                                },
                                value: {
                                    type: "string"
                                },
                                path: {
                                    type: "string",
                                    optional: !0
                                },
                                domain: {
                                    type: "string",
                                    optional: !0
                                },
                                expires: {
                                    type: "string",
                                    optional: !0
                                },
                                httpOnly: {
                                    type: "boolean",
                                    optional: !0
                                },
                                secure: {
                                    type: "boolean",
                                    optional: !0
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    m = {
                        postDataType: {
                            id: "postDataType",
                            description: "Posted data info.",
                            optional: !0,
                            properties: {
                                mimeType: {
                                    type: "string"
                                },
                                text: {
                                    type: "string",
                                    optional: !0
                                },
                                params: {
                                    type: "array",
                                    optional: !0,
                                    properties: {
                                        name: {
                                            type: "string"
                                        },
                                        value: {
                                            type: "string",
                                            optional: !0
                                        },
                                        fileName: {
                                            type: "string",
                                            optional: !0
                                        },
                                        contentType: {
                                            type: "string",
                                            optional: !0
                                        },
                                        comment: {
                                            type: "string",
                                            optional: !0
                                        }
                                    }
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    n = {
                        contentType: {
                            id: "contentType",
                            description: "Response content",
                            properties: {
                                size: {
                                    type: "integer"
                                },
                                compression: {
                                    type: "integer",
                                    optional: !0
                                },
                                mimeType: {
                                    type: "string"
                                },
                                text: {
                                    type: "string",
                                    optional: !0
                                },
                                encoding: {
                                    type: "string",
                                    optional: !0
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    o = {
                        cacheType: {
                            id: "cacheType",
                            description: "Info about a response coming from the cache.",
                            properties: {
                                beforeRequest: {
                                    $ref: "cacheEntryType"
                                },
                                afterRequest: {
                                    $ref: "cacheEntryType"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    p = {
                        cacheEntryType: {
                            id: "cacheEntryType",
                            optional: !0,
                            description: "Info about cache entry.",
                            properties: {
                                expires: {
                                    type: "string",
                                    optional: "true"
                                },
                                lastAccess: {
                                    type: "string"
                                },
                                eTag: {
                                    type: "string"
                                },
                                hitCount: {
                                    type: "integer"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    q = {
                        timingsType: {
                            id: "timingsType",
                            description: "Info about request-response timing.",
                            properties: {
                                dns: {
                                    type: "integer",
                                    optional: !0,
                                    min: -1
                                },
                                connect: {
                                    type: "integer",
                                    optional: !0,
                                    min: -1
                                },
                                blocked: {
                                    type: "integer",
                                    optional: !0,
                                    min: -1
                                },
                                send: {
                                    type: "integer",
                                    min: -1
                                },
                                wait: {
                                    type: "integer",
                                    min: -1
                                },
                                receive: {
                                    type: "integer",
                                    min: -1
                                },
                                ssl: {
                                    type: "integer",
                                    optional: !0,
                                    min: -1
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    };
                r.prototype = {
                    registerType: function() {
                        var a = function(a, b) {
                                for (var c in b) b.hasOwnProperty(c) && c !=
                                    "prototype" && (a[c] = b[c])
                            },
                            b = this;
                        for (i = 0; i < arguments.length; i += 1) a(b,
                            arguments[i])
                    }
                };
                var s = new r;
                s.registerType(b, c, d, e, f, g, h, j, k, m, n, o, p, q);
                return s
            }),
            function($) {
                if (!JSON) var JSON = {};
                (function() {
                    function str(a, b) {
                        var c, d, e, f, g = gap,
                            h, i = b[a];
                        i && typeof i === "object" && typeof i.toJSON ===
                            "function" && (i = i.toJSON(a)), typeof rep ===
                            "function" && (i = rep.call(b, a, i));
                        switch (typeof i) {
                            case "string":
                                return quote(i);
                            case "number":
                                return isFinite(i) ? String(i) : "null";
                            case "boolean":
                            case "null":
                                return String(i);
                            case "object":
                                if (!i) return "null";
                                gap += indent, h = [];
                                if (Object.prototype.toString.apply(i) ===
                                    "[object Array]") {
                                    f = i.length;
                                    for (c = 0; c < f; c += 1) h[c] = str(c, i) ||
                                        "null";
                                    e = h.length === 0 ? "[]" : gap ? "[\n" + gap +
                                        h.join(",\n" + gap) + "\n" + g + "]" : "[" +
                                        h.join(",") + "]", gap = g;
                                    return e
                                }
                                if (rep && typeof rep === "object") {
                                    f = rep.length;
                                    for (c = 0; c < f; c += 1) d = rep[c], typeof d ===
                                        "string" && (e = str(d, i), e && h.push(
                                            quote(d) + (gap ? ": " : ":") + e))
                                } else
                                    for (d in i) Object.hasOwnProperty.call(i, d) &&
                                        (e = str(d, i), e && h.push(quote(d) + (gap ?
                                            ": " : ":") + e));
                                e = h.length === 0 ? "{}" : gap ? "{\n" + gap + h.join(
                                    ",\n" + gap) + "\n" + g + "}" : "{" + h.join(
                                    ",") + "}", gap = g;
                                return e
                        }
                    }

                    function quote(a) {
                        escapable.lastIndex = 0;
                        return escapable.test(a) ? '"' + a.replace(escapable,
                            function(a) {
                                var b = meta[a];
                                return typeof b === "string" ? b : "\\u" + (
                                    "0000" + a.charCodeAt(0).toString(16)).slice(-
                                    4)
                            }) + '"' : '"' + a + '"'
                    }

                    function f(a) {
                        return a < 10 ? "0" + a : a
                    }
                    typeof Date.prototype.toJSON !== "function" && (Date.prototype.toJSON =
                        function(a) {
                            return this.getUTCFullYear() + "-" + f(this.getUTCMonth() +
                                    1) + "-" + f(this.getUTCDate()) + "T" + f(
                                    this.getUTCHours()) + ":" + f(this.getUTCMinutes()) +
                                ":" + f(this.getUTCSeconds()) + "Z"
                        }, String.prototype.toJSON = Number.prototype.toJSON =
                        Boolean.prototype.toJSON = function(a) {
                            return this.valueOf()
                        });
                    var cx =
                        /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                        escapable =
                        /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                        gap, indent, meta = {
                            "\b": "\\b",
                            "\t": "\\t",
                            "\n": "\\n",
                            "\f": "\\f",
                            "\r": "\\r",
                            '"': '\\"',
                            "\\": "\\\\"
                        },
                        rep;
                    typeof JSON.stringify !== "function" && (JSON.stringify =
                        function(a, b, c) {
                            var d;
                            gap = "", indent = "";
                            if (typeof c === "number")
                                for (d = 0; d < c; d += 1) indent += " ";
                            else typeof c === "string" && (indent = c);
                            rep = b;
                            if (b && typeof b !== "function" && (typeof b !==
                                    "object" || typeof b.length !== "number"))
                                throw new Error("JSON.stringify");
                            return str("", {
                                "": a
                            })
                        }), typeof JSON.parse !== "function" && (JSON.parse =
                        function(text, reviver) {
                            function walk(a, b) {
                                var c, d, e = a[b];
                                if (e && typeof e === "object")
                                    for (c in e) Object.hasOwnProperty.call(e,
                                        c) && (d = walk(e, c), d !==
                                        undefined ? e[c] = d : delete e[c]);
                                return reviver.call(a, b, e)
                            }
                            var j;
                            cx.lastIndex = 0, cx.test(text) && (text = text.replace(
                                cx,
                                function(a) {
                                    return "\\u" + ("0000" + a.charCodeAt(
                                        0).toString(16)).slice(-4)
                                }));
                            if (/^[\],:{}\s]*$/.test(text.replace(
                                    /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                                    "@").replace(
                                    /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                                    "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                                j = eval("(" + text + ")");
                                return typeof reviver === "function" ? walk({
                                    "": j
                                }, "") : j
                            }
                            throw new SyntaxError("JSON.parse")
                        })
                })(), $.toJSON = function(a, b) {
                    typeof b == "undefined" && (b = null);
                    return JSON.parse(a, b)
                }, $.jSONToString = function(a, b, c) {
                    typeof b == "undefined" && (b = null), typeof c == "undefined" &&
                        (c = null);
                    return JSON.stringify(a, b, c)
                }
            }(jQuery), define("jquery-plugins/jquery.json", function() {}), require.def(
                "preview/harModel", ["core/lib", "preview/jsonSchema", "preview/ref",
                    "preview/harSchema", "core/cookies", "core/trace",
                    "jquery-plugins/jquery.json"
                ],
                function(a, b, c, d, e, f) {
                    function h() {
                        var a = {};
                        for (var b in this) b != "toJSON" && (a[b] = this[b]);
                        if (!this.text) return a;
                        a.text = Array.map(this.text, function(a) {
                            var b = a.charCodeAt(0);
                            if (b >= 32 && b < 127 || b == 10 || b == 13) return a
                                .charAt(0);
                            var c = b.toString(16).toUpperCase();
                            while (c.length < 4) c = "0" + c;
                            return "\\u" + c
                        }).join("");
                        return a
                    }

                    function g() {
                        this.input = null
                    }
                    g.prototype = {
                        append: function(a) {
                            {
                                if (a) {
                                    if (this.input) {
                                        if (!a.log.pages) {
                                            f.error(
                                                "Import of additional data without a page is not yet supported."
                                            );
                                            return null
                                        }
                                        for (var b = 0; b < a.log.pages.length; b++)
                                            this.importPage(a.log.pages[b], a.log
                                                .entries)
                                    } else this.input = a;
                                    return this.input
                                }
                                f.error(
                                    "HarModel.append; Trying to append null input!"
                                )
                            }
                        },
                        getPages: function() {
                            if (!this.input) return [];
                            return this.input.log.pages ? this.input.log.pages :
                                []
                        },
                        getFirstPage: function() {
                            var a = this.getPages();
                            return a.length > 0 ? a[0] : null
                        },
                        getPageEntries: function(a) {
                            return g.getPageEntries(this.input, a)
                        },
                        getAllEntries: function(a) {
                            return this.input ? this.input.log.entries : []
                        },
                        getParentPage: function(a) {
                            return g.getParentPage(this.input, a)
                        },
                        importPage: function(a, b) {
                            var c = this.getUniquePageID(a.id),
                                d = a.id;
                            a.id = c, this.input.log.pages.push(a);
                            for (var e = 0; e < b.length; e++) {
                                var f = b[e];
                                f.pageref == d && (f.pageref = c, this.input.log
                                    .entries.push(f))
                            }
                        },
                        getUniquePageID: function(a) {
                            var b = this.input.log.pages,
                                c = {};
                            for (var d = 0; d < b.length; d++) c[b[d].id] = !0;
                            if (!c[a]) return a;
                            var e = 1;
                            while (!0) {
                                var f = a + e;
                                if (!c[f]) return f;
                                e++
                            }
                        },
                        toJSON: function(a) {
                            a || (a = this.input);
                            if (!a) return "";
                            var b = this.input.log.entries;
                            for (var c = 0; c < b.length; c++) {
                                var d = b[c];
                                d.response.content.text && (d.response.content.toJSON =
                                    h)
                            }
                            var e = $.jSONToString(this.input, null, "\t"),
                                f = e.replace(/\\\\u/g, "\\u");
                            return f
                        },
                        getSize: function(a) {
                            a || (a = this.input);
                            if (!a) return 0;
                            var b = dojo.toJson(a, !0);
                            return b.length
                        }
                    }, g.parse = function(a, e) {
                        var f = a;
                        try {
                            typeof a === "string" && (f = jQuery.toJSON(a))
                        } catch (g) {
                            console.exception("HarModel.parse; EXCEPTION", g);
                            throw {
                                errors: [{
                                    message: "Failed to parse JSON",
                                    property: "JSON evaluation"
                                }]
                            }
                        }
                        if (!e) return f;
                        var h = c.resolveJson(d),
                            i = b.validate(f, h.logType);
                        if (i.valid) return f;
                        throw i
                    }, g.getPageEntries = function(a, b) {
                        var c = [],
                            d = a.log.entries;
                        if (!d) return c;
                        for (var e = 0; e < d.length; e++) {
                            var f = d[e];
                            !f.pageref && !b && c.push(f), b && f.pageref == b.id &&
                                c.push(f)
                        }
                        return c
                    }, g.getParentPage = function(a, b) {
                        var c = a.log.pages;
                        if (!c) return null;
                        for (var d = 0; d < c.length; d++)
                            if (c[d].id == b.pageref) return c[d];
                        return null
                    }, g.Loader = {
                        run: function(b, c) {
                            var d = a.getURLParameter("baseUrl");
                            d && d[d.length - 1] != "/" && (d += "/");
                            var e = a.getURLParameters("path"),
                                f = a.getURLParameter("callback"),
                                g = a.getURLParameters("inputUrl"),
                                h = [];
                            for (var i in e) h.push(d ? d + e[i] : e[i]);
                            for (var i in g) h.push(g[i]);
                            if ((d || g.length > 0) && h.length > 0) return this
                                .loadRemoteArchive(h, f, b, c);
                            var j = a.getURLParameter("path");
                            if (j) return this.loadLocalArchive(j, b, c)
                        },
                        loadExample: function(a, b) {
                            var c = document.location.href,
                                d = c.indexOf("?");
                            document.location = c.substr(0, d) + "?path=" + a,
                                e.setCookie("timeline", !0), e.setCookie(
                                    "stats", !0)
                        },
                        loadLocalArchive: function(a, b, c) {
                            $.ajax({
                                url: a,
                                context: this,
                                success: function(a) {
                                    b(a)
                                },
                                error: function(a, b) {
                                    c(a, b)
                                }
                            });
                            return !0
                        },
                        loadRemoteArchive: function(a, b, c, d) {
                            if (!a.length) return !1;
                            var e = a.shift();
                            b || (b = "onInputData"), $.ajax({
                                url: e,
                                context: this,
                                dataType: "jsonp",
                                jsonp: "callback",
                                jsonpCallback: b,
                                success: function(e) {
                                    c && c(e);
                                    if (a.length) {
                                        var f = this;
                                        setTimeout(function() {
                                            f.loadRemoteArchive(
                                                a, b, c,
                                                d)
                                        }, 300)
                                    }
                                },
                                error: function(a, b) {
                                    d && d(a, b)
                                }
                            });
                            return !0
                        },
                        load: function(a, b, c, d, e, f) {
                            function h(b, c) {
                                a.onLoadError && a.onLoadError(b, c), f && f.call(
                                    a, b, c)
                            }

                            function g(b) {
                                a.appendPreview && a.appendPreview(b), e && e.call(
                                    a, b)
                            }
                            return c ? this.loadRemoteArchive([b], d, g, h) :
                                this.loadLocalArchive(b, g, h)
                        }
                    };
                    return g
                }), define("nls/requestBody", {
                root: {
                    RequestHeaders: "Request Headers",
                    ResponseHeaders: "Response Headers",
                    RequestCookies: "Request Cookies",
                    ResponseCookies: "Response Cookies",
                    URLParameters: "Params",
                    Headers: "Headers",
                    Post: "Post",
                    Put: "Put",
                    Cookies: "Cookies",
                    Response: "Response",
                    Cache: "Cache",
                    HTML: "HTML",
                    DataURL: "Data URL"
                }
            }), require.def("domplate/tabView", ["domplate/domplate", "core/lib",
                "core/trace"
            ], function(Domplate, Lib, Trace) {
                with(Domplate) {
                    var TabViewTempl = domplate({
                        tag: TABLE({
                            "class": "tabView",
                            cellpadding: 0,
                            cellspacing: 0,
                            _repObject: "$tabView"
                        }, TBODY(TR({
                            "class": "tabViewRow"
                        }, TD({
                            "class": "tabViewCol",
                            valign: "top"
                        }, TAG("$tabList", {
                            tabView: "$tabView"
                        }))))),
                        tabList: DIV({
                            "class": "tabViewBody",
                            onclick: "$onClickTab"
                        }, DIV({
                            "class": "$tabView.id\\Bar tabBar"
                        }), DIV({
                            "class": "$tabView.id\\Bodies tabBodies"
                        })),
                        tabHeaderTag: A({
                            "class": "$tab.id\\Tab tab",
                            view: "$tab.id",
                            _repObject: "$tab"
                        }, "$tab.label"),
                        tabBodyTag: DIV({
                            "class": "tab$tab.id\\Body tabBody",
                            _repObject: "$tab"
                        }),
                        hideTab: function(a) {
                            return !1
                        },
                        onClickTab: function(a) {
                            var b = Lib.fixEvent(a),
                                c = this.getTabView(b.target);
                            c.onClickTab(b)
                        },
                        getTabView: function(a) {
                            var b = Lib.getAncestorByClass(a,
                                "tabView");
                            return b.repObject
                        }
                    });

                    function TabView(a) {
                        this.id = a, this.tabs = [], this.listeners = [], this.tabBarVisibility = !
                            0
                    }
                    TabView.prototype = {
                        appendTab: function(a) {
                            this.tabs.push(a), a.tabView = this;
                            return a
                        },
                        removeTab: function(a) {
                            for (var b in this.tabs) {
                                var c = this.tabs[b];
                                if (c.id == a) {
                                    this.tabs.splice(b, 1);
                                    break
                                }
                            }
                        },
                        getTab: function(a) {
                            for (var b in this.tabs) {
                                var c = this.tabs[b];
                                if (c.id == a) return c
                            }
                        },
                        selectTabByName: function(a) {
                            var b = Lib.getElementByClass(this.element,
                                a + "Tab");
                            b && this.selectTab(b)
                        },
                        showTabBar: function(a) {
                            this.element ? a ? this.element.removeAttribute(
                                    "hideTabBar") : this.element.setAttribute(
                                    "hideTabBar", "true") : this.tabBarVisibility =
                                a
                        },
                        addListener: function(a) {
                            this.listeners.push(a)
                        },
                        removeListener: function(a) {
                            Lib.remove(this.listeners, a)
                        },
                        onClickTab: function(a) {
                            var b = Lib.getAncestorByClass(a.target,
                                "tab");
                            b && this.selectTab(b)
                        },
                        selectTab: function(a) {
                            if (Lib.hasClass(a, "tab")) {
                                if (Lib.hasClass(a, "selected")) return;
                                var b = a.getAttribute("view");
                                if (!b) return;
                                var c = Lib.getAncestorByClass(a,
                                    "tabViewBody");
                                c.selectedTab && (c.selectedTab.removeAttribute(
                                        "selected"), c.selectedBody
                                    .removeAttribute("selected"),
                                    Lib.removeClass(c.selectedTab,
                                        "selected"), Lib.removeClass(
                                        c.selectedBody, "selected")
                                );
                                var d = Lib.getElementByClass(c, "tab" +
                                    b + "Body");
                                d || Trace.error(
                                        "TabView.selectTab; Missing tab body",
                                        a), c.selectedTab = a, c.selectedBody =
                                    d, c.selectedTab.setAttribute(
                                        "selected", "true"), c.selectedBody
                                    .setAttribute("selected", "true"),
                                    Lib.setClass(c.selectedBody,
                                        "selected"), Lib.setClass(c.selectedTab,
                                        "selected"), this.updateTabBody(
                                        c, b)
                            }
                        },
                        updateTabBody: function(a, b) {
                            var c = a.selectedTab.repObject;
                            if (!c._body._updated) {
                                c._body._updated = !0, c.bodyTag && c.bodyTag
                                    .replace({
                                        tab: c
                                    }, c._body), c && c.onUpdateBody &&
                                    c.onUpdateBody(this, c._body);
                                for (var d = 0; d < this.listeners.length; d++) {
                                    var e = this.listeners[d];
                                    e.onUpdateBody && e.onUpdateBody(
                                        this, c._body)
                                }
                            }
                        },
                        render: function(a) {
                            this.element = TabViewTempl.tag.replace({
                                tabView: this
                            }, a, TabViewTempl), Lib.setClass(this.element,
                                this.id), this.showTabBar(this.tabBarVisibility);
                            for (var b in this.tabs) {
                                var c = this.tabs[b],
                                    d = c.tabHeaderTag ? c.tabHeaderTag :
                                    TabViewTempl.tabHeaderTag,
                                    e = c.tabBodyTag ? c.tabBodyTag :
                                    TabViewTempl.tabBodyTag;
                                try {
                                    c._header = d.append({
                                            tab: c
                                        }, Lib.$(a, "tabBar")), c._body =
                                        e.append({
                                            tab: c
                                        }, Lib.$(a, "tabBodies"))
                                } catch (f) {
                                    Trace.exception(
                                        "TabView.appendTab; Exception ",
                                        f)
                                }
                            }
                            return this.element
                        }
                    }, TabView.Tab = function() {}, TabView.Tab.prototype = {
                        invalidate: function() {
                            this._updated = !1
                        },
                        select: function() {
                            this.tabView.selectTabByName(this.id)
                        }
                    };
                    return TabView
                }
            }), require.def("core/dragdrop", ["core/lib"], function(a) {
                function d(a) {
                    return isNaN(window.scrollX) ? new c(a.clientX + document.documentElement
                        .scrollLeft + document.body.scrollLeft, a.clientY +
                        document.documentElement.scrollTop + document.body.scrollTop
                    ) : new c(a.clientX + window.scrollX, a.clientY + window.scrollY)
                }

                function c(a, b) {
                    this.x = a, this.y = b, this.Add = function(a) {
                        var b = new c(this.x, this.y);
                        a != null && (isNaN(a.x) || (b.x += a.x), isNaN(a.y) ||
                            (b.y += a.y));
                        return b
                    }, this.Subtract = function(a) {
                        var b = new c(this.x, this.y);
                        a != null && (isNaN(a.x) || (b.x -= a.x), isNaN(a.y) ||
                            (b.y -= a.y));
                        return b
                    }, this.Bound = function(a, b) {
                        var c = this.Max(a);
                        return c.Min(b)
                    }, this.Check = function() {
                        var a = new c(this.x, this.y);
                        isNaN(a.x) && (a.x = 0), isNaN(a.y) && (a.y = 0);
                        return a
                    }, this.Apply = function(a) {
                        typeof a == "string" && (a = document.getElementById(a));
                        a && (isNaN(this.x) || (a.style.left = this.x + "px"),
                            isNaN(this.y) || (a.style.top = this.y + "px"))
                    }
                }

                function b(b, c) {
                    this.element = b, this.handle = b, this.callbacks = c, this.cursorStartPos =
                        null, this.cursorLastPos = null, this.dragging = !1, this.onDragStart =
                        a.bind(this.onDragStart, this), this.onDragOver = a.bind(
                            this.onDragOver, this), this.onDrop = a.bind(this.onDrop,
                            this), a.addEventListener(this.element, "mousedown",
                            this.onDragStart, !1), this.active = !0
                }
                b.prototype = {
                    onDragStart: function(b) {
                        var c = a.fixEvent(b);
                        this.dragging || (this.callbacks.onDragStart &&
                            this.callbacks.onDragStart(this), this.dragging = !
                            0, this.cursorStartPos = d(c), this.cursorLastPos =
                            this.cursorStartPos, a.addEventListener(
                                this.element.ownerDocument, "mousemove",
                                this.onDragOver, !1), a.addEventListener(
                                this.element.ownerDocument, "mouseup",
                                this.onDrop, !1), a.cancelEvent(c))
                    },
                    onDragOver: function(b) {
                        if (this.dragging) {
                            var c = a.fixEvent(b);
                            a.cancelEvent(c);
                            var e = d(c),
                                e = e.Subtract(this.cursorStartPos);
                            if (this.cursorLastPos.x == e.x && this.cursorLastPos
                                .y == e.y) return;
                            this.cursorLastPos = e, this.callbacks.onDragOver !=
                                null && this.callbacks.onDragOver(e, this)
                        }
                    },
                    onDrop: function(b) {
                        if (this.dragging) {
                            var c = a.fixEvent(b);
                            a.cancelEvent(c), this.dragStop()
                        }
                    },
                    dragStop: function() {
                        this.dragging && (a.removeEventListener(this.element
                                .ownerDocument, "mousemove", this.onDragOver, !
                                1), a.removeEventListener(this.element.ownerDocument,
                                "mouseup", this.onDrop, !1), this.cursorStartPos =
                            null, this.cursorLastPos = null, this.callbacks
                            .onDrop != null && this.callbacks.onDrop(
                                this), this.dragging = !1)
                    },
                    destroy: function() {
                        a.removeEventListener(this.element, "mousedown",
                                this.onDragStart, !1), this.active = !1,
                            this.dragging && this.dragStop()
                    }
                };
                var e = {};
                e.Tracker = b;
                return e
            }), require.def("syntax-highlighter/shCore", [], function() {
                var a = {
                    sh: {
                        Toolbar: {},
                        Utils: {},
                        RegexLib: {},
                        Brushes: {},
                        Strings: {
                            AboutDialog: '<html><head><title>About...</title></head><body class="dp-about"><table cellspacing="0"><tr><td class="copy"><p class="title">dp.SyntaxHighlighter</div><div class="para">Version: {V}</p><p><a href="http://www.dreamprojections.com/syntaxhighlighter/?ref=about" target="_blank">http://www.dreamprojections.com/syntaxhighlighter</a></p>&copy;2004-2007 Alex Gorbatchev.</td></tr><tr><td class="footer"><input type="button" class="close" value="OK" onClick="window.close()"/></td></tr></table></body></html>'
                        },
                        ClipboardSwf: null,
                        Version: "1.5.1"
                    }
                };
                a.SyntaxHighlighter = a.sh, a.sh.Toolbar.Commands = {
                        ExpandSource: {
                            label: "+ expand source",
                            check: function(a) {
                                return a.collapse
                            },
                            func: function(a, b) {
                                a.parentNode.removeChild(a), b.div.className =
                                    b.div.className.replace("collapsed", "")
                            }
                        },
                        ViewSource: {
                            label: "view plain",
                            func: function(b, c) {
                                var d = a.sh.Utils.FixForBlogger(c.originalCode)
                                    .replace(/</g, "&lt;"),
                                    e = window.open("", "_blank",
                                        "width=750, height=400, location=0, resizable=1, menubar=0, scrollbars=0"
                                    );
                                e.document.write(
                                    '<textarea style="width:99%;height:99%">' +
                                    d + "</textarea>"), e.document.close()
                            }
                        },
                        CopyToClipboard: {
                            label: "copy to clipboard",
                            check: function() {
                                return window.clipboardData != null || a.sh.ClipboardSwf !=
                                    null
                            },
                            func: function(b, c) {
                                var d = a.sh.Utils.FixForBlogger(c.originalCode)
                                    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
                                    .replace(/&amp;/g, "&");
                                if (window.clipboardData) window.clipboardData.setData(
                                    "text", d);
                                else if (a.sh.ClipboardSwf != null) {
                                    var e = c.flashCopier;
                                    e == null && (e = document.createElement(
                                                "div"), c.flashCopier = e, c.div
                                            .appendChild(e)), e.innerHTML =
                                        '<embed src="' + a.sh.ClipboardSwf +
                                        '" FlashVars="clipboard=' +
                                        encodeURIComponent(d) +
                                        '" width="0" height="0" type="application/x-shockwave-flash"></embed>'
                                }
                                alert("The code is in your clipboard now")
                            }
                        },
                        PrintSource: {
                            label: "print",
                            func: function(b, c) {
                                var d = document.createElement("IFRAME"),
                                    e = null;
                                d.style.cssText =
                                    "position:absolute;width:0px;height:0px;left:-500px;top:-500px;",
                                    document.body.appendChild(d), e = d.contentWindow
                                    .document, a.sh.Utils.CopyStyles(e, window.document),
                                    e.write('<div class="' + c.div.className.replace(
                                            "collapsed", "") + ' printing">' +
                                        c.div.innerHTML + "</div>"), e.close(),
                                    d.contentWindow.focus(), d.contentWindow.print(),
                                    alert("Printing..."), document.body.removeChild(
                                        d)
                            }
                        },
                        About: {
                            label: "?",
                            func: function(b) {
                                var c = window.open("", "_blank",
                                        "dialog,width=300,height=150,scrollbars=0"
                                    ),
                                    d = c.document;
                                a.sh.Utils.CopyStyles(d, window.document), d.write(
                                    a.sh.Strings.AboutDialog.replace("{V}",
                                        a.sh.Version)), d.close(), c.focus()
                            }
                        }
                    }, a.sh.Toolbar.Create = function(b) {
                        var c = document.createElement("DIV");
                        c.className = "tools";
                        for (var d in a.sh.Toolbar.Commands) {
                            var e = a.sh.Toolbar.Commands[d];
                            if (e.check != null && !e.check(b)) continue;
                            c.innerHTML +=
                                '<a href="#" onclick="dp.sh.Toolbar.Command(\'' + d +
                                "',this);return false;\">" + e.label + "</a>"
                        }
                        return c
                    }, a.sh.Toolbar.Command = function(b, c) {
                        var d = c;
                        while (d != null && d.className.indexOf("dp-highlighter") ==
                            -1) d = d.parentNode;
                        d != null && a.sh.Toolbar.Commands[b].func(c, d.highlighter)
                    }, a.sh.Utils.CopyStyles = function(a, b) {
                        var c = b.getElementsByTagName("link");
                        for (var d = 0; d < c.length; d++) c[d].rel.toLowerCase() ==
                            "stylesheet" && a.write(
                                '<link type="text/css" rel="stylesheet" href="' + c[
                                    d].href + '"></link>')
                    }, a.sh.Utils.FixForBlogger = function(b) {
                        return a.sh.isBloggerMode == !0 ? b.replace(
                            /<br\s*\/?>|&lt;br\s*\/?&gt;/gi, "\n") : b
                    }, a.sh.RegexLib = {
                        MultiLineCComments: new RegExp("/\\*[\\s\\S]*?\\*/", "gm"),
                        SingleLineCComments: new RegExp("//.*$", "gm"),
                        SingleLinePerlComments: new RegExp("#.*$", "gm"),
                        DoubleQuotedString: new RegExp(
                            '"(?:\\.|(\\\\\\")|[^\\""\\n])*"', "g"),
                        SingleQuotedString: new RegExp(
                            "'(?:\\.|(\\\\\\')|[^\\''\\n])*'", "g")
                    }, a.sh.Match = function(a, b, c) {
                        this.value = a, this.index = b, this.length = a.length,
                            this.css = c
                    }, a.sh.Highlighter = function() {
                        this.noGutter = !1, this.addControls = !0, this.collapse = !
                            1, this.tabsToSpaces = !0, this.wrapColumn = 80, this.showColumns = !
                            0
                    }, a.sh.Highlighter.SortCallback = function(a, b) {
                        if (a.index < b.index) return -1;
                        if (a.index > b.index) return 1;
                        if (a.length < b.length) return -1;
                        if (a.length > b.length) return 1;
                        return 0
                    }, a.sh.Highlighter.prototype.CreateElement = function(a) {
                        var b = document.createElement(a);
                        b.highlighter = this;
                        return b
                    }, a.sh.Highlighter.prototype.GetMatches = function(b, c) {
                        var d = 0,
                            e = null;
                        while ((e = b.exec(this.code)) != null) this.matches[this.matches
                            .length] = new a.sh.Match(e[0], e.index, c)
                    }, a.sh.Highlighter.prototype.AddBit = function(a, b) {
                        if (a != null && a.length != 0) {
                            var c = this.CreateElement("SPAN");
                            a = a.replace(/ /g, "&nbsp;"), a = a.replace(/</g,
                                "&lt;"), a = a.replace(/\n/gm, "&nbsp;<br>");
                            if (b != null)
                                if (/br/gi.test(a)) {
                                    var d = a.split("&nbsp;<br>");
                                    for (var e = 0; e < d.length; e++) c = this.CreateElement(
                                            "SPAN"), c.className = b, c.innerHTML =
                                        d[e], this.div.appendChild(c), e + 1 < d.length &&
                                        this.div.appendChild(this.CreateElement(
                                            "BR"))
                                } else c.className = b, c.innerHTML = a, this.div.appendChild(
                                    c);
                            else c.innerHTML = a, this.div.appendChild(c)
                        }
                    }, a.sh.Highlighter.prototype.IsInside = function(a) {
                        if (a == null || a.length == 0) return !1;
                        for (var b = 0; b < this.matches.length; b++) {
                            var c = this.matches[b];
                            if (c == null) continue;
                            if (a.index > c.index && a.index < c.index + c.length)
                                return !0
                        }
                        return !1
                    }, a.sh.Highlighter.prototype.ProcessRegexList = function() {
                        for (var a = 0; a < this.regexList.length; a++) this.GetMatches(
                            this.regexList[a].regex, this.regexList[a].css)
                    }, a.sh.Highlighter.prototype.ProcessSmartTabs = function(a) {
                        function g(a, b) {
                            if (a.indexOf(e) == -1) return a;
                            var c = 0;
                            while ((c = a.indexOf(e)) != -1) {
                                var d = b - c % b;
                                a = f(a, c, d)
                            }
                            return a
                        }

                        function f(a, b, c) {
                            var d = a.substr(0, b),
                                e = a.substr(b + 1, a.length),
                                f = "";
                            for (var g = 0; g < c; g++) f += " ";
                            return d + f + e
                        }
                        var b = a.split("\n"),
                            c = "",
                            d = 4,
                            e = "\t";
                        for (var h = 0; h < b.length; h++) c += g(b[h], d) + "\n";
                        return c
                    }, a.sh.Highlighter.prototype.SwitchToList = function() {
                        var b = this.div.innerHTML.replace(/<(br)\/?>/gi, "\n"),
                            c = b.split("\n");
                        this.addControls == !0 && this.bar.appendChild(a.sh.Toolbar
                            .Create(this));
                        if (this.showColumns) {
                            var d = this.CreateElement("div"),
                                e = this.CreateElement("div"),
                                f = 10,
                                g = 1;
                            while (g <= 150) g % f == 0 ? (d.innerHTML += g, g += (
                                g + "").length) : (d.innerHTML += "&middot;", g++);
                            e.className = "columns", e.appendChild(d), this.bar.appendChild(
                                e)
                        }
                        for (var g = 0, h = this.firstLine; g < c.length - 1; g++,
                            h++) {
                            var i = this.CreateElement("LI"),
                                j = this.CreateElement("SPAN");
                            i.className = g % 2 == 0 ? "alt" : "", j.innerHTML = c[
                                g] + "&nbsp;", i.appendChild(j), this.ol.appendChild(
                                i)
                        }
                        this.div.innerHTML = ""
                    }, a.sh.Highlighter.prototype.Highlight = function(b) {
                        function f(a, b, c) {
                            return a.substr(b, c - b)
                        }

                        function e(b) {
                            var d = a.sh.Utils.FixForBlogger(b).split("\n"),
                                e = [],
                                f = new RegExp("^\\s*", "g"),
                                g = 1e3;
                            for (var h = 0; h < d.length && g > 0; h++) {
                                if (c(d[h]).length == 0) continue;
                                var i = f.exec(d[h]);
                                i != null && i.length > 0 && (g = Math.min(i[0].length,
                                    g))
                            }
                            if (g > 0)
                                for (var h = 0; h < d.length; h++) d[h] = d[h].substr(
                                    g);
                            return d.join("\n")
                        }

                        function d(a) {
                            return a.replace(/\n*$/, "").replace(/^\n*/, "")
                        }

                        function c(a) {
                            return a.replace(/^\s*(.*?)[\s\n]*$/g, "$1")
                        }
                        var g = 0;
                        b == null && (b = ""), this.originalCode = b, this.code = d(
                                e(b)), this.div = this.CreateElement("DIV"), this.bar =
                            this.CreateElement("DIV"), this.ol = this.CreateElement(
                                "OL"), this.matches = [], this.div.className =
                            "dp-highlighter", this.div.highlighter = this, this.bar
                            .className = "bar", this.ol.start = this.firstLine,
                            this.CssClass != null && (this.ol.className = this.CssClass),
                            this.collapse && (this.div.className += " collapsed"),
                            this.noGutter && (this.div.className += " nogutter"),
                            this.tabsToSpaces == !0 && (this.code = this.ProcessSmartTabs(
                                this.code)), this.ProcessRegexList();
                        if (this.matches.length == 0) this.AddBit(this.code, null),
                            this.SwitchToList(), this.div.appendChild(this.bar),
                            this.div.appendChild(this.ol);
                        else {
                            this.matches = this.matches.sort(a.sh.Highlighter.SortCallback);
                            for (var h = 0; h < this.matches.length; h++) this.IsInside(
                                this.matches[h]) && (this.matches[h] = null);
                            for (var h = 0; h < this.matches.length; h++) {
                                var i = this.matches[h];
                                if (i == null || i.length == 0) continue;
                                this.AddBit(f(this.code, g, i.index), null), this.AddBit(
                                    i.value, i.css), g = i.index + i.length
                            }
                            this.AddBit(this.code.substr(g), null), this.SwitchToList(),
                                this.div.appendChild(this.bar), this.div.appendChild(
                                    this.ol)
                        }
                    }, a.sh.Highlighter.prototype.GetKeywords = function(a) {
                        return "\\b" + a.replace(/ /g, "\\b|\\b") + "\\b"
                    }, a.sh.BloggerMode = function() {
                        a.sh.isBloggerMode = !0
                    }, a.sh.HighlightAll = function(b, c, d, e, f, g) {
                        function k(a, b, c) {
                            var d = document.getElementsByTagName(c);
                            for (var e = 0; e < d.length; e++) d[e].getAttribute(
                                "name") == b && a.push(d[e])
                        }

                        function j(a, b, c) {
                            var d = new RegExp("^" + a + "\\[(\\w+)\\]$", "gi"),
                                e = null;
                            for (var f = 0; f < b.length; f++)
                                if ((e = d.exec(b[f])) != null) return e[1];
                            return c
                        }

                        function i(a, b) {
                            for (var c = 0; c < b.length; c++)
                                if (b[c] == a) return !0;
                            return !1
                        }

                        function h() {
                            var a = arguments;
                            for (var b = 0; b < a.length; b++) {
                                if (a[b] == null) continue;
                                if (typeof a[b] == "string" && a[b] != "") return a[
                                    b] + "";
                                if (typeof a[b] == "object" && a[b].value != "")
                                    return a[b].value + ""
                            }
                            return null
                        }
                        var l = [],
                            m = null,
                            n = {},
                            o = "innerHTML";
                        typeof b == "string" ? (k(l, b, "pre"), k(l, b, "textarea")) :
                            l.push(b);
                        if (l.length != 0) {
                            for (var p in a.sh.Brushes) {
                                var q = a.sh.Brushes[p].Aliases;
                                if (q == null) continue;
                                for (var r = 0; r < q.length; r++) n[q[r]] = p
                            }
                            for (var r = 0; r < l.length; r++) {
                                var s = l[r],
                                    t = h(s.attributes["class"], s.className, s.attributes
                                        .language, s.language),
                                    u = "";
                                if (t == null) continue;
                                t = t.split(":"), u = t[0].toLowerCase();
                                if (n[u] == null) continue;
                                m = new a.sh.Brushes[n[u]], s.style.display =
                                    "none", m.noGutter = c == null ? i("nogutter",
                                        t) : !c, m.addControls = d == null ? !i(
                                        "nocontrols", t) : d, m.collapse = e ==
                                    null ? i("collapse", t) : e, m.showColumns = g ==
                                    null ? i("showcolumns", t) : g;
                                var v = document.getElementsByTagName("head")[0];
                                if (m.Style && v) {
                                    var w = document.createElement("style");
                                    w.setAttribute("type", "text/css");
                                    if (w.styleSheet) w.styleSheet.cssText = m.Style;
                                    else {
                                        var x = document.createTextNode(m.Style);
                                        w.appendChild(x)
                                    }
                                    v.appendChild(w)
                                }
                                m.firstLine = f == null ? parseInt(j("firstline", t,
                                        1)) : f, m.Highlight(s[o]), m.source = s, s
                                    .parentNode.insertBefore(m.div, s)
                            }
                        }
                    }, a.sh.Brushes.JScript = function() {
                        var b =
                            "abstract boolean break byte case catch char class const continue debugger default delete do double else enum export extends false final finally float for function goto if implements import in instanceof int interface long native new null package private protected public return short static super switch synchronized this throw throws transient true try typeof var void volatile while with";
                        this.regexList = [{
                            regex: a.sh.RegexLib.SingleLineCComments,
                            css: "comment"
                        }, {
                            regex: a.sh.RegexLib.MultiLineCComments,
                            css: "comment"
                        }, {
                            regex: a.sh.RegexLib.DoubleQuotedString,
                            css: "string"
                        }, {
                            regex: a.sh.RegexLib.SingleQuotedString,
                            css: "string"
                        }, {
                            regex: new RegExp("^\\s*#.*", "gm"),
                            css: "preprocessor"
                        }, {
                            regex: new RegExp(this.GetKeywords(b), "gm"),
                            css: "keyword"
                        }], this.CssClass = "dp-c"
                    }, a.sh.Brushes.JScript.prototype = new a.sh.Highlighter, a.sh.Brushes
                    .JScript.Aliases = ["js", "jscript", "javascript"];
                return a
            }), require.def("preview/requestBody", ["domplate/domplate",
                "i18n!nls/requestBody", "core/lib", "core/cookies",
                "domplate/tabView", "core/dragdrop", "syntax-highlighter/shCore"
            ], function(Domplate, Strings, Lib, Cookies, TabView, DragDrop, dp) {
                with(Domplate) {
                    function RequestBody() {}
                    RequestBody.prototype = domplate({
                        render: function(a, b) {
                            var c = new TabView("requestBody");
                            b.response.headers.length > 0 && c.appendTab(
                                    new HeadersTab(b)), b.request.queryString &&
                                b.request.queryString.length && c.appendTab(
                                    new ParamsTab(b)), b.request.postData &&
                                c.appendTab(new SentDataTab(b, b.request
                                    .method)), b.response.content.text &&
                                b.response.content.text.length > 0 &&
                                c.appendTab(new ResponseTab(b)),
                                this.showCache(b) && c.appendTab(
                                    new CacheTab(b)), this.showHtml(
                                    b) && c.appendTab(new HtmlTab(b)),
                                this.showDataURL(b) && c.appendTab(
                                    new DataURLTab(b));
                            var d = c.render(a);
                            c.tabs.length > 0 && c.selectTabByName(
                                c.tabs[0].id);
                            return d
                        },
                        showCache: function(a) {
                            if (!a.cache) return !1;
                            if (!a.cache.afterRequest) return !1;
                            if (a.category == "image") return !1;
                            return !0
                        },
                        showHtml: function(a) {
                            return a.response.content.mimeType ==
                                "text/html" || a.mimeType ==
                                "application/xhtml+xml"
                        },
                        showDataURL: function(a) {
                            return a.request.url.indexOf("data:") ==
                                0
                        }
                    });

                    function HeadersTab(a) {
                        this.file = a
                    }
                    HeadersTab.prototype = domplate(TabView.Tab.prototype, {
                        id: "Headers",
                        label: Strings.Headers,
                        bodyTag: TABLE({
                            "class": "netInfoHeadersText netInfoText netInfoHeadersTable",
                            cellpadding: 0,
                            cellspacing: 0
                        }, TBODY(TR({
                            "class": "netInfoResponseHeadersTitle"
                        }, TD({
                            colspan: 2
                        }, DIV({
                            "class": "netInfoHeadersGroup"
                        }, Strings.ResponseHeaders))), TR({
                            "class": "netInfoRequestHeadersTitle"
                        }, TD({
                            colspan: 2
                        }, DIV({
                            "class": "netInfoHeadersGroup"
                        }, Strings.RequestHeaders))))),
                        headerDataTag: FOR("param", "$headers", TR(TD({
                            "class": "netInfoParamName"
                        }, "$param.name"), TD({
                            "class": "netInfoParamValue"
                        }, PRE("$param|getParamValue")))),
                        getParamValue: function(a) {
                            return Lib.wrapText(a.value, !0)
                        },
                        onUpdateBody: function(a, b) {
                            this.file.response.headers && this.insertHeaderRows(
                                    b, this.file.response.headers,
                                    "Headers", "ResponseHeaders"),
                                this.file.request.headers && this.insertHeaderRows(
                                    b, this.file.request.headers,
                                    "Headers", "RequestHeaders")
                        },
                        insertHeaderRows: function(a, b, c, d) {
                            var e = Lib.getElementByClass(a,
                                    "netInfo" + c + "Table"),
                                f = Lib.getElementByClass(e,
                                    "netInfo" + d + "Title");
                            b.length ? (this.headerDataTag.insertRows({
                                headers: b
                            }, f ? f : a), Lib.removeClass(
                                f, "collapsed")) : Lib.setClass(
                                f, "collapsed")
                        }
                    });

                    function ResponseTab(a) {
                        this.file = a
                    }
                    ResponseTab.prototype = domplate(TabView.Tab.prototype, {
                        id: "Response",
                        label: Strings.Response,
                        bodyTag: DIV({
                            "class": "netInfoResponseText netInfoText"
                        }, PRE({
                            "class": "javascript:nocontrols:nogutter:",
                            name: "code"
                        })),
                        onUpdateBody: function(a, b) {
                            var c = Lib.getElementByClass(b,
                                "netInfoResponseText");
                            if (this.file.category == "image") {
                                Lib.clearNode(c);
                                var d = b.ownerDocument.createElement(
                                    "img");
                                d.src = this.file.href, c.appendChild(
                                    d, c)
                            } else {
                                Lib.clearNode(c.firstChild);
                                var e = this.file.response.content.text,
                                    f = this.file.response.content.mimeType;
                                f == "application/javascript" || f ==
                                    "text/javascript" || f ==
                                    "application/x-javascript" || f ==
                                    "text/ecmascript" || f ==
                                    "application/ecmascript" ? (c.firstChild
                                        .innerHTML = e, dp.SyntaxHighlighter
                                        .HighlightAll(c.firstChild)
                                    ) : Lib.insertWrappedText(e, c.firstChild)
                            }
                        }
                    });

                    function ParamsTab(a) {
                        this.file = a
                    }
                    ParamsTab.prototype = domplate(HeadersTab.prototype, {
                        id: "Params",
                        label: Strings.URLParameters,
                        bodyTag: TABLE({
                            "class": "netInfoParamsText netInfoText netInfoParamsTable",
                            cellpadding: 0,
                            cellspacing: 0
                        }, TBODY()),
                        onUpdateBody: function(a, b) {
                            if (this.file.request.queryString) {
                                var c = Lib.getElementByClass(b,
                                    "netInfoParamsText");
                                this.insertHeaderRows(c, this.file.request
                                    .queryString, "Params")
                            }
                        }
                    });

                    function SentDataTab(a, b) {
                        b = b.charAt(0).toUpperCase() + b.slice(1).toLowerCase(),
                            this.file = a, this.id = b, this.label = Strings[b]
                    }
                    SentDataTab.prototype = domplate(HeadersTab.prototype, {
                        bodyTag: DIV({
                            "class": "netInfo$tab.id\\Text netInfoText"
                        }, TABLE({
                            "class": "netInfo$tab.id\\Table",
                            cellpadding: 0,
                            cellspacing: 0
                        }, TBODY())),
                        onUpdateBody: function(a, b) {
                            var c = this.file.request.postData;
                            if (c) {
                                var d = Lib.getElementByClass(b,
                                    "netInfo" + this.id +
                                    "Text");
                                c.mimeType ==
                                    "application/x-www-form-urlencoded" ?
                                    this.insertHeaderRows(d, c.params,
                                        this.id) : Lib.insertWrappedText(
                                        c.text, d)
                            }
                        }
                    });

                    function CookiesTab(a) {
                        this.file = a
                    }
                    CookiesTab.prototype = domplate(HeadersTab.prototype, {
                        id: "Cookies",
                        label: Strings.Cookies,
                        bodyTag: DIV({
                            "class": "netInfoCookiesText netInfoText"
                        }, TABLE({
                            "class": "netInfoCookiesTable",
                            cellpadding: 0,
                            cellspacing: 0
                        }, TBODY(TR({
                                "class": "netInfoResponseCookiesTitle"
                            }, TD({
                                colspan: 2
                            }, DIV({
                                "class": "netInfoCookiesGroup"
                            }, Strings.ResponseCookies))),
                            TR({
                                "class": "netInfoRequestCookiesTitle"
                            }, TD({
                                colspan: 2
                            }, DIV({
                                "class": "netInfoCookiesGroup"
                            }, Strings.RequestCookies)))))),
                        onUpdateBody: function(a, b) {
                            if (file.response.cookies) {
                                var c = Lib.getElementByClass(b,
                                    "netInfoParamsText");
                                this.insertHeaderRows(c, file.response
                                    .cookies, "Cookies",
                                    "ResponseCookies")
                            }
                            if (file.request.cookies) {
                                var c = Lib.getElementByClass(b,
                                    "netInfoParamsText");
                                this.insertHeaderRows(c, file.request
                                    .cookies, "Cookies",
                                    "RequestCookies")
                            }
                        }
                    });

                    function CacheTab(a) {
                        this.file = a
                    }
                    CacheTab.prototype = domplate(HeadersTab.prototype, {
                        id: "Cache",
                        label: Strings.Cache,
                        bodyTag: DIV({
                            "class": "netInfoCacheText netInfoText"
                        }, TABLE({
                            "class": "netInfoCacheTable",
                            cellpadding: 0,
                            cellspacing: 0
                        }, TBODY())),
                        onUpdateBody: function(a, b) {
                            if (this.file.cache && this.file.cache.afterRequest) {
                                var c = this.file.cache.afterRequest,
                                    d = [];
                                for (var e in c) d.push({
                                    name: e,
                                    value: c[e]
                                });
                                this.insertHeaderRows(b, d, "Cache")
                            }
                        }
                    });

                    function HtmlTab(a) {
                        this.file = a
                    }
                    HtmlTab.prototype = domplate(HeadersTab.prototype, {
                        id: "HTML",
                        label: Strings.HTML,
                        bodyTag: DIV({
                            "class": "netInfoHtmlText netInfoText"
                        }, IFRAME({
                            "class": "netInfoHtmlPreview",
                            onload: "$onLoad"
                        }), DIV({
                            "class": "htmlPreviewResizer"
                        })),
                        onUpdateBody: function(a, b) {
                            this.preview = Lib.getElementByClass(b,
                                "netInfoHtmlPreview");
                            var c = parseInt(Cookies.getCookie(
                                "htmlPreviewHeight"));
                            isNaN(c) || (this.preview.style.height =
                                c + "px");
                            var d = Lib.getElementByClass(b,
                                "htmlPreviewResizer");
                            this.resizer = new DragDrop.Tracker(d, {
                                onDragStart: Lib.bind(this.onDragStart,
                                    this),
                                onDragOver: Lib.bind(this.onDragOver,
                                    this),
                                onDrop: Lib.bind(this.onDrop,
                                    this)
                            })
                        },
                        onLoad: function(a) {
                            var b = Lib.fixEvent(a),
                                c = Lib.getAncestorByClass(b.target,
                                    "tabHTMLBody").repObject;
                            c.preview.contentWindow.document.body.innerHTML =
                                c.file.response.content.text
                        },
                        onDragStart: function(a) {
                            var b = Lib.getBody(this.preview.ownerDocument);
                            b.setAttribute("resizingHtmlPreview",
                                    "true"), this.startHeight =
                                this.preview.clientHeight
                        },
                        onDragOver: function(a, b) {
                            var c = this.startHeight + a.y;
                            this.preview.style.height = c + "px",
                                Cookies.setCookie(
                                    "htmlPreviewHeight", c)
                        },
                        onDrop: function(a) {
                            var b = Lib.getBody(this.preview.ownerDocument);
                            b.removeAttribute("resizingHtmlPreview")
                        }
                    });

                    function DataURLTab(a) {
                        this.file = a
                    }
                    DataURLTab.prototype = domplate(HeadersTab.prototype, {
                        id: "DataURL",
                        label: Strings.DataURL,
                        bodyTag: DIV({
                            "class": "netInfoDataURLText netInfoText"
                        }),
                        onUpdateBody: function(a, b) {
                            var c = Lib.getElementByClass(b,
                                    "netInfoDataURLText"),
                                d = this.file.request.url;
                            if (d.indexOf("data:image") == 0) {
                                var e = b.ownerDocument.createElement(
                                    "img");
                                e.src = d, c.appendChild(e)
                            } else Lib.insertWrappedText(unescape(d),
                                c)
                        }
                    });
                    return RequestBody
                }
            }), require.def("domplate/infoTip", ["domplate/domplate", "core/lib",
                "core/trace"
            ], function(Domplate, Lib, Trace) {
                with(Domplate) {
                    var InfoTip = Lib.extend({
                        listeners: [],
                        maxWidth: 100,
                        maxHeight: 80,
                        infoTipMargin: 10,
                        infoTipWindowPadding: 25,
                        tags: domplate({
                            infoTipTag: DIV({
                                "class": "infoTip"
                            })
                        }),
                        initialize: function() {
                            if (!$.browser.msie) {
                                var a = $("body");
                                a.bind("mouseover", Lib.bind(this.onMouseMove,
                                    this)), a.bind("mouseout",
                                    Lib.bind(this.onMouseOut,
                                        this)), a.bind(
                                    "mousemove", Lib.bind(this.onMouseMove,
                                        this));
                                return this.infoTip = this.tags.infoTipTag
                                    .append({}, Lib.getBody(
                                        document))
                            }
                        },
                        showInfoTip: function(a, b, c, d, e, f) {
                            var g = Lib.getOverflowParent(b),
                                h = c + (g ? g.scrollLeft : 0),
                                i = Lib.dispatch2(this.listeners,
                                    "showInfoTip", [a, b, h, d, e,
                                        f
                                    ]);
                            if (i) {
                                var j = a.ownerDocument.documentElement,
                                    k = j.clientWidth,
                                    l = j.clientHeight;
                                c + a.offsetWidth + this.infoTipMargin >
                                    k - this.infoTipWindowPadding ?
                                    (a.style.left = "auto", a.style
                                        .right = k - c + this.infoTipMargin +
                                        "px") : (a.style.left = c +
                                        this.infoTipMargin + "px",
                                        a.style.right = "auto"), d +
                                    a.offsetHeight + this.infoTipMargin >
                                    l ? (a.style.top = Math.max(0,
                                            l - (a.offsetHeight +
                                                this.infoTipMargin)
                                        ) + "px", a.style.bottom =
                                        "auto") : (a.style.top = d +
                                        this.infoTipMargin + "px",
                                        a.style.bottom = "auto"), a
                                    .setAttribute("active", "true")
                            } else this.hideInfoTip(a)
                        },
                        hideInfoTip: function(a) {
                            a && a.removeAttribute("active")
                        },
                        onMouseOut: function(a) {
                            a.relatedTarget || this.hideInfoTip(
                                this.infoTip)
                        },
                        onMouseMove: function(a) {
                            this.infoTip.setAttribute("multiline", !
                                1);
                            var b = a.clientX,
                                c = a.clientY;
                            this.showInfoTip(this.infoTip, a.target,
                                b, c, a.rangeParent, a.rangeOffset
                            )
                        },
                        populateTimingInfoTip: function(a, b) {
                            this.tags.colorTag.replace({
                                rgbValue: b
                            }, a);
                            return !0
                        },
                        addListener: function(a) {
                            this.listeners.push(a)
                        },
                        removeListener: function(a) {
                            Lib.remove(this.listeners, a)
                        }
                    });
                    InfoTip.initialize();
                    return InfoTip
                }
            }), require.def("domplate/popupMenu", ["domplate/domplate", "core/lib",
                "core/trace"
            ], function(Domplate, Lib, Trace) {
                with(Domplate) {
                    var Controller = {
                            controllers: [],
                            controllerContext: {
                                label: "controller context"
                            },
                            initialize: function(a) {
                                this.controllers = [], this.controllerContext =
                                    a || this.controllerContext
                            },
                            shutdown: function() {
                                this.removeControllers()
                            },
                            addController: function() {
                                for (var a = 0, b; b = arguments[a]; a++) {
                                    typeof b[0] == "string" && (b[0] = $$(b[
                                        0], this.controllerContext));
                                    var c = b[2];
                                    b[2] = Lib.bind(c, this), b[3] = c,
                                        this.controllers.push(b), Lib.addEventListener
                                        .apply(this, b)
                                }
                            },
                            removeController: function() {
                                for (var a = 0, b; b = arguments[a]; a++)
                                    for (var c = 0, d; d = this.controllers[
                                            c]; c++) b[0] == d[0] && b[1] ==
                                        d[1] && b[2] == d[3] && Lib.removeEventListener
                                        .apply(this, d)
                            },
                            removeControllers: function() {
                                for (var a = 0, b; b = this.controllers[a]; a++)
                                    Lib.removeEventListener.apply(this, b)
                            }
                        },
                        menuItemProps = {
                            "class": "$item.className",
                            type: "$item.type",
                            value: "$item.value",
                            _command: "$item.command"
                        };
                    Lib.isIE6 && (menuItemProps.href = "javascript:void(0)");
                    var MenuPlate = domplate({
                        tag: DIV({
                            "class": "popupMenu popupMenuShadow"
                        }, DIV({
                            "class": "popupMenuContent popupMenuShadowContent"
                        }, FOR("item",
                            "$object.items|memberIterator",
                            TAG("$item.tag", {
                                item: "$item"
                            })))),
                        itemTag: A(menuItemProps, "$item.label"),
                        checkBoxTag: A(Lib.extend(menuItemProps, {
                            checked: "$item.checked"
                        }), "$item.label"),
                        radioButtonTag: A(Lib.extend(menuItemProps, {
                            selected: "$item.selected"
                        }), "$item.label"),
                        groupTag: A(Lib.extend(menuItemProps, {
                            child: "$item.child"
                        }), "$item.label"),
                        shortcutTag: A(menuItemProps, "$item.label",
                            SPAN({
                                "class": "popupMenuShortcutKey"
                            }, "$item.key")),
                        separatorTag: SPAN({
                            "class": "popupMenuSeparator"
                        }),
                        memberIterator: function(a) {
                            var b = [];
                            for (var c = 0, d = a.length; c < d; c++) {
                                var e = a[c];
                                if (typeof e == "string" && e.indexOf(
                                        "-") == 0) {
                                    b.push({
                                        tag: this.separatorTag
                                    });
                                    continue
                                }
                                e = Lib.extend(e, {}), e.type = e.type ||
                                    "", e.value = e.value || "";
                                var f = e.type;
                                e.tag = this.itemTag;
                                var g = e.className || "";
                                g += "popupMenuOption ", f ==
                                    "checkbox" ? (g +=
                                        "popupMenuCheckBox ", e.tag =
                                        this.checkBoxTag) : f ==
                                    "radio" ? (g +=
                                        "popupMenuRadioButton ", e.tag =
                                        this.radioButtonTag) : f ==
                                    "group" ? (g +=
                                        "popupMenuGroup ", e.tag =
                                        this.groupTag) : f ==
                                    "shortcut" && (g +=
                                        "popupMenuShortcut ", e.tag =
                                        this.shortcutTag), e.checked ?
                                    g += "popupMenuChecked " : e.selected &&
                                    (g += "popupMenuRadioSelected "),
                                    e.disabled && (g +=
                                        "popupMenuDisabled "), e.className =
                                    g, e.label = e.label, b.push(e)
                            }
                            return b
                        }
                    });

                    function Menu(a) {
                        if (!a.element) {
                            a.getItems && (a.items = a.getItems());
                            var b = Lib.getBody(document);
                            a.element = MenuPlate.tag.append({
                                object: a
                            }, b, MenuPlate)
                        }
                        Lib.append(this, a), typeof this.element == "string" ?
                            (this.id = this.element, this.element = $(this.id)) :
                            this.id && (this.element.id = this.id), this.elementStyle =
                            this.element.style, this.isVisible = !1, this.handleMouseDown =
                            Lib.bind(this.handleMouseDown, this), this.handleMouseOver =
                            Lib.bind(this.handleMouseOver, this), this.handleMouseOut =
                            Lib.bind(this.handleMouseOut, this), this.handleWindowMouseDown =
                            Lib.bind(this.handleWindowMouseDown, this)
                    }
                    var menuMap = {};
                    Menu.prototype = Lib.extend(Controller, {
                        initialize: function() {
                            Controller.initialize.call(this), this.addController(
                                [this.element, "mousedown",
                                    this.handleMouseDown
                                ], [this.element, "mouseover",
                                    this.handleMouseOver
                                ])
                        },
                        destroy: function() {
                            this.hide(), this.parentMenu && (this.parentMenu
                                    .childMenu = null), this.element
                                .parentNode.removeChild(this.element),
                                this.element = null, this.elementStyle =
                                null, this.parentMenu = null, this.parentTarget =
                                null
                        },
                        shutdown: function() {
                            Controller.shutdown.call(this)
                        },
                        showPopup: function(a) {
                            var b = Lib.isIE6 ? 1 : -4,
                                c = Lib.getElementBox(a),
                                d = {
                                    top: 0,
                                    left: 0
                                };
                            this.show(c.left + b - d.left, c.top +
                                c.height - 5 - d.top)
                        },
                        show: function(a, b) {
                            this.initialize();
                            if (!this.isVisible) {
                                a = a || 0, b = b || 0;
                                if (this.parentMenu) {
                                    var c = this.parentMenu.childMenu;
                                    c && c != this && c.destroy(),
                                        this.parentMenu.childMenu =
                                        this
                                } else Lib.addEventListener(
                                    document, "mousedown", this
                                    .handleWindowMouseDown);
                                this.elementStyle.display = "block",
                                    this.elementStyle.visibility =
                                    "hidden";
                                var d = Lib.getWindowSize();
                                a = Math.min(a, d.width - this.element
                                        .clientWidth - 10), a =
                                    Math.max(a, 0), b = Math.min(b,
                                        d.height - this.element.clientHeight -
                                        10), b = Math.max(b, 0),
                                    this.elementStyle.left = a +
                                    "px", this.elementStyle.top = b +
                                    "px", this.elementStyle.visibility =
                                    "visible", this.isVisible = !0,
                                    Lib.isFunction(this.onShow) &&
                                    this.onShow.apply(this,
                                        arguments)
                            }
                        },
                        hide: function() {
                            this.clearHideTimeout(), this.clearShowChildTimeout();
                            this.isVisible && (this.elementStyle.display =
                                "none", this.childMenu && (this
                                    .childMenu.destroy(), this.childMenu =
                                    null), this.parentTarget &&
                                Lib.removeClass(this.parentTarget,
                                    "popupMenuGroupSelected"),
                                this.isVisible = !1, this.shutdown(),
                                Lib.isFunction(this.onHide) &&
                                this.onHide.apply(this,
                                    arguments))
                        },
                        showChildMenu: function(a) {
                            var b = a.getAttribute("child"),
                                c = this,
                                a = a;
                            this.showChildTimeout = window.setTimeout(
                                function() {
                                    var d = Lib.getElementBox(a),
                                        e = menuMap.hasOwnProperty(
                                            b) ? menuMap[b] : {
                                            element: $(b)
                                        },
                                        f = new Menu(Lib.extend(
                                            e, {
                                                parentMenu: c,
                                                parentTarget: a
                                            })),
                                        g = Lib.isIE6 ? -1 : -6;
                                    f.show(d.left + d.width + g,
                                        d.top - 6), Lib.setClass(
                                        a,
                                        "popupMenuGroupSelected"
                                    )
                                }, 350)
                        },
                        clearHideTimeout: function() {
                            this.hideTimeout && (window.clearTimeout(
                                    this.hideTimeout), delete this
                                .hideTimeout)
                        },
                        clearShowChildTimeout: function() {
                            this.showChildTimeout && (window.clearTimeout(
                                    this.showChildTimeout),
                                this.showChildTimeout = null)
                        },
                        handleMouseDown: function(a) {
                            Lib.cancelEvent(a, !0);
                            var b = this;
                            while (b.parentMenu) b = b.parentMenu;
                            var c = a.target || a.srcElement;
                            c = Lib.getAncestorByClass(c,
                                "popupMenuOption");
                            if (!c || Lib.hasClass(c,
                                    "popupMenuGroup")) return !1;
                            if (c && !Lib.hasClass(c,
                                    "popupMenuDisabled")) {
                                var d = c.getAttribute("type");
                                if (d == "checkbox") {
                                    var e = c.getAttribute(
                                            "checked"),
                                        f = c.getAttribute("value"),
                                        g = Lib.hasClass(c,
                                            "popupMenuChecked");
                                    g ? (Lib.removeClass(c,
                                                "popupMenuChecked"),
                                            c.setAttribute(
                                                "checked", "")) : (
                                            Lib.setClass(c,
                                                "popupMenuChecked"),
                                            c.setAttribute(
                                                "checked", "true")),
                                        Lib.isFunction(this.onCheck) &&
                                        this.onCheck.call(this, c,
                                            f, !g)
                                }
                                if (d == "radiobutton") {
                                    var h = Lib.getElementsByClass(
                                            c.parentNode,
                                            "popupMenuRadioSelected"
                                        ),
                                        i = c.getAttribute("group");
                                    for (var j = 0, k = h.length; j <
                                        k; j++) radio = h[j], radio
                                        .getAttribute("group") == i &&
                                        (Lib.removeClass(radio,
                                            "popupMenuRadioSelected"
                                        ), radio.setAttribute(
                                            "selected", ""));
                                    Lib.setClass(c,
                                        "popupMenuRadioSelected"
                                    ), c.setAttribute(
                                        "selected", "true")
                                }
                                var l = null,
                                    m = c.command;
                                Lib.isFunction(m) ? l = m : typeof m ==
                                    "string" && (l = this[m]);
                                var n = !0;
                                l && (n = l.call(this, c) !== !1),
                                    n && b.hide()
                            }
                            return !1
                        },
                        handleWindowMouseDown: function(a) {
                            var b = a.target || a.srcElement;
                            b = Lib.getAncestorByClass(b,
                                "popupMenu"), b || (Lib.removeEventListener(
                                    document, "mousedown", this
                                    .handleWindowMouseDown),
                                this.destroy())
                        },
                        handleMouseOver: function(a) {
                            this.clearHideTimeout(), this.clearShowChildTimeout();
                            var b = a.target || a.srcElement;
                            b = Lib.getAncestorByClass(b,
                                "popupMenuOption");
                            if (b) {
                                var c = this.childMenu;
                                c && (Lib.removeClass(c.parentTarget,
                                            "popupMenuGroupSelected"
                                        ), c.parentTarget != b && c
                                        .isVisible && (c.clearHideTimeout(),
                                            c.hideTimeout = window.setTimeout(
                                                function() {
                                                    c.destroy()
                                                }, 300))), Lib.hasClass(
                                        b, "popupMenuGroup") &&
                                    this.showChildMenu(b)
                            }
                        }
                    }), Lib.append(Menu, {
                        register: function(a) {
                            menuMap[a.id] = a
                        },
                        check: function(a) {
                            Lib.setClass(a, "popupMenuChecked"), a.setAttribute(
                                "checked", "true")
                        },
                        uncheck: function(a) {
                            Lib.removeClass(a, "popupMenuChecked"),
                                a.setAttribute("checked", "")
                        },
                        disable: function(a) {
                            Lib.setClass(a, "popupMenuDisabled")
                        },
                        enable: function(a) {
                            Lib.removeClass(a, "popupMenuDisabled")
                        }
                    });
                    return Menu
                }
            }), require.def("preview/requestList", ["domplate/domplate", "core/lib",
                "i18n!nls/requestList", "preview/harModel", "core/cookies",
                "preview/requestBody", "domplate/infoTip", "domplate/popupMenu"
            ], function(Domplate, Lib, Strings, HarModel, Cookies, RequestBody,
                InfoTip, Menu) {
                with(Domplate) {
                    function RequestList(a) {
                        this.input = a, this.pageTimings = [], this.addPageTiming({
                            name: "onContentLoad",
                            classes: "netContentLoadBar",
                            description: Strings.ContentLoad
                        }), this.addPageTiming({
                            name: "onLoad",
                            classes: "netWindowLoadBar",
                            description: Strings.WindowLoad
                        }), InfoTip.addListener(this)
                    }
                    RequestList.columns = ["url", "status", "type", "domain",
                        "size", "timeline"
                    ], RequestList.columnsHiddenByDefault = ["type",
                        "domain"
                    ], RequestList.getHiddenColumns = function() {
                        var a = Cookies.getCookie("hiddenCols");
                        if (a) {
                            a = a.replace(/\+/g, " "), a = unescape(a);
                            return a.split(" ")
                        }
                        return Lib.cloneArray(RequestList.columnsHiddenByDefault)
                    };
                    var cols = RequestList.getHiddenColumns();
                    document.getElementById("content").setAttribute(
                            "hiddenCols", cols.join(" ")), RequestList.prototype =
                        domplate({
                            tableTag: TABLE({
                                "class": "netTable",
                                cellpadding: 0,
                                cellspacing: 0,
                                onclick: "$onClick",
                                _repObject: "$requestList"
                            }, TBODY(TR(TD({
                                "class": "netHrefCol",
                                width: "20%"
                            }), TD({
                                "class": "netStatusCol",
                                width: "7%"
                            }), TD({
                                "class": "netTypeCol",
                                width: "7%"
                            }), TD({
                                "class": "netDomainCol",
                                width: "7%"
                            }), TD({
                                "class": "netSizeCol",
                                width: "7%"
                            }), TD({
                                "class": "netTimeCol",
                                width: "100%"
                            }), TD({
                                width: "15px"
                            })))),
                            fileTag: FOR("file", "$files", TR({
                                "class": "netRow loaded",
                                $isExpandable: "$file|isExpandable",
                                $responseError: "$file|isError",
                                $responseRedirect: "$file|isRedirect",
                                $fromCache: "$file|isFromCache"
                            }, TD({
                                "class": "netHrefCol netCol"
                            }, DIV({
                                "class": "netHrefLabel netLabel",
                                style: "margin-left: $file|getIndent\\px"
                            }, "$file|getHref"), DIV({
                                "class": "netFullHrefLabel netHrefLabel netLabel",
                                style: "margin-left: $file|getIndent\\px"
                            }, "$file|getFullHref")), TD({
                                "class": "netStatusCol netCol"
                            }, DIV({
                                "class": "netStatusLabel netLabel"
                            }, "$file|getStatus")), TD({
                                "class": "netTypeCol netCol"
                            }, DIV({
                                "class": "netTypeLabel netLabel"
                            }, "$file|getType")), TD({
                                "class": "netDomainCol netCol"
                            }, DIV({
                                "class": "netDomainLabel netLabel"
                            }, "$file|getDomain")), TD({
                                "class": "netSizeCol netCol"
                            }, DIV({
                                "class": "netSizeLabel netLabel"
                            }, "$file|getSize")), TD({
                                "class": "netTimeCol netCol"
                            }, DIV({
                                "class": "netTimelineBar"
                            }, "&nbsp;", DIV({
                                "class": "netBlockingBar netBar"
                            }), DIV({
                                "class": "netResolvingBar netBar"
                            }), DIV({
                                "class": "netConnectingBar netBar"
                            }), DIV({
                                "class": "netSendingBar netBar"
                            }), DIV({
                                "class": "netWaitingBar netBar"
                            }), DIV({
                                "class": "netReceivingBar netBar"
                            }, SPAN({
                                    "class": "netTimeLabel"
                                },
                                "$file|getElapsedTime"
                            )))), TD({
                                "class": "netOptionsCol netCol"
                            }, DIV({
                                "class": "netOptionsLabel netLabel",
                                onclick: "$onOpenOptions"
                            })))),
                            headTag: TR({
                                "class": "netHeadRow"
                            }, TD({
                                "class": "netHeadCol",
                                colspan: 7
                            }, DIV({
                                "class": "netHeadLabel"
                            }, "$doc.rootFile.href"))),
                            netInfoTag: TR({
                                "class": "netInfoRow"
                            }, TD({
                                "class": "netInfoCol",
                                colspan: 7
                            })),
                            summaryTag: TR({
                                "class": "netRow netSummaryRow"
                            }, TD({
                                "class": "netHrefCol netCol"
                            }, DIV({
                                "class": "netCountLabel netSummaryLabel"
                            }, "-")), TD({
                                "class": "netStatusCol netCol"
                            }), TD({
                                "class": "netTypeCol netCol"
                            }), TD({
                                "class": "netDomainCol netCol"
                            }), TD({
                                "class": "netTotalSizeCol netSizeCol netCol"
                            }, DIV({
                                "class": "netTotalSizeLabel netSummaryLabel"
                            }, "0KB")), TD({
                                "class": "netTotalTimeCol netTimeCol netCol"
                            }, DIV({
                                "class": "",
                                style: "width: 100%"
                            }, DIV({
                                "class": "netCacheSizeLabel netSummaryLabel"
                            }, "(", SPAN("0KB"), SPAN(
                                " " + Strings.fromCache
                            ), ")"), DIV({
                                "class": "netTimeBar"
                            }, SPAN({
                                "class": "netTotalTimeLabel netSummaryLabel"
                            }, "0ms")))), TD({
                                "class": "netCol"
                            })),
                            getIndent: function(a) {
                                return 0
                            },
                            isError: function(a) {
                                var b = Math.floor(a.response.status /
                                    100);
                                return b == 4 || b == 5
                            },
                            isRedirect: function(a) {
                                return !1
                            },
                            isFromCache: function(a) {
                                return a.cache && a.cache.afterRequest
                            },
                            getHref: function(a) {
                                var b = Lib.getFileName(this.getFullHref(
                                    a));
                                return unescape(a.request.method + " " +
                                    b)
                            },
                            getFullHref: function(a) {
                                return unescape(a.request.url)
                            },
                            getStatus: function(a) {
                                var b = a.response.status > 0 ? a.response
                                    .status + " " : "";
                                return b + a.response.statusText
                            },
                            getType: function(a) {
                                return a.response.content.mimeType
                            },
                            getDomain: function(a) {
                                return Lib.getPrettyDomain(a.request.url)
                            },
                            getSize: function(a) {
                                var b = a.response.bodySize,
                                    c = b && b != -1 ? b : a.response.content
                                    .size;
                                return this.formatSize(c)
                            },
                            isExpandable: function(a) {
                                var b = a.response.headers.length > 0,
                                    c = a.request.url.indexOf("data:") ==
                                    0;
                                return b || c
                            },
                            formatSize: function(a) {
                                return Lib.formatSize(a)
                            },
                            getElapsedTime: function(a) {
                                return Lib.formatTime(a.time)
                            },
                            onClick: function(a) {
                                var b = Lib.fixEvent(a);
                                if (Lib.isLeftClick(a)) {
                                    var c = Lib.getAncestorByClass(b.target,
                                        "netRow");
                                    c && (this.toggleHeadersRow(c), Lib
                                        .cancelEvent(a))
                                } else Lib.isControlClick(a) && window.open(
                                    a.target.innerText || a.target.textContent
                                )
                            },
                            toggleHeadersRow: function(a) {
                                if (Lib.hasClass(a, "isExpandable")) {
                                    var b = a.repObject;
                                    Lib.toggleClass(a, "opened");
                                    if (Lib.hasClass(a, "opened")) {
                                        var c = this.netInfoTag.insertRows({},
                                            a)[0];
                                        c.repObject = b;
                                        var d = new RequestBody;
                                        d.render(c.firstChild, b)
                                    } else {
                                        var c = a.nextSibling,
                                            e = Lib.getElementByClass(c,
                                                "netInfoBody");
                                        a.parentNode.removeChild(c)
                                    }
                                }
                            },
                            onOpenOptions: function(a) {
                                var b = Lib.fixEvent(a);
                                Lib.cancelEvent(a);
                                if (Lib.isLeftClick(a)) {
                                    var c = b.target,
                                        d = Lib.getAncestorByClass(c,
                                            "netRow"),
                                        e = this.getMenuItems(d),
                                        f = new Menu({
                                            id: "requestContextMenu",
                                            items: e
                                        });
                                    f.showPopup(c)
                                }
                            },
                            getMenuItems: function(a) {
                                var b = a.repObject,
                                    c = a.phase,
                                    d = c.files[0] == b && this.phases[
                                        0] == c,
                                    e = [{
                                        label: Strings.menuBreakTimeline,
                                        type: "checkbox",
                                        disabled: d,
                                        checked: c.files[0] == b &&
                                            !d,
                                        command: Lib.bind(this.breakLayout,
                                            this, a)
                                    }, "-", {
                                        label: Strings.menuOpenRequest,
                                        command: Lib.bind(this.openRequest,
                                            this, b)
                                    }, {
                                        label: Strings.menuOpenResponse,
                                        disabled: !b.response.content
                                            .text,
                                        command: Lib.bind(this.openResponse,
                                            this, b)
                                    }];
                                Lib.dispatch(this.listeners,
                                    "getMenuItems", [this, e, c, b]
                                );
                                return e
                            },
                            openRequest: function(a, b) {
                                window.open(b.request.url)
                            },
                            openResponse: function(a, b) {
                                var c = b.response.content.text,
                                    d = b.response.content.mimeType,
                                    e = b.response.content.encoding,
                                    f = "data:" + (d ? d : "") + ";" +
                                    (e ? e : "") + "," + c;
                                window.open(f)
                            },
                            breakLayout: function(a, b) {
                                var c = b.repObject,
                                    d = b.phase,
                                    e = d.files[0] == c;
                                b.breakLayout = !e, b.setAttribute(
                                    "breakLayout", b.breakLayout ?
                                    "true" : "false");
                                var f = Lib.getAncestorByClass(b,
                                        "netTable"),
                                    g = HarModel.getParentPage(this.input,
                                        c);
                                this.updateLayout(f, g)
                            },
                            updateLayout: function(a, b) {
                                var c = HarModel.getPageEntries(this.input,
                                    b);
                                this.table = a;
                                var d = this.table.firstChild,
                                    e = this.firstRow = d.firstChild.nextSibling;
                                this.phases = [];
                                var f = Cookies.getCookie(
                                    "phaseInterval");
                                f || (f = 4e3);
                                var g = null,
                                    h = b ? Lib.parseISO8601(b.startedDateTime) :
                                    null,
                                    i = b && b.pageTimings ? b.pageTimings
                                    .onLoad : -1;
                                i > 0 && (i += h);
                                for (var j = 0; j < c.length; j++) {
                                    var k = c[j];
                                    Lib.hasClass(e, "netInfoRow") && (e =
                                            e.nextSibling), e.repObject =
                                        k, h || (h = Lib.parseISO8601(k
                                            .startedDateTime));
                                    var l = Lib.parseISO8601(k.startedDateTime),
                                        m = g ? Lib.parseISO8601(g.getLastStartTime()) :
                                        0,
                                        n = g ? g.endTime : 0,
                                        o = !1;
                                    f >= 0 && (o = l > i && l - m >= f &&
                                            l + k.time >= n + f),
                                        typeof e.breakLayout ==
                                        "boolean" ? !g || e.breakLayout ?
                                        g = this.startPhase(k) : g.addFile(
                                            k) : !g || o ? g = this.startPhase(
                                            k) : g.addFile(k), this.phases[
                                            0] != g && e.setAttribute(
                                            "breakLayout", g.files[0] ==
                                            k ? "true" : "false");
                                    if (g.startTime == undefined || g.startTime >
                                        l) g.startTime = l;
                                    if (g.endTime == undefined || g.endTime <
                                        l + k.time) g.endTime = l + k.time;
                                    e = e.nextSibling
                                }
                                this.updateTimeStamps(b), this.updateTimeline(
                                    b), this.updateSummaries(b)
                            },
                            startPhase: function(a) {
                                var b = new Phase(a);
                                this.phases.push(b);
                                return b
                            },
                            calculateFileTimes: function(a, b, c) {
                                c != b.phase && (c = b.phase, this.phaseStartTime =
                                    c.startTime, this.phaseEndTime =
                                    c.endTime, this.phaseElapsed =
                                    this.phaseEndTime - c.startTime
                                );
                                var d = b.timings.blocked < 0 ? 0 : b.timings
                                    .blocked,
                                    e = d + (b.timings.dns < 0 ? 0 : b.timings
                                        .dns),
                                    f = e + (b.timings.connect < 0 ? 0 :
                                        b.timings.connect),
                                    g = f + (b.timings.send < 0 ? 0 : b
                                        .timings.send),
                                    h = g + (b.timings.wait < 0 ? 0 : b
                                        .timings.wait),
                                    i = h + (b.timings.receive < 0 ? 0 :
                                        b.timings.receive),
                                    j = b.time,
                                    k = Lib.parseISO8601(b.startedDateTime);
                                this.barOffset = ((k - this.phaseStartTime) /
                                    this.phaseElapsed * 100).toFixed(
                                    3), this.barBlockingWidth = (d /
                                    this.phaseElapsed * 100).toFixed(
                                    3), this.barResolvingWidth = (e /
                                    this.phaseElapsed * 100).toFixed(
                                    3), this.barConnectingWidth = (
                                    f / this.phaseElapsed * 100).toFixed(
                                    3), this.barSendingWidth = (g /
                                    this.phaseElapsed * 100).toFixed(
                                    3), this.barWaitingWidth = (h /
                                    this.phaseElapsed * 100).toFixed(
                                    3), this.barReceivingWidth = (i /
                                    this.phaseElapsed * 100).toFixed(
                                    3), this.calculatePageTimings(a,
                                    b, c);
                                return c
                            },
                            calculatePageTimings: function(a, b, c) {
                                if (a) {
                                    var d = Lib.parseISO8601(a.startedDateTime);
                                    for (var e = 0; e < c.pageTimings.length; e++) {
                                        var f = c.pageTimings[e].time;
                                        if (f > 0) {
                                            var g = d + f - c.startTime,
                                                h = (g / this.phaseElapsed *
                                                    100).toFixed(3);
                                            c.pageTimings[e].offset = h
                                        }
                                    }
                                }
                            },
                            updateTimeline: function(a) {
                                var b = this.table.firstChild,
                                    c;
                                for (var d = this.firstRow; d; d = d.nextSibling) {
                                    var e = d.repObject;
                                    if (!e) continue;
                                    if (Lib.hasClass(d, "netInfoRow"))
                                        continue;
                                    c = this.calculateFileTimes(a, e, c),
                                        d.phase = e.phase, delete e.phase;
                                    var f = Lib.getElementByClass(d,
                                            "netTimelineBar"),
                                        g = f.children[0],
                                        h = g.nextSibling,
                                        i = h.nextSibling,
                                        j = i.nextSibling,
                                        k = j.nextSibling,
                                        l = k.nextSibling;
                                    g.style.left = i.style.left = h.style
                                        .left = j.style.left = k.style.left =
                                        l.style.left = this.barOffset +
                                        "%", g.style.width = this.barBlockingWidth +
                                        "%", h.style.width = this.barResolvingWidth +
                                        "%", i.style.width = this.barConnectingWidth +
                                        "%", j.style.width = this.barSendingWidth +
                                        "%", k.style.width = this.barWaitingWidth +
                                        "%", l.style.width = this.barReceivingWidth +
                                        "%";
                                    var m = Lib.getElementsByClass(f,
                                        "netPageTimingBar");
                                    for (var n = 0; n < m.length; n++) m[
                                        n].parentNode.removeChild(m[
                                        n]);
                                    for (var n = 0; n < c.pageTimings.length; n++) {
                                        var o = c.pageTimings[n];
                                        if (!o.offset) continue;
                                        var p = f.ownerDocument.createElement(
                                            "DIV");
                                        f.appendChild(p), o.classes &&
                                            Lib.setClass(p, o.classes),
                                            Lib.setClass(p,
                                                "netPageTimingBar netBar"
                                            ), p.style.left = o.offset +
                                            "%", p.style.display =
                                            "block", o.offset = null
                                    }
                                }
                            },
                            updateTimeStamps: function(a) {
                                if (a) {
                                    var b = [];
                                    for (var c = 0; a.pageTimings && c <
                                        this.pageTimings.length; c++) {
                                        var d = this.pageTimings[c],
                                            e = a.pageTimings[d.name];
                                        e > 0 && b.push({
                                            label: d.name,
                                            time: e,
                                            classes: d.classes,
                                            comment: d.description
                                        })
                                    }
                                    var f = a.pageTimings ? a.pageTimings
                                        ._timeStamps : [];
                                    f && b.push.apply(b, f);
                                    var g = this.phases;
                                    for (var c = 0; c < g.length; c++) {
                                        var h = g[c],
                                            i = g[c + 1];
                                        for (var j = 0; j < b.length; j++) {
                                            var k = b[j],
                                                l = k.time;
                                            if (!l) continue;
                                            var m = Lib.parseISO8601(a.startedDateTime);
                                            l += m;
                                            if (!i || l < i.startTime)
                                                if (c == 0 || l >= h.startTime)
                                                    h.startTime > l &&
                                                    (h.startTime = l),
                                                    h.endTime < l && (h
                                                        .endTime = l),
                                                    h.pageTimings.push({
                                                        classes: k.classes ?
                                                            k.classes :
                                                            "netTimeStampBar",
                                                        name: k.label,
                                                        description: k
                                                            .comment,
                                                        time: k.time
                                                    })
                                        }
                                    }
                                }
                            },
                            updateSummaries: function(a) {
                                var b = this.phases,
                                    c = 0,
                                    d = 0,
                                    e = 0,
                                    f = 0;
                                for (var g = 0; g < b.length; ++g) {
                                    var h = b[g];
                                    h.invalidPhase = !1;
                                    var i = this.summarizePhase(h);
                                    c += i.fileCount, d += i.totalSize,
                                        e += i.cachedSize, f += i.totalTime
                                }
                                var j = this.summaryRow;
                                if (j) {
                                    var k = Lib.getElementByClass(j,
                                        "netCountLabel");
                                    k.firstChild.nodeValue = this.formatRequestCount(
                                        c);
                                    var l = Lib.getElementByClass(j,
                                        "netTotalSizeLabel");
                                    l.setAttribute("totalSize", d), l.firstChild
                                        .nodeValue = Lib.formatSize(d);
                                    var m = Lib.getElementByClass(j,
                                        "netCacheSizeLabel");
                                    m.setAttribute("collapsed", e == 0),
                                        m.childNodes[1].firstChild.nodeValue =
                                        Lib.formatSize(e);
                                    var n = Lib.getElementByClass(j,
                                            "netTotalTimeLabel"),
                                        o = Lib.formatTime(f);
                                    a && a.pageTimings.onLoad > 0 && (o +=
                                        " (onload: " + Lib.formatTime(
                                            a.pageTimings.onLoad) +
                                        ")"), n.innerHTML = o
                                }
                            },
                            formatRequestCount: function(a) {
                                return a + " " + (a == 1 ? Strings.request :
                                    Strings.requests)
                            },
                            summarizePhase: function(a) {
                                var b = 0,
                                    c = 0,
                                    d = "all";
                                d == "all" && (d = null);
                                var e = 0,
                                    f = 0,
                                    g = 0;
                                for (var h = 0; h < a.files.length; h++) {
                                    var i = a.files[h],
                                        j = Lib.parseISO8601(i.startedDateTime);
                                    if (!d || i.category == d) {
                                        ++e;
                                        var k = i.response.bodySize,
                                            l = k && k != -1 ? k : i.response
                                            .content.size;
                                        c += l, i.response.status ==
                                            304 && (b += l);
                                        if (!f || j < f) f = j;
                                        var m = j + i.time;
                                        m > g && (g = m)
                                    }
                                }
                                var n = g - f;
                                return {
                                    cachedSize: b,
                                    totalSize: c,
                                    totalTime: n,
                                    fileCount: e
                                }
                            },
                            showInfoTip: function(a, b, c, d) {
                                var e = Lib.getAncestorByClass(b,
                                    "netTable");
                                if (e && e.repObject == this) {
                                    var f = Lib.getAncestorByClass(b,
                                        "netRow");
                                    if (f) {
                                        if (Lib.getAncestorByClass(b,
                                                "netBar")) {
                                            a.setAttribute("multiline", !
                                                0);
                                            var g = f.repObject.startedDateTime +
                                                "-nettime";
                                            this.infoTipURL = g;
                                            return this.populateTimeInfoTip(
                                                a, f)
                                        }
                                        if (Lib.hasClass(b,
                                                "netSizeLabel")) {
                                            var g = f.repObject.startedDateTime +
                                                "-netsize";
                                            this.infoTipURL = g;
                                            return this.populateSizeInfoTip(
                                                a, f)
                                        }
                                    }
                                }
                            },
                            populateTimeInfoTip: function(a, b) {
                                EntryTimeInfoTip.render(this, b, a);
                                return !0
                            },
                            populateSizeInfoTip: function(a, b) {
                                EntrySizeInfoTip.render(this, b, a);
                                return !0
                            },
                            render: function(a, b) {
                                var c = HarModel.getPageEntries(this.input,
                                    b);
                                if (!c.length) return null;
                                return this.append(a, b, c)
                            },
                            append: function(a, b, c) {
                                this.table || (this.table = this.tableTag
                                        .replace({
                                            requestList: this
                                        }, a, this)), this.summaryRow ||
                                    (this.summaryRow = this.summaryTag.insertRows({},
                                        this.table.firstChild)[0]);
                                var d = this.table.firstChild,
                                    e = d.lastChild.previousSibling,
                                    f = this.fileTag.insertRows({
                                        files: c
                                    }, e, this);
                                this.updateLayout(this.table, b);
                                return f[0]
                            },
                            addPageTiming: function(a) {
                                this.pageTimings.push(a)
                            }
                        });

                    function Phase(a) {
                        this.files = [], this.pageTimings = [], this.addFile(a)
                    }
                    Phase.prototype = {
                        addFile: function(a) {
                            this.files.push(a), a.phase = this
                        },
                        getLastStartTime: function() {
                            return this.files[this.files.length - 1].startedDateTime
                        }
                    };
                    var EntryTimeInfoTip = domplate({
                            tableTag: TABLE({
                                "class": "timeInfoTip"
                            }, TBODY()),
                            timingsTag: FOR("time", "$timings", TR({
                                    "class": "timeInfoTipRow",
                                    $collapsed: "$time|hideBar"
                                }, TD({
                                    "class": "$time|getBarClass timeInfoTipBar",
                                    $loaded: "$time.loaded",
                                    $fromCache: "$time.fromCache"
                                }), TD({
                                        "class": "timeInfoTipCell startTime"
                                    },
                                    "$time.start|formatStartTime"),
                                TD({
                                    "class": "timeInfoTipCell elapsedTime"
                                }, "$time.elapsed|formatTime"), TD(
                                    "$time|getLabel"))),
                            startTimeTag: TR(TD(), TD(
                                    "$startTime.time|formatStartTime"),
                                TD({
                                    "class": "timeInfoTipStartLabel",
                                    colspan: 2
                                }, "$startTime|getLabel")),
                            separatorTag: TR({}, TD({
                                "class": "timeInfoTipSeparator",
                                colspan: 4,
                                height: "10px"
                            }, SPAN("$label"))),
                            eventsTag: FOR("event", "$events", TR({
                                    "class": "timeInfoTipEventRow"
                                }, TD({
                                    "class": "timeInfoTipBar",
                                    align: "center"
                                }, DIV({
                                    "class": "$event|getPageTimingClass timeInfoTipEventBar"
                                })), TD(
                                    "$event.start|formatStartTime"),
                                TD({
                                    colspan: 2
                                }, "$event|getTimingLabel"))),
                            hideBar: function(a) {
                                return !a.elapsed && a.bar ==
                                    "request.phase.Blocking"
                            },
                            getBarClass: function(a) {
                                var b = a.bar.substr(a.bar.lastIndexOf(
                                    ".") + 1);
                                return "net" + b + "Bar"
                            },
                            getPageTimingClass: function(a) {
                                return a.classes ? a.classes : ""
                            },
                            formatTime: function(a) {
                                return Lib.formatTime(a)
                            },
                            formatStartTime: function(a) {
                                var b = a > 0,
                                    c = Lib.formatTime(Math.abs(a));
                                if (!a) return c;
                                return (b > 0 ? "+" : "-") + c
                            },
                            getLabel: function(a) {
                                return Strings[a.bar]
                            },
                            getTimingLabel: function(a) {
                                return a.bar
                            },
                            render: function(a, b, c) {
                                var d = a.input,
                                    e = b.repObject,
                                    f = HarModel.getParentPage(d, e),
                                    g = f ? Lib.parseISO8601(f.startedDateTime) :
                                    null,
                                    h = Lib.parseISO8601(e.startedDateTime),
                                    i = EntryTimeInfoTip.tableTag.replace({},
                                        c),
                                    j = {};
                                g ? j.time = h - g : j.time = h - b.phase
                                    .startTime, j.bar =
                                    "request.Started", this.startTimeTag
                                    .insertRows({
                                        startTime: j
                                    }, i.firstChild), this.separatorTag
                                    .insertRows({
                                        label: Strings[
                                            "request.phases.label"
                                        ]
                                    }, i.firstChild);
                                var k = 0,
                                    l = [],
                                    m = e.timings.blocked,
                                    n = e.timings.dns,
                                    o = e.timings.ssl,
                                    p = e.timings.connect,
                                    q = e.timings.send,
                                    r = e.timings.wait,
                                    s = e.timings.receive;
                                m >= 0 && l.push({
                                    bar: "request.phase.Blocking",
                                    elapsed: m,
                                    start: k
                                }), n >= 0 && l.push({
                                    bar: "request.phase.Resolving",
                                    elapsed: n,
                                    start: k += m < 0 ? 0 : m
                                }), p >= 0 && l.push({
                                    bar: "request.phase.Connecting",
                                    elapsed: p,
                                    start: k += n < 0 ? 0 : n
                                }), q >= 0 && l.push({
                                    bar: "request.phase.Sending",
                                    elapsed: q,
                                    start: k += p < 0 ? 0 : p
                                }), r >= 0 && l.push({
                                    bar: "request.phase.Waiting",
                                    elapsed: r,
                                    start: k += q < 0 ? 0 : q
                                }), s >= 0 && l.push({
                                    bar: "request.phase.Receiving",
                                    elapsed: s,
                                    start: k += r < 0 ? 0 : r,
                                    loaded: e.loaded,
                                    fromCache: e.fromCache
                                }), this.timingsTag.insertRows({
                                    timings: l
                                }, i.firstChild);
                                if (!f) return !0;
                                var t = [];
                                for (var u = 0; u < b.phase.pageTimings
                                    .length; u++) {
                                    var v = b.phase.pageTimings[u];
                                    t.push({
                                        bar: v.description ? v.description :
                                            v.name,
                                        start: g + v.time - h,
                                        classes: v.classes,
                                        time: v.time
                                    })
                                }
                                t.length && (t.sort(function(a, b) {
                                        return a.time < b.time ?
                                            -1 : 1
                                    }), this.separatorTag.insertRows({
                                        label: Strings[
                                            "request.timings.label"
                                        ]
                                    }, i.firstChild), this.eventsTag
                                    .insertRows({
                                        events: t
                                    }, i.firstChild));
                                return !0
                            }
                        }),
                        EntrySizeInfoTip = domplate({
                            tag: DIV({
                                "class": "sizeInfoTip"
                            }, "$file|getSize"),
                            zippedTag: DIV(DIV({
                                "class": "sizeInfoTip"
                            }, "$file|getBodySize"), DIV({
                                "class": "sizeInfoTip"
                            }, "$file|getContentSize")),
                            getSize: function(a) {
                                var b = a.response.bodySize;
                                if (b < 0) return Strings.unknownSize;
                                return Lib.formatString(Strings.tooltipSize,
                                    Lib.formatSize(b), Lib.formatNumber(
                                        b))
                            },
                            getBodySize: function(a) {
                                var b = a.response.bodySize;
                                if (b < 0) return Strings.unknownSize;
                                return Lib.formatString(Strings.tooltipZippedSize,
                                    Lib.formatSize(b), Lib.formatNumber(
                                        b))
                            },
                            getContentSize: function(a) {
                                var b = a.response.content.size;
                                if (b < 0) return Strings.unknownSize;
                                return Lib.formatString(Strings.tooltipUnzippedSize,
                                    Lib.formatSize(b), Lib.formatNumber(
                                        b))
                            },
                            render: function(a, b, c) {
                                var d = a.input,
                                    e = b.repObject;
                                if (e.response.bodySize == e.response.content
                                    .size) return this.tag.replace({
                                    file: e
                                }, c);
                                return this.zippedTag.replace({
                                    file: e
                                }, c)
                            }
                        });
                    return RequestList
                }
            }), define("nls/pageList", {
                root: {
                    "column.label.url": "URL",
                    "column.label.status": "Status",
                    "column.label.type": "Type",
                    "column.label.domain": "Domain",
                    "column.label.size": "Size",
                    "column.label.timeline": "Timeline",
                    "action.label.Reset": "Reset"
                }
            }), require.def("preview/pageList", ["domplate/domplate", "core/lib",
                "core/trace", "core/cookies", "preview/requestList",
                "i18n!nls/pageList", "domplate/popupMenu"
            ], function(Domplate, Lib, Trace, Cookies, RequestList, Strings, Menu) {
                with(Domplate) {
                    function PageList(a) {
                        this.input = a, this.listeners = []
                    }
                    PageList.prototype = domplate({
                        tableTag: TABLE({
                            "class": "pageTable",
                            cellpadding: 0,
                            cellspacing: 0,
                            onclick: "$onClick",
                            _repObject: "$input"
                        }, TBODY(TAG("$rowTag", {
                            groups: "$input.log.pages"
                        }))),
                        rowTag: FOR("group", "$groups", TR({
                            "class": "pageRow",
                            _repObject: "$group"
                        }, TD({
                            "class": "groupName pageCol",
                            width: "1%"
                        }, SPAN({
                            "class": "pageName"
                        }, "$group|getPageTitle")), TD({
                            "class": "netOptionsCol netCol",
                            width: "15px"
                        }, DIV({
                            "class": "netOptionsLabel netLabel",
                            onclick: "$onOpenOptions"
                        })))),
                        bodyTag: TR({
                            "class": "pageInfoRow",
                            style: "height:auto;"
                        }, TD({
                            "class": "pageInfoCol",
                            colspan: 2
                        })),
                        getPageTitle: function(a) {
                            return Lib.cropString(a.title, 100)
                        },
                        getPageID: function(a) {
                            return "[" + a.id + "]"
                        },
                        onClick: function(a) {
                            var b = Lib.fixEvent(a);
                            if (Lib.isLeftClick(a)) {
                                var c = Lib.getAncestorByClass(b.target,
                                    "pageRow");
                                c && (this.toggleRow(c), Lib.cancelEvent(
                                    a))
                            }
                        },
                        toggleRow: function(a, b) {
                            var c = Lib.hasClass(a, "opened");
                            if (!c || !b) {
                                Lib.toggleClass(a, "opened");
                                if (Lib.hasClass(a, "opened")) {
                                    var d = this.bodyTag.insertRows({},
                                            a)[0],
                                        e = this.createRequestList(),
                                        f = PageList.prototype.pageTimings;
                                    for (var g = 0; g < f.length; g++)
                                        e.addPageTiming(f[g]);
                                    e.render(d.firstChild, a.repObject)
                                } else {
                                    var d = a.nextSibling;
                                    a.parentNode.removeChild(d)
                                }
                            }
                        },
                        expandAll: function(a) {
                            var b = a.firstChild.firstChild;
                            while (b) Lib.hasClass(b, "pageRow") &&
                                this.toggleRow(b, !0), b = b.nextSibling
                        },
                        getPageRow: function(a) {
                            var b = this.element.parentNode,
                                c = Lib.getElementsByClass(b,
                                    "pageRow");
                            for (var d = 0; d < c.length; d++) {
                                var e = c[d];
                                if (e.repObject == a) return e
                            }
                        },
                        togglePage: function(a) {
                            var b = this.getPageRow(a);
                            this.toggleRow(b)
                        },
                        expandPage: function(a) {
                            var b = this.getPageRow(a);
                            this.toggleRow(b, !0)
                        },
                        collapsePage: function(a) {
                            var b = this.getPageRow(a);
                            Lib.hasClass(b, "opened") && this.toggleRow(
                                b)
                        },
                        onOpenOptions: function(a) {
                            var b = Lib.fixEvent(a);
                            Lib.cancelEvent(a);
                            if (Lib.isLeftClick(a)) {
                                var c = b.target,
                                    d = Lib.getAncestorByClass(c,
                                        "pageRow"),
                                    e = this.getMenuItems(d.repObject),
                                    f = new Menu({
                                        id: "requestContextMenu",
                                        items: e
                                    });
                                f.showPopup(c)
                            }
                        },
                        getMenuItems: function(a) {
                            var b = RequestList.getHiddenColumns().join(),
                                c, d = 0,
                                e = [];
                            for (var f = 0; f < RequestList.columns
                                .length; f++) {
                                var g = RequestList.columns[f],
                                    h = b.indexOf(g) == -1;
                                e.push({
                                    label: Strings[
                                        "column.label." +
                                        g],
                                    type: "checkbox",
                                    checked: h,
                                    command: Lib.bindFixed(
                                        this.onToggleColumn,
                                        this, g)
                                }), h && (c = f, d++)
                            }
                            d == 1 && (e[c].disabled = !0), e.push(
                                "-"), e.push({
                                label: Strings[
                                    "action.label.Reset"
                                ],
                                command: Lib.bindFixed(this
                                    .updateColumns,
                                    this)
                            });
                            return e
                        },
                        onToggleColumn: function(a) {
                            var b = RequestList.getHiddenColumns();
                            Lib.remove(b, a) || b.push(a), this.updateColumns(
                                b)
                        },
                        updateColumns: function(a) {
                            var b = a || RequestList.columnsHiddenByDefault;
                            Cookies.setCookie("hiddenCols", b.join(
                                " ")), document.getElementById(
                                "content").setAttribute(
                                "hiddenCols", b.join(" "))
                        },
                        createRequestList: function() {
                            var a = new RequestList(this.input);
                            a.listeners = this.listeners;
                            return a
                        },
                        append: function(a) {
                            var b = this.createRequestList();
                            b.render(a, null);
                            var c = this.input.log.pages;
                            if (c && c.length) {
                                var d = this.tableTag.append({
                                        input: this.input
                                    }, a, this),
                                    e = d.firstChild.childNodes.length,
                                    f = d.parentNode.childNodes.length;
                                e == 1 && f == 1 && this.toggleRow(
                                    d.firstChild.firstChild);
                                var g = Lib.getURLParameter(
                                    "expand");
                                g && this.expandAll(d)
                            }
                        },
                        render: function(a) {
                            this.append(a)
                        },
                        addListener: function(a) {
                            this.listeners.push(a)
                        },
                        removeListener: function(a) {
                            Lib.remove(this.listeners, a)
                        }
                    }), PageList.prototype.pageTimings = [];
                    return PageList
                }
            }), require.def("domplate/toolbar", ["domplate/domplate", "core/lib",
                "core/trace", "domplate/popupMenu"
            ], function(Domplate, Lib, Trace, Menu) {
                with(Domplate) {
                    var ToolbarTempl = domplate({
                        tag: DIV({
                            "class": "toolbar",
                            onclick: "$onClick"
                        }),
                        buttonTag: SPAN({
                            "class": "$button|getClassName toolbarButton",
                            title: "$button.tooltiptext",
                            $text: "$button|hasLabel",
                            onclick: "$button|getCommand"
                        }, "$button|getLabel"),
                        dropDownTag: SPAN({
                            "class": "$button|getClassName toolbarButton dropDown",
                            _repObject: "$button",
                            title: "$button.tooltiptext",
                            $text: "$button|hasLabel",
                            onclick: "$onDropDown"
                        }, "$button|getLabel", SPAN({
                            "class": "arrow"
                        })),
                        separatorTag: SPAN({
                            "class": "toolbarSeparator",
                            style: "color: gray;"
                        }, "|"),
                        hasLabel: function(a) {
                            return a.label ? !0 : !1
                        },
                        getLabel: function(a) {
                            return a.label ? a.label : ""
                        },
                        getClassName: function(a) {
                            return a.className ? a.className : ""
                        },
                        getCommand: function(a) {
                            return a.command ? a.command : function() {}
                        },
                        onClick: function(a) {
                            var b = $.event.fix(a || window.event);
                            Lib.cancelEvent(b)
                        },
                        onDropDown: function(a) {
                            var b = $.event.fix(a || window.event),
                                c = b.target,
                                d = Lib.getAncestorByClass(c,
                                    "toolbarButton"),
                                e = d.repObject.items,
                                f = new Menu({
                                    id: "toolbarContextMenu",
                                    items: e
                                });
                            f.showPopup(d)
                        }
                    });

                    function Toolbar() {
                        this.buttons = []
                    }
                    Toolbar.prototype = {
                        addButton: function(a) {
                            a.tooltiptext || (tooltiptext = ""), this.buttons
                                .push(a)
                        },
                        removeButton: function(a) {
                            for (var b = 0; b < this.buttons.length; b++)
                                if (this.buttons[b].id == a) {
                                    this.buttons.splice(b, 1);
                                    break
                                }
                        },
                        addButtons: function(a) {
                            for (var b = 0; b < a.length; b++) this.addButton(
                                a[b])
                        },
                        getButton: function(a) {
                            for (var b = 0; b < this.buttons.length; b++)
                                if (this.buttons[b].id == a) return this
                                    .buttons[b]
                        },
                        render: function(a) {
                            if (this.buttons.length) {
                                this.element && (a = this.element.parentNode),
                                    this.element = ToolbarTempl.tag.replace({},
                                        a);
                                for (var b = 0; b < this.buttons.length; b++) {
                                    var c = this.buttons[b],
                                        d = c.items ? ToolbarTempl.dropDownTag :
                                        ToolbarTempl.buttonTag,
                                        e = c.tag ? c.tag : d;
                                    e.append({
                                            button: c
                                        }, this.element), b < this.buttons
                                        .length - 1 && ToolbarTempl.separatorTag
                                        .append({}, this.element)
                                }
                                return this.element
                            }
                        }
                    };
                    return Toolbar
                }
            }), require.def("preview/menu", ["domplate/domplate", "core/lib",
                "domplate/toolbar", "core/trace"
            ], function(Domplate, Lib, Toolbar, Trace) {
                with(Domplate) {
                    function Menu() {}
                    Menu.prototype = {
                        render: function(a) {
                            this.element = MenuPlate.render(a), this.toolbar =
                                new Toolbar, this.toolbar.addButton({
                                    id: "credentials",
                                    label: "Powered by Jan Odvarko",
                                    tooltiptext: "http://www.softwareishard.com/blog/har-viewer/",
                                    command: Lib.bindFixed(this.onCredentials,
                                        this, !0)
                                });
                            var b = Lib.getElementByClass(this.element,
                                "menuContent");
                            this.toolbar.render(b), Lib.isWebkit && (b.style
                                .paddingTop = "1px")
                        },
                        onCredentials: function() {
                            window.open(
                                "http://www.softwareishard.com/blog/har-viewer/"
                            )
                        },
                        onFullPreview: function() {}
                    };
                    var MenuPlate = domplate({
                        tag: DIV({
                            "class": "menu",
                            _repObject: "$object"
                        }, DIV({
                            "class": "menuHandle",
                            onmousemove: "$onMouseMove",
                            onclick: "$onMouseClick"
                        }), DIV({
                            "class": "menuContent",
                            style: "display: none"
                        })),
                        onMouseMove: function(a) {
                            var b = Lib.fixEvent(a);
                            this.open(b.target)
                        },
                        onMouseClick: function(a) {
                            var b = Lib.fixEvent(a);
                            this.toggle(b.target)
                        },
                        open: function(a) {
                            var b = Lib.getAncestorByClass(a,
                                    "menu"),
                                c = Lib.getElementByClass(b,
                                    "menuContent");
                            c.clientWidth <= 0 && this.toggle(a)
                        },
                        toggle: function(a) {
                            var b = Lib.getAncestorByClass(a,
                                    "menu"),
                                c = Lib.getElementByClass(b,
                                    "menuContent");
                            $(c).animate({
                                    width: "toggle"
                                }, undefined, undefined,
                                function() {
                                    var a = Lib.getElementByClass(
                                        b, "menuHandle");
                                    c.clientWidth > 0 ? Lib.setClass(
                                        a, "opened") : Lib.removeClass(
                                        a, "opened")
                                })
                        },
                        render: function(a, b) {
                            return this.tag.append({
                                object: b
                            }, a, this)
                        }
                    });
                    return Menu
                }
            }), require.def("harPreview", ["preview/pageList", "preview/harModel",
                "core/lib", "core/trace", "preview/menu"
            ], function(a, b, c, d, e) {
                function f() {
                    this.id = "harPreview", this.model = new b
                }
                f.prototype = {
                    initialize: function(a) {
                        this.topMenu = new e, this.topMenu.render(a);
                        var d = c.bind(this.appendPreview, this);
                        b.Loader.run(d)
                    },
                    appendPreview: function(e) {
                        try {
                            var f = b.parse(e, !0);
                            this.model.append(f);
                            var h = new a(f);
                            h.render(g), c.fireEvent(g,
                                "onPreviewHARLoaded")
                        } catch (i) {
                            d.exception(
                                "HarPreview.appendPreview; EXCEPTION ",
                                i)
                        }
                    },
                    loadHar: function(a, c) {
                        c = c || {};
                        return b.Loader.load(this, a, c.jsonp, c.jsonpCallback,
                            c.success, c.ajaxError)
                    }
                };
                var g = document.getElementById("content"),
                    h = g.repObject = new f;
                c.fireEvent(g, "onPreviewPreInit"), h.initialize(g), c.fireEvent(g,
                    "onPreviewInit"), d.log("HarPreview; initialized OK")
            });
        }  
    });
    
    
    })(jQuery,require = window.require || {});