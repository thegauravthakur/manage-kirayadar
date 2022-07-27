import { addNewTenant } from '../controller/tenant/addNewTenant';
import { getAllTenants } from '../controller/tenant/getAllTenants';
import { updateProfilePhoto } from '../controller/tenant/updateProfilePhoto';
import multer from 'multer';
import { getProfilePhoto } from '../controller/tenant/getProfilePhoto';
import { auth } from '../middleware/protected';

const upload = multer();
const express = require('express');
const router = express.Router();

router.post('/add', auth, addNewTenant);
router.post('/get', auth, getAllTenants);
router.post(
    '/updateProfile',
    auth,
    upload.single('profilePhoto'),
    updateProfilePhoto
);
router.post('/profilePhoto', auth, getProfilePhoto);

export default router;
