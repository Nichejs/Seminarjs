var Auth = {



    signup: function (req, res, next) {
        //req.status store data related to the success or fail of the signup
        req.dbRead = false;
        if (req.body.email && req.body.password) {
            var email = req.body.email;
            var pass = req.body.password;
            process.nextTick(function () {
                Auth.app.user.findOne({
                    'local.email': email
                }, function (err, user) {
                    // if there are any errors, return the error
                    if (err) {
                        req.status = 'error';
                    }

                    // check to see if theres already a user with that email
                    if (user) {
                        req.status = 'fail';
                    } else {

                        // if there is no user with that email
                        // create the user
                        var newUser = new Auth.app.user();

                        // set the user's local credentials
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(pass);

                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            req.status = 'successful';
                        });
                    }

                });
                req.dbRead = true;
            });
            
        } else {
            req.dbRead = true;
            req.status = 'dataless';
        }
        next();
            
    },
    checkCredentials: function (req, res, next) {
        //req.status store data related to the success or fail of the signup
        req.status = '';
        if (req.body.email && req.body.password) {
            var email = req.body.email;
            var pass = req.body.password;

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            Auth.app.user.findOne({
                'local.email': email
            }, function (err, user,next) {
                // if there are any errors, return the error before anything else
                if (err) {
                    next();
                }

                // if no user is found, return fail
                if (!user) {
                    req.status = 'fail';
                    next();
                }
                // if the user is found but the password is wrong
                if (!user.validPassword(pass)) {
                    req.status = 'fail';
                    next();
                }

                // all is well, return successful user
                req.status = 'successful';
                next();
            });
        } else {
            req.status = 'dataless';
            next();
        }
    },

    init: function (App) {
        Auth.app = App;
        //Adding routes

        //middleware to check wether or not the user is logged
        function requireLogin(req, res, next) {
            console.log(req.url);
            //Check whether or not the url requested is allowed before logging
            var allowed = ['/login', '/signup']
            if (App._.indexOf(allowed, req.url) > -1) {
                next();
            }
            next();
            //        } else if (req.session.loggedIn) {
            //            next(); // allow the next route to run
            //        } else {
            //            // require the user to log in
            //            res.render('login.ejs', {
            //                message: ''
            //            });
            //        }
        }

        // Automatically apply the `requireLogin` middleware to all
        // routes indicated in the path
        //TO-DO: add an argument to auth that let the user pick which paths they want to secure
        App.express.all(/^((?!(.js|.css)).)*$/, requireLogin, function (req, res, next) {
            next(); // if the middleware allowed us to get here,
            // just move on to the next route handler
        });




        // show the login form
        App.express.get('/login', function (req, res) {
            console.log('rendering login');

            res.render('login.ejs', {
                message: ''
            });
        });


        // show the signup form
        App.express.get('/signup', function (req, res) {

            res.render('signup.ejs', {
                message: ''
            });
        });

        // process the signup form
        App.express.post('/signup',  function (req, res, next) {
             if (req.body.email && req.body.password) {
            var email = req.body.email;
            var pass = req.body.password;
            process.nextTick(function () {
                Auth.app.user.findOne({
                    'local.email': email
                }, function (err, user) {
                    // if there are any errors, return the error
                    if (err) {
                        res.render('error.ejs', {
                            message: 'Our fault. Please try signing up later'
                        });
                    }

                    // check to see if theres already a user with that email
                    if (user) {
                        res.render('signup.ejs', {
                            message: 'Oups! I think you have been here before.'
                        });
                    } else {

                        // if there is no user with that email
                        // create the user
                        var newUser = new Auth.app.user();

                        // set the user's local credentials
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(pass);

                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            res.render('index.ejs');
                        });
                    }

                });

            });
            
        } else {
            res.render('signup.ejs', {
                            message: 'Oups! Some data got lost. Please provide it again.'
                        });
        }

        });


        // process the login form
        App.express.post('/login', Auth.checkCredentials, function (req, res, next) {

            switch (req.status) {
            case 'successful':
                res.render('index.ejs');
                break;

            case 'fail':
                res.render('login.ejs', {
                    message: 'Are you trying to fool us? Please try agin'
                });
                break;
            case 'dataless':
                res.render('signup.ejs', {
                    message: 'Oups! Some data got lost. Please provide it again.'
                });
                break;

            default:
                res.render('error.ejs', {
                    message: 'Our fault. Please try logging in later'
                });
                break;
            }

        });



        // =====================================
        // LOGOUT ==============================
        // =====================================
        //    App.express.get('/logout', Auth.logout(req, res, function (status) {
        //
        //        switch (status) {
        //        case 'successful':
        //            res.render('login.ejs');
        //            break;
        //        default:
        //            res.render('login.ejs');
        //            break;
        //        }
        //
        //    }));



    }
}
module.exports = Auth;