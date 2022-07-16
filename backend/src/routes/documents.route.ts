import multer from 'multer';
import express from 'express';
import { uploadFile } from '../controller/documents/uploadFile';
import { getFileFromS3 } from '../controller/documents/getFileFromS3';

const upload = multer();
const router = express.Router();

router.post('/uploadFile', upload.single(''), uploadFile);
router.get('/fetchFile', getFileFromS3);

export default router;
