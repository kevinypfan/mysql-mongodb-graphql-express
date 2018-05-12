
const express = require("express");
const app = express();
const expressGraphQL = require('express-graphql');
const morgan = require("morgan");
const cors = require('cors');
const mongoose = require("mongoose");
const { authenticate } = require('./middleware/authenticate');

const User = require('./models/sequelize').User;
const Token = require('./models/sequelize').Token;

const schema = require('./schema/schema');

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;
app.use(cors());

app.use(morgan("dev"));

app.use('/graphql', authenticate, expressGraphQL((req, res) => ({
  schema,
  graphiql: true,
  context: { req, res }
})));

module.exports = app;