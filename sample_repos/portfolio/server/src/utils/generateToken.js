const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'anshika_portfolio_super_secure_jwt_secret_2025';
  return jwt.sign({ id }, secret, {
    expiresIn: '7d'
  });
};

module.exports = generateToken;
