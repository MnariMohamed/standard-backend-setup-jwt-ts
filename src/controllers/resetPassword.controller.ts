import { Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { generateKey } from '../tools/shared_functions';
import { sendEmail } from '../tools/sendMsg';
import User, { UserRoleEnum } from '../models/user.model';
import bcrypt from 'bcrypt';


export async function addToken(req: Request, res: Response) {
    try {
        let email = req.body.email;
        let foundUser = await User.findOne({ email, role: { $in: [UserRoleEnum.CLIENT] } });
        if (!foundUser) return res.status(404).json({ message: "Utilisateur pas trouvé" });
        const code = await generateKey();
        const token = jsonwebtoken.sign({ user_id: foundUser._id }, code, { expiresIn: '1h' });
        foundUser.tokens.resetPassword = token;
        await foundUser.save();
        let mailOptions = {} as any;
        let output = `<h4>Bonjour <span style="color: #00aadd;">
    </span>, le code de confirmation est : <strong>${code} </strong> .</h4>
    <div>
      <p>Cordialement; <br>
      Assistance LETs BRICOLE.</p>
    </div>`;
        mailOptions = {
            from: '"R3 Logistics Service"',
            to: email,
            subject: 'Réinitialisation du MDP',
            text: '',
            html: output,
        };
        await sendEmail(mailOptions);

        res.status(200).json({ message: "Veuillez verifier votre boite email", user_id: foundUser._id });
    } catch (error) { console.log(error); res.status(500).json({ message: "Erreur Interne" }); }

}


//verify token
export async function verifyToken(req: Request, res: Response) {
    try {
        let foundUser = await User.findById(req.body.user_id);
        if (!foundUser) return res.status(404).json({ message: "Utilisateur pas trouvé" });
        const tokenData: any = jsonwebtoken.verify(foundUser.tokens.resetPassword, req.body.code);
        if (tokenData) {
            //console.log("tokendata: ",tokenData);
            res.status(200).json({ message: "Veuillez renouveler votre mot de passe !", user_id: tokenData.userId })
        } else {
            res.status(403).json({ message: "Le code entré est incorrect, veuillez reverifier votre boite mail." });
        }
    } catch (error) { console.log(error); res.status(500).json({ message: "Erreur possible que le code est Invalide" }); }
}


//update password
export async function updatePassword(req: Request, res: Response) {
    try {
        let foundUser = await User.findById(req.body.user_id);
        if (!foundUser) return res.status(404).json({ message: "Utilisateur pas trouvé" });
        const tokenData: any = jsonwebtoken.verify(foundUser.tokens.resetPassword, req.body.code);
        if (tokenData) {
            const hash = bcrypt.hashSync(req.body.new_pass, 10);
            foundUser.password = hash;
            foundUser.save(function () {
                foundUser.save(() => res.status(200).json({ message: "Votre mot de passe a été bien mise à jour, vous pouvez connecter avec le nouveau mot de passe" }));
            });
        }
    } catch (error) { console.log(error); res.status(500).json({ message: "Erreur Interne" }); }
}

