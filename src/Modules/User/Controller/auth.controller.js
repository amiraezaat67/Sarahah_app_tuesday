import {Router} from "express";
import * as services from '../Services/auth.service.js'

import { SignUpSchema } from "../../../validators/user.schema.js";
import { validationMiddleware , authenticationMiddle , refreshTokenVerify } from "../../../Middlewares/index.js";
const authRouter = Router();

// Auth apis
authRouter.post('/signup', validationMiddleware(SignUpSchema),services.SignUpService)
authRouter.post('/login',services.LoginService)
authRouter.put('/confirm-email',services.ConfirmEmailService)
authRouter.post('/signup-gmail' , services.SignUpWithGmail)
authRouter.post('/login-gmail' , services.LoginGmailService)
authRouter.post('/logout', authenticationMiddle , refreshTokenVerify ,services.LogoutService)
authRouter.post('/refresh-token', refreshTokenVerify ,  services.RefreshTokenService)


export {authRouter} ;