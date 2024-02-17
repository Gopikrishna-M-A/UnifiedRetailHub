import express from 'express';
// import multer from 'multer'
import { addUser, getUserByEmail, getUser, deleteUser, updateUser, getUsers }  from '../controllers/user.js';
const router = express.Router();
// import { fileURLToPath } from 'url';
// import path from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       const uploadPath = path.resolve(__dirname, '..', '..', 'uploads');
//       cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//       return cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const upload = multer({ storage: storage });

// router.post("/", upload.single('image'), addQuestion)
// router.get("/getImage/:path", getImage)


//route to get all users for admin 
router.post("/", addUser)
router.get("/email/:id", getUserByEmail)
router.get("/:id", getUser)
router.get("/", getUsers)
router.delete("/:id", deleteUser)
router.patch("/:id", updateUser)



export default router;
