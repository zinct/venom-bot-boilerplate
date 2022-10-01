// Include environent variable
require("dotenv").config();

const app = require("./app");

const host = process.env.HOST;
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});
