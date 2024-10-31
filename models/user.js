const mongoose=require('mongoose')

mongoose.connect(`mongodb://localhost:27017/demoAuth`)
.then(()=> console.log("connected to database"))
.catch(err => console.log("connection problem"))

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const user=mongoose.model("user",userSchema)
module.exports=user