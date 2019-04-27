"use strict";
var Greenlock = require('greenlock');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
var redir = require('redirect-https')();
var leStore = require('le-store-redis').create({
    debug: true,
    redisOptions: {
        db: process.env.REDIS_DB,
    }
});
// let's create ou greenlock server first
var greenlock = Greenlock.create({
    version: 'draft-11',
    server: 'https://acme-staging-v02.api.letsencrypt.org/directory',
    email: 'cyrille.derche@dokspot.com',
    agreeTos: true,
    store: leStore,
    approvedDomains: ['slave.clientdomain1.com', 'slave.clientdomain2.com'],
    debug: true
});
require('http').createServer(greenlock.middleware(redir)).listen(80);
require('https').createServer(greenlock.tlsOptions, function (req, res) {
    return proxy.web(req, res, {
        target: 'https://www.google.com/',
    });
}).listen(443);
