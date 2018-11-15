var express= require("express");
let app=express();
const cors=require("cors");
let cars=require("./cars");
let measurements=require("./measurement");
app.use("/v1/cars",cars);
app.use("/v1/measurements",measurements);

app.listen(8080,
    console.log("Listening"));