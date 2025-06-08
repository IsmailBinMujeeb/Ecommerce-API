import { Router } from 'express';
import { UserRegisterController, UserLoginController, UserLogoutController, emailVerificationController, refreshAccessToken, saveUserAddressController, getUserAddressController } from '../../controllers/api/auth.controller.js';
import { UserLoginValidator, UserLogoutValidator, UserRegisterValidator, emailVerificationValidator, refreshAccessTokenValidator, saveUserAddressValidator } from "../../validators/auth.validator.js";
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import AsyncHandler from '../../utils/AsyncHandler.utils.js';
import authenticationMiddleware from '../../middlewares/authentication.middleware.js';

const router = Router();

router.post('/register', UserRegisterValidator(), validatorMiddleware, AsyncHandler(UserRegisterController));
router.post('/login', UserLoginValidator(), validatorMiddleware, AsyncHandler(UserLoginController));
router.post('/logout', UserLogoutValidator(), validatorMiddleware, AsyncHandler(UserLogoutController));
router.get('/verify-email/:token', emailVerificationValidator(), validatorMiddleware, AsyncHandler(emailVerificationController));
router.post('/refresh-token', refreshAccessTokenValidator(), validatorMiddleware, AsyncHandler(refreshAccessToken));
router.post('/address', saveUserAddressValidator(), authenticationMiddleware, validatorMiddleware, AsyncHandler(saveUserAddressController));
router.get('/address', authenticationMiddleware, AsyncHandler(getUserAddressController));

export default router;