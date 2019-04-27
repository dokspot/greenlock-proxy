let Greenlock = require('greenlock-express');

let glx = Greenlock.create({
  version:          'draft-11'
, server:           'https://acme-staging-v02.api.letsencrypt.org/directory'
, email:            'cyrille.derche@dokspot.com'
, agreeTos:         true
, approvedDomains:  [ 'slave.clientdomain1.com', 'slave.clientdomain2.com', 'example.com' ]
, configDir:        '/home/node/acme/'
, communityMember:  true
, debug:            true
})

////////////////////////
// http-01 Challenges //
////////////////////////

// http-01 challenge happens over http/1.1, not http2
var redirectHttps = require('redirect-https')();
var acmeChallengeHandler = glx.middleware(redirectHttps);
require('http').createServer(acmeChallengeHandler).listen(80, function (this: any) {
  console.log("Listening for ACME http-01 challenges on", this.address());
});

////////////////////////
// http2 via SPDY h2  //
////////////////////////

// spdy is a drop-in replacement for the https API
var spdyOptions = Object.assign({}, glx.tlsOptions);
spdyOptions.spdy = { protocols: [ 'h2', 'http/1.1' ], plain: false };

var server = require('spdy').createServer(spdyOptions, function(req: any, res: any) {
  
});
server.on('error', function (err: any) {
  console.error(err);
});
server.on('listening', function (this: any) {
  console.log("Listening for SPDY/http2/https requests on", this.address());
});
server.listen(443);