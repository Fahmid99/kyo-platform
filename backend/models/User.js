const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  orgId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: String,
  roles: [String],
  eulaAccepted: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
});

module.exports = mongoose.model("User", userSchema);
