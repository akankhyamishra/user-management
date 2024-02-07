const env= require("dotenv").config();
const express = require("express");
const mongoose= require("mongoose");
const session=require("express-session");

const app= express();
const PORT=process.env.PORT  || 5500;


mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db=mongoose.connection;
db.on("error", (error)=>console.log(error));
db.once("open", ()=> console.log("connected to database!"))

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
    secret: "my secret",
    saveUninitialized: true,
    resave: false,
}));

app.use((req, res, next)=>{
res.locals.message=req.session.message;
delete req.session.message;
next();
})

app.use(express.static("uploads"));
app.set("view engine", "ejs");
app.use("", require("./routes/routes.js"));

app.get("/", (req, res)=>{
    res.send("hello world")
})


app.listen(PORT, ()=>{
    console.log(`listening on port http://localhost:${PORT}`)
})