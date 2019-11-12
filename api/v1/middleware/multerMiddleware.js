const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'image/gif') {
      cb(null, './images/gifs');
    } else {
      cb({ message: 'This file is not a gif file' }, false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

module.exports = multer({ storage });
