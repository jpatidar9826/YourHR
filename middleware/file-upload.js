const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const fileUpload = multer({
  limits: 3 * 1024 * 1024,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/resumes");
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + ".pdf");
    },
  }),
});

module.exports = fileUpload;
