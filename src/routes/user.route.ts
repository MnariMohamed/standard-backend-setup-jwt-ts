import express from 'express';
import { checkAuthSuperAdmin } from '../middlewares/auth.middleware';
import * as UserCtrl from '../controllers/user.controller';


const userRoute = express.Router();

// la route qui permet de creer un compte pour tous les utilisateur
userRoute.post('/signup', UserCtrl.createUser);
// la route qui permet de se connecter pour tous les utilisateurs
userRoute.route('/login').post(UserCtrl.login);

//send verification codes
userRoute.route('/send_codes').post(UserCtrl.sendVerification);



export default userRoute;
