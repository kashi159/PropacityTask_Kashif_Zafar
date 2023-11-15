const jwt = require('jsonwebtoken');
const {pool} = require('../util/database');

const authenticate = async (req, res, next) => {
  // console.log(req.body)
  try {
    const token = req.header('Authorization');
    const user = jwt.verify(token, '9031278576kash159');
    const userId = user.userId;

    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [userId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    // console.error(err);
    next(err)
    // return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  authenticate,
};
