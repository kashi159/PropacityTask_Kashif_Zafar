const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

const { pool } = require('../util/database');

const KEY_ID = process.env.IAM_USER_KEY;
const KEY_SECRET = process.env.IAM_USER_SECRET;

AWS.config.update({
  accessKeyId: KEY_ID,
  secretAccessKey: KEY_SECRET,
  region: 'us-east-1',
});

const s3 = new AWS.S3(); 

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'propacitytask',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

exports.uploadFile = (req, res) => {
  upload.single('file')(req, res, async function (err) {
    if (err) {
      console.error(err);

      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).send('Too many files uploaded.');
        }
        return res.status(400).send('Multer error.');
      } else if (err) {
        return res.status(500).send('Error uploading file.');
      }
    }

    try {
      const { originalname, size, location } = req.file;
      const userId = req.user.id;
      const folderId = req.body.folderId
      const query =
        'INSERT INTO uploads (file_name, size, url, user_id, folder_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const values = [originalname, size, location, userId, folderId];

      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error processing file.');
    }
  });
};

exports.getFiles = async (req, res) => {
  const parentFolderId = req.params.folderId;
        // console.log(parentFolderId)
        const query = 'SELECT id, file_name, url FROM uploads WHERE folder_id = $1';
        const values = [parentFolderId];

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving files');
  }
};
