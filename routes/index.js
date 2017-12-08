
/*
 * GET home page.
 * @author: zach
 */
module.exports = function(app){
    app.get('/',function(req,res){
        res.render('index',{title:"Stupid Die Way"});
    });
}
