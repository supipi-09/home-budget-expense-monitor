const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const [existing] = await db.query("SELECT * FROM Users WHERE Email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO Users (UserName, Email, PasswordHash) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query("SELECT * FROM Users WHERE Email = ?", [
      email,
    ]);
    if (users.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.UserId, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, userId: user.UserId, username: user.UserName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
