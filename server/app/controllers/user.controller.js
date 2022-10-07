import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string';

import sendActivationLink from '../middlewares/sendActivationLink.js';

import User from '../models/user.model.js';
import Activation from '../models/activation.model.js';

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    try { 
        const existingUser = await User.findOne({ email });

        if(!existingUser) return res.status(404).json({ message: "Nieprawidłowe dane logowania" });

        if(existingUser?.active === false) {
            return res.status(401).json({ message: "Użytkownik z takim adresem email już istnieje, ale nie został jeszcze aktywowany. Jeżeli nie dotarł do ciebie link aktywacyjny, możesz " });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(400).json({ message: "Nieprawidłowe dane logowania" });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'Steganografia - Marcin Herman', { expiresIn: "1h" });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Coś poszło nie tak, spróbuj ponownie później" });
    }
};

export const signUp = async (req, res) => {
    const { email, password, confirmPassword, firstName } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if(existingUser?.active === false) {
            return res.status(401).json({ message: "Użytkownik z takim adresem email już istnieje, ale nie został jeszcze aktywowany. Jeżeli nie dotarł do ciebie link aktywacyjny, możesz " });
        }

        if(existingUser) return res.status(400).json({ message: "Użytkownik z takim adresem email już istnieje" });

        if(password !== confirmPassword) return res.status(400).json({ message: "Hasła nie są identyczne" });

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const result = await User.create({ email, password: hashedPassword, name: firstName, active: true });
        
        //const hash = cryptoRandomString({ length: 176, type: 'url-safe' });
        //Activation.create({ hash: hash, email: result.email });
       // await sendActivationLink(hash, result.email);

        res.status(200).json({ message: "Rejestracja przebiegła pomyślnie" }); //Link aktywacyjny
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Coś poszło nie tak, spróbuj ponownie później" });
    }
};

export const activate = async (req, res) => {
    const hash = req.params.hash;

    try {
        const existingActivation = await Activation.findOne({ hash });

        if(!existingActivation) return res.status(403).json({ message: "Link aktywacyjny wygasł, musisz zarejestrować się ponownie" });

        const existingUser = await User.findOneAndUpdate({ email: existingActivation.email }, { active: true }, { new: true });

        await existingActivation.delete();

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'Steganografia - Marcin Herman', { expiresIn: "1h" });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Coś poszło nie tak, spróbuj ponownie poźniej" });
    }

}

export const activationRepeat = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if(!existingUser) return res.status(404).json({ message: "Użytkownik z takim adresem email nie istnieje" });

        if(existingUser?.active !== false) {
            return res.status(401).json({ message: "Użytkownik został już aktywowany" });
        }

        const hash = cryptoRandomString({ length: 176, type: 'url-safe' });
        Activation.create({ hash: hash, email: email });
        await sendActivationLink(hash, email);

        res.status(200).json({ message: "Na podany przez ciebie adres email został wysłany link aktywacyjny." });
    } catch (error) {
        res.status(500).json({ message: "Coś poszło nie tak, spróbuj ponownie poźniej" });
    }

}