import multer from 'multer';
import express from 'express';
import { uploadFile } from '../controller/documents/uploadFile';
import { getFileFromS3 } from '../controller/documents/getFileFromS3';
import { getAllDocuments } from '../controller/documents/getAllDocuments';

const upload = multer();
const router = express.Router();

router.post('/uploadFile', upload.single('document'), uploadFile);
router.get('/fetchFile', getFileFromS3);
router.get('/allDocuments', getAllDocuments);

export default router;
