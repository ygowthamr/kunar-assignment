CREATE TABLE IF NOT EXISTS admins (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_type TEXT NOT NULL CHECK (user_type IN ('Parent', 'Student', 'School')),
  category TEXT NOT NULL CHECK (category IN ('Scholarship', 'Concert', 'Admission', 'General Query')),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email TEXT NOT NULL CHECK (char_length(email) <= 254),
  phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 1 AND 30),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 3000),
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'In Progress', 'Resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_category_idx ON inquiries (category);
CREATE INDEX IF NOT EXISTS inquiries_user_type_idx ON inquiries (user_type);
