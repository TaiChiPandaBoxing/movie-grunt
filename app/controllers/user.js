var User = require("../models/user");
// signup
exports.showSignup =  function (req, res) {
    res.render("signup.jade", {
        title: "注册页面"
    })
}
exports.showSignin =  function (req, res) {
    res.render("signin.jade", {
        title: "登录页面"
    })
}
exports.signup =  function (req, res) {
    var _user = req.body.user;
    //console.log(_user);
    User.findOne({name: _user.name}, function (err, user) {
        if (err) {
            console.log(err)
        } else {
            if (user) {
                // console.log(user);
                return res.redirect("/signin")
            } else {
                user = new User(_user);
                user.save(function (err, user) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.redirect("/")
                    }
                })
            }
        }
    })
}
// signin
exports.signin =  function (req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    User.findOne({name: name}, function (err, user) {
        if (err) {
            console.log(err)
        } else {
            if (!user) {
                res.redirect("/signup")
            } else {
                user.comparePassword(password, function (err, isMatch) {
                    if (err) {
                        console.log(err)
                    } else {
                        if (isMatch) {
                            // console.log("Password is matched");
                            req.session.user = user;
                            return res.redirect("/")
                        } else {
                            res.redirect("/signin")
                            // console.log("Password is not matched")
                        }
                    }
                })
            }
        }
    })
}

// logout
exports.logout = function (req, res) {
    delete req.session.user;
    // delete app.locals.user;
    res.redirect("/")
}
// userlist page
exports.list =  function (req, res) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err)
        }
        res.render("userlist.jade", {
            title: "Panda Movie 用户列表页",
            users: users
        })
    })
}

// midware for user
exports.signinRequired =  function (req, res, next) {
    var user = req.session.user;
    if (!user) {
        return res.redirect("/signin")
    } else {
        next();
    }
}
exports.adminRequired =  function (req, res, next) {
    var user = req.session.user;
    if (user.role > 10 ) {
        next();
    } else {
        return res.redirect("/signin")
    }
}