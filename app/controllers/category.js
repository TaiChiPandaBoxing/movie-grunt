var Category = require("../models/category");

// category_admin post movie
exports.save = function (req, res) {
    var _category = req.body.category;
    var category = new Category(_category);
    category.save(function (err, category) {
        if (err) {
            console.log(err)
        }
        res.redirect("/admin/category/list")
    })
}
// category_admin new page
exports.new = function (req, res) {
    res.render("category_admin.jade", {
        title: "Panda Movie 后台分类录入页",
        category: {}
    })
}
// category_admin list page
exports.list =  function (req, res) {
    Category.fetch(function (err, categories) {
        if (err) {
            console.log(err)
        }
        res.render("categorylist.jade", {
            title: "Panda Movie 分类列表页",
            categories: categories
        })
    })
}
