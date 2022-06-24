// chiffrage mail
const cryptoJs = require('crypto-js');

// chiffrage password
const bcrypt = require('bcrypt');

// token
const jwt = require('jsonwebtoken');

const dotEnv = require('dotenv');
const User = require('../models/User');

dotEnv.config();

/**
 * sign up
 */
exports.signup = (req, res, next) => {
    const emailCrypt = cryptoJs.HmacSHA1(req.body.email, process.env.KEY_EMAIL).toString();
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: emailCrypt,
                password: hash
            })
            user.save()
                .then (() => res.status(201).json({ message: 'utilisateur créé !' }))
                .catch(error => res.status(400).json({ error}));
        })
        .catch(error => res.status(500).json({ error}));
};

/**
 * login
 */
exports.login = (req, res, next) => {
    const emailCrypt = cryptoJs.HmacSHA1(req.body.email, process.env.KEY_EMAIL).toString();
    User.findOne({ email: emailCrypt })
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({ error: '<Mot de passe incorrect> !'});
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    process.env.KEY_TOKEN,
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error}));
    })
    .catch(error => res.status(500).json({ error}));
};