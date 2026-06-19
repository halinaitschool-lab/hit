export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Only handle the site root.
  if (url.pathname !== "/") return context.next();

  // 1) Respect user's explicit choice (cookie set on language switch click).
  const cookie = context.request.headers.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)hit_lang=(ua|pl|en)\b/);
  if (m) {
    url.pathname = `/${m[1]}/`;
    return Response.redirect(url.toString(), 302);
  }

  // 2) Fall back to browser language.
  const al = (context.request.headers.get("accept-language") || "").toLowerCase();

  let lang = "en"; // default fallback
  if (al.startsWith("uk") || al.includes(" uk") || al.startsWith("ua") || al.includes(" ua")) {
    lang = "ua";
  } else if (al.startsWith("pl") || al.includes(" pl")) {
    lang = "pl";
  }

  url.pathname = `/${lang}/`;
  return Response.redirect(url.toString(), 302);
}

