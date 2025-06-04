const getOrgIdByProvider = (provider, userClaims) => {
  switch (provider) {
    case "aad":
      return userClaims.find(
        (claim) =>
          claim.typ === "http://schemas.microsoft.com/identity/claims/tenantid"
      ).val;
  }
};

const getClaimsFromToken = (req, res, next) => {
  const token = req.token;
  const provider = token.provider_name;
  const userClaims = token.user_claims;

  const orgId = getOrgIdByProvider(provider, userClaims);
  const email = userClaims.find(
    (claim) =>
      claim.typ ===
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
  ).val;

  if (!provider || !orgId || !email) {
    return res.status(404).json({
      message: {
        key: "ERROR_CLAIM_NOT_FOUND",
        description: req.t("ERROR_CLAIM_NOT_FOUND"),
      },
    });
  }

  req.claims = {
    provider,
    orgId,
    email,
  };

  next();
};

module.exports = getClaimsFromToken;
