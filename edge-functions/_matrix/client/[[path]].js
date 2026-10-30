export function onRequest({ request }) {
    const url = new URL(request.url);
    const target = new URL("https://matrix.neboer.site:8448");
    target.pathname = url.pathname;
    target.search = url.search;
    return new Response(null, {
        status: 307,
        headers: { Location: target.href, "Cache-Control": "no-store" },
    });
}
