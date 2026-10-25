
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/projects/json-config-builder"
  },
  {
    "renderMode": 2,
    "route": "/projects/handmade-candle-ecommerce"
  },
  {
    "renderMode": 2,
    "route": "/projects/ers-admin-portal"
  },
  {
    "renderMode": 0,
    "route": "/projects/*"
  },
  {
    "renderMode": 2,
    "route": "/blog/[YOUR: first-post-slug]"
  },
  {
    "renderMode": 2,
    "route": "/blog/[YOUR: second-post-slug]"
  },
  {
    "renderMode": 0,
    "route": "/blog/*"
  },
  {
    "renderMode": 2,
    "route": "/coming-soon"
  },
  {
    "renderMode": 2,
    "route": "/demo-unavailable"
  },
  {
    "renderMode": 2,
    "route": "/contact"
  },
  {
    "renderMode": 2,
    "redirectTo": "/",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 9744, hash: 'd58a47b1df17e393310604406990a95961c76a1989c0f20098f0ba5e4a3e8dc1', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 8503, hash: '520f6b51b4a6787387d44a14c742a0606ec6abc57ae8f9a1d8c77b3ecb1fcf07', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'projects/handmade-candle-ecommerce/index.html': {size: 63348, hash: '2f51370d63b7bfff165f0d720be0433199bd950ef832557cc40f83be475b99c9', text: () => import('./assets-chunks/projects_handmade-candle-ecommerce_index_html.mjs').then(m => m.default)},
    'projects/json-config-builder/index.html': {size: 66315, hash: '2377dae01650cfdbe5af5119fe0484904c3625171910f819388c8ee103510c78', text: () => import('./assets-chunks/projects_json-config-builder_index_html.mjs').then(m => m.default)},
    'projects/ers-admin-portal/index.html': {size: 68726, hash: '2b93b283e19108744f75f770dc920290135153dfa2cad5c78d0574de68db2b09', text: () => import('./assets-chunks/projects_ers-admin-portal_index_html.mjs').then(m => m.default)},
    'contact/index.html': {size: 50644, hash: '28c116eac341ccb82b4fdf038341dfacb8f54be17a3106be40880a78952fba1d', text: () => import('./assets-chunks/contact_index_html.mjs').then(m => m.default)},
    'blog/[YOUR: second-post-slug]/index.html': {size: 51515, hash: '24aead722b808c8d1e512038721c9006a89b3932abe61c4f1ea24f0ab44ebc48', text: () => import('./assets-chunks/blog_[YOUR: second-post-slug]_index_html.mjs').then(m => m.default)},
    'demo-unavailable/index.html': {size: 50258, hash: 'ad33d9c45dbc76849bfc6fb6fe1596b3c3f4f2236ddad87cffd41544a75dbef1', text: () => import('./assets-chunks/demo-unavailable_index_html.mjs').then(m => m.default)},
    'blog/[YOUR: first-post-slug]/index.html': {size: 51591, hash: 'c259db41441fb3f8e67d9d8c18a21bfcff4eac62600b08eeb8e7a8ebb03244bf', text: () => import('./assets-chunks/blog_[YOUR: first-post-slug]_index_html.mjs').then(m => m.default)},
    'coming-soon/index.html': {size: 52649, hash: 'aa1fa6e4d9ff2cb670bbd6c0f4e09ae6294b0ec71a511504272a3d59b8306f21', text: () => import('./assets-chunks/coming-soon_index_html.mjs').then(m => m.default)},
    'index.html': {size: 130797, hash: 'aec9ded284b3fd540d5b55fe38ce66bb120b0da8320be6db11617141e84d89aa', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-UTRRIN43.css': {size: 4426, hash: 'iafMLeBnnjE', text: () => import('./assets-chunks/styles-UTRRIN43_css.mjs').then(m => m.default)}
  },
};
