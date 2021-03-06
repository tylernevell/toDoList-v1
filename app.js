const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

const items = [];
const workItems = [];
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

/////////////////
// HOME ROUTE //
///////////////
app.get("/", (req, res) => {
    const day = date.getDate();
    res.render("list", {listTitle: day, newListItems: items});
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
