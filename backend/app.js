const express = require("express");
const path = require("path");

const { i18next, middleware } = require("./config/i18n.js");

const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");
const platformRoutes = require("./routes/platform.js");
const versionRoutes = require("./routes/version.js");

const app = express();
app.use(middleware.handle(i18next));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/platform", platformRoutes);
app.use("/api/version", versionRoutes);

app.use(express.static(path.join(__dirname, "../dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

module.exports = app;
