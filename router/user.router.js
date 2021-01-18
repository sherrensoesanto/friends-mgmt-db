const express = require("express");
const router = express.Router();
const User = require("./../model/user.model");

router.route("/").get((req, res) => {
  let filter = req.query;
  User.find(filter, (err, data) => {
    if (err) {
      console.log(err.stack);
      return res.status(500).send(err);
    }
    console.log(data.length);
    res.json(data);
  });
});

router.route("/link-up").put((req, res) => {
  console.log(req.body);
  let _firstEmail = req.body.email;
  let _secondEmail = req.body.friendEmail;

  User.findOne({ email: _firstEmail })
    .then((firstEmail) => {
      if (!firstEmail) {
        return res.json({ status: "error", message: "Email cannot be found" });
      } else {
        User.findOne({ email: _secondEmail })
          .then((secondEmail) => {
            if (!secondEmail) {
              return res.json({
                status: "error",
                message: "Friend's email cannot be found",
              });
            } else {
              let friends_1 = firstEmail.friends;
              const found_1 = friends_1.find(
                (element) => element.email == _secondEmail
              );
              if (!found_1) {
                let update = {
                  email: _secondEmail,
                  isBlock: false,
                  isSubscribe: false,
                };
                friends_1.push(update);
                User.findOneAndUpdate(
                  { email: _firstEmail },
                  { friends: friends_1 },
                  {
                    new: true,
                  }
                )
                  .then((data) => {
                    if (data) {
                      console.log(data);
                    }
                  })
                  .catch((err) => console.log(err.stack));
              }

              let friends_2 = secondEmail.friends;
              const found_2 = friends_2.find(
                (element) => element.email == _firstEmail
              );
              if (!found_2) {
                let update = {
                  email: _firstEmail,
                  isBlock: false,
                  isSubscribe: false,
                };
                friends_2.push(update);
                User.findOneAndUpdate(
                  { email: _secondEmail },
                  { friends: friends_2 },
                  {
                    new: true,
                  }
                )
                  .then((data) => {
                    if (data) {
                      console.log(data);
                    }
                  })
                  .catch((err) => console.log(err.stack));
                return res.json({
                  status: "succesful",
                  message: "Succesfully Link up!",
                });
              } else {
                return res.json({ message: "Both emails already link up" });
              }
            }
          })
          .catch((err) => console.log(err.stack));
      }
    })
    .catch((err) => console.log(err.stack));
});

router.route("/friends-list/:e").get((req, res) => {
  console.log(req.params.e);
  User.findOne({ email: req.params.e })
    .then((data) => {
      if (!data) {
        return res.json({ status: "error", message: "Email cannot be found" });
      }
      res.json({ status: "succesful", result: data.friends });
    })
    .catch((err) => console.log(err.stack));
});

router.route("/friends-update-list/:e").get((req, res) => {
  console.log(req.params.e);
  User.findOne({ email: req.params.e })
    .then((data) => {
      if (!data) {
        return res.json({ status: "error", message: "Email cannot be found" });
      }

      let update = [];
      for (let i = 0; i < data.friends.length; i++) {
        if (
          data.friends[i].isBlock == false &&
          data.friends[i].isSubscribe == true
        ) {
          update.push(data.friends[i]);
        }
      }
      console.log(update);
      data.friends = update;

      res.json({ status: "succesful", result: data.friends });
    })
    .catch((err) => console.log(err.stack));
});

router.route("/block-friend").put((req, res) => {
  let _firstEmail = req.body.email;
  let _secondEmail = req.body.friendEmail;

  User.findOne({ email: _firstEmail })
    .then((firstEmail) => {
      if (!firstEmail) {
        return res.json({ status: "error", message: "Email cannot be found" });
      }

      let index = firstEmail.friends.findIndex((e) => e.email == _secondEmail);
      firstEmail.friends[index].isBlock = true;
      User.findOneAndUpdate(
        { email: _firstEmail },
        { friends: firstEmail.friends }
      ).then((e) => {
        return res.json({
          status: "succesful",
          message: `Succesfully block ${_secondEmail}`,
        });
      });
    })
    .catch((err) => console.log(err.stack));
});

router.route("/unblock-friend").put((req, res) => {
  let _firstEmail = req.body.email;
  let _secondEmail = req.body.friendEmail;

  User.findOne({ email: _firstEmail })
    .then((firstEmail) => {
      if (!firstEmail) {
        return res.json({ status: "error", message: "Email cannot be found" });
      }

      let index = firstEmail.friends.findIndex((e) => e.email == _secondEmail);
      firstEmail.friends[index].isBlock = false;
      User.findOneAndUpdate(
        { email: _firstEmail },
        { friends: firstEmail.friends }
      ).then((e) => {
        return res.json({
          status: "succesful",
          message: `Succesfully unblock ${_secondEmail}`,
        });
      });
    })
    .catch((err) => console.log(err.stack));
});

router.route("/subscribe-update").put((req, res) => {
  let _firstEmail = req.body.email;
  let _secondEmail = req.body.friendEmail;

  User.findOne({ email: _firstEmail })
    .then((firstEmail) => {
      if (!firstEmail) {
        return res.json({ status: "error", message: "Email cannot be found" });
      }

      let index = firstEmail.friends.findIndex((e) => e.email == _secondEmail);
      firstEmail.friends[index].isSubscribe = true;
      User.findOneAndUpdate(
        { email: _firstEmail },
        { friends: firstEmail.friends }
      ).then((e) => {
        return res.json({
          status: "succesful",
          message: `Succesfully subscribe to ${_secondEmail} update`,
        });
      });
    })
    .catch((err) => console.log(err.stack));
});

router.route("/unsubscribe-update").put((req, res) => {
  let _firstEmail = req.body.email;
  let _secondEmail = req.body.friendEmail;

  User.findOne({ email: _firstEmail })
    .then((firstEmail) => {
      if (!firstEmail) {
        return res.json({ status: "error", message: "Email cannot be found" });
      }

      let index = firstEmail.friends.findIndex((e) => e.email == _secondEmail);
      firstEmail.friends[index].isSubscribe = false;
      User.findOneAndUpdate(
        { email: _firstEmail },
        { friends: firstEmail.friends }
      ).then((e) => {
        return res.json({
          status: "succesful",
          message: `Succesfully unsubscribe to ${_secondEmail} update`,
        });
      });
    })
    .catch((err) => console.log(err.stack));
});

router.route("/common-friends").post((req, res) => {
  console.log(req.body);
  let _firstEmail = req.body.email;
  let _secondEmail = req.body.friendEmail;

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
              let friends_1 = firstEmail.friends;
              let friends_2 = secondEmail.friends;
              let matches = [];

              for (let i = 0; i < friends_1.length; i++) {
                for (let j = 0; j < friends_2.length; j++) {
                  if (friends_1[i].email === friends_2[j].email) {
                    matches.push({ email: friends_1[i].email });
                  }
                }
              }
              if (matches.length == 0) {
                return res.json({
                  status: "error",
                  message: "No Common Friends",
                });
              } else {
                return res.json({ status: "succesful", data: matches });
              }
            }
          })
          .catch((err) => console.log(err.stack));
      }
    })
    .catch((err) => console.log(err.stack));
});

router.route("/add-user").post((req, res) => {
  let _name = req.body.name;
  let _email = req.body.email;

  User.findOne({ email: _email }).then((email) => {
    if (email) {
      return res.json({
        status: "error",
        message: "User already exist",
      });
    } else {
      const user = new User({
        name: _name,
        email: _email,
        friends: [],
        posts: [],
      });

      user
        .save()
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err.stack);
        });
      return res.json({
        status: "successful",
        message: "User successfully added!",
      });
    }
  });
});

router.route("/unfriend").put((req, res) => {
  let _firstEmail = req.body.email;
  let _secondEmail = req.body.friendEmail;

  User.findOne({ email: _firstEmail })
    .then((firstEmail) => {
      let index = firstEmail.friends.findIndex((e) => e.email == _secondEmail);

      if (index >= 0) {
        firstEmail.friends.splice(index, 1);
      }
      User.findOneAndUpdate(
        { email: _firstEmail },
        { friends: firstEmail.friends }
      ).then((e) => {
        return res.json({
          status: "successful",
          message: `You have unfriend ${_secondEmail}`,
        });
      });
    })
    .catch((err) => console.log(err.stack));

  User.findOne({ email: _secondEmail })
    .then((secondEmail) => {
      let index = secondEmail.friends.findIndex((e) => e.email == _firstEmail);

      if (index >= 0) {
        secondEmail.friends.splice(index, 1);
      }
      User.findOneAndUpdate(
        { email: _secondEmail },
        { friends: secondEmail.friends }
      ).then((e) => {
        return res.json({
          status: "successful",
          message: `You have unfriend ${_secondEmail}`,
        });
      });
    })
    .catch((err) => console.log(err.stack));
});

module.exports = router;
