const express = require("express");
const pool = require("../db");
const requireAdmin = require("../middleware/requireAdmin");
const { categories, inquiryStatuses, userTypes } = require("../constants");

const router = express.Router();

function escapeLikeValue(value) {
  return value.replace(/[\\%_]/g, "\\$&");
}

router.post("/", async (request, response, next) => {
  const { userType, category, name, email, phone, message } = request.body || {};

  if (!userTypes.includes(userType)) {
    return response.status(400).json({ error: "Choose a valid user type." });
  }
  if (!categories.includes(category)) {
    return response.status(400).json({ error: "Choose a valid inquiry category." });
  }
  if (typeof name !== "string" || name.trim().length < 1 || name.trim().length > 100) {
    return response.status(400).json({ error: "Name must be between 1 and 100 characters." });
  }
  if (typeof email !== "string" || email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return response.status(400).json({ error: "Enter a valid email address." });
  }
  if (typeof phone !== "string" || phone.trim().length < 1 || phone.trim().length > 30) {
    return response.status(400).json({ error: "Phone number must be between 1 and 30 characters." });
  }
  if (typeof message !== "string" || message.trim().length < 1 || message.trim().length > 3000) {
    return response.status(400).json({ error: "Message must be between 1 and 3000 characters." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO inquiries (user_type, category, name, email, phone, message)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, created_at`,
      [userType, category, name.trim(), email.trim(), phone.trim(), message.trim()],
    );

    return response.status(201).json({
      message: "Your inquiry was submitted.",
      inquiry: { id: result.rows[0].id, createdAt: result.rows[0].created_at },
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/", requireAdmin, async (request, response, next) => {
  const { category, userType, search } = request.query;

  if (category && !categories.includes(category)) {
    return response.status(400).json({ error: "Choose a valid inquiry category." });
  }
  if (userType && !userTypes.includes(userType)) {
    return response.status(400).json({ error: "Choose a valid user type." });
  }
  if (search !== undefined && (typeof search !== "string" || search.length > 100)) {
    return response.status(400).json({ error: "Search must be 100 characters or fewer." });
  }

  const conditions = [];
  const values = [];

  if (category) {
    values.push(category);
    conditions.push(`category = $${values.length}`);
  }
  if (userType) {
    values.push(userType);
    conditions.push(`user_type = $${values.length}`);
  }
  if (search && search.trim()) {
    values.push(`%${escapeLikeValue(search.trim())}%`);
    conditions.push(`(name ILIKE $${values.length} ESCAPE '\\' OR phone ILIKE $${values.length} ESCAPE '\\')`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const result = await pool.query(
      `SELECT id, user_type, category, name, email, phone, message, status, created_at
       FROM inquiries ${whereClause}
       ORDER BY created_at DESC`,
      values,
    );
    const inquiries = result.rows.map((row) => ({
      id: row.id,
      userType: row.user_type,
      category: row.category,
      name: row.name,
      email: row.email,
      phone: row.phone,
      message: row.message,
      status: row.status,
      createdAt: row.created_at,
    }));

    return response.json({ inquiries });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id/status", requireAdmin, async (request, response, next) => {
  const inquiryId = Number(request.params.id);
  const { status } = request.body || {};

  if (!Number.isSafeInteger(inquiryId) || inquiryId < 1) {
    return response.status(400).json({ error: "Enter a valid inquiry ID." });
  }
  if (!inquiryStatuses.includes(status)) {
    return response.status(400).json({ error: "Choose a valid inquiry status." });
  }

  try {
    const result = await pool.query(
      "UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING id, status",
      [status, inquiryId],
    );

    if (result.rowCount === 0) {
      return response.status(404).json({ error: "That inquiry could not be found." });
    }

    return response.json({ inquiry: { id: result.rows[0].id, status: result.rows[0].status } });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
