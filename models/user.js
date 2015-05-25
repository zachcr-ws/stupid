var mongodb = require('./db');

function User( user ){
    this.id = user.id;
    this.name = user.name;
    this.suggestion = user.suggestion;
    this.score = user.score;
    this.killnum = user.killnum
}

module.exports = User;

User.prototype.save = function( callback ){
    var user = {
        id: this.id,
        name: this.name,
        suggestion: this.suggestion,
        score: parseInt(this.score),
        killnum: parseInt(this.killnum)
    }

    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection("users", function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.insert(user, {
                safe: true
            }, function(err, user){
                mongodb.close();
                if(err) {
                    return callback(err);
                }
                callback(null, user[0]);
            })
        })
    });
}

User.get = function( id, callback ){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection("users", function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            console.log(id);
            collection.findOne({
                id: id
            },function(err, user){
                mongodb.close();
                if(err){
                    return callback(err)
                }
                callback(null, user);
            });
        })
    })
}

User.getAll = function(limit, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection("users", function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.find({}).sort({
                score: -1
            }).limit(limit).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null, docs);
            });
        })
    })
}