const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileSchema = new Schema({
  name: String,
  data:  String,
  fileExtension:String,
  contentType:String,
},{collection:'file',timestamps:true});
const File = mongoose.model('File', fileSchema);
module.exports=File