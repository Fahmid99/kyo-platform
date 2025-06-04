const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateEmailFormat = (req, res, next) => {
  const sources = [req.body, req.params, req.query];
  const emails = sources
    .map((source) => source?.email)
    .filter((email) => email !== undefined);

  // Validate all found emails
  const invalidEmail = emails.find((email) => !isValidEmail(email));
  if (invalidEmail) {
    return res.status(400).json({
      message: {
        key: "ERROR_EMAIL_INVALID_FORMAT",
        description: req.t("ERROR_EMAIL_INVALID_FORMAT"),
      },
    });
  }

  next();
};

module.exports = validateEmailFormat;
