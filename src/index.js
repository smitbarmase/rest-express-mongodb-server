const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const postRouter = require("./routers/post");
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  if (req.method === 'GET') {

  } else {
    next();
  }
});

app.use(express.json());
app.use(userRouter);
app.use(postRouter);

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});