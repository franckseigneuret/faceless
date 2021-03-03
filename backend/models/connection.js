var mongoose = require('mongoose');

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology : true
}
mongoose.connect('mongodb+srv://facelessadmin:fl32kju122DD@cluster0.7hc88.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
    options,         
    function(err) {
     console.log(err);
    }
);