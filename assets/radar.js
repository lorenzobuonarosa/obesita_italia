/* Radar – Quotidiano Nazionale · funzioni condivise per le dataviz (D3 v7) */
(function () {
  "use strict";

  // ---------- Sfondo e tema (chiaro/scuro) ----------
  // QN usa quattro sfondi. La dataviz si adatta a quello che ha davvero dietro:
  //  1. ?bg=grigio|bianco|nero|notte (o un colore #rrggbb) nell'URL dell'iframe;
  //  2. il colore inviato dallo script del CMS ({sentinel:'radar-qn', type:'theme', theme, bg});
  //  3. altrimenti il tema: ?theme= > messaggio del CMS > prefers-color-scheme.
  // Il tema (testi, griglie, sfumature) si deduce dalla luminosità dello sfondo, così un blocco
  // scuro dentro una pagina chiara (o il contrario) resta leggibile.
  var root = document.documentElement;
  var qs = new URLSearchParams(location.search);
  var QN_BG = { grigio: "#f7f8f9", bianco: "#ffffff", nero: "#121212", notte: "#060e11" };
  var urlTheme = /^(light|dark)$/.test(qs.get("theme") || "") ? qs.get("theme") : null;
  var urlBg = qs.get("bg");
  var msgTheme = null, msgBg = null;
  var darkMQ = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function rgbOf(c) {
    if (!c) return null;
    c = String(c).trim().toLowerCase();
    if (QN_BG[c]) c = QN_BG[c];
    var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(c);
    if (m) {
      var h = m[1].length === 3 ? m[1].replace(/./g, "$&$&") : m[1];
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
    }
    m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(c);
    if (m) return [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]];
    return null;   // qualunque altra cosa viene ignorata (niente CSS arbitrario)
  }
  function hex(rgb) { return "#" + rgb.slice(0, 3).map(function (v) { return ("0" + Math.round(v).toString(16)).slice(-2); }).join(""); }
  function lum(rgb) {   // luminanza relativa WCAG, 0 = nero, 1 = bianco
    var a = rgb.slice(0, 3).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  // se il colore è a un passo da uno dei quattro sfondi QN, usa quello esatto
  function qnName(rgb) {
    var best = null, dmin = 1e9;
    Object.keys(QN_BG).forEach(function (k) {
      var q = rgbOf(QN_BG[k]);
      var d = Math.abs(q[0] - rgb[0]) + Math.abs(q[1] - rgb[1]) + Math.abs(q[2] - rgb[2]);
      if (d < dmin) { dmin = d; best = k; }
    });
    return dmin <= 18 ? best : null;
  }
  function apply() {
    var rgb = rgbOf(urlBg) || rgbOf(msgBg);
    if (rgb && rgb[3] < 0.95) rgb = null;            // sfondo trasparente: non dice niente
    var name = rgb ? qnName(rgb) : null;
    var theme;
    if (urlTheme) theme = urlTheme;
    else if (rgb) theme = lum(rgb) < 0.18 ? "dark" : "light";
    else theme = msgTheme || (darkMQ && darkMQ.matches ? "dark" : "light");
    if (root.getAttribute("data-theme") !== theme) root.setAttribute("data-theme", theme);
    if (rgb) {
      root.style.setProperty("--bg", name ? QN_BG[name] : hex(rgb));
      root.setAttribute("data-bg", name || "altro");
    } else {
      root.style.removeProperty("--bg");
      root.removeAttribute("data-bg");
    }
  }
  apply();
  if (darkMQ && darkMQ.addEventListener) darkMQ.addEventListener("change", apply);
  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || typeof d !== "object" || d.sentinel !== "radar-qn" || d.type !== "theme") return;
    msgTheme = d.theme === "dark" || d.theme === "light" ? d.theme : null;
    msgBg = typeof d.bg === "string" ? d.bg : null;
    apply();
  });

  // ---------- Logo QN in alto a destra, in linea con il titolo ----------
  // Un solo SVG (currentColor): il colore lo decide il CSS in base allo sfondo
  // (--logo: #0e0f11 su grigio e bianco, #ffffff su nero e notte).
  var QN_LOGO_PATH = "M198.191 0.0308838C291.679 1.40807 396.303 79.4122 396.303 201.18C396.303 295.975 334.916 348.183 334.805 348.277C334.805 348.277 337.618 358.821 353.045 371.041H353.03C368.736 383.486 386.574 386.299 402.639 386.161V398.563C402.544 398.566 364.081 399.914 337.259 396.646C306.99 392.959 273.52 386.204 250.854 366.304C207.268 328.035 211.56 270.951 169.453 270.856C157.095 270.827 147.967 277.334 142.305 284.343C140.298 286.835 138.942 289.758 138.942 291.849C138.942 296.383 137.39 340.94 142.723 355.353C152.246 381.097 175.204 391.794 193.459 393.404C225.633 396.238 246.122 384.805 246.122 384.805C249.983 387.829 255.316 390.599 257.228 391.459C251.557 396.727 227.764 406.797 198.185 405.996C89.4376 403.052 0.000195909 314.205 0 201.188V201.108C3.56752 78.4071 103.048 -1.37545 198.191 0.0308838ZM581.85 3.43518L742.506 240.334V15.8365H704.479V3.43518H795V15.8365H757.083V397.624H675.763L469.521 93.36V386.17H507.547V398.571H416.968V386.17H454.943V15.8365H416.968V3.43518H581.85ZM198.191 11.2672C163.307 11.2672 138.957 40.1076 138.957 70.1871L139.045 256.662C139.045 256.662 158.817 226.837 198.191 225.154C235.127 223.573 257.426 247.284 257.426 247.284V70.9596C257.426 36.8797 230.446 11.2672 198.191 11.2672Z";
  function addLogo() {
    var head = document.querySelector(".radar > header");
    if (!head || head.querySelector(".r-logo") || head.hasAttribute("data-no-logo")) return;
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "r-logo");
    svg.setAttribute("viewBox", "0 0 795 407");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "QN Quotidiano Nazionale");
    var t = document.createElementNS(ns, "title");
    t.textContent = "QN Quotidiano Nazionale";
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", QN_LOGO_PATH);
    path.setAttribute("fill", "currentColor");
    svg.appendChild(t); svg.appendChild(path);
    head.appendChild(svg);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addLogo);
  else addLogo();

  // ---------- Formati numerici italiani ----------
  var locale = d3.formatLocale({
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["", " €"],
    percent: "%",
    minus: "−"
  });
  var timeLocale = d3.timeFormatLocale({
    dateTime: "%A %e %B %Y, %X",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"],
    shortDays: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
    months: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
    shortMonths: ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"]
  });

  /** fmt(n, decimali): numero all'italiana con decimali fissi */
  function fmt(n, dec) {
    if (n == null || isNaN(n)) return "–";
    return locale.format(",." + (dec || 0) + "f")(n);
  }
  function pct(share, dec) {
    return fmt(share * 100, dec == null ? 1 : dec) + "%";
  }

  // ---------- CSV italiano: separatore ; e virgola decimale ----------
  function splitRow(line) {
    var out = [], cur = "", q = false;
    for (var i = 0; i < line.length; i++) {
      var c = line[i];
      if (c === '"') { q = !q; cur += c; }
      else if (c === ";" && !q) { out.push(cur); cur = ""; }
      else cur += c;
    }
    out.push(cur);
    return out.map(function (f) {
      f = f.trim();
      // campo interamente tra virgolette: tolgo le virgolette esterne
      var m = /^"((?:[^"]|"")*)"$/.exec(f);
      return m ? m[1].replace(/""/g, '"') : f;
    });
  }
  function parseCSV(text) {
    var lines = text.replace(/^﻿/, "").split(/\r?\n/).filter(function (l) { return l.trim() !== ""; });
    var head = splitRow(lines[0]);
    return lines.slice(1).map(function (l) {
      var cells = splitRow(l), row = {};
      head.forEach(function (h, i) { row[h] = cells[i] == null ? "" : cells[i]; });
      return row;
    });
  }
  /** "1.234,5" -> 1234.5 ; "" -> null */
  function num(s) {
    if (s == null) return null;
    s = String(s).trim();
    if (s === "") return null;
    var v = +s.replace(/\./g, "").replace(",", ".");
    return isNaN(v) ? null : v;
  }
  function loadCSV(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("CSV non trovato: " + url);
      return r.text();
    }).then(parseCSV);
  }

  // ---------- Ambiente ----------
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DUR = reduced ? 0 : 750;
  var EASE = d3.easeCubicOut;
  function isNarrow(w) { return w < 520; }

  // ---------- Altezza iframe ----------
  function postHeight() {
    var el = document.querySelector(".radar") || document.body;
    var cs = getComputedStyle(document.body);
    var h = Math.ceil(el.getBoundingClientRect().height + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom));
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ sentinel: "radar-qn", type: "height", height: h }, "*");
    }
  }
  var heightTimer;
  function scheduleHeight() { clearTimeout(heightTimer); heightTimer = setTimeout(postHeight, 60); }
  window.addEventListener("load", postHeight);
  window.addEventListener("resize", scheduleHeight);
  if (window.ResizeObserver) {
    document.addEventListener("DOMContentLoaded", function () {
      new ResizeObserver(scheduleHeight).observe(document.querySelector(".radar") || document.body);
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleHeight);

  // ---------- Primo ingresso nel viewport ----------
  function onFirstView(el, cb) {
    if (reduced || !("IntersectionObserver" in window)) { cb(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { io.disconnect(); cb(); }
      });
    }, { threshold: 0.25 });
    io.observe(el);
  }

  /**
   * Ridisegna al cambio di larghezza. draw(width, phase) con phase:
   *  "pre"    -> elementi nello stato iniziale (prima dell'ingresso nel viewport)
   *  "play"   -> animazione d'ingresso dallo stato iniziale a quello finale
   *  "static" -> stato finale senza animazione (resize, reduced motion)
   */
  function responsive(container, draw) {
    var node = typeof container === "string" ? document.querySelector(container) : container;
    var lastW = 0, played = reduced;
    function render(phase) {
      var w = Math.floor(node.getBoundingClientRect().width);
      if (!w) return;
      lastW = w;
      draw(w, phase);
      scheduleHeight();
    }
    render(played ? "static" : "pre");
    if (!played) onFirstView(node, function () { played = true; render("play"); });
    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var w = Math.floor(node.getBoundingClientRect().width);
        if (w !== lastW) render(played ? "static" : "pre");
      }, 120);
    });
  }

  /** Applica stato iniziale/finale secondo la fase (vedi responsive) */
  function enter(sel, phase, initial, final, delay) {
    if (phase === "static") { final(sel); return sel; }
    initial(sel);
    if (phase === "play") {
      var tr = sel.transition().duration(DUR).ease(EASE);
      if (delay) tr.delay(delay);
      final(tr);
    }
    return sel;
  }

  /** Conta da 0 al valore finale in un elemento HTML o SVG text */
  function countUp(sel, value, format, phase, delay) {
    if (phase === "static" || !DUR) { sel.text(format(value)); return; }
    if (phase === "pre") { sel.text(format(0)); return; }
    var dur = DUR;
    sel.transition().delay(delay || 0).duration(dur).ease(EASE).tween("text", function () {
      var node = this, i = d3.interpolateNumber(0, value);
      return function (t) { node.textContent = format(i(t)); };
    });
  }

  // ---------- Tooltip ----------
  function tooltip(container) {
    var host = d3.select(container);
    var tip = host.append("div").attr("class", "r-tip").attr("role", "status").attr("aria-live", "polite");
    function show(html, x, y) {
      tip.html(html).classed("is-on", true);
      var W = host.node().getBoundingClientRect().width;
      var tw = tip.node().offsetWidth, th = tip.node().offsetHeight;
      var left = x + 14;
      if (left + tw > W) left = x - tw - 14;
      if (left < 0) left = Math.max(0, Math.min(W - tw, x - tw / 2));
      var top = y - th - 12;
      if (top < -8) top = y + 16;
      tip.style("transform", "translate(" + Math.round(left) + "px," + Math.round(top) + "px)");
    }
    function hide() { tip.classed("is-on", false); }
    return { show: show, hide: hide, node: tip.node() };
  }
  /** html del tooltip: titolo in grassetto, valore grande, righe extra, nota */
  function tipHTML(o) {
    var h = '<div class="r-tip__t">' + o.title + "</div>";
    if (o.value != null) h += '<div class="r-tip__v">' + o.value + (o.unit ? " <small>" + o.unit + "</small>" : "") + "</div>";
    if (o.rows && o.rows.length) {
      h += '<div class="r-tip__rows">' + o.rows.map(function (r) {
        return '<div class="r-tip__row"><span>' + r[0] + "</span><b>" + r[1] + "</b></div>";
      }).join("") + "</div>";
    }
    if (o.note) h += '<div class="r-tip__note">' + o.note + "</div>";
    return h;
  }
  /** chiude i tooltip quando si tocca fuori dal grafico (mobile) */
  function dismissOutside(container, fn) {
    document.addEventListener("pointerdown", function (e) {
      if (!container.contains(e.target)) fn();
    });
  }

  // ---------- Testo SVG a capo ----------
  function wrap(textSel, width, lineHeight) {
    lineHeight = lineHeight || 1.35;
    textSel.each(function () {
      var text = d3.select(this);
      var words = text.text().split(/\s+/).reverse();
      var x = text.attr("x") || 0, y = text.attr("y") || 0, dy = parseFloat(text.attr("dy") || 0);
      var fs = parseFloat(getComputedStyle(this).fontSize) || 13;
      text.text(null);
      var line = [], n = 0, word;
      var tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "px");
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width && line.length > 1) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          n++;
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", (dy + n * fs * lineHeight) + "px").text(word);
        }
      }
      text.attr("data-lines", n + 1);
    });
    return textSel;
  }

  /** Path di una barra verticale con angoli superiori smussati (r) */
  function barPathV(x, y, w, h, r) {
    if (h <= 0 || w <= 0) return "M" + x + "," + (y + h) + "h" + w + "v0h" + (-w) + "Z";
    r = Math.min(r, w / 2, h);
    return "M" + x + "," + (y + h) +
      "V" + (y + r) + "Q" + x + "," + y + " " + (x + r) + "," + y +
      "H" + (x + w - r) + "Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) +
      "V" + (y + h) + "Z";
  }
  /** Path di una barra orizzontale con angoli destri smussati */
  function barPathH(x, y, w, h, r) {
    if (w <= 0) return "M" + x + "," + y + "h0v" + h + "h0Z";
    r = Math.min(r, h / 2, w);
    return "M" + x + "," + y +
      "H" + (x + w - r) + "Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) +
      "V" + (y + h - r) + "Q" + (x + w) + "," + (y + h) + " " + (x + w - r) + "," + (y + h) +
      "H" + x + "Z";
  }

  /** Mostra un errore leggibile se il CSV non si carica */
  function fail(container, err) {
    d3.select(container).append("p").attr("class", "r-note").text("Dati non disponibili. " + (err && err.message ? err.message : ""));
    scheduleHeight();
    if (window.console) console.error(err);
  }

  window.Radar = {
    locale: locale, timeLocale: timeLocale, fmt: fmt, pct: pct,
    num: num, parseCSV: parseCSV, loadCSV: loadCSV,
    reduced: reduced, DUR: DUR, EASE: EASE, isNarrow: isNarrow,
    postHeight: postHeight, scheduleHeight: scheduleHeight,
    addLogo: addLogo, onFirstView: onFirstView, responsive: responsive, enter: enter, countUp: countUp,
    tooltip: tooltip, tipHTML: tipHTML, dismissOutside: dismissOutside,
    wrap: wrap, barPathV: barPathV, barPathH: barPathH, fail: fail
  };
})();
