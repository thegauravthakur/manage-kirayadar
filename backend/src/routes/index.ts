import { Request, Response } from 'express';
import userRoute from './user.route';
import otpRoute from './otp.route';
import propertyRoute from './property.route';
import { auth } from '../middleware/protected';
import tenantRoute from './tenant.route';
import spaceRoute from './space.route';
import documentsRoute from './documents.route';
import { prismaClient } from '../utils/server';
const express = require('express');
const router = express.Router();

router.use('/user', userRoute);
router.use('/otp', otpRoute);
router.use('/property', auth, propertyRoute);
router.use('/space', auth, spaceRoute);
router.use('/tenant', auth, tenantRoute);
router.use('/documents', auth, documentsRoute);
router.use('/', async function (req: Request, res: Response) {
    const properties = await prismaClient.property.findMany({});
    res.json(properties);
});

export default router;
