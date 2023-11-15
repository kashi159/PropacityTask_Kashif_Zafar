const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
require('dotenv').config();

const initializeTables = require('./util/database')
const app = express();
app.use(cors());

const port = 4000;

const userRoutes = require('./routes/user');
const folderRoutes = require('./routes/folder');
const uploadRoutes = require('./routes/upload')

app.use(bodyParser.json());

app.use(userRoutes)                               
app.use(folderRoutes)
app.use(uploadRoutes);

initializeTables.initializeTables();


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
