// app/routes.js
module.exports = function (App) {

    // =====================================
    // HOME PAGE ========
    // =====================================
    App.express.get('/', function (req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });
}