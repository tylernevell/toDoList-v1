const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let items = [];
let workItems = [];
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

/////////////////
// HOME ROUTE //
///////////////
app.get("/", (req, res) => {

    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };

    let day = today.toLocaleDateString("en-US", options);

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

// app.post("/work", (req, res) => {
//
//     workItems.push(item);
//     res.redirect("/work");
// });

app.post("/", (req, res) => {

    let item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
    // form makes a post request to home route
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
