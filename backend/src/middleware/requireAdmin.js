const jwt = require("jsonwebtoken");

function requireAdmin(request, response, next) {
  const authorization = request.get("authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return response.status(401).json({ error: "Please sign in to continue." });
  }

  const token = authorization.slice("Bearer ".length);

  try {
    request.admin = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return response.status(401).json({ error: "Invalid or expired token" });
    }

    return next(error);
  }
}

module.exports = requireAdmin;
