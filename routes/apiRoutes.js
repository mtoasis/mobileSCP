var db = require("../models");

var accountSid = 'AC8cb0275d6e431c8ffaa1097481c941d6'; // Your Account SID from www.twilio.com/console
var authToken = '41def554aa7f8d81dc93a83c2dc46b43'; // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);


module.exports = function (app) {

  app.get("/post/phone/:id", function (req, res) {
    var id = req.params.id;
    db.users.findById(id).then(data => {
      const name = data.get({
        plain: true
      }).name;
      let phone = data.get({
        plain: true
      }).phone;

      phone = '+1' + phone.replace(/-/g, '');
      //const phone data
      console.log(phone);
      client.messages.create({
        body: 'Thank you for using SchoolPool! You will be riding with ' + name + '. Please contact them at ' + phone + ' and set up a pick up location.',
        to: phone,  // Text this number
        from: '+19495569807' // From a valid Twilio number
      })
        .then((message) => console.log(message.sid));

      res.json(data);
    });

  });


  app.get("/api/ids/:id", function (req, res) {

    var id = req.params.id;

    db.lists.findAll({
      where: {
        id: id
      }
    }).then(function (data) {
      res.json(data);
    })
  })

  app.post("/api/check/post", function (req, res) {
    var name = req.body.name;
    var pin = req.body.pin;

    db.lists.findAll({
      where: {
        name: name,
        pin: pin
      }
    }).then(function (data) {
      if (data.length != 0) {
        db.users.findAll({
          where: {
            postId: data[0].id
          }
        }).then(function (response) {
          res.json(response)
        })
      }
      else {
        res.json(data)
      }
    })


  })

  app.post("/api/check/join", function (req, res) {
    var name = req.body.name;
    var pin = req.body.pin;
    // console.log(req.body)

    db.users.findAll({
      where: {
        name: name,
        pin: pin
      }
    }).then(function (data) {
      res.json(data)
    })
  })

  // app.get("/api/check/ride/:id", function(req, res){
  //   var school = req.params.school;
  // })


  app.get("/api/all/:school?", function (req, res) {

    var school = req.params.school;

    if (school) {
      console.log(`search for ${school}`)
      db.lists.findAll({
        where: {
          destination: school
        }
      }).then(function (data) {
        res.json(data);
      })
    }
    else if (school == null) {
      console.log(`print all`)
      db.lists.findAll({})
        .then(function (data) {
          for (var i = 0, n = data.length; i < n; i++) {
            if (!data[i].isFull) {
              if (data[i].currentSeats >= data[i].seats) {
                db.lists.update({
                  isFull: true
                },
                  {
                    where: {
                      id: data[i].id
                    }
                  })
              }
            }
          }
          res.json(data);
        });
    }

  });

  app.get("/user/:id", function (req, res) {
    var postId = req.params.id;
    db.users.findAll({
      where: {
        postid: postId
      }
    }).then(function (data) {
      res.json(data)
    })
  })


  app.get("/pin/:id", function (req, res) {
    var postId = req.params.id;

    db.lists.findAll({
      where: {
        id: postId
      }
    }).then(function (data) {
      res.json(data)
    })

  })


  app.post("/api/postRide", function (req, res) {
    db.lists.create(req.body)
      .then(function (data) {
        res.json(data)
      })

  })

  app.post("/api/joinRide", function (req, res) {
    console.log(req.body)
    db.users.create(req.body)
      .then(function (data) {
        res.json(data)
      })

  })
  app.put("/api/isAccepted/update", function (req, res) {
    var status = req.body.isAccepted;
    db.users.update({
      isAccepted: status.isAccepted
    },
      {
        where: {
          id: status.id
        }
      }).then(function (data) {
        res.json(data)
      })

  })



  app.put("/api/update", function (req, res) {
    console.log(req.body)
    db.lists.findAll({
      where: {
        id: req.body.id
      }
    }).then(function (data) {
      if (data[0].seats >= req.body.currentSeats) {
        console.log(`since max seat:${data[0].seats} >= current seat:${req.body.currentSeats}, seat is added`)
        db.lists.update({
          currentSeats: req.body.currentSeats
        }, {
            where: {
              id: req.body.id
            }
          })

        res.json({ success: true });
      }
      else {
        console.log(`${data[0].name} is currently full`)
        res.json({ success: false });
      }
    })

  });


};
