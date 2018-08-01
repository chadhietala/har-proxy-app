/* eslint-env node */
'use strict';
let httpProxy = require('http-proxy');
let HARRemix = require('har-remix').default;
let path = require('path');
let url = require('url');

let harRemix = new HARRemix({
  keyForArchiveEntry(entry) {
    let { request, response } = entry;
    let { status } = response;
    if (status >= 200 && status < 300 && request.method !== 'OPTIONS') {
      return request.method + url.parse(request.url).path;
    }
  },

  keyForServerRequest(req) {
    return req.method + req.url;
  },

  textFor(entry, key, text) {
    return text;
  }
});

harRemix.loadArchive(path.join(process.cwd(), 'proxy-app.har'));
harRemix.createServer().listen(6789);

module.exports = {
  name: 'server-proxy',

  isDevelopingAddon() {
    return true;
  },

  serverMiddleware(options) {
    let app = options.app;
    let proxy = httpProxy.createProxyServer({});

    app.use((req, res, next) => {
      if (req.url.includes('/api')) {
        proxy.web(req, res, { target: 'http://localhost:6789' })
      } else {
        next();
      }

    });
  }
};
