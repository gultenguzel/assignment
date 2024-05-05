const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();

const serviceAUrl = 'http://service-A:3001';
const serviceBUrl = 'http://service-B:3002';

// Service A ve Service B'ye yönlendirme
app.use('/api/mobile', (req, res) => {
  console.log(`Incoming request to /api/mobile: ${req.method} ${req.url}`);
  
  proxy.web(req, res, { target: serviceAUrl }, (err) => {
    console.error(`Error forwarding request to service A: ${err.message}`);
    res.status(500).send('Internal Server Error');
  });
});

app.use('/api/web', (req, res) => {
  console.log(`Incoming request to /api/web: ${req.method} ${req.url}`);
  
  proxy.web(req, res, { target: serviceBUrl }, (err) => {
    console.error(`Error forwarding request to service B: ${err.message}`);
    res.status(500).send('Internal Server Error');
  });
});

// Proxy tarafından alınan istekleri günlüğe kaydetme
proxy.on('proxyReq', function (proxyReq, req, res, options) {
  console.log(`Received request to ${options.target.href}: ${req.method} ${req.url}`);
});

const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});

