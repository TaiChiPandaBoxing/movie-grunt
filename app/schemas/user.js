var mongoose = require("mongoose");
//加密密码模块
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;
var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    // 0: nomal user 普通用户
    // 1: verified user 邮箱验证通过的用户
    // 2: professonal user 会员用户

    // >10: admin 管理员
    // >50: super admin 开发人员
    role: {
        type: Number,
        default: 0
    },
    password: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});
UserSchema.pre("save", function (next) {
    var user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        } else {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return next(err)
                } else {
                    user.password = hash;
                    next();
                }
            })
        }
    });
});
UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) {
                return cb(err)
            } else {
                cb(null, isMatch)
            }
        })
    }
}
UserSchema.statics = {
    fetch: function(cb){
        return this.find({}).sort("meta.updateAt").exec(cb);
    },
    findById: function (id, cb) {
        return this.findOne({_id: id}).exec(cb);
    }
};
module.exports = UserSchema