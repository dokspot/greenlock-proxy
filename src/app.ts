////////////////////
// INIT GREENLOCK //
////////////////////

var greenlock = require('greenlock').create({
  email: 'cyrille.derche@dokspot.com'           // IMPORTANT: Change email and domains
, agreeTos: true                                // Accept Let's Encrypt v2 Agreement
, store: require('greenlock-store-fs')

, communityMember: true                         // Get (rare) non-mandatory updates about cool greenlock-related stuff (default false)
, securityUpdates: true                         // Important and mandatory notices related to security or breaking API changes (default true)

, approveDomains: [ 'slave.clientdomain1.com' , 'slave.clientdomain2.com' ]
, debug: true
});

////////////////////
// CREATE SERVERS //
////////////////////

var redir = require('redirect-https')();
require('http').createServer(greenlock.middleware(redir)).listen(80);

require('spdy').createServer(greenlock.tlsOptions, function (req: any, res: any) {
  res.end('Hello, Secure World!');
}).listen(443);