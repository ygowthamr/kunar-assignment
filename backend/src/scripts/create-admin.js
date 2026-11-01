require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("../db");

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before creating an admin.");
  }
  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters long.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO admins (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [email.trim().toLowerCase(), passwordHash],
  );

  console.log(`Admin account ready for ${email.trim().toLowerCase()}.`);
}

createAdmin()
  .catch((error) => {
    console.error("Could not create the admin account:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
