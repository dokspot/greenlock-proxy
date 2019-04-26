import { Greenlock } from 'greenlock';
let httpProxy = require('http-proxy');
let proxy = httpProxy.createProxyServer({});
let redir = require('redirect-https')();

let leStore = require('le-store-redis').create({
  debug: true,
  redisOptions: {
    db: 2,
    password: 'password'
  }
})

// let's create ou greenlock server first

let greenlock = Greenlock.create({
  version: 'draft-11',
  server: 'https://acme-staging-v02.api.letsencrypt.org/directory',
  email: 'cyrille.derche@dokspot.com',
  agreeTos: true,
  store: leStore,
  approvedDomains: ['example.com', 'www.example.com']
});


require('http').createServer(greenlock.middleware(redir)).listen(80);

require('https').createServer(greenlock.tlsOptions, function (req: any, res: any) {
  return proxy.web(req, res, {
    target: 'https://another-server.com',
  });
}).listen(443);