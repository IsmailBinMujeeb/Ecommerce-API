import {Router} from 'express';
import { UserRegisterController, UserLoginController, UserLogoutController, getLoginUserController, emailVerificationController, refreshAccessToken, saveUserAddressController, getUserAddressController } from '../../controllers/api/auth.controller.js';
import AsyncHandler from '../../utils/AsyncHandler.utils.js';
import authenticationMiddleware from '../../middlewares/authentication.middleware.js';

const router = Router();

router.post('/register', AsyncHandler(UserRegisterController));
router.post('/login', AsyncHandler(UserLoginController));
router.post('/logout', AsyncHandler(UserLogoutController));
router.get('/', authenticationMiddleware, AsyncHandler(getLoginUserController));
router.get('/verify-email/:token', AsyncHandler(emailVerificationController));
router.post('/refresh-token', AsyncHandler(refreshAccessToken));
router.post('/address', authenticationMiddleware, AsyncHandler(saveUserAddressController));
router.get('/address', authenticationMiddleware, AsyncHandler(getUserAddressController));


export default router;