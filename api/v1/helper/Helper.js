const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

class Helpers {
  static async hashPassword(password) {
    const res = await bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    return res;
  }

  static async comparePassword(password, hashPassword) {
    const res = await bcrypt.compare(password, hashPassword);
    return res;
  }

  static async generateToken(userId) {
    const res = await jwt.sign({ userId }, process.env.SECRET_TOKEN, { expiresIn: '24h' });
    return res;
  }

  static async verifyToken(token) {
    const res = await jwt.verify(token, process.env.SECRET_TOKEN);
    return res;
  }

  static async pushToCloudinary(file) {
    const result = await cloudinary.uploader.upload(file);
    console.log(result);
    return result;
  }

  static async deleteFromCloudinary(publicId) {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);
    return result;
  }

  static imageType(file, folder) {
    let filetype;
    const mimetype = file.mimetype;
    switch (mimetype) {
      case 'image/jpg':
        filetype = 'jpg';
        break;
      case 'image/jpeg':
        filetype = 'jpg';
        break;
      case 'image/png':
        filetype = 'png';
        break;
      default:
        filetype = '';
        break;
    }
    if (filetype === '') {
      return filetype;
    }
    file.name.split(' ').join('');
    file.mv(`.${folder}`, (err) => {
      if (err) {
        console.log('Could Not Upload Image');
      }
      return file;
    });
    return file;
  }
}
module.exports = Helpers;
