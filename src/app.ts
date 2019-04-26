import { Greenlock } from 'greenlock';
let httpProxy = require('http-proxy');
let proxy = httpProxy.createProxyServer({});
let redir = require('redirect-https')();

// let's create ou greenlock server first

let greenlock = Greenlock.create({
  // check greenlock's doc for the entire code sample
});


require('http').createServer(greenlock.middleware(redir)).listen(80);

require('https').createServer(greenlock.tlsOptions, function (req: any, res: any) {
  return proxy.web(req, res, {
    target: 'https://another-server.com',
  });
}).listen(443);