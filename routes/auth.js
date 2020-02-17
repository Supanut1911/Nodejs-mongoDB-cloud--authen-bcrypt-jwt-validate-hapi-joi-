const router = require('express').Router()
const User = require('../model/User');
const bcrypt = require('bcrypt');
const {registerValidation, loginValidation} = require('../validation')
const jwt = require('jsonwebtoken')

//Register
router.post('/register', async (req, res)=> {

    //let validate the data before we a user
    const {error} = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //Checking if user is already in databsae
    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) return res.status(400).send('Email already exists.')

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    
    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })

    try {
        const saveUser = await user.save()
        res.send(saveUser)
    } catch (err) {
        res.status(400).send(err)
    }
})

//Login
router.post('/login', async (req, res)=> {
    //let validate the data before we a user
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //Checking if the email does ont exits
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Email is not found.')

    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Email or password is not valid')

    //create and assign token
    const token = jwt.sign({_id: user._id}, 'nutX')
    res.header('auth-token', token).send(token)
})



module.exports = router