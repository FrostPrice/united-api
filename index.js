const express = require("express");
const session = require("express-session");
const { secretKeyBase64 } = require("./src/config.js");
const app = express();
const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: secretKeyBase64, // Ensure this is a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true }, // Recommended for production
  })
);

// Routes
require("./src/routes/apiStatus.routes.js")(app); // Status route - Only to check if the API route is working
require("./src/routes/auth.routes.js")(app);
require("./src/routes/users.routes.js")(app);
require("./src/routes/notifications.routes.js")(app);
require("./src/routes/events.routes.js")(app);
// TODO: Apply the middleware to check if the user is logged in

app.listen(port, hostname, () => {
  console.log(`Starting server at ${hostname}:${port}`);
});
