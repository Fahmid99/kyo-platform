const { EmailClient } = require("@azure/communication-email");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const User = require("../../models/User.js");

dotenv.config();

const connectionString =
  process.env.AZURE_COMMUNICATION_SERVICE_CONNECTION_STRING;
if (!connectionString) {
  throw new Error(
    "Azure Communication Service connection string is not set in environment variables."
  );
}

const createUser = async (req, res) => {
  const { email, name, roles } = req.body;
  const orgId = req.org?.orgId;
  let emailSent = false;

  try {
    // Check if the user already exists
    const user = await User.findOne({ email, orgId });
    if (user) {
      return res.status(409).json({
        message: {
          key: "ERROR_EMAIL_ALREADY_EXISTS",
          description: req.t("ERROR_EMAIL_ALREADY_EXISTS"),
        },
      });
    }

    const newUser = new User({
      orgId,
      email,
      name,
      roles: roles || [],
    });

    await newUser.save();

    emailSent = await sendEmail(email, name);

    return res.status(201).json({
      message: {
        key: "SUCCESS_USER_CREATED",
        description: req.t("SUCCESS_USER_CREATED"),
      },
      user: newUser,
      emailSent,
    });
  } catch (error) {
    console.error("Error createUser:", error);
    return res.status(500).json({
      message: {
        key: "ERROR_INTERNAL_SERVER",
        description: req.t("ERROR_INTERNAL_SERVER"),
      },
    });
  }
};

const sendEmail = async (email, name) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../../templates/welcome-email-template.html"
    );
    let htmlContent = fs.readFileSync(templatePath, "utf-8");

    const host = process.env.HOST || 
    req.headers.host;
    htmlContent = htmlContent
      .replace("{{name}}", name || "User")
      .replace("{{host}}", `http://${host}/login`);

    const emailMessage = {
      senderAddress:
        "DoNotReply@5cb49d00-f24f-47cf-9bab-e3abb8c80457.azurecomm.net",
      content: {
        subject: "Welcome to Our Platform!",
        html: htmlContent,
      },
      recipients: {
        to: [{ address: email }],
      },
    };

    const emailClient = new EmailClient(connectionString);
    const poller = await emailClient.beginSend(emailMessage);
    const response = await poller.pollUntilDone();
    const result = response.status === "Succeeded";
    return result;
  } catch (emailError) {
    console.warn("Failed to send welcome email:", emailError);
    return false;
  }
};

module.exports = createUser;
