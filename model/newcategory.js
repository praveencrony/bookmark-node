var mongoose = require('mongoose'); 
var Schema	=	mongoose.Schema;
var categorySchema = Schema({  
  category: String,
  bookmarks:[{ name: String, url: String }]
 
});
mongoose.model('Category', categorySchema);
