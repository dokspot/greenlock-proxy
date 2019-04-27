let Greenlock = require('greenlock');
let httpProxy = require('http-proxy');
let proxy = httpProxy.createProxyServer({});

// Storage Backend
var leStore = require('greenlock-store-fs').create({
  configDir: '/home/node/acme/etc'
, debug: false
});

// ACME Challenge Handlers
var leHttpChallenge = require('le-challenge-fs').create({
  webrootPath: '/home/node/acme/var'
, debug: false
});

// let's create ou greenlock server first

let greenlock = Greenlock.create({
  version: 'draft-12'
, server: 'https://acme-staging-v02.api.letsencrypt.org/directory'
, email: 'cyrille.derche@dokspot.com'
, agreeTos: true
, approvedDomains: [ 'slave.clientdomain1.com', 'slave.clientdomain2.com', 'example.com' ]
, debug: true
, store: leStore
, challenges: {
  'http-01': leHttpChallenge
}
, challengeType: 'http-01'
});

let acmeChallengeHandler = greenlock.middleware(function (req: any, res: any) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<h1>Hello, ⚠️ Insecure World!</h1><a>Visit Secure Site</a>');
});

require('http').createServer(acmeChallengeHandler).listen(80, function (this: any) {
  console.log("Listening for ACME http-01 challenges on", this.address());
});

let spdyOptions = Object.assign({}, greenlock.tlsOptions);
spdyOptions.spdy = { protocols: ['h2', 'http/1.1'], plain: false };
let server = require('spdy').createServer(spdyOptions, function (req: any, res: any) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<h1>Hello, 🔐 Secure World!</h1>');
});
server.on('error', function (err: any) {
  console.error(err);
});
server.on('listening', function (this: any) {
  console.log("Listening for SPDY/http2/https requests on", this.address());
})
server.listen(443);

// require('https').createServer(greenlock.tlsOptions, function (req: any, res: any) {
//   return proxy.web(req, res, {
//     target: 'https://www.google.com/',
//   });
// }).listen(443);