const getBuildVersion = async (req, res) => {
  return res.status(200).json({
    version: 1.1,
  });
};
module.exports = getBuildVersion;
