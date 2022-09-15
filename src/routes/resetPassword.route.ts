import express from 'express';
import * as ResetPasswordCtrl from '../controllers/resetPassword.controller';

const resetPasswordRouter = express.Router();

// pour ajouter creer un token
resetPasswordRouter.post('/add-token', ResetPasswordCtrl.addToken);

// verify toke
resetPasswordRouter.post('/verify-token', ResetPasswordCtrl.verifyToken);

// update password
resetPasswordRouter.put('/update-password', ResetPasswordCtrl.updatePassword);


export default resetPasswordRouter;