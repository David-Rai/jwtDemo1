const express = require('express')
const app = express()
const port = 1111
const user=require('./models/user')
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const cookieParser=require("cookie-parser")

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

      //geetting all the users
app.get('/',async (req, res) => {
const result=await user.find()
res.json(result)
})

//creating the user
app.post('/signup',async (req,res)=>{
const {name,email,password}=req.body

//Hashing the passowrd
bcrypt.genSalt(10,(err,salt)=>{
    if(!err){
        bcrypt.hash(password,salt,(err,hash)=>{
            if(!err){
                const newUser=new user({
                    name,
                    email,
                    password:hash
                })
                newUser.save()//saving the documnet
                //generatin the token
                const token=jwt.sign({email},"secret")
                res.cookie("token",token)          

                res.json({
                    message:"user created",
                    hashed:hash
                })
            }
        })
    }
})
})

//sign in
app.post('/signin',async (req,res)=>{
const {email,password}=req.body

const userBody=await user.findOne({email})
if(!userBody){res.send("something went wrong")}

//decrypting the password
bcrypt.compare(password,userBody.password,(err,result)=>{
    if(err){res.send("server problem")}

    if(!result){
        res.send("something went wrong")
    }

    //generating the token
    const token=jwt.sign({email},"secret")
    res.cookie("token",token)   

    res.json({
        name:`Your name is ${userBody.name}`,
        password:`your passwrod is ${password}`
    })
})

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})