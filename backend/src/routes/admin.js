const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

router.post("/login", async (request, response, next) => {
  const { email, password } = request.body || {};

  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return response.status(400).json({ error: "Enter your email address and password." });
  }

  try {
    const result = await pool.query(
      "SELECT id, email, password_hash FROM admins WHERE email = $1",
      [email.trim().toLowerCase()],
    );
    const admin = result.rows[0];

    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return response.status(401).json({ error: "The email or password is incorrect." });
    }

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    return response.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
