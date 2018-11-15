var express= require("express");

let router=express.Router();
var mysql = require("mysql");
const bodyParser=require("body-parser");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_cars'
})
router.use(bodyParser.json());
router.get('/', function(req, res) {
    connection.query('SELECT * FROM cars', function(err, results) {
        if(err){
            res.sendStatus(404);
            throw err
        }
        else{
            res.statusCode=200;
            res.send(results);
        }

    })

});
router.post('/', function(req, res) {
    let obj= req.body;

            connection.query(`INSERT INTO cars
                SET ?`,obj,(err) => {
                if (err) {
                    //throw err
                    res.statusCode=400;
                    res.send({"status_code":400,"message":"Error in db insert"});
                }else{
                    res.send('Data received from plate '+obj.plate);
                }
            });

});

module.exports=router;