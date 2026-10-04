import { contributorsFor } from './shared/wiki'
import { readdirSync, readFileSync } from 'node:fs'
const audience = process.env.WIKI_AUDIENCE ?? 'public'
const baseURL = process.env.NUXT_APP_BASE_URL ?? '/'
const noteRoutes = readdirSync(`.generated/${audience}`).filter(file => file.endsWith('.json')).map(file => `/notes/${file.slice(0, -5)}`)

const authorRoutes = [...new Set(readdirSync(`.generated/${audience}`).filter(file => file.endsWith('.json')).flatMap(file => {
  const note = JSON.parse(readFileSync(`.generated/${audience}/${file}`, 'utf8'))
  return note.kind === 'source' ? contributorsFor(note).map(credit => `/authors/${credit.id}`) : []
}))]

export default defineNuxtConfig({
  compatibilityDate: '2026-10-04',
  modules: ['@nuxt/content', '@vite-pwa/nuxt'],
  css: ['@commonplace/ui/styles.css', '~/assets/main.css'],
  build: { transpile: ['@commonplace/ui'] },
  devtools: { enabled: false },
  debug: { hydration: true },
  app: { baseURL, head: { script: [{ innerHTML: "try{document.documentElement.dataset.theme=localStorage.getItem('commonplace-theme')==='light'?'light':'dark'}catch{document.documentElement.dataset.theme='dark'}" }], title: 'Commonplace · Dein verbundenes Wissen', htmlAttrs: { lang: 'de' }, meta: [{ name: 'theme-color', content: '#191b19' }, { name: 'description', content: 'Ein Ort für gute Gedanken. Ein persönliches Wiki aus Quellen, Themen und Erkenntnissen.' }], link: [{ rel: 'icon', type: 'image/png', sizes: '32x32', href: `${baseURL}brand/icon-32.png` }, { rel: 'apple-touch-icon', sizes: '180x180', href: `${baseURL}brand/icon-180.png` }] } },
  runtimeConfig: { public: { audience } },
  content: { experimental: { sqliteConnector: 'native' } },
  nitro: { prerender: { routes: ['/', '/graph', '/about', '/authors', ...authorRoutes, ...noteRoutes], crawlLinks: true, failOnError: true } },
  pwa: {
    registerType: 'prompt',
    manifest: { name: 'Commonplace Wiki', short_name: 'Commonplace', description: 'Dein verbundenes Wissen', theme_color: '#191b19', background_color: '#191b19', display: 'standalone', lang: 'de', icons: [{ src: `${baseURL}brand/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: `${baseURL}brand/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any maskable' }] },
    workbox: { clientsClaim: true, ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^_b$/, /^v$/], cacheId: `commonplace-${audience}`, globPatterns: ['**/*.{js,css,html,json,svg,png,ico,woff2,wasm,sqlite,db,data,txt}'], globIgnores: ['200.html', '404.html'], maximumFileSizeToCacheInBytes: 12 * 1024 * 1024, navigateFallback: null, cleanupOutdatedCaches: true },
    client: { installPrompt: true },
  },
})
