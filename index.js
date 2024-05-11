const express = require("express");
const app = express();
const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, hostname, () => {
  console.log(`Starting server at ${hostname}:${port}`);
});
