var Movie = require("../models/movie");
var Category = require("../models/category")
// index page
exports.index = function (req, res) {
    // console.log("user in sesion:");
    // console.log(req.session.user);
    Category
    .find({})
    .populate({
        path: "movies", 
        select: "title poster",
        options: {limit: 6}
    })
    .exec(function(err, categories){
        // Movie.fetch(function (err, movies) {
        //     if (err) {
        //         console.log(err)
        //     }
        //     res.render("index.jade", {
        //         title: "Panda Movie 首页",
        //         movies: movies
        //     })
        // })
        if (err) {
            console.log(err)
        }
        res.render("index.jade", {
            title: "Panda Movie 首页",
            categories: categories
        })
    })
}

// search page
exports.search = function (req, res) {
    var cateId = req.query.cate;
    var q = req.query.q;
    var page = parseInt(req.query.p, 10) || 0;
    var count = 2;
    var index = page * count;
    if (cateId) {
        Category
        .find({_id: cateId})
        .populate({
            path: "movies", 
            select: "title poster"
        })
        .exec(function(err, categories){
            if (err) {
                console.log(err)
            }
            var category = categories[0] || {};
            var movies = category.movies || [];
            var results = movies.slice(index, index + count);
            res.render("results.jade", {
                title: "Panda Movie 结果列表页面",
                keyword: category.name,
                currentPage: (page + 1),
                query: "cate=" + cateId,
                totalPage: Math.ceil(movies.length / count),
                movies: results
            })
        })
    } else {
        Movie
        .find({title: new RegExp(q + ".*", "i")})
        .exec(function(err, movies){
            if (err) {
                console.log(err)
            }
            var results = movies.slice(index, index + count);
            res.render("results.jade", {
                title: "Panda Movie 结果列表页面",
                keyword: q,
                currentPage: (page + 1),
                query: "q=" + q,
                totalPage: Math.ceil(movies.length / count),
                movies: results
            })
        })
    }
}