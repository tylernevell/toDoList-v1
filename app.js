const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let items = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) => {

    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };

    let day = today.toLocaleDateString("en-US", options);

    res.render("list", {kindOfDay: day, newListItems: items});
});

app.post("/", (req, res) => {

    // form makes a post request to home route
    // and it's going to POST the value of newItem
    // when request is received it gets caught in this
    // app.post section

    // when a post is triggered on home route, value of newItem
    // saved to variable item and it will redirect to home route
    // and triggers app.get and render kindOfDay and newListItem
    items.push(req.body.newItem);
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
