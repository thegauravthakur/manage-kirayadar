import multer from 'multer';
import express from 'express';
import { uploadFile } from '../controller/documents/uploadFile';
import { getFileFromS3 } from '../controller/documents/getFileFromS3';
import { getAllDocuments } from '../controller/documents/getAllDocuments';
import { deleteFile } from '../controller/documents/deleteFile';

const upload = multer();
const router = express.Router();

router.post('/uploadFile', upload.single('document'), uploadFile);
router.post('/fetchFile', getFileFromS3);
router.post('/allDocuments', getAllDocuments);
router.post('/deleteFile', deleteFile);

export default router;
