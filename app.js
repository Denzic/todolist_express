const express = require("express")
const bodyParser = require("body-parser")
// Local export modules
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose")
const _ = require("lodash")

const app = express()
app.set("view engine", "ejs")
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(express.static("public"))

mongoose.connect(
  "mongodb+srv://admin-Denzic:op930917@cluster0-fkb6v.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
)

// Create Item model
const itemShema = {
  name: String
}
const Item = mongoose.model("Item", itemShema)

const item1 = new Item({
  name: "Buy Food"
})
const item2 = new Item({
  name: "Cook Food"
})
const item3 = new Item({
  name: "Eat Food"
})
const defaultItems = [item1, item2, item3]

// Create List model
const List = mongoose.model("List", { name: String, items: [itemShema] })

// Home route
app.get("/", (req, res) => {
  Item.find((err, foundItems) => {
    if (foundItems.length !== 0) {
      res.render("list", {
        listTitle: "Today",
        items: foundItems
      })
    } else {
      Item.insertMany(defaultItems, err => {})
      res.redirect("/")
    }
  })
})

// Home post route
app.post("/", (req, res) => {
  const { newItem, list } = req.body
  // Have a new Item array
  const item = new Item({
    name: newItem
  })
  if (list === "Today") {
    item.save()
    res.redirect("/")
  } else {
    List.findOne({ name: list }, (err, foundList) => {
      foundList.items.push(item)
      foundList.save()
      res.redirect("/" + list)
    })
  }
})

// Render custom route
app.get("/:routeParam", (req, res) => {
  const routeParam = _.capitalize(req.params.routeParam)

  List.findOne({ name: routeParam }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: routeParam,
          items: defaultItems
        })
        list.save()
        res.redirect("/" + routeParam)
      } else {
        res.render("list", { listTitle: routeParam, items: foundList.items })
      }
    }
  })
})

// Delete
app.post("/delete", (req, res) => {
  const { itemId, listTitle } = req.body
  if (listTitle === "Today") {
    Item.findByIdAndRemove(itemId, err => {})
    res.redirect("/")
  } else {
    // prettier-ignore
    List.findOneAndUpdate({name: listTitle}, {$pull:{items:{_id: itemId}}}, (err)=>{
      if (err) {
        console.log(err)
      }else{
        res.redirect("/" + listTitle)
      }
    })
  }
})

// About route
app.get("/about", (req, res) => {
  res.render("about", {})
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000")
})
