const joi = require('joi');
const HttpStatus = require('http-status-codes');
const user = require('../models/userModels')
const helpers = require('../helpers/helpers');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbconfig = require('../config/secrets')
module.exports = {
    async CreateUser(req, res) {
        const schema = joi.object().keys({
            username: joi.string().min(5).max(10).required(),
            email: joi.string().email().required(),
            password: joi.string().min(5).required()
        })

        const { error, value } = joi.validate(req.body, schema);
        console.log(value);
        if (error && error.details) {
            return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });

        }
        const userEmail = await user.findOne({ email: helpers.lowerCase(req.body.email) });
        if (userEmail) {
            return res.status(HttpStatus.CONFLICT).json({ message: 'Email already exists' })

        }

        const userName = await user.findOne({ username: helpers.lowerCase(req.body.username) });
        if (userName) {
            return res.status(HttpStatus.CONFLICT).json({ message: 'username already exists' })

        }
        console.log("in here 1")
        return bcrypt.hash(value.password, 10, (err, hash) => {
            console.log("in here 2")
            if (err) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'error hashing password' });
            }
            const body = {
                username: helpers.firstUpper(value.username),
                email: helpers.lowerCase(value.email),
                password: hash
            }
            user.create(body).then((user) => {
                const token = jwt.sign({data:user}, dbconfig.secret, {
                    expiresIn: 120
                });
                res.cookie('auth',token);
                res.status(HttpStatus.CREATED).json({ message: 'user created succesfully' ,user,token})
            }).catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'error occured' })
            })
        });
    }
} 
