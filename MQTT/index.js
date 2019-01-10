var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://broker.hivemq.com')
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_cars'
})


client.on('connect', function () {
    client.subscribe('smart_car/cars/+', function (err) {
        client.on('message', function (topic, message) {
            // message is Buffer
            let t=topic.replace("smart_car/cars/find/","")+"";
            if(topic.includes("smart_car/cars/find")&&!topic.includes("response")){
                console.log("QUERY");
                connection.query(`SELECT * FROM cars WHERE(plate)=?`,t,(err,results) => {
                    if (err) {
                        //throw err
                        client.publish(topic+"/response",'ERROR');
                    }else{
                        //console.log("Plate:"+t+" results:"+results);
                        client.publish(topic+"/response",JSON.stringify(results));
                    }
                });
        }
        })
    })
    client.subscribe('smart_car/+/measurement', function (err) {
        /*if (!err) {
            client.publish('frizzi/4/macchine', 'EHILA')
        }*/
        client.on('message', function (topic, message) {
            // message is Buffer
            if(!topic.includes("/measurements")&&topic.includes("/measurement")){
            let t=topic.replace("smart_car/","").replace("/measurement","");
            let m = JSON.parse(message);
            connection.query(`INSERT INTO measurements
                SET ?`,m,(err) => {
                if (err) {
                    //throw err
                    client.publish(topic+"/response",'ERROR');
                }else{
                }
            });
            }

        })
    })
    client.subscribe('smart_car/cars/upload', function (err) {
        /*if (!err) {
            client.publish('frizzi/4/macchine', 'EHILA')
        }*/
        client.on('message', function (topic, message) {
            // message is Buffer
            if(topic=="smart_car/cars/upload"){
                console.log("Insert car");
                let m = JSON.parse(message);
                connection.query(`INSERT INTO cars
                SET ?`,m,(err) => {
                    if (err) {
                        //throw err
                        console.log(err);
                        client.publish(topic+"/response",'ERROR');
                    }else{
                        client.publish(topic+"/response",'DATA SAVED')
                    }
                });
            }else console.log("OPS");

        })
    })
    client.subscribe('smart_car/+/measurements', function (err) {
        client.on('message', function (topic, message) {
            // message is Buffer
            if(topic.includes("/measurements")){
                let t=topic.replace("smart_car/","").replace("/measurements","");
                connection.query(`SELECT * FROM measurements
                WHERE car_id =?`,t,(err,results) => {
                    if (err) {
                        //throw err
                        client.publish(topic+"/response",'ERROR');
                    }else{
                        client.publish(topic+"/response",JSON.stringify(results));
                    }
                });
            }

        })
    })
})

