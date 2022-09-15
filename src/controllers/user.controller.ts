import mongoose from 'mongoose';
import { Request, Response } from 'express';
import User, { UserDoc, UserRoleEnum } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Country from '../models/country.model';
import { ObjectID } from 'bson';
import { sendEmail, sendSMS, } from '../tools/sendMsg';


//create super_admin if it doesn't exist
User.findOne({ role: UserRoleEnum.SUPER_ADMIN }, function (err: any, super_admin: any) {
    if (err) return console.log(err);
    if (super_admin) return true;
    const userData = {
        role: UserRoleEnum.SUPER_ADMIN,
        name: 'Super', phoneNumber: process.env.SUPER_ADMIN_PHONE, email: 'neokraal.technique@gmail.com',
        password: '', Country: new ObjectID()
    };
    const hash = bcrypt.hashSync(process.env.SUPER_ADMIN_PASS, 10);
    userData.password = hash;
    User.create(userData, async function (err: any, created_superAdmin: any) {
        if (err) return console.log(err);
        await created_superAdmin.save();
        return console.log("super admin created");
    });
});


// la fonction qui permet de se connecter pour tous les utilisateurs
export const login = async (req: Request, res: Response) => {//body:phoneNumber,password

    try {

        const userData = {
            phoneNumber: req.body.phoneNumber,
            password: req.body.password
        };
        const user: UserDoc = await User.findOne({ phoneNumber: userData.phoneNumber });

        if (user) {
            if (bcrypt.compareSync(userData.password, user.password)) {
                const token = jwt.sign(
                    { user },
                    process.env.JWT_KEY,
                    { expiresIn: process.env.TOKEN_DURATION }
                );
                return res.status(200).json({
                    token,
                    user,
                    expiresIn: process.env.TOKEN_DURATION,
                    message: 'User logged in successfully'
                });
            }
            else {
                res.status(400).json({ message: "Informations d'identification invalides !" });
            }
        }
        else res.status(404).json({ message: "Informations d'identification invalides !" });

    } catch (error) { console.log(error); res.status(400).send(error); }
}


// la fonction qui permet de créer un compte pour tous les utilisateurs
export const createUser = async (req: Request, res: Response) => {
    //body: clientType,name,phoneNumber,email,password,countryCode,originCountry,birthCountry,activity,address,representative
    try {
        let userData;
        let { name, phoneNumber, email, password, Country, role } = req.body as any;
        userData = { name, phoneNumber, email, password, Country, role };
        userData.role = UserRoleEnum.CLIENT;

        //verifying codes
        try {
            const emailTokenData: any = jwt.verify(req.body.emailToken, req.body.emailCode);
            const phoneTokenData: any = jwt.verify(req.body.phoneToken, req.body.phoneCode);
        } catch (err) {
            if (err) return res.status(400).json({ message: "code incorrecte" });
        }

        //password validation
        if (req.body.password.length < 8) { return res.status(403).json({ message: 'Mot de passe non valide' }); }

        const hash = bcrypt.hashSync(req.body.password, 10);
        userData.password = hash;

        const user: UserDoc = await User.findOne({
            $or: [
                { phoneNumber: userData.phoneNumber },
                { email: userData.email }
            ]
        });
        if (user) {
            return res.status(400).json({ message: 'Utilisateur déja existe' });
        }
        const newUser = new User(userData);
        const userSaved: UserDoc = await newUser.save();
        //this just for client
        const token = jwt.sign(
            { user: userSaved },
            process.env.JWT_KEY,
            { expiresIn: process.env.TOKEN_DURATION }
        );
        return res.status(200).json({ message: 'Succées, Bienvenu Chez R3!' });

    } catch (error) { console.log(error); res.status(400).send(error); }
};




//send verification code
export const sendVerification = async (req: Request, res: Response) => {
    try {
        let phoneToken;
        if (req.body.phoneNumber) {
            let phoneNumber = req.body.phoneNumber;
            const code = await generateKey();
            phoneToken = jwt.sign({ auth: phoneNumber }, code, { expiresIn: '1h' });
            await sendSMS(phoneNumber,
                'CHER(E) CLIENT(E), BIENVENUE CHEZ R3. Voici le code pour activer votre compte: ' + code
            );
        }

        let emailToken;
        if (req.body.email) {
            let email = req.body.email;
            const code = await generateKey();
            emailToken = jwt.sign({ auth: email }, code, { expiresIn: '1h' });
            let mailOptions = {} as any;
            let output = `<h4>Bonjour <span style="color: #00aadd;">
            </span>, le code de confirmation est : <strong>${code} </strong> .</h4>
            <div>
              <p>Cordialement; <br>
              Assistance R3 Logistics.</p>
            </div>`;
            mailOptions = {
                from: '"R3 Logistics Service"',
                to: email,
                subject: 'Confirmation' || req.body.subject,
                text: '',
                html: output,
            };
            await sendEmail(mailOptions);
        }

        res.status(200).json({ message: "Veuillez verifier le code envoyé", phoneToken, emailToken });

    } catch (error) { console.log(error); res.status(500).json({ message: "Erreur Interne" }); }
}


//generate key
const generateKey = () => { const code = Math.random().toString().slice(2, 8); return code; }