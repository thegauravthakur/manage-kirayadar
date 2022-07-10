import userRoute from './user.route';
import otpRoute from './otp.route';
import propertyRoute from './property.route';
import { auth } from '../middleware/protected';
import tenantRoute from './tenant.route';
import spaceRoute from './space.route';
const express = require('express');
const router = express.Router();

router.use('/user', userRoute);
router.use('/otp', otpRoute);
router.use('/property', auth, propertyRoute);
router.use('/space', auth, spaceRoute);
router.use('/tenant', auth, tenantRoute);

export default router;
