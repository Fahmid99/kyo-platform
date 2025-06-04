const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: false }, // Prevent auto-generation
  name: { type: String, required: true },
  permissions: { type: Object, default: {} },
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roles: [roleSchema],
});

module.exports = mongoose.model("Service", serviceSchema);
