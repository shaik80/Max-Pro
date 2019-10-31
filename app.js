const express = require('express');
// const expressLayouts=require('express-ejs-layouts');
const mongoose =require('mongoose');
const flash=require('connect-flash');
const session =require('express-session');
const passport=require('passport');
const exphbs = require('express-handlebars');
const path = require('path');
const cors = require('cors');
const app= express();


app.use(express.static('public'));

app.use(cors());

//passport config
require('./config/passport')(passport);
//DB config
const db=require('./config/keys').MongoURI;

//connect to mongo
mongoose.connect(db,{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>console.log('mongoDB connected..'))
.catch(err=>console.log(err));


//EJS
app.set('views',path.join(__dirname,'./views'))
app.engine('hbs',exphbs({
   extname:'hbs',
   defaultLayout:'layout',
   layoutsDir:__dirname+'/views/',
   partialsDir: __dirname+'/views/partials'
}));
app.set('view engine','hbs');

//Bodyparser
app.use(express.urlencoded({extended:false}));


//express session
app.use(session({
secret:'secret',
resave:true,
saveUninitialized:true,

}));


//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Global Vars
app.use((req,res,next)=>{
    res.locals.success_msg= req.flash('success_msg');
    res.locals.error_msg= req.flash('error_msg');
    res.locals.error= req.flash('error');
    next();
})

//routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
const PORT = process.env.PORT || 5000;
app.listen(PORT,console.log(`server started on port ${PORT}`));