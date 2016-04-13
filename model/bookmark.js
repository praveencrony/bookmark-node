var mongoose = require('mongoose'); 
var Schema	=	mongoose.Schema;
var bookmarkSchema = Schema({  
  category	: { type: Schema.Types.ObjectId, ref: 'Category' },
  name		: String,
  url		: String 
});
mongoose.model('Bookmark', bookmarkSchema);

