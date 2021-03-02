// mongodb+srv://facelessadmin:<password>@cluster0.7hc88.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

var mongoose = require('mongoose');

var user = 'facelessadmin';
var password = 'fl32kju122D';
var port = 55492;
var bddname = 'Faceless';

var options = { connectTimeoutMS: 5000, useNewUrlParser: true }

mongoose.connect(
  "mongodb://"+user+":"+password+"@ds1"+port+".mlab.com:"+port+"/"+bddname, 
  options, 
  function(error){
  }
);