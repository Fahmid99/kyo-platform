const app = require("./app.js");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");

const port = process.env.PORT || 3000;

dotenv.config();

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
