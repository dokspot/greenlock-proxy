var Greenlock = require('greenlock');
let httpProxy = require('http-proxy');
let proxy = httpProxy.createProxyServer({});
let redir = require('redirect-https')();

let leStore = require('le-store-redis').create({
  debug: true,
  redisOptions: {
    db: process.env.REDIS_DB,
    password: process.env.REDIS_PASSWORD
  }
})

// let's create ou greenlock server first

let greenlock = Greenlock.create({
  version: 'draft-11',
  server: 'https://acme-staging-v02.api.letsencrypt.org/directory',
  email: 'cyrille.derche@dokspot.com',
  agreeTos: true,
  store: leStore,
  approvedDomains: ['slave.clientdomain1.com', 'slave.clientdomain2.com'],
  debug: true
});

require('http').createServer(greenlock.middleware(redir)).listen(80);

require('https').createServer(greenlock.tlsOptions, function (req: any, res: any) {
  return proxy.web(req, res, {
    target: 'https://www.google.com/',
  });
}).listen(443);