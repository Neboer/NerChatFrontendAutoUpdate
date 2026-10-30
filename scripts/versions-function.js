export function onRequest({ request }) {
    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization, Date, If-Match, If-None-Match",
        "Access-Control-Expose-Headers": "ETag, Location, X-Max-Bytes",
        "X-Content-Type-Options": "nosniff",
    };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (!["GET", "HEAD"].includes(request.method)) {
        return new Response(null, { status: 405, headers: { ...headers, Allow: "GET, HEAD, OPTIONS" } });
    }
    return new Response(request.method === "HEAD" ? null : JSON.stringify(versions), { headers });
}
