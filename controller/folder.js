const {pool} = require('../util/database')

exports.getFolders = async (req, res, next) => {
    const userId = req.user.id; 
  
    const query = `
      SELECT id, name
      FROM folders
      WHERE user_id = $1
    `;
    const values = [userId];
  
    try {
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (error) {
      // console.error(error);
      res.status(500).send('Error retrieving folders');
      next(error)
    }
  };

exports.getSubFolders = async (req, res, next) => {
    
    try {
        const parentFolderId = req.params.folderId;
        // console.log(parentFolderId)
        const query = 'SELECT id, name FROM folders WHERE parent_id = $1';
        const values = [parentFolderId];

        const result = await pool.query(query, values);

        res.status(200).json(result.rows);
    } catch (error) {
        // console.error(error);
        res.status(500).send('Error retrieving subfolders');
        next(error)
}
}; 



exports.postFolder = async (req, res, next) => {
  const folderName = req.body.folderName
    const userId = req.user.id;
    // console.log(folderName)
    // console.log(userId)
  
    const query = 'INSERT INTO folders (name, user_id) VALUES ($1, $2) RETURNING *';
    const values = [folderName, userId];
  
    try {
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      // console.error(error);
      res.status(500).send('Error creating folder');
      next(error)
    }
  };
  
  exports.postSubFolder = async (req, res, next) => {
    const userId = req.user.id;
    const { subfolderName, parentId} = req.body.data;
  
  
    const query = 'INSERT INTO folders (name, parent_id, user_id) VALUES ($1, $2, $3) RETURNING *';
    const values = [subfolderName, parentId, userId];
  
    try {
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      // console.error(error);
      res.status(500).send('Error creating subfolder');
      next(error)
    }
  };

exports.renameFile = async (req, res, next) => {
    const { fileId } = req.params;
    const { newName } = req.body;
    const userId = req.user.id;
    
// console.log(newName, fileId)

const query = 'UPDATE uploads SET file_name = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
const values = [newName, fileId, userId];
  
    try {
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      // console.error(error);
      res.status(500).send('Error renaming file');
      next(error)
    }
  };
  
  exports.moveFile = async (req, res, next) => {
    const { fileId } = req.params;
    const { newFolderId } = req.body;
    // console.log(ne)
    const userId = req.user.id;

    const query = 'UPDATE uploads SET folder_id = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
    const values = [newFolderId, fileId, userId];
  
    try {
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      // console.error(error);
      res.status(500).send('Error moving file');
      next(error)
    }
  };
  
  exports.deleteFile = async (req, res, next) => {
    const { fileId } = req.params;
    const userId = req.user.id;

    const query = 'DELETE FROM uploads WHERE id = $1 AND user_id = $2 RETURNING *';
    const values = [fileId, userId];
  
    try {
      const result = await pool.query(query, values);
      // console.log(result)
      if(result.rows.length === 0){
        res.status(400).send({message: 'File not found'})
        // res.json({message: 'File not found'})
      }else{
        res.json({ message: 'File deleted successfully' });
      }
    } catch (error) {
      // console.error(error);
      res.status(500).send('Error deleting file');
      next(error)
    }
  };