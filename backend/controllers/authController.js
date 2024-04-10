const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Mock user data
const users = [
  {
    id: '1',
    username: 'user1',
    passwordHash: bcrypt.hashSync('password1', 10),
  },
  {
    id: '2',
    username: 'user2',
    passwordHash: bcrypt.hashSync('password2', 10),
  },
];

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

exports.authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Authorization token missing' });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = { userId: decodedToken.userId };
    next();
  } catch (error) {
    console.error('Error decoding token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
