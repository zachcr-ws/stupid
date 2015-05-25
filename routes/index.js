/*
 * routers.
 */
// var Save = require('../controller/save.js');
//var User = require('../models/user.js')

module.exports = function(app){
    app.get('/', function(req,res){
        res.render('index',{title:"Stupid Die Way"});
    });
    // app.get('/getSort', function(req, res){
    //     var response = {
    //         code : "",
    //         msg : "",
    //         data : ""
    //     }
    //     User.getAll(10, function(err, users){
    //         if(err){
    //             response.code = 400;
    //             response.msg = err;
    //         }else{
    //             response.code = 200;
    //             response.msg = "success";
    //             response.data = users;
    //         }
    //         res.setHeader('Content-Type', 'application/json');
    //         res.end(JSON.stringify(response));
    //         return;
    //     });
    // });
    // app.post('/save', function(req, res){
    //     var id = req.body.id,
    //         name = req.body.name,
    //         suggestion = req.body.suggestion,
    //         score = req.body.score,
    //         killnum = req.body.killnum;

    //     var response = {
    //         code : "",
    //         msg : "",
    //         data : ""
    //     }

    //     if(!id || !name || !suggestion || !score || !killnum){
    //         response.code = 403
    //         response.msg = "缺少参数"
    //         res.setHeader('Content-Type', 'application/json');
    //         res.end(JSON.stringify(response));
    //         return;
    //     }

    //     var newUser = new User({
    //         id: id,
    //         name: name,
    //         suggestion: suggestion,
    //         score: score,
    //         killnum: killnum
    //     });

    //     User.get(newUser.id, function(err, user){

    //         if(err){
    //             response.code = 400;
    //             response.msg = err;
    //         }

    //         if(user){
    //             response.code = 401;
    //             response.msg = "用户已经存在";
    //         }

    //         if(response.code != ""){
    //             res.setHeader('Content-Type', 'application/json');
    //             res.end(JSON.stringify(response));
    //             return;
    //         }

    //         newUser.save(function(err, user){
    //             if(err){
    //                 response.code = 402;
    //                 response.msg = err
    //             }else{
    //                 response.code = 200;
    //                 response.msg = "success";
    //                 response.data = user
    //             }
    //             res.setHeader('Content-Type', 'application/json');
    //             res.end(JSON.stringify(response));
    //             return;
    //         });
    //     });

    // });
}
