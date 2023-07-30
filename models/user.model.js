const mongoose=require('mongoose')
const registerUserSchema=new mongoose.Schema({
    uname:String,
    email:String,
    contactno:Number,
    pwd:String
})
const mailSendSchema=new mongoose.Schema({
    from:String,
    tmail:String,
    subject:String,
    date:String,
    time:String,
    textArea:String,
    img_name:String
})
mongoose.model('registerUser',registerUserSchema);
mongoose.model('mailSendSchema',mailSendSchema);