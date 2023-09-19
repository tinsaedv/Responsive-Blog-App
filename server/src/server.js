const http = require('http');
const app = require('./app');

const mongoConnect = require('./services/mongo');

const server = http.createServer(app);

const port = process.env.PORT;

async function startServer() {
  try {
    await mongoConnect();
    server.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();
