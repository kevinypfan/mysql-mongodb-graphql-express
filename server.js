require('./config/config');

const http = require('http');
const app = require('./app');
const models = require('./models/sequelize');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

models.sequelize.sync({ force: process.env.NODE_ENV === "test" ? true : false })
  .then(() => {
    server.listen(port);
  })
