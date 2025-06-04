const requireName = (req, res, next) => {
  const sources = [req.body, req.params, req.query];
  const names = sources
    .map((source) => source?.name)
    .filter((name) => name !== undefined);

  if (names.length === 0) {
    return res.status(400).json({
      message: {
        key: "ERROR_NAME_REQUIRED",
        description: req.t("ERROR_NAME_REQUIRED"),
      },
    });
  }

  next();
};

module.exports = requireName;
