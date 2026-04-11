-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update todos table
ALTER TABLE todos ADD COLUMN user_id INT,
ADD COLUMN priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
ADD COLUMN category VARCHAR(100) DEFAULT 'General',
ADD COLUMN due_date DATETIME;

-- Add foreign key constraint
ALTER TABLE todos ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;
