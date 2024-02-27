import multer from "multer";
import path from "path";

const storage = multer.diskStorage({});

const fileFilter = (req: any, file: any, cb: any) => {
  let ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    cb(new Error("File type is not supported"), false);
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
