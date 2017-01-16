//global variables and imports
var mongoose= require('mongoose');
var Schema= mongoose.Schema;

//creates schma for pet objects.
var petSchema= new Schema({
  name: String,
  animal: String,
  age: Number,
  image: String
});

// saves schema to pet variable
var pet= mongoose.model('pet', petSchema);

//exports pet schema
module.exports= pet;
