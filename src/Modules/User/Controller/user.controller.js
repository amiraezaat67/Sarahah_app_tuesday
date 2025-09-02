import {Router} from "express";
import * as services from '../Services/user.service.js'
// import { authenticationMiddle } from "../../../Middlewares/authentication.middleware.js";
import { authorizationMiddle , LocalUpload, authenticationMiddle, HostUpload } from "../../../Middlewares/index.js";
import { RolesEnum } from "../../../Common/enums/user.enum.js";
const userRouter = Router();

// User apis
userRouter.put('/update', authenticationMiddle,services.UpdateService)
userRouter.delete('/delete' , authenticationMiddle,authorizationMiddle([RolesEnum.USER]),  services.DeleteService)


// Admins
userRouter.get('/list', 
    authenticationMiddle ,
    authorizationMiddle([RolesEnum.ADMIN , RolesEnum.SUPER_ADMIN]),  
    services.ListUsersService)

userRouter.patch('/upload-profile',
    authenticationMiddle,
    // LocalUpload({path:'User/Profiles'})
    HostUpload().single('profile'),
    services.UploadProfileService
)

// test delete cloud
userRouter.delete('/test-delete-cloud', services.DeleteFolder)
export {userRouter};