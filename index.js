const express = require("express");
const app = express();
const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
require("./src/routes/users.routes.js")(app);
require("./src/routes/notifications.routes.js")(app);
require("./src/routes/events.routes.js")(app);

app.listen(port, hostname, () => {
  console.log(`Starting server at ${hostname}:${port}`);
});
