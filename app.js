const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8000;
const mongoose = require("mongoose");

//middleware.
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/notetakerDB")

const notetakerSchema = {
   name : String,
   title: String,
   description: String,
}

const Noteapp = mongoose.model('Noteapp', notetakerSchema)


app.get("/", (req, res) => {
    Noteapp.find({}, (err, demo) => {
      res.render("index", {demo:demo});
 });
});


app.get("/create", (req, res) => {
    Noteapp.find({},(err, demo)=>{

        res.render("create" , {demo:demo});
    })
});

app.post("/create_note", (req, res) => {
    const notetake = new Noteapp(req.body)
    notetake.save()

    Noteapp.find({}, (err, demo)=>{
        if (!err) {
            console.log("success")
            res.redirect("/");
        }else{
            console.log("error is ", err);
        }
    })
    
    
});

app.get("/delete/:id", (req, res) => {
    Noteapp.findByIdAndDelete(req.params.id,(err) => {
      err ? console.error(err) : console.log("deleted successfully")

      res.redirect('/')
 })
})

app.get("/update/:id", (req, res) => {
    Noteapp.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        (err, demo) => {
            if (!err) {
                console.log(demo)
                res.render("update", { demo:demo });
                console.log("edited successfully");           
            }else{
                console.log(err);
            }
        }
     )
 })




app.post("/update/:id", (req, res) => {
    Noteapp.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        (err, result) => {
            if (!err) {
                res.redirect('/')
                console.log("edited successfully");           
            }else{
                console.log(err);
            }
        }
     )
 })




app.listen(port, () => {
    console.log("listening on port ", port);
}); 