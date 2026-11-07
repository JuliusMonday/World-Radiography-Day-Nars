// Chapter name matching, shared by the API (imported) and the page (inlined by src/build.py).
// Keep this file free of imports and non-ES5 syntax so it can be inlined into the page as-is.

// Words that never identify a school.
export var CHAPTER_STOP = { NARS: 1, CHAPTER: 1, CHAP: 1, THE: 1, OF: 1, STUDENT: 1, STUDENTS: 1, ASSOCIATION: 1, NIGERIAN: 1, RADIOGRAPHY: 1, RADIOGRAPHERS: 1, DEPARTMENT: 1, DEPT: 1 };

export function chapterTokens(raw) {
  return String(raw || "")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter(function (w) { return w && !CHAPTER_STOP[w]; });
}

// Tidy key for anything typed, e.g. "NARS Unizik chapter" -> "UNIZIK".
export function chapterKey(raw) {
  return chapterTokens(raw).join(" ").slice(0, 40);
}

// Returns the chapter code for typed text, or "" if it doesn't clearly match one school.
// chapters: [{code, aliases:[...]}]; extra: {"TIDY KEY": "CODE"} learned from admin merges.
export function matchChapter(raw, chapters, extra) {
  var key = chapterKey(raw);
  if (!key) return "";
  if (extra && extra[key]) return extra[key];
  var toks = key.split(" "), best = "", bestLen = 0, tie = false;
  for (var i = 0; i < chapters.length; i++) {
    var c = chapters[i], names = [c.code].concat(c.aliases || []);
    for (var j = 0; j < names.length; j++) {
      var a = chapterTokens(names[j]);
      if (!a.length || a.length > toks.length) continue;
      for (var s = 0; s + a.length <= toks.length; s++) {
        var ok = true;
        for (var t = 0; t < a.length; t++) if (toks[s + t] !== a[t]) { ok = false; break; }
        if (!ok) continue;
        var len = a.join(" ").length;
        if (len > bestLen) { best = c.code; bestLen = len; tie = false; }
        else if (len === bestLen && best !== c.code) tie = true;
        break;
      }
    }
  }
  return tie ? "" : best;
}
