const multer = require("multer");
const crypto = require('crypto');
const uuid = crypto.randomUUID();
// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});


const upload = multer({ storage });
module.exports = {upload};