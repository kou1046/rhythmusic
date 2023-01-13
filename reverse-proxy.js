const fs = require('fs');
const https = require('https');
const httpProxy = require('http-proxy');
require("dotenv").config({ path: ".env.development"});

const proxy = httpProxy.createProxyServer({
  target: {
    host: process.env.HOST,
    port: 3000,
  }
})

const web = (req, res) => {
  proxy.web(req, res)
}

const ws = (req, socket, head) => {
  proxy.ws(req, socket, head)
}

const server = https.createServer(
  {
    key: fs.readFileSync(`${process.env.HOST}-key.pem`),
    cert: fs.readFileSync(`${process.env.HOST}.pem`),
  },
  web,
)

server.on('upgrade', ws)

server.listen(process.env.PORT, process.env.HOST, () => {
  console.log(
    `proxy server has started listening on https://${process.env.HOST}:${process.env.PORT}, forwarding to http://${process.env.HOST}:3000`,
  )
})