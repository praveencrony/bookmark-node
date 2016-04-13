var mongoose = require('mongoose');  
var categorySchema = new mongoose.Schema({  
  category: String
 
});
mongoose.model('Category', categorySchema);

/*var mongoose = require('mongoose'); 
var Schema	=	mongoose.Schema;
var categorySchema = Schema({  
 category: String,
  bookmarks:[{ type: Schema.Types.ObjectId, ref: 'Bookmark' }]
});
mongoose.model('Category', categorySchema);*/