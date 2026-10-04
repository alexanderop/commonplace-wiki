import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
const root = resolve('.output/public')
const base = process.env.NUXT_APP_BASE_URL ?? '/'
const port = Number(process.env.PORT ?? 4173)
const types: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml', '.wasm': 'application/wasm', '.png': 'image/png', '.webmanifest': 'application/manifest+json' }
createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', 'http://localhost')
    if (!url.pathname.startsWith(base)) { response.writeHead(404).end(); return }
    let path = resolve(root, '.' + '/' + decodeURIComponent(url.pathname.slice(base.length)))
    if (path !== root && !path.startsWith(root + sep)) { response.writeHead(403).end(); return }
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html')
    const data = await readFile(path)
    response.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' }).end(data)
  } catch { response.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found') }
}).listen(port, '127.0.0.1', () => console.log(`Commonplace at http://127.0.0.1:${port}${base}`))
