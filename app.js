var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
// var multiparty = require('connect-multiparty');
var mongoose = require("mongoose");
var MongoStore = require("connect-mongo")(session);
var serveStatic = require("serve-static");
var fs = require("fs");

// models loading
var models_path = __dirname + "/app/models/";
var walk = function(path){
    fs
    .readdirSync(path)
    .forEach(function(file){
        var newPath = path + "/" + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js|coffee)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    })
}
walk(models_path);

// 调试
var logger = require("morgan");
// var logger = morgan("dev");
var port = process.env.PORT || 8888;
var app = express();
mongoose.Promise = global.Promise;
var dbUrl = "mongodb://localhost:27017/movie";
mongoose.connect(dbUrl,{
    useMongoClient: true
});

app.set("views", "./app/views/pages");
app.set("view engine", "jade");
// parse application/raw
//app.use(bodyParser.raw);
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser());
app.use(cookieParser());
app.use(session({
    resave:false,//添加这行
    saveUninitialized: true,//添加这行
    secret: "Panda",
    store: new MongoStore({
        url: dbUrl,
        collection: "sessions"
    })
}));
// app.use(multiparty());
app.use(serveStatic(path.join(__dirname, "public")));
// app.use(logger);
app.locals.moment = require("moment");
var env = process.env.NODE_ENV || "development";
if ("development" === env) {
    app.set("showStackError", true);
    app.use(logger(":method :url :status"));
    app.locals.pretty = true;
    mongoose.set("debug", true);
} else {
    console.log("Development is not env");
}
require("./config/routes")(app);

app.listen(port);
console.log("Panda Movie started on port:" + port);