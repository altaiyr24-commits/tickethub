const jwt = require('jsonwebtoken');
const supabase = require('../lib/supabase');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
      return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user } = await supabase
      .from('users')
      .select('id, email, name, role, is_verified')
      .eq('id', decoded.userId)
      .maybeSingle();

    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      return res.status(401).json({ error: 'Token expired' });
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN')
    return res.status(403).json({ error: 'Admin access required' });
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { data: user } = await supabase
        .from('users')
        .select('id, email, name, role')
        .eq('id', decoded.userId)
        .maybeSingle();
      req.user = user;
    }
  } catch {}
  next();
};

module.exports = { authenticate, requireAdmin, optionalAuth };
