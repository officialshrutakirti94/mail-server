require('./models/db')
const express=require('express')
const mongoose=require('mongoose')
const user=mongoose.model('registerUser')
const message=mongoose.model('mailSendSchema')
const bodyParser= require('body-parser')
const session=require('express-session')
let alert = require('alert'); 
var { query } = require('express')
const app=express()
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
const multer = require('multer');
var img_name=''
app.use(session({
    secret:"magic",
    saveUninitialized:true,
    resave:false
}));
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        img_name=file.originalname;
      cb(null, file.originalname);
    }
  });
  const upload = multer({ storage: storage });
app.get('/home',(req,res)=>{
    res.render('home')
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/register',(req,res)=>{
    res.render('register')
})
/*function checkDuplicate(email,req,res)
{
    console.log('Working')
    query={email:email}
    var e=''
    user.find(query,(err,data)=>{
        if(data.length==0)
        {
            console.log('Mail id available')
            return true;
        }
        else{
            console.log('Mail id not available')
            return false;
        }
    })
}*/
app.post("/checkDuplicate",(req,res)=>{
    var email=req.body.email;
    var x=new user(req.body)
    console.log(x)
    query={email:email}
    user.find(query,(err,data)=>{
        if(data.length==0){
            console.log('valid email id')
        }
        else{
            console.log('Invalid email id')
            res.send({msg:'Invalid email id'})
        }
    })
    console.log(email)
})
app.post("/register",(req,res)=>{
    var x=new user(req.body)
    console.log(x)
    x.save((err,data)=>{
        console.log(data)
        if(!err)
        {
            console.log("Data Saved !!!")
        }

   })
    var p=req.body.pwd
    var cp=req.body.cpwd
    if(p===cp)
    {
        res.render('confirmation')
    }
    else{
        res.render('register',{msg:'incorrect'})
    }
})
app.post("/login",(req,res)=>{
    var query={email:req.body.email,pwd:req.body.pwd}
    user.find(query,(err,data)=>{
    console.log(data)
    if(data.length!=0)
    {
        sess=req.session;
        sess.mailid=req.body.email;
        sess.uname=data[0].uname
        res.render('dashboard',{uname:sess.uname,mailid:sess.mailid})
        console.log(sess)
        var name=sess.uname
        console.log(name)
    }
    else{
        alert("Incorrect email id or password")
        //console.log('incorrect')
        res.render('login')
    }
   })
})
app.get("/dashboard",(req,res)=>{
    sess=req.session;
    console.log(sess.mailid)
    res.render('dashboard',{uname:sess.uname,mailid:sess.mailid})
})
app.post("/send", upload.single('file'),(req,res)=>{
    var x=new message(req.body)
    console.log(req.body)
    x.img_name=img_name;
   console.log(img_name)
    x.save((err,data)=>{
        if(!err){
            
            alert('message saved')
        }
    })
})
app.get('/mail_sent',(req,res)=>{
    sess=req.session;
    email=sess.mailid;
    console.log(sess.mailid)
    var query={from:email}
    message.find(query,(err,data)=>{
     //  console.log(data)
      res.render('mail_sent',{data:data})
    })
      //res.render('mail_sent')
})
app.get('/del',(req,res)=>{
    var id=req.query.id
    console.log(id)
    message.findByIdAndRemove(id,(err,data)=>{
        res.redirect("/mail_sent")
    })
})
app.get("/mail_recieved",(req,res)=>{
    sess=req.session;
    email=sess.mailid;
    console.log(sess.mailid)
    var query={tmail:email}
    message.find(query,(err,data)=>{
        let obj = {data}
        if(obj.value!=0){
            console.log(obj.value)
        }
        else{
            console.log('not defined')
        }

        console.log(data)
        res.render('mail_recieved',{data:data})
    })
   // res.render('mail_recieved')
})
app.get("/profile",(req,res)=>{
    res.render('profile')
})
app.get("/view",(req,res)=>{
    res.render('view')
})
app.listen(3000,(req,res)=>{
    console.log('Server is running')
})