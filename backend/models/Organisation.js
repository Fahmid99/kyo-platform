const mongoose = require("mongoose");

const organisationSchema = new mongoose.Schema({
  orgId: { type: String, required: true, unique: true },
  name: String,
});

module.exports = mongoose.model("Organisation", organisationSchema);
