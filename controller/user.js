const {pool} = require('../util/database')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postSignUpUser = async (req, res, next) => {
    const { username, email, password } = req.body;
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
    const values = [username, email, hashedPassword];
  
    try {
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      // console.error(error);
      res.status(500).send('Error registering user');
      next(error)
    }
  };

  function generateToken(id){
    return jwt.sign({ userId: id }, '9031278576kash159');
  }
  
  
  exports.postLoginUser = async (req, res, next) => {
    const { email, password } = req.body;
  
    const query = 'SELECT * FROM public.users WHERE email = $1';
    const values = [email];
  
    try {
      const result = await pool.query(query, values);
  
      if (result.rows.length > 0) {
        const match = await bcrypt.compare(password, result.rows[0].password);
  
        if (match) {
          return res.status(200).json({ token: generateToken(result.rows[0].id) });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      // console.error(error);
      next(error)
      // res.status(500).send('Error during login');
    }
  };
  