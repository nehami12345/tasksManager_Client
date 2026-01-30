
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 0,
    "route": "/login"
  },
  {
    "renderMode": 0,
    "route": "/register"
  },
  {
    "renderMode": 0,
    "route": "/teams"
  },
  {
    "renderMode": 0,
    "route": "/projects"
  },
  {
    "renderMode": 0,
    "route": "/projects/*"
  },
  {
    "renderMode": 0,
    "route": "/all-tasks"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 436, hash: 'd751e820338e033b1829fa0a7b6f79f2b2991ee3093ec04d3c3868358454a592', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 949, hash: '2428d458761fa136c01a7b3f65653791db7f1a6e0b7ac9c27aab028b1550f3d0', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
