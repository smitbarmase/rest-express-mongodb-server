const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const postRouter = require("./routers/post");
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(postRouter);

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});