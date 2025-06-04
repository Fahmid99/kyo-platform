const requireEmail = (req, res, next) => {
  const sources = [req.body, req.params, req.query];
  const emails = sources
    .map((source) => source?.email)
    .filter((email) => email !== undefined);

  if (emails.length === 0) {
    return res.status(400).json({
      message: {
        key: "ERROR_EMAIL_REQUIRED",
        description: req.t("ERROR_EMAIL_REQUIRED"),
      },
    });
  }

  next();
};

module.exports = requireEmail;
