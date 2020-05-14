const express = require("express")
const bodyParser = require("body-parser")
// Local export modules
const date = require(__dirname + "/date.js")

const app = express()
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"))

// create arrays to store items
let items = ["Buy Food", "Cook Food", "Eat Food"]
let workItems = []

// Homepage route
app.get("/", (req, res) => {
  let day = date.getDate()
  // Assign variables to the template
  res.render("list", {
    listTitle: day,
    items
  })
})

// Post route for homepage 
app.post("/", (req, res) => {
  // Display lists & Redirect to respective route depending on botton value
  if (req.body.list === "Work") {
    // Assign new item to workItems array
    workItems.push(req.body.newItem)
    res.redirect("/work")
  } else {
    // Assign new item to items array
    items.push(req.body.newItem)
    res.redirect("/")
  }
})

// Get /work route & assigning data to render
app.get("/work", (req, res) => {
  res.render("list", {
    listTitle: "Work",
    items: workItems
  })
})

// About route
app.get("/about", (req, res) => {
  res.render("about", {})
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
})