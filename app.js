//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////Requests Targetting all articles/////////////////////

app
  .route("7articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.query.title,
      content: req.query.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Success");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully");
      } else {
        res.send(err);
      }
    });
  });

/////////////////////Requests Targetting a specific article/////////////////////

app
  .route("/articles/:topic")

  .get(function (req, res) {
    Article.findOne({ title: req.params.topic }, function (err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No such file");
      }
    });
  })

  .put(function (req, res) {
    Article.replaceOne(
      { title: req.params.topic },
      { title: req.query.title, content: req.query.content },

      function (err) {
        if (!err) {
          res.send("Success putting...");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.replaceOne(
      { title: req.query.topic },
      { $set: req.query },
      function (err) {
        if (!err) {
          res.send("Successful patch");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.topic }, function (err) {
      if (!err) {
        res.send("Success deleting");
      } else {
        res.send(err);
      }
    });
  });

//TODO

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
