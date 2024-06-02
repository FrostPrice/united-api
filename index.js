const express = require("express");
const session = require("express-session");
const { secretKeyBase64 } = require("./src/config.js");
const app = express();
const hostname = process.env.APP_HOSTNAME || "localhost";
const port = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: secretKeyBase64, // Ensure this is a secure key
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // * Keep it true for production. And false for development
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }, // Recommended for production
  })
);

// Routes
require("./src/routes/apiStatus.routes.js")(app); // Status route - Only to check if the API route is working
require("./src/routes/auth.routes.js")(app);
require("./src/routes/users.routes.js")(app);
require("./src/routes/notifications.routes.js")(app);
require("./src/routes/events.routes.js")(app);
require("./src/routes/grades.routes.js")(app);
require("./src/routes/courses.routes.js")(app);
require("./src/routes/subjects.routes.js")(app);
require("./src/routes/professors.routes.js")(app);
require("./src/routes/enrollments.routes.js")(app);
require("./src/routes/assessments.routes.js")(app);

app.listen(port, hostname, () => {
  console.log(`Starting server at ${hostname}:${port}`);
});
