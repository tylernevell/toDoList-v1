require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://n3vdawg:" + process.env.MONGO_PASSWORD + "@fruitcluster.3zp30.mongodb.net/toDoListDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

//////////////////
// DATA SCHEMA //
////////////////
const itemSchema = new mongoose.Schema({
    name: String
});

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

/////////////
// MODELS //
////////////
const List = mongoose.model("List", listSchema);
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


// HOME ROUTE //
/*
* This route is retrieved upon a user visiting the homepage of this webapp.
* In this method call, a callback function is called to find the list of items
* stored in the to do list collection. If to do list is empty, to do list is
* populated by the default items; the instructions.
* */
app.get("/", (req, res) => {
    // const day = date.getDate();
    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    });
});


// CUSTOM LIST ROUTE //
app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, (err, foundList) => {
        if (err) {
            console.log(err);
        } else {
            if (!foundList) {
                // Create a new list
                const list  = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                // Show existing list
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
            }
        }
    });

});

// app.get("/work", (req, res) => {
//     res.render("list", {listTitle: "Work List", newListItems: workItems});
// });


//////////////////
// ABOUT ROUTE //
////////////////
app.get("/about", (req, res) => {
    res.render("about");
})

////////////////////
// POST NEW ITEM //
//////////////////
app.post("/", (req, res) => {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/") // after saving item, reenter home route and find all items to render on screen
    } else {
        List.findOne({name: listName}, (err, foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }


    // if (req.body.list === "Work") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // } else {
    //     items.push(item);
    //     res.redirect("/");
    // }
    // html form makes a post request to home route
    // and it's going to POST the value of newItem
    // when request is received it gets caught in this
    // app.post section

    // when a post is triggered on home route, value of newItem
    // saved to variable item and it will redirect to home route
    // and triggers app.get and render kindOfDay and newListItem
});

///////////////////
// DELETE ROUTE //
/////////////////
app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, (err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/");
            }
        });
    } else {
        // find the document we want to update and remove the item from our list
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
            if (!err) {
                res.redirect("/" + listName);
            } else {
                console.log(err);
            }
        });
    }


});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log("Server started successfully!");
});
