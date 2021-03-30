const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://n3vdawg:" + process.env.MONGO_PASSWORD + "@fruitcluster.3zp30.mongodb.net/toDoListDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

// Data Schema
const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema);

///////////////////
// DEFAULT ITEMS //
///////////////////
const item1 = new Item({
    name: "Welcome to your Todo List!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

/////////////////
// HOME ROUTE //
///////////////
app.get("/", (req, res) => {
    // const day = date.getDate();
    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Success.");
                }
            });
        } else {
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    });

});

/////////////////
// WORK ROUTE //
///////////////
app.get("/work", (req, res) => {
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});


//////////////////
// ABOUT ROUTE //
////////////////
app.get("/about", (req, res) => {
    res.render("about");
})

app.post("/", (req, res) => {

    const item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
    // html form makes a post request to home route
    // and it's going to POST the value of newItem
    // when request is received it gets caught in this
    // app.post section

    // when a post is triggered on home route, value of newItem
    // saved to variable item and it will redirect to home route
    // and triggers app.get and render kindOfDay and newListItem


});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
