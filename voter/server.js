const http = require('http')
const app = require('./app')

const port = process.env.PORT | 3002, 
     hostname = '127.0.0.1'

app.set('port', port)
app.set('hostname', hostname)


const server = http.createServer(app)

server.listen(port, hostname, _ => console.log(`
server run at http://${hostname}:${port}`))