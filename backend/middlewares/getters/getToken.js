const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");

const getToken = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development") {
      // Read token from local Token.json file
      const tokenPath = path.join(
        __dirname,
        "../../__tests__/samples/AzureToken.json"
      );
      const tokenData = await fs.readFile(tokenPath, "utf-8");
      req.token = JSON.parse(tokenData);
      return next();
    }

    const host = process.env.HOST || req.get("host");
    const response = await axios.get(`https://${host}/.auth/me`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: req.headers.cookie,
      },
      withCredentials: true,
    });

    if (response.status === 200 && response.data.length > 0) {
      req.token = response.data[0];
      next(); // Proceed to the next middleware or route handler
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error("Error in getToken:", error);
    switch (error.response?.status) {
      case 401:
        return res.status(401).json({
          message: {
            key: "ERROR_TOKEN_UNAUTHORISED",
            description: req.t("ERROR_TOKEN_UNAUTHORISED"),
          },
        });
      case 403:
        return res.status(403).json({
          message: {
            key: "ERROR_TOKEN_FORBIDDEN",
            description: req.t("ERROR_TOKEN_FORBIDDEN"),
          },
        });
      default:
        return res.status(500).json({
          message: {
            key: "ERROR_INTERNAL_SERVER",
            description: req.t("ERROR_INTERNAL_SERVER"),
          },
        });
    }
  }
};

module.exports = getToken;
