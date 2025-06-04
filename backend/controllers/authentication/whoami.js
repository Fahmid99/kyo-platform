const whoami = async (req, res) => {
  // At this point, both org and user are validated and attached to req after middleware execution
  return res.status(200).json({ organisation: req.org, user: req.user });
};

module.exports = whoami;
