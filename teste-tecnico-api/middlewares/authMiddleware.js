const jwt = require('jsonwebtoken');

function authorize(req, res, next) {
  const token = req.header('authorization');
  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Token inválido.' });
  }
}

module.exports = authorize;
