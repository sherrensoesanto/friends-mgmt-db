const express = require("express");
const router = express.Router();
const Post = require("./../model/post.model");
const User = require("./../model/user.model");

router.route("/update").post((req, res) => {
  let _firstEmail = req.body.email;
  let _secondEmail = req.body.friendEmail;
  let _text = req.body.text;

  User.findOne({ email: _firstEmail })
    .then((firstEmail) => {
      if (!firstEmail) {
        return res.json({
          status: "error",
          message: "Email cannot be found",
        });
      } else {
        User.findOne({ email: _secondEmail })
          .then((secondEmail) => {
            if (!secondEmail) {
              return res.json({
                status: "error",
                message: "Friend's email cannot be found",
              });
            } else {
              let index = firstEmail.friends.findIndex(
                (e) => e.email == _secondEmail
              );
              if (index !== -1) {
                let subscription = firstEmail.friends[index].isSubscribe;
                if (subscription == true) {
                  const post = new Post({
                    email: _secondEmail,
                    text: _text,
                    createdAt: Date.now(),
                    postBy: firstEmail._id,
                  });

                  post
                    .save()
                    .then((result) => {
                      console.log(result);
                    })
                    .catch((err) => {
                      console.log(err.stack);
                    });

                  User.findOneAndUpdate(
                    { email: _firstEmail },
                    { $push: { posts: post._id } },
                    { new: true }
                  ).then((user) => console.log("updated:" + user));
                  res.json({
                    status: "succesful",
                    message: "Updates succesfully posted",
                    data: post,
                  });
                } else {
                  return res.json({
                    status: "error",
                    message: `You are not subscribe to ${_secondEmail}`,
                  });
                }
              } else {
                return res.json({
                  status: "error",
                  message: `You are not friend with ${_secondEmail}`,
                });
              }
            }
          })
          .catch((err) => console.log(err.stack));
      }
    })
    .catch((err) => console.log(err.stack));
});

module.exports = router;
