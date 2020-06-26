const IMG_PATH = './images/';

require('dotenv').config()

var express = require('express');
var hbs = require( 'express-handlebars');
var path = require('path');
var app = express();
var router = express.Router();
var helpers = require('handlebars-helpers')();
var moment = require('moment');
//Import the mongoose module
var mongoose = require('mongoose');

var RunModel = require('./models/run.model');
app.use('/admin', require('./admin'));
//set up file structure stuff I guess
var fs = require('fs');

//Set up default mongoose connection
var mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/runs';
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.urlencoded({extended: false}));
app.use('/',router);
app.use(express.static(path.join(__dirname, 'public')));
var path = __dirname + '/views/';

app.engine('hbs', hbs({
    extname: 'hbs', 
    defaultLayout: 'layout', 
    layoutsDir: __dirname + '/views/layouts/',
    helpers: {
        duration: function(duration_milli) {
            return moment.duration(duration_milli).minutes() + "m " +
                moment.duration(duration_milli).seconds() + "s " +
                moment.duration(duration_milli).milliseconds() + "ms";
        }
    }
}));
app.set('views', __dirname + '/views/');  
app.set('view engine', 'hbs');

function readableDateTime(datetime) {
    var d = new Date(datetime);
    return d.toDateString();
}

router.get('/',function(req, res, next){
    res.render('index', {title: "Taco Bell Speedruns", page_name:"index"})
});

router.get('/drivethru', function(req, res) {
    RunModel.find({"category": "drive thru%"}, null, {sort: { length : 'asc' }}, function(err, runs) {
        res.render("drivethru", {
            title: "drive thru%", 
            runs: runs.map(run => run.toJSON())
        });
    });
});

router.get('/bajablast', function(req, res) {
    RunModel.find({"category": "baja blast%"}, function(err, runs) {
        res.render("bajablast", {title: "baja blast%", runs: runs.map(run => run.toJSON())});
    });
});

router.get('/recipes',function(req, res){
    res.render('temp-recipes');
});


router.get('/images/:fileName', function(req, res) {
    let fileName = req.params.fileName;
    try {    
        if (fileName) {
            res.sendFile(fileName, {root: IMG_PATH});
        } else {
            res.status(404).send('Image not found');
        } 
    } catch (err) {
        console.error(err);
    }
});

router.get('/about',function(req, res){
    res.render('about');
});

router.get('/roadmap',function(req, res){
    res.render('roadmap');
});


app.use('*',function(req, res){
  res.send('Error 404: Not Found!');
});
 
const PORT = process.env.PORT || 3000;

app.listen(PORT,function(){
  console.log('Server running at Port 3000');
});
