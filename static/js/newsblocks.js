var MooTools = {
    version: "1.11"
};
function $defined(B) {
    return (B != undefined)
}
function $type(D) {
    if (!$defined(D)) {
        return false
    }
    if (D.htmlElement) {
        return "element"
    }
    var C = typeof D;
    if (C == "object" && D.nodeName) {
        switch (D.nodeType) {
        case 1:
            return "element";
        case 3:
            return (/\S/).test(D.nodeValue) ? "textnode": "whitespace"
        }
    }
    if (C == "object" || C == "function") {
        switch (D.constructor) {
        case Array:
            return "array";
        case RegExp:
            return "regexp";
        case Class:
            return "class"
        }
        if (typeof D.length == "number") {
            if (D.item) {
                return "collection"
            }
            if (D.callee) {
                return "arguments"
            }
        }
    }
    return C
}
function $merge() {
    var I = {};
    for (var J = 0; J < arguments.length; J++) {
        for (var G in arguments[J]) {
            var F = arguments[J][G];
            var H = I[G];
            if (H && $type(F) == "object" && $type(H) == "object") {
                I[G] = $merge(H, F)
            } else {
                I[G] = F
            }
        }
    }
    return I
}
var $extend = function() {
    var C = arguments;
    if (!C[1]) {
        C = [this, C[0]]
    }
    for (var D in C[1]) {
        C[0][D] = C[1][D]
    }
    return C[0]
};
var $native = function() {
    for (var D = 0, C = arguments.length; D < C; D++) {
        arguments[D].extend = function(B) {
            for (var A in B) {
                if (!this.prototype[A]) {
                    this.prototype[A] = B[A]
                }
                if (!this[A]) {
                    this[A] = $native.generic(A)
                }
            }
        }
    }
};
$native.generic = function(B) {
    return function(A) {
        return this.prototype[B].apply(A, Array.prototype.slice.call(arguments, 1))
    }
};
$native(Function, Array, String, Number);
function $chk(B) {
    return !! (B || B === 0)
}
function $pick(D, C) {
    return $defined(D) ? D: C
}
function $random(D, C) {
    return Math.floor(Math.random() * (C - D + 1) + D)
}
function $time() {
    return new Date().getTime()
}
function $clear(B) {
    clearTimeout(B);
    clearInterval(B);
    return null
}
var Abstract = function(B) {
    B = B || {};
    B.extend = $extend;
    return B
};
var Window = new Abstract(window);
var Document = new Abstract(document);
document.head = document.getElementsByTagName("head")[0];
window.xpath = !!(document.evaluate);
if (window.ActiveXObject) {
    window.ie = window[window.XMLHttpRequest ? "ie7": "ie6"] = true
} else {
    if (document.childNodes && !document.all && !navigator.taintEnabled) {
        window.webkit = window[window.xpath ? "webkit420": "webkit419"] = true
    } else {
        if (document.getBoxObjectFor != null) {
            window.gecko = true
        }
    }
}
window.khtml = window.webkit;
Object.extend = $extend;
if (typeof HTMLElement == "undefined") {
    var HTMLElement = function() {};
    if (window.webkit) {
        document.createElement("iframe")
    }
    HTMLElement.prototype = (window.webkit) ? window["[[DOMElement.prototype]]"] : {}
}
HTMLElement.prototype.htmlElement = function() {};
if (window.ie6) {
    try {
        document.execCommand("BackgroundImageCache", false, true)
    } catch(e) {}
}
var Class = function(D) {
    var C = function() {
        return (arguments[0] !== null && this.initialize && $type(this.initialize) == "function") ? this.initialize.apply(this, arguments) : this
    };
    $extend(C, this);
    C.prototype = D;
    C.constructor = Class;
    return C
};
Class.empty = function() {};
Class.prototype = {
    extend: function(H) {
        var G = new this(null);
        for (var F in H) {
            var E = G[F];
            G[F] = Class.Merge(E, H[F])
        }
        return new Class(G)
    },
    implement: function() {
        for (var D = 0, C = arguments.length; D < C; D++) {
            $extend(this.prototype, arguments[D])
        }
    }
};
Class.Merge = function(G, F) {
    if (G && G != F) {
        var H = $type(F);
        if (H != $type(G)) {
            return F
        }
        switch (H) {
        case "function":
            var E = function() {
                this.parent = arguments.callee.parent;
                return F.apply(this, arguments)
            };
            E.parent = G;
            return E;
        case "object":
            return $merge(G, F)
        }
    }
    return F
};
var Chain = new Class({
    chain: function(B) {
        this.chains = this.chains || [];
        this.chains.push(B);
        return this
    },
    callChain: function() {
        if (this.chains && this.chains.length) {
            this.chains.shift().delay(10, this)
        }
    },
    clearChain: function() {
        this.chains = []
    }
});
var Events = new Class({
    addEvent: function(D, C) {
        if (C != Class.empty) {
            this.$events = this.$events || {};
            this.$events[D] = this.$events[D] || [];
            this.$events[D].include(C)
        }
        return this
    },
    fireEvent: function(E, F, D) {
        if (this.$events && this.$events[E]) {
            this.$events[E].each(function(A) {
                A.create({
                    bind: this,
                    delay: D,
                    "arguments": F
                })()
            },
            this)
        }
        return this
    },
    removeEvent: function(D, C) {
        if (this.$events && this.$events[D]) {
            this.$events[D].remove(C)
        }
        return this
    }
});
var Options = new Class({
    setOptions: function() {
        this.options = $merge.apply(null, [this.options].extend(arguments));
        if (this.addEvent) {
            for (var B in this.options) {
                if ($type(this.options[B] == "function") && (/^on[A-Z]/).test(B)) {
                    this.addEvent(B, this.options[B])
                }
            }
        }
        return this
    }
});
Array.extend({
    forEach: function(G, F) {
        for (var H = 0, E = this.length; H < E; H++) {
            G.call(F, this[H], H, this)
        }
    },
    filter: function(H, G) {
        var I = [];
        for (var J = 0, F = this.length; J < F; J++) {
            if (H.call(G, this[J], J, this)) {
                I.push(this[J])
            }
        }
        return I
    },
    map: function(H, G) {
        var I = [];
        for (var J = 0, F = this.length; J < F; J++) {
            I[J] = H.call(G, this[J], J, this)
        }
        return I
    },
    every: function(G, F) {
        for (var H = 0, E = this.length; H < E; H++) {
            if (!G.call(F, this[H], H, this)) {
                return false
            }
        }
        return true
    },
    some: function(G, F) {
        for (var H = 0, E = this.length; H < E; H++) {
            if (G.call(F, this[H], H, this)) {
                return true
            }
        }
        return false
    },
    indexOf: function(G, F) {
        var E = this.length;
        for (var H = (F < 0) ? Math.max(0, E + F) : F || 0; H < E; H++) {
            if (this[H] === G) {
                return H
            }
        }
        return - 1
    },
    copy: function(F, G) {
        F = F || 0;
        if (F < 0) {
            F = this.length + F
        }
        G = G || (this.length - F);
        var E = [];
        for (var H = 0; H < G; H++) {
            E[H] = this[F++]
        }
        return E
    },
    remove: function(E) {
        var F = 0;
        var D = this.length;
        while (F < D) {
            if (this[F] === E) {
                this.splice(F, 1);
                D--
            } else {
                F++
            }
        }
        return this
    },
    contains: function(C, D) {
        return this.indexOf(C, D) != -1
    },
    associate: function(G) {
        var F = {},
        H = Math.min(this.length, G.length);
        for (var E = 0; E < H; E++) {
            F[G[E]] = this[E]
        }
        return F
    },
    extend: function(E) {
        for (var F = 0, D = E.length; F < D; F++) {
            this.push(E[F])
        }
        return this
    },
    merge: function(E) {
        for (var F = 0, D = E.length; F < D; F++) {
            this.include(E[F])
        }
        return this
    },
    include: function(B) {
        if (!this.contains(B)) {
            this.push(B)
        }
        return this
    },
    getRandom: function() {
        return this[$random(0, this.length - 1)] || null
    },
    getLast: function() {
        return this[this.length - 1] || null
    }
});
Array.prototype.each = Array.prototype.forEach;
Array.each = Array.forEach;
function $A(B) {
    return Array.copy(B)
}
function $each(G, H, F) {
    if (G && typeof G.length == "number" && $type(G) != "object") {
        Array.forEach(G, H, F)
    } else {
        for (var E in G) {
            H.call(F || G, G[E], E)
        }
    }
}
Array.prototype.test = Array.prototype.contains;
String.extend({
    test: function(C, D) {
        return (($type(C) == "string") ? new RegExp(C, D) : C).test(this)
    },
    toInt: function() {
        return parseInt(this, 10)
    },
    toFloat: function() {
        return parseFloat(this)
    },
    camelCase: function() {
        return this.replace(/-\D/g,
        function(B) {
            return B.charAt(1).toUpperCase()
        })
    },
    hyphenate: function() {
        return this.replace(/\w[A-Z]/g,
        function(B) {
            return (B.charAt(0) + "-" + B.charAt(1).toLowerCase())
        })
    },
    capitalize: function() {
        return this.replace(/\b[a-z]/g,
        function(B) {
            return B.toUpperCase()
        })
    },
    trim: function() {
        return this.replace(/^\s+|\s+$/g, "")
    },
    clean: function() {
        return this.replace(/\s{2,}/g, " ").trim()
    },
    rgbToHex: function(D) {
        var C = this.match(/\d{1,3}/g);
        return (C) ? C.rgbToHex(D) : false
    },
    hexToRgb: function(D) {
        var C = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
        return (C) ? C.slice(1).hexToRgb(D) : false
    },
    contains: function(C, D) {
        return (D) ? (D + this + D).indexOf(D + C + D) > -1 : this.indexOf(C) > -1
    },
    escapeRegExp: function() {
        return this.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
    }
});
Array.extend({
    rgbToHex: function(F) {
        if (this.length < 3) {
            return false
        }
        if (this.length == 4 && this[3] == 0 && !F) {
            return "transparent"
        }
        var H = [];
        for (var E = 0; E < 3; E++) {
            var G = (this[E] - 0).toString(16);
            H.push((G.length == 1) ? "0" + G: G)
        }
        return F ? H: "#" + H.join("")
    },
    hexToRgb: function(E) {
        if (this.length != 3) {
            return false
        }
        var D = [];
        for (var F = 0; F < 3; F++) {
            D.push(parseInt((this[F].length == 1) ? this[F] + this[F] : this[F], 16))
        }
        return E ? D: "rgb(" + D.join(",") + ")"
    }
});
Function.extend({
    create: function(C) {
        var D = this;
        C = $merge({
            bind: D,
            event: false,
            "arguments": null,
            delay: false,
            periodical: false,
            attempt: false
        },
        C);
        if ($chk(C.arguments) && $type(C.arguments) != "array") {
            C.arguments = [C.arguments]
        }
        return function(B) {
            var H;
            if (C.event) {
                B = B || window.event;
                H = [(C.event === true) ? B: new C.event(B)];
                if (C.arguments) {
                    H.extend(C.arguments)
                }
            } else {
                H = C.arguments || arguments
            }
            var A = function() {
                return D.apply($pick(C.bind, D), H)
            };
            if (C.delay) {
                return setTimeout(A, C.delay)
            }
            if (C.periodical) {
                return setInterval(A, C.periodical)
            }
            if (C.attempt) {
                try {
                    return A()
                } catch(G) {
                    return false
                }
            }
            return A()
        }
    },
    pass: function(C, D) {
        return this.create({
            "arguments": C,
            bind: D
        })
    },
    attempt: function(C, D) {
        return this.create({
            "arguments": C,
            bind: D,
            attempt: true
        })()
    },
    bind: function(D, C) {
        return this.create({
            bind: D,
            "arguments": C
        })
    },
    bindAsEventListener: function(D, C) {
        return this.create({
            bind: D,
            event: true,
            "arguments": C
        })
    },
    delay: function(F, E, D) {
        return this.create({
            delay: F,
            bind: E,
            "arguments": D
        })()
    },
    periodical: function(D, E, F) {
        return this.create({
            periodical: D,
            bind: E,
            "arguments": F
        })()
    }
});
Number.extend({
    toInt: function() {
        return parseInt(this)
    },
    toFloat: function() {
        return parseFloat(this)
    },
    limit: function(D, C) {
        return Math.min(C, Math.max(D, this))
    },
    round: function(B) {
        B = Math.pow(10, B || 0);
        return Math.round(this * B) / B
    },
    times: function(D) {
        for (var C = 0; C < this; C++) {
            D(C)
        }
    }
});
var Element = new Class({
    initialize: function(F, G) {
        if ($type(F) == "string") {
            if (window.ie && G && (G.name || G.type)) {
                var E = (G.name) ? ' name="' + G.name + '"': "";
                var H = (G.type) ? ' type="' + G.type + '"': "";
                delete G.name;
                delete G.type;
                F = "<" + F + E + H + ">"
            }
            F = document.createElement(F)
        }
        F = $(F);
        return (!G || !F) ? F: F.set(G)
    }
});
var Elements = new Class({
    initialize: function(B) {
        return (B) ? $extend(B, this) : this
    }
});
Elements.extend = function(C) {
    for (var D in C) {
        this.prototype[D] = C[D];
        this[D] = $native.generic(D)
    }
};
function $(D) {
    if (!D) {
        return null
    }
    if (D.htmlElement) {
        return Garbage.collect(D)
    }
    if ([window, document].contains(D)) {
        return D
    }
    var C = $type(D);
    if (C == "string") {
        D = document.getElementById(D);
        C = (D) ? "element": false
    }
    if (C != "element") {
        return null
    }
    if (D.htmlElement) {
        return Garbage.collect(D)
    }
    if (["object", "embed"].contains(D.tagName.toLowerCase())) {
        return D
    }
    $extend(D, Element.prototype);
    D.htmlElement = function() {};
    return Garbage.collect(D)
}
document.getElementsBySelector = document.getElementsByTagName;
function $$() {
    var F = [];
    for (var G = 0, H = arguments.length; G < H; G++) {
        var E = arguments[G];
        switch ($type(E)) {
        case "element":
            F.push(E);
        case "boolean":
            break;
        case false:
            break;
        case "string":
            E = document.getElementsBySelector(E, true);
        default:
            F.extend(E)
        }
    }
    return $$.unique(F)
}
$$.unique = function(I) {
    var L = [];
    for (var M = 0, H = I.length; M < H; M++) {
        if (I[M].$included) {
            continue
        }
        var N = $(I[M]);
        if (N && !N.$included) {
            N.$included = true;
            L.push(N)
        }
    }
    for (var J = 0, K = L.length; J < K; J++) {
        L[J].$included = null
    }
    return new Elements(L)
};
Elements.Multi = function(B) {
    return function() {
        var J = arguments;
        var L = [];
        var A = true;
        for (var I = 0, K = this.length, H; I < K; I++) {
            H = this[I][B].apply(this[I], J);
            if ($type(H) != "element") {
                A = false
            }
            L.push(H)
        }
        return (A) ? $$.unique(L) : L
    }
};
Element.extend = function(D) {
    for (var F in D) {
        HTMLElement.prototype[F] = D[F];
        Element.prototype[F] = D[F];
        Element[F] = $native.generic(F);
        var E = (Array.prototype[F]) ? F + "Elements": F;
        Elements.prototype[E] = Elements.Multi(F)
    }
};
Element.extend({
    set: function(D) {
        for (var E in D) {
            var F = D[E];
            switch (E) {
            case "styles":
                this.setStyles(F);
                break;
            case "events":
                if (this.addEvents) {
                    this.addEvents(F)
                }
                break;
            case "properties":
                this.setProperties(F);
                break;
            default:
                this.setProperty(E, F)
            }
        }
        return this
    },
    inject: function(G, E) {
        G = $(G);
        switch (E) {
        case "before":
            G.parentNode.insertBefore(this, G);
            break;
        case "after":
            var H = G.getNext();
            if (!H) {
                G.parentNode.appendChild(this)
            } else {
                G.parentNode.insertBefore(this, H)
            }
            break;
        case "top":
            var F = G.firstChild;
            if (F) {
                G.insertBefore(this, F);
                break
            }
        default:
            G.appendChild(this)
        }
        return this
    },
    injectBefore: function(B) {
        return this.inject(B, "before")
    },
    injectAfter: function(B) {
        return this.inject(B, "after")
    },
    injectInside: function(B) {
        return this.inject(B, "bottom")
    },
    injectTop: function(B) {
        return this.inject(B, "top")
    },
    adopt: function() {
        var B = [];
        $each(arguments,
        function(A) {
            B = B.concat(A)
        });
        $$(B).inject(this);
        return this
    },
    remove: function() {
        return this.parentNode.removeChild(this)
    },
    clone: function(E) {
        var F = $(this.cloneNode(E !== false));
        if (!F.$events) {
            return F
        }
        F.$events = {};
        for (var D in this.$events) {
            F.$events[D] = {
                keys: $A(this.$events[D].keys),
                values: $A(this.$events[D].values)
            }
        }
        return F.removeEvents()
    },
    replaceWith: function(B) {
        B = $(B);
        this.parentNode.replaceChild(B, this);
        return B
    },
    appendText: function(B) {
        this.appendChild(document.createTextNode(B));
        return this
    },
    hasClass: function(B) {
        return this.className.contains(B, " ")
    },
    addClass: function(B) {
        if (!this.hasClass(B)) {
            this.className = (this.className + " " + B).clean()
        }
        return this
    },
    removeClass: function(B) {
        this.className = this.className.replace(new RegExp("(^|\\s)" + B + "(?:\\s|$)"), "$1").clean();
        return this
    },
    toggleClass: function(B) {
        return this.hasClass(B) ? this.removeClass(B) : this.addClass(B)
    },
    setStyle: function(D, C) {
        switch (D) {
        case "opacity":
            return this.setOpacity(parseFloat(C));
        case "float":
            D = (window.ie) ? "styleFloat": "cssFloat"
        }
        D = D.camelCase();
        switch ($type(C)) {
        case "number":
            if (! ["zIndex", "zoom"].contains(D)) {
                C += "px"
            }
            break;
        case "array":
            C = "rgb(" + C.join(",") + ")"
        }
        this.style[D] = C;
        return this
    },
    setStyles: function(B) {
        switch ($type(B)) {
        case "object":
            Element.setMany(this, "setStyle", B);
            break;
        case "string":
            this.style.cssText = B
        }
        return this
    },
    setOpacity: function(B) {
        if (B == 0) {
            if (this.style.visibility != "hidden") {
                this.style.visibility = "hidden"
            }
        } else {
            if (this.style.visibility != "visible") {
                this.style.visibility = "visible"
            }
        }
        if (!this.currentStyle || !this.currentStyle.hasLayout) {
            this.style.zoom = 1
        }
        if (window.ie) {
            this.style.filter = (B == 1) ? "": "alpha(opacity=" + B * 100 + ")"
        }
        this.style.opacity = this.$tmp.opacity = B;
        return this
    },
    getStyle: function(G) {
        G = G.camelCase();
        var E = this.style[G];
        if (!$chk(E)) {
            if (G == "opacity") {
                return this.$tmp.opacity
            }
            E = [];
            for (var H in Element.Styles) {
                if (G == H) {
                    Element.Styles[H].each(function(A) {
                        var B = this.getStyle(A);
                        E.push(parseInt(B) ? B: "0px")
                    },
                    this);
                    if (G == "border") {
                        var F = E.every(function(A) {
                            return (A == E[0])
                        });
                        return (F) ? E[0] : false
                    }
                    return E.join(" ")
                }
            }
            if (G.contains("border")) {
                if (Element.Styles.border.contains(G)) {
                    return ["Width", "Style", "Color"].map(function(A) {
                        return this.getStyle(G + A)
                    },
                    this).join(" ")
                } else {
                    if (Element.borderShort.contains(G)) {
                        return ["Top", "Right", "Bottom", "Left"].map(function(A) {
                            return this.getStyle("border" + A + G.replace("border", ""))
                        },
                        this).join(" ")
                    }
                }
            }
            if (document.defaultView) {
                E = document.defaultView.getComputedStyle(this, null).getPropertyValue(G.hyphenate())
            } else {
                if (this.currentStyle) {
                    E = this.currentStyle[G]
                }
            }
        }
        if (window.ie) {
            E = Element.fixStyle(G, E, this)
        }
        if (E && G.test(/color/i) && E.contains("rgb")) {
            return E.split("rgb").splice(1, 4).map(function(A) {
                return A.rgbToHex()
            }).join(" ")
        }
        return E
    },
    getStyles: function() {
        return Element.getMany(this, "getStyle", arguments)
    },
    walk: function(D, E) {
        D += "Sibling";
        var F = (E) ? this[E] : this[D];
        while (F && $type(F) != "element") {
            F = F[D]
        }
        return $(F)
    },
    getPrevious: function() {
        return this.walk("previous")
    },
    getNext: function() {
        return this.walk("next")
    },
    getFirst: function() {
        return this.walk("next", "firstChild")
    },
    getLast: function() {
        return this.walk("previous", "lastChild")
    },
    getParent: function() {
        return $(this.parentNode)
    },
    getChildren: function() {
        return $$(this.childNodes)
    },
    hasChild: function(B) {
        return !! $A(this.getElementsByTagName("*")).contains(B)
    },
    getProperty: function(F) {
        var H = Element.Properties[F];
        if (H) {
            return this[H]
        }
        var E = Element.PropertiesIFlag[F] || 0;
        if (!window.ie || E) {
            return this.getAttribute(F, E)
        }
        var G = this.attributes[F];
        return (G) ? G.nodeValue: null
    },
    removeProperty: function(D) {
        var C = Element.Properties[D];
        if (C) {
            this[C] = ""
        } else {
            this.removeAttribute(D)
        }
        return this
    },
    getProperties: function() {
        return Element.getMany(this, "getProperty", arguments)
    },
    setProperty: function(E, F) {
        var D = Element.Properties[E];
        if (D) {
            this[D] = F
        } else {
            this.setAttribute(E, F)
        }
        return this
    },
    setProperties: function(B) {
        return Element.setMany(this, "setProperty", B)
    },
    setHTML: function() {
        this.innerHTML = $A(arguments).join("");
        return this
    },
    setText: function(D) {
        var C = this.getTag();
        if (["style", "script"].contains(C)) {
            if (window.ie) {
                if (C == "style") {
                    this.styleSheet.cssText = D
                } else {
                    if (C == "script") {
                        this.setProperty("text", D)
                    }
                }
                return this
            } else {
                this.removeChild(this.firstChild);
                return this.appendText(D)
            }
        }
        this[$defined(this.innerText) ? "innerText": "textContent"] = D;
        return this
    },
    getText: function() {
        var B = this.getTag();
        if (["style", "script"].contains(B)) {
            if (window.ie) {
                if (B == "style") {
                    return this.styleSheet.cssText
                } else {
                    if (B == "script") {
                        return this.getProperty("text")
                    }
                }
            } else {
                return this.innerHTML
            }
        }
        return ($pick(this.innerText, this.textContent))
    },
    getTag: function() {
        return this.tagName.toLowerCase()
    },
    empty: function() {
        Garbage.trash(this.getElementsByTagName("*"));
        return this.setHTML("")
    }
});
Element.fixStyle = function(G, F, H) {
    if ($chk(parseInt(F))) {
        return F
    }
    if (["height", "width"].contains(G)) {
        var J = (G == "width") ? ["left", "right"] : ["top", "bottom"];
        var I = 0;
        J.each(function(A) {
            I += H.getStyle("border-" + A + "-width").toInt() + H.getStyle("padding-" + A).toInt()
        });
        return H["offset" + G.capitalize()] - I + "px"
    } else {
        if (G.test(/border(.+)Width|margin|padding/)) {
            return "0px"
        }
    }
    return F
};
Element.Styles = {
    border: [],
    padding: [],
    margin: []
};
["Top", "Right", "Bottom", "Left"].each(function(D) {
    for (var C in Element.Styles) {
        Element.Styles[C].push(C + D)
    }
});
Element.borderShort = ["borderWidth", "borderStyle", "borderColor"];
Element.getMany = function(H, F, G) {
    var E = {};
    $each(G,
    function(A) {
        E[A] = H[F](A)
    });
    return E
};
Element.setMany = function(H, F, G) {
    for (var E in G) {
        H[F](E, G[E])
    }
    return H
};
Element.Properties = new Abstract({
    "class": "className",
    "for": "htmlFor",
    colspan: "colSpan",
    rowspan: "rowSpan",
    accesskey: "accessKey",
    tabindex: "tabIndex",
    maxlength: "maxLength",
    readonly: "readOnly",
    frameborder: "frameBorder",
    value: "value",
    disabled: "disabled",
    checked: "checked",
    multiple: "multiple",
    selected: "selected"
});
Element.PropertiesIFlag = {
    href: 2,
    src: 2
};
Element.Methods = {
    Listeners: {
        addListener: function(D, C) {
            if (this.addEventListener) {
                this.addEventListener(D, C, false)
            } else {
                this.attachEvent("on" + D, C)
            }
            return this
        },
        removeListener: function(D, C) {
            if (this.removeEventListener) {
                this.removeEventListener(D, C, false)
            } else {
                this.detachEvent("on" + D, C)
            }
            return this
        }
    }
};
window.extend(Element.Methods.Listeners);
document.extend(Element.Methods.Listeners);
Element.extend(Element.Methods.Listeners);
var Garbage = {
    elements: [],
    collect: function(B) {
        if (!B.$tmp) {
            Garbage.elements.push(B);
            B.$tmp = {
                opacity: 1
            }
        }
        return B
    },
    trash: function(J) {
        for (var L = 0, G = J.length, K; L < G; L++) {
            if (! (K = J[L]) || !K.$tmp) {
                continue
            }
            if (K.$events) {
                K.fireEvent("trash").removeEvents()
            }
            for (var I in K.$tmp) {
                K.$tmp[I] = null
            }
            for (var H in Element.prototype) {
                K[H] = null
            }
            Garbage.elements[Garbage.elements.indexOf(K)] = null;
            K.htmlElement = K.$tmp = K = null
        }
        Garbage.elements.remove(null)
    },
    empty: function() {
        Garbage.collect(window);
        Garbage.collect(document);
        Garbage.trash(Garbage.elements)
    }
};
window.addListener("beforeunload",
function() {
    window.addListener("unload", Garbage.empty);
    if (window.ie) {
        window.addListener("unload", CollectGarbage)
    }
});
var Event = new Class({
    initialize: function(E) {
        if (E && E.$extended) {
            return E
        }
        this.$extended = true;
        E = E || window.event;
        this.event = E;
        this.type = E.type;
        this.target = E.target || E.srcElement;
        if (this.target.nodeType == 3) {
            this.target = this.target.parentNode
        }
        this.shift = E.shiftKey;
        this.control = E.ctrlKey;
        this.alt = E.altKey;
        this.meta = E.metaKey;
        if (["DOMMouseScroll", "mousewheel"].contains(this.type)) {
            this.wheel = (E.wheelDelta) ? E.wheelDelta / 120 : -(E.detail || 0) / 3
        } else {
            if (this.type.contains("key")) {
                this.code = E.which || E.keyCode;
                for (var F in Event.keys) {
                    if (Event.keys[F] == this.code) {
                        this.key = F;
                        break
                    }
                }
                if (this.type == "keydown") {
                    var D = this.code - 111;
                    if (D > 0 && D < 13) {
                        this.key = "f" + D
                    }
                }
                this.key = this.key || String.fromCharCode(this.code).toLowerCase()
            } else {
                if (this.type.test(/(click|mouse|menu)/)) {
                    this.page = {
                        x: E.pageX || E.clientX + document.documentElement.scrollLeft,
                        y: E.pageY || E.clientY + document.documentElement.scrollTop
                    };
                    this.client = {
                        x: E.pageX ? E.pageX - window.pageXOffset: E.clientX,
                        y: E.pageY ? E.pageY - window.pageYOffset: E.clientY
                    };
                    this.rightClick = (E.which == 3) || (E.button == 2);
                    switch (this.type) {
                    case "mouseover":
                        this.relatedTarget = E.relatedTarget || E.fromElement;
                        break;
                    case "mouseout":
                        this.relatedTarget = E.relatedTarget || E.toElement
                    }
                    this.fixRelatedTarget()
                }
            }
        }
        return this
    },
    stop: function() {
        return this.stopPropagation().preventDefault()
    },
    stopPropagation: function() {
        if (this.event.stopPropagation) {
            this.event.stopPropagation()
        } else {
            this.event.cancelBubble = true
        }
        return this
    },
    preventDefault: function() {
        if (this.event.preventDefault) {
            this.event.preventDefault()
        } else {
            this.event.returnValue = false
        }
        return this
    }
});
Event.fix = {
    relatedTarget: function() {
        if (this.relatedTarget && this.relatedTarget.nodeType == 3) {
            this.relatedTarget = this.relatedTarget.parentNode
        }
    },
    relatedTargetGecko: function() {
        try {
            Event.fix.relatedTarget.call(this)
        } catch(B) {
            this.relatedTarget = this.target
        }
    }
};
Event.prototype.fixRelatedTarget = (window.gecko) ? Event.fix.relatedTargetGecko: Event.fix.relatedTarget;
Event.keys = new Abstract({
    enter: 13,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    esc: 27,
    space: 32,
    backspace: 8,
    tab: 9,
    "delete": 46
});
Element.Methods.Events = {
    addEvent: function(G, H) {
        this.$events = this.$events || {};
        this.$events[G] = this.$events[G] || {
            keys: [],
            values: []
        };
        if (this.$events[G].keys.contains(H)) {
            return this
        }
        this.$events[G].keys.push(H);
        var E = G;
        var F = Element.Events[G];
        if (F) {
            if (F.add) {
                F.add.call(this, H)
            }
            if (F.map) {
                H = F.map
            }
            if (F.type) {
                E = F.type
            }
        }
        if (!this.addEventListener) {
            H = H.create({
                bind: this,
                event: true
            })
        }
        this.$events[G].values.push(H);
        return (Element.NativeEvents.contains(E)) ? this.addListener(E, H) : this
    },
    removeEvent: function(K, L) {
        if (!this.$events || !this.$events[K]) {
            return this
        }
        var H = this.$events[K].keys.indexOf(L);
        if (H == -1) {
            return this
        }
        var G = this.$events[K].keys.splice(H, 1)[0];
        var I = this.$events[K].values.splice(H, 1)[0];
        var J = Element.Events[K];
        if (J) {
            if (J.remove) {
                J.remove.call(this, L)
            }
            if (J.type) {
                K = J.type
            }
        }
        return (Element.NativeEvents.contains(K)) ? this.removeListener(K, I) : this
    },
    addEvents: function(B) {
        return Element.setMany(this, "addEvent", B)
    },
    removeEvents: function(C) {
        if (!this.$events) {
            return this
        }
        if (!C) {
            for (var D in this.$events) {
                this.removeEvents(D)
            }
            this.$events = null
        } else {
            if (this.$events[C]) {
                this.$events[C].keys.each(function(A) {
                    this.removeEvent(C, A)
                },
                this);
                this.$events[C] = null
            }
        }
        return this
    },
    fireEvent: function(E, F, D) {
        if (this.$events && this.$events[E]) {
            this.$events[E].keys.each(function(A) {
                A.create({
                    bind: this,
                    delay: D,
                    "arguments": F
                })()
            },
            this)
        }
        return this
    },
    cloneEvents: function(E, D) {
        if (!E.$events) {
            return this
        }
        if (!D) {
            for (var F in E.$events) {
                this.cloneEvents(E, F)
            }
        } else {
            if (E.$events[D]) {
                E.$events[D].keys.each(function(A) {
                    this.addEvent(D, A)
                },
                this)
            }
        }
        return this
    }
};
window.extend(Element.Methods.Events);
document.extend(Element.Methods.Events);
Element.extend(Element.Methods.Events);
Element.Events = new Abstract({
    mouseenter: {
        type: "mouseover",
        map: function(B) {
            B = new Event(B);
            if (B.relatedTarget != this && !this.hasChild(B.relatedTarget)) {
                this.fireEvent("mouseenter", B)
            }
        }
    },
    mouseleave: {
        type: "mouseout",
        map: function(B) {
            B = new Event(B);
            if (B.relatedTarget != this && !this.hasChild(B.relatedTarget)) {
                this.fireEvent("mouseleave", B)
            }
        }
    },
    mousewheel: {
        type: (window.gecko) ? "DOMMouseScroll": "mousewheel"
    }
});
Element.NativeEvents = ["click", "dblclick", "mouseup", "mousedown", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "keydown", "keypress", "keyup", "load", "unload", "beforeunload", "resize", "move", "focus", "blur", "change", "submit", "reset", "select", "error", "abort", "contextmenu", "scroll"];
Function.extend({
    bindWithEvent: function(D, C) {
        return this.create({
            bind: D,
            "arguments": C,
            event: Event
        })
    }
});
Elements.extend({
    filterByTag: function(B) {
        return new Elements(this.filter(function(A) {
            return (Element.getTag(A) == B)
        }))
    },
    filterByClass: function(D, E) {
        var F = this.filter(function(A) {
            return (A.className && A.className.contains(D, " "))
        });
        return (E) ? F: new Elements(F)
    },
    filterById: function(E, F) {
        var D = this.filter(function(A) {
            return (A.id == E)
        });
        return (F) ? D: new Elements(D)
    },
    filterByAttribute: function(J, F, H, G) {
        var I = this.filter(function(B) {
            var A = Element.getProperty(B, J);
            if (!A) {
                return false
            }
            if (!F) {
                return true
            }
            switch (F) {
            case "=":
                return (A == H);
            case "*=":
                return (A.contains(H));
            case "^=":
                return (A.substr(0, H.length) == H);
            case "$=":
                return (A.substr(A.length - H.length) == H);
            case "!=":
                return (A != H);
            case "~=":
                return A.contains(H, " ")
            }
            return false
        });
        return (G) ? I: new Elements(I)
    }
});
function $E(C, D) {
    return ($(D) || document).getElement(C)
}
function $ES(C, D) {
    return ($(D) || document).getElementsBySelector(C)
}
$$.shared = {
    regexp: /^(\w*|\*)(?:#([\w-]+)|\.([\w-]+))?(?:\[(\w+)(?:([!*^$]?=)["']?([^"'\]]*)["']?)?])?$/,
    xpath: {
        getParam: function(J, H, G, I) {
            var F = [H.namespaceURI ? "xhtml:": "", G[1]];
            if (G[2]) {
                F.push('[@id="', G[2], '"]')
            }
            if (G[3]) {
                F.push('[contains(concat(" ", @class, " "), " ', G[3], ' ")]')
            }
            if (G[4]) {
                if (G[5] && G[6]) {
                    switch (G[5]) {
                    case "*=":
                        F.push("[contains(@", G[4], ', "', G[6], '")]');
                        break;
                    case "^=":
                        F.push("[starts-with(@", G[4], ', "', G[6], '")]');
                        break;
                    case "$=":
                        F.push("[substring(@", G[4], ", string-length(@", G[4], ") - ", G[6].length, ' + 1) = "', G[6], '"]');
                        break;
                    case "=":
                        F.push("[@", G[4], '="', G[6], '"]');
                        break;
                    case "!=":
                        F.push("[@", G[4], '!="', G[6], '"]')
                    }
                } else {
                    F.push("[@", G[4], "]")
                }
            }
            J.push(F.join(""));
            return J
        },
        getItems: function(N, K, I) {
            var J = [];
            var H = document.evaluate(".//" + N.join("//"), K, $$.shared.resolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var L = 0, M = H.snapshotLength; L < M; L++) {
                J.push(H.snapshotItem(L))
            }
            return (I) ? J: new Elements(J.map($))
        }
    },
    normal: {
        getParam: function(F, I, G, J) {
            if (J == 0) {
                if (G[2]) {
                    var H = I.getElementById(G[2]);
                    if (!H || ((G[1] != "*") && (Element.getTag(H) != G[1]))) {
                        return false
                    }
                    F = [H]
                } else {
                    F = $A(I.getElementsByTagName(G[1]))
                }
            } else {
                F = $$.shared.getElementsByTagName(F, G[1]);
                if (G[2]) {
                    F = Elements.filterById(F, G[2], true)
                }
            }
            if (G[3]) {
                F = Elements.filterByClass(F, G[3], true)
            }
            if (G[4]) {
                F = Elements.filterByAttribute(F, G[4], G[5], G[6], true)
            }
            return F
        },
        getItems: function(D, F, E) {
            return (E) ? D: $$.unique(D)
        }
    },
    resolver: function(B) {
        return (B == "xhtml") ? "http://www.w3.org/1999/xhtml": false
    },
    getElementsByTagName: function(H, I) {
        var G = [];
        for (var J = 0, F = H.length; J < F; J++) {
            G.extend(H[J].getElementsByTagName(I))
        }
        return G
    }
};
$$.shared.method = (window.xpath) ? "xpath": "normal";
Element.Methods.Dom = {
    getElements: function(I, J) {
        var O = [];
        I = I.trim().split(" ");
        for (var M = 0, N = I.length; M < N; M++) {
            var L = I[M];
            var K = L.match($$.shared.regexp);
            if (!K) {
                break
            }
            K[1] = K[1] || "*";
            var P = $$.shared[$$.shared.method].getParam(O, this, K, M);
            if (!P) {
                break
            }
            O = P
        }
        return $$.shared[$$.shared.method].getItems(O, this, J)
    },
    getElement: function(B) {
        return $(this.getElements(B, true)[0] || false)
    },
    getElementsBySelector: function(F, G) {
        var H = [];
        F = F.split(",");
        for (var I = 0, J = F.length; I < J; I++) {
            H = H.concat(this.getElements(F[I], true))
        }
        return (G) ? H: $$.unique(H)
    }
};
Element.extend({
    getElementById: function(E) {
        var F = document.getElementById(E);
        if (!F) {
            return false
        }
        for (var D = F.parentNode; D != this; D = D.parentNode) {
            if (!D) {
                return false
            }
        }
        return F
    },
    getElementsByClassName: function(B) {
        return this.getElements("." + B)
    }
});
document.extend(Element.Methods.Dom);
Element.extend(Element.Methods.Dom);
Element.Events.domready = {
    add: function(F) {
        if (window.loaded) {
            F.call(this);
            return
        }
        var D = function() {
            if (window.loaded) {
                return
            }
            window.loaded = true;
            window.timer = $clear(window.timer);
            this.fireEvent("domready")
        }.bind(this);
        if (document.readyState && window.webkit) {
            window.timer = function() {
                if (["loaded", "complete"].contains(document.readyState)) {
                    D()
                }
            }.periodical(50)
        } else {
            if (document.readyState && window.ie) {
                if (!$("ie_ready")) {
                    var E = (window.location.protocol == "https:") ? "://0": "javascript:void(0)";
                    document.write('<script id="ie_ready" defer src="' + E + '"><\/script>');
                    $("ie_ready").onreadystatechange = function() {
                        if (this.readyState == "complete") {
                            D()
                        }
                    }
                }
            } else {
                window.addListener("load", D);
                document.addListener("DOMContentLoaded", D)
            }
        }
    }
};
window.onDomReady = function(B) {
    return this.addEvent("domready", B)
};
window.extend({
    getWidth: function() {
        if (this.webkit419) {
            return this.innerWidth
        }
        if (this.opera) {
            return document.body.clientWidth
        }
        return document.documentElement.clientWidth
    },
    getHeight: function() {
        if (this.webkit419) {
            return this.innerHeight
        }
        if (this.opera) {
            return document.body.clientHeight
        }
        return document.documentElement.clientHeight
    },
    getScrollWidth: function() {
        if (this.ie) {
            return Math.max(document.documentElement.offsetWidth, document.documentElement.scrollWidth)
        }
        if (this.webkit) {
            return document.body.scrollWidth
        }
        return document.documentElement.scrollWidth
    },
    getScrollHeight: function() {
        if (this.ie) {
            return Math.max(document.documentElement.offsetHeight, document.documentElement.scrollHeight)
        }
        if (this.webkit) {
            return document.body.scrollHeight
        }
        return document.documentElement.scrollHeight
    },
    getScrollLeft: function() {
        return this.pageXOffset || document.documentElement.scrollLeft
    },
    getScrollTop: function() {
        return this.pageYOffset || document.documentElement.scrollTop
    },
    getSize: function() {
        return {
            size: {
                x: this.getWidth(),
                y: this.getHeight()
            },
            scrollSize: {
                x: this.getScrollWidth(),
                y: this.getScrollHeight()
            },
            scroll: {
                x: this.getScrollLeft(),
                y: this.getScrollTop()
            }
        }
    },
    getPosition: function() {
        return {
            x: 0,
            y: 0
        }
    }
});
var Fx = {};
Fx.Base = new Class({
    options: {
        onStart: Class.empty,
        onComplete: Class.empty,
        onCancel: Class.empty,
        transition: function(B) {
            return - (Math.cos(Math.PI * B) - 1) / 2
        },
        duration: 500,
        unit: "px",
        wait: true,
        fps: 50
    },
    initialize: function(B) {
        this.element = this.element || null;
        this.setOptions(B);
        if (this.options.initialize) {
            this.options.initialize.call(this)
        }
    },
    step: function() {
        var B = $time();
        if (B < this.time + this.options.duration) {
            this.delta = this.options.transition((B - this.time) / this.options.duration);
            this.setNow();
            this.increase()
        } else {
            this.stop(true);
            this.set(this.to);
            this.fireEvent("onComplete", this.element, 10);
            this.callChain()
        }
    },
    set: function(B) {
        this.now = B;
        this.increase();
        return this
    },
    setNow: function() {
        this.now = this.compute(this.from, this.to)
    },
    compute: function(D, C) {
        return (C - D) * this.delta + D
    },
    start: function(D, C) {
        if (!this.options.wait) {
            this.stop()
        } else {
            if (this.timer) {
                return this
            }
        }
        this.from = D;
        this.to = C;
        this.change = this.to - this.from;
        this.time = $time();
        this.timer = this.step.periodical(Math.round(1000 / this.options.fps), this);
        this.fireEvent("onStart", this.element);
        return this
    },
    stop: function(B) {
        if (!this.timer) {
            return this
        }
        this.timer = $clear(this.timer);
        if (!B) {
            this.fireEvent("onCancel", this.element)
        }
        return this
    },
    custom: function(D, C) {
        return this.start(D, C)
    },
    clearTimer: function(B) {
        return this.stop(B)
    }
});
Fx.Base.implement(new Chain, new Events, new Options);
Fx.Slide = Fx.Base.extend({
    options: {
        mode: "vertical"
    },
    initialize: function(D, C) {
        this.element = $(D);
        this.wrapper = new Element("div", {
            styles: $extend(this.element.getStyles("margin"), {
                overflow: "hidden"
            })
        }).injectAfter(this.element).adopt(this.element);
        this.element.setStyle("margin", 0);
        this.setOptions(C);
        this.now = [];
        this.parent(this.options);
        this.open = true;
        this.addEvent("onComplete",
        function() {
            this.open = (this.now[0] === 0)
        });
        if (window.webkit419) {
            this.addEvent("onComplete",
            function() {
                if (this.open) {
                    this.element.remove().inject(this.wrapper)
                }
            })
        }
    },
    setNow: function() {
        for (var B = 0; B < 2; B++) {
            this.now[B] = this.compute(this.from[B], this.to[B])
        }
    },
    vertical: function() {
        this.margin = "margin-top";
        this.layout = "height";
        this.offset = this.element.offsetHeight
    },
    horizontal: function() {
        this.margin = "margin-left";
        this.layout = "width";
        this.offset = this.element.offsetWidth
    },
    slideIn: function(B) {
        this[B || this.options.mode]();
        return this.start([this.element.getStyle(this.margin).toInt(), this.wrapper.getStyle(this.layout).toInt()], [0, this.offset])
    },
    slideOut: function(B) {
        this[B || this.options.mode]();
        return this.start([this.element.getStyle(this.margin).toInt(), this.wrapper.getStyle(this.layout).toInt()], [ - this.offset, 0])
    },
    hide: function(B) {
        this[B || this.options.mode]();
        this.open = false;
        return this.set([ - this.offset, 0])
    },
    show: function(B) {
        this[B || this.options.mode]();
        this.open = true;
        return this.set([0, this.offset])
    },
    toggle: function(B) {
        if (this.wrapper.offsetHeight == 0 || this.wrapper.offsetWidth == 0) {
            return this.slideIn(B)
        }
        return this.slideOut(B)
    },
    increase: function() {
        this.element.setStyle(this.margin, this.now[0] + this.options.unit);
        this.wrapper.setStyle(this.layout, this.now[1] + this.options.unit)
    }
});
Fx.Transition = function(D, C) {
    C = C || [];
    if ($type(C) != "array") {
        C = [C]
    }
    return $extend(D, {
        easeIn: function(A) {
            return D(A, C)
        },
        easeOut: function(A) {
            return 1 - D(1 - A, C)
        },
        easeInOut: function(A) {
            return (A <= 0.5) ? D(2 * A, C) / 2 : (2 - D(2 * (1 - A), C)) / 2
        }
    })
};
Fx.Transitions = new Abstract({
    linear: function(B) {
        return B
    }
});
Fx.Transitions.extend = function(C) {
    for (var D in C) {
        Fx.Transitions[D] = new Fx.Transition(C[D]);
        Fx.Transitions.compat(D)
    }
};
Fx.Transitions.compat = function(B) { ["In", "Out", "InOut"].each(function(A) {
        Fx.Transitions[B.toLowerCase() + A] = Fx.Transitions[B]["ease" + A]
    })
};
Fx.Transitions.extend({
    Pow: function(D, C) {
        return Math.pow(D, C[0] || 6)
    },
    Expo: function(B) {
        return Math.pow(2, 8 * (B - 1))
    },
    Circ: function(B) {
        return 1 - Math.sin(Math.acos(B))
    },
    Sine: function(B) {
        return 1 - Math.sin((1 - B) * Math.PI / 2)
    },
    Back: function(D, C) {
        C = C[0] || 1.618;
        return Math.pow(D, 2) * ((C + 1) * D - C)
    },
    Bounce: function(F) {
        var G;
        for (var H = 0, E = 1; 1; H += E, E /= 2) {
            if (F >= (7 - 4 * H) / 11) {
                G = -Math.pow((11 - 6 * H - 11 * F) / 4, 2) + E * E;
                break
            }
        }
        return G
    },
    Elastic: function(D, C) {
        return Math.pow(2, 10 * --D) * Math.cos(20 * D * Math.PI * (C[0] || 1) / 3)
    }
});
["Quad", "Cubic", "Quart", "Quint"].each(function(D, C) {
    Fx.Transitions[D] = new Fx.Transition(function(A) {
        return Math.pow(A, [C + 2])
    });
    Fx.Transitions.compat(D)
});
var Tips = new Class({
    options: {
        onShow: function(B) {
            B.setStyle("visibility", "visible")
        },
        onHide: function(B) {
            B.setStyle("visibility", "hidden")
        },
        maxTitleChars: 30,
        showDelay: 100,
        hideDelay: 100,
        className: "tool",
        offsets: {
            x: 16,
            y: 16
        },
        fixed: false
    },
    initialize: function(D, C) {
        this.setOptions(C);
        this.toolTip = new Element("div", {
            "class": this.options.className + "-tip",
            styles: {
                position: "absolute",
                top: "0",
                left: "0",
                visibility: "hidden"
            }
        }).inject(document.body);
        this.wrapper = new Element("div").inject(this.toolTip);
        $$(D).each(this.build, this);
        if (this.options.initialize) {
            this.options.initialize.call(this)
        }
    },
    build: function(F) {
        F.$tmp.myTitle = (F.href && F.getTag() == "a") ? F.href.replace("http://", "") : (F.rel || false);
        if (F.title) {
            var E = F.title.split("::");
            if (E.length > 1) {
                F.$tmp.myTitle = E[0].trim();
                F.$tmp.myText = E[1].trim()
            } else {
                F.$tmp.myText = F.title
            }
            F.removeAttribute("title")
        } else {
            F.$tmp.myText = false
        }
        if (F.$tmp.myTitle && F.$tmp.myTitle.length > this.options.maxTitleChars) {
            F.$tmp.myTitle = F.$tmp.myTitle.substr(0, this.options.maxTitleChars - 1) + "&hellip;"
        }
        F.addEvent("mouseenter",
        function(A) {
            this.start(F);
            if (!this.options.fixed) {
                this.locate(A)
            } else {
                this.position(F)
            }
        }.bind(this));
        if (!this.options.fixed) {
            F.addEvent("mousemove", this.locate.bindWithEvent(this))
        }
        var D = this.end.bind(this);
        F.addEvent("mouseleave", D);
        F.addEvent("trash", D)
    },
    start: function(B) {
        this.wrapper.empty();
        if (B.$tmp.myTitle) {
            this.title = new Element("span").inject(new Element("div", {
                "class": this.options.className + "-title"
            }).inject(this.wrapper)).setHTML(B.$tmp.myTitle)
        }
        if (B.$tmp.myText) {
            this.text = new Element("span").inject(new Element("div", {
                "class": this.options.className + "-text"
            }).inject(this.wrapper)).setHTML(B.$tmp.myText)
        }
        $clear(this.timer);
        this.timer = this.show.delay(this.options.showDelay, this)
    },
    end: function(B) {
        $clear(this.timer);
        this.timer = this.hide.delay(this.options.hideDelay, this)
    },
    position: function(C) {
        var D = C.getPosition();
        this.toolTip.setStyles({
            left: D.x + this.options.offsets.x,
            top: D.y + this.options.offsets.y
        })
    },
    locate: function(N) {
        var L = {
            x: window.getWidth(),
            y: window.getHeight()
        };
        var H = {
            x: window.getScrollLeft(),
            y: window.getScrollTop()
        };
        var M = {
            x: this.toolTip.offsetWidth,
            y: this.toolTip.offsetHeight
        };
        var I = {
            x: "left",
            y: "top"
        };
        for (var K in I) {
            var J = N.page[K] + this.options.offsets[K];
            if ((J + M[K] - H[K]) > L[K]) {
                J = N.page[K] - this.options.offsets[K] - M[K]
            }
            this.toolTip.setStyle(I[K], J)
        }
    },
    show: function() {
        if (this.options.timeout) {
            this.timer = this.hide.delay(this.options.timeout, this)
        }
        this.fireEvent("onShow", [this.toolTip])
    },
    hide: function() {
        this.fireEvent("onHide", [this.toolTip])
    }
});
Tips.implement(new Events, new Options);
window.addEvent("domready",
function() {
    var A = [];
    $$("ul.secondary").each(function(E) {
        var D = E.id.replace(/s_/gi, "");
        A[D] = new Fx.Slide(E).hide();
        $("s_" + D).setStyle("display", "block")
    });
    var C = $$("li.tips a");
    var B = new Tips(C, {
        maxTitleChars: 200
    });
    $$("a.more").addEvent("click",
    function(E) {
        var F = this.id.replace(/m_/gi, "");
        var D = A[F];
        D.toggle();
        (new Event(E)).stop()
    })
});
