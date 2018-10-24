/* Main Root is "/user" in this controller *
*This controller performs following function
* Issues a web token to a user
* Registers a User
* On successful login through /login issues a JWT to user
* Perform automatic login through JWT through /loginAuth 
*/


const express = require('express');

const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({extended:true});



/* JSON WEB TOKENS */

const jwt = require('jsonwebtoken');

/* Set up Mongoose here */
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Project',{useNewUrlParser:true})
.then(console.log('Users Database is connected ... '))
.catch((err) =>{
    console.log('Users Database is not Connected Exiting ...')
});


/* Handling random errors */
mongoose.set('useCreateIndex', true);

/* Create Router */
const router = new express.Router();

router.use(express.json())

/* Create User Schema validate it on client side using JS */

const userSchema = new mongoose.Schema({
    name : String,
    password : {
        type : String,
        required : true
    },

    email : {
        type:String,
        unique:true,
        required : true
    },

    phone :Number,

    isAdmin : Boolean
})

/* Method for Generating Tokens */

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({email : this.email,password : this.password,name : this.name , _id : this._id , isAdmin : this.isAdmin} , 'ourSecretPrivateKey');
    return token;
}

/* Model User Schema results into a user class */

const User = mongoose.model('users',userSchema);



/* Register a User */
router.post('/register', async (req,res)=>{
  
    let answer = await User.findOne({email : req.body.email});  
    
    if(answer === null)
    {
        /* User has not been registered */
            let user = new User( {
            name : req.body.name,
            email : req.body.email,
            phone : req.body.phone,
            password : req.body.password
        })

        user.save()
        .then()
        .catch((err) => console.log(err.message))


        /* issue a token for new user */
        const token = user.generateAuthToken()
        res.header('x-auth-token',token)
        .send('User Registered')

    }

    else {
        res.send("You have already Registered as " + answer.name)
    }
})

/* Handle User Login   <=================== AUTHENTICATION ===============================> */



/* login handler takes in a json object with email and password if match returns token */

router.post('/login',urlencodedParser,async (req,res)=>{
    console.log(req.body)
    let user = await User.findOne({email : req.body.email})

    if(user === null)
    {
        res.send({message : 'Invalid Username or Password' })
    }

    else if(user.password === req.body.password)
    {
        const token = user.generateAuthToken()
        res.header('x-auth-token',token)
        .send({
            payloadToken : token,
            message : `Login Success , Welcome  ${user.name}`
        });
    }
    /* invalid credentials */
    else res.send({message : 'Invalid Username or Password' })
})


  /* Automatically Login User */

router.post('/loginAuth',(req,res)=>{
    const token = req.header('x-auth-token');
    if(!token)
    {
       res.status(400).send('Automatic Login has Failed')
    }

    if(token)
    {
        try{
            const decodedInfo = jwt.verify(token,'ourSecretPrivateKey')
            console.log(decodedInfo.name + ' has logged-in at '+ new Date())
            res.status(200).send('Welcome, '+ decodedInfo.name)
        }
        catch(ex) 
        {
            console.log(ex.message)
            res.status(401).send('Invalid Token, Please Sign-in')
        }
       
    }
})

module.exports = router;