const express= require("express");
const router= express.Router();
const user=  require("../models/users");
const multer = require("multer");
const users = require("../models/users");

var storage=multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads")
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
})
var upload=multer({
    storage: storage,

}).single("image");

router.post("/add", upload, (req, res)=>{
const user= new users({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    image: req.body.image 

});
user.save((err)=>{
    if(err){
        res.json({
         message: err.message,
         type: "danger"
        })
    }
    else{
        req.session.message={
            type: "success",
            type: "user added successfully!"
        };
        res.redirect("/");
    }

})
})

router.get("/", (req, res)=>{
    users.find().exec((err, users)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render("index",{
                title:"home page",
                users: users, 
            })
        }
    })
})

router.get("/", (req, res)=>{
    res.render("index", {title: "home"});
})

router.get("/add", (req, res)=>{
    res.render("add_user", {title: "add"});
})

router.get("/edit/:id", (req, res)=>{ 
    let id=req.params.id;
    users.findById(id, (err, user)=>{
        if(err) {
            res.redirect("/");
        }
        else{
            if(user==null){
                res.redirect("/");
            }
            else{
                res.render("edit_users", {title: "edit user",
                users: users,
            })
            }
        }
        })
}  )

router.post("/update/:id", upload, (req, res)=>{
    let id= req.params.id;
    let new_image="";

    if(req.file){
        new_image=req.file.filename;
        try {
            fs.unlinkSync("./uploads/"+req.body.old_image);
        } catch (error) {
            console.log(error);
        }
    }else{
        new_image=req.body.old_image;
    }
    users.findByIdAndUpdate({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image,
    },(err, res)=>{
        if (err) {
            res.json({
                message: err.message,
                type: "danger",
            })
        }else{
            req.session.message={
                type: "success",
                message: "user updated successfully"
            };
            res.redirect("/");
        }
    })
})

router.get("/delete/:id", (req, res)=>{
    let id=req.params.id;
    users.findByIdAndDelete(id, (err, result)=>{
        if(result.image!=""){
            try {
                fs.unlinkSync("./uploads/"+result.image);
            } catch (error) {
                console.log(error);
            }
        }
        if (err) {
            res.json({
                message: err.message
            });
        }
        else{
            req.session.message={
                type: "info",
                message: "user deleted successfully!"
            };
            res.redirect("/");
        }
    })
})
module.exports=router;