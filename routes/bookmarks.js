var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), 
    bodyParser = require('body-parser'); 
    methodOverride = require('method-override'), 
	
	router.use(bodyParser.urlencoded({ extended: true }))

router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))



router.route('/')
    
    .get(function(req, res, next) {
      
      mongoose.model('Bookmark').find({}).populate('category')
			.exec(function (err, bookmark) {
              if (err) {
                  return console.error(err);
				 
              } else {
                 console.log(bookmark);
                  res.format({
                    
                    html: function(){
                        res.render('bookmarks/index', {
                              title			: 'All Bookmarks',
                              "bookmarks"	: bookmark
                          });
                    },
                    //JSON response will show all blobs in JSON format
                    json: function(){
                        res.json(bookmark);
                    }
                });
              }     
        });
    })
    //POST a new category
    .post(function(req, res) {
       
		var category	= req.body.category;
		var name		= req.body.name;
		var url			= req.body.url;
		
		mongoose.model('Bookmark').create({
		category : category,
		name	: name,
		url		: url
           
        }, function (err, bookmarks) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  console.log('POST creating new category: ' + category);
				
				  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("bookmarks");
                        // And forward to success page
                        res.redirect("/bookmarks");
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(bookmarks);
                    }
                });
              }
        });
		
});

 /*.post(function(req, res) {
       
		var category = req.body.category;
		var name = req.body.name;
		var url = req.body.url;
		
       mongoose.model('Category').findOne({ _id: category}, 
	   
	   function (err, cats) 
	   {
		   if(cats)
		   {
				mongoose.model('Bookmark').create({
				category : category,
				name	: name,
				url		: url
           
        }, function (err, bookmarks) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  console.log('POST creating new category: ' + category);
				  console.log('catsss'+cats);
				  cats.bookmarks.push(bookmarks);
				  cats.save(function(err,books)
				  {
					  if(err)
						  console.log('error saving')
					  if(books)
						  console.log('sucesss'+cats);
					  
				  });
				  
				  console.log(cats);
				
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("bookmarks");
                        // And forward to success page
                        res.redirect("/bookmarks");
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(bookmarks);
                    }
                });
              }
        })
		
		
		
			   
		   }
		  
		});
	   
        //call the create function for our database
        
	
    });*/
		  
		


/* GET New Blob page. */
router.get('/newbookmark', function(req, res) {
    
      mongoose.model('Category').find({}, function (err, category) {
              if (err) {
                  return console.error(err);
				 
              } else {
                 //console.log(category);
                  res.format({
                    
                    html: function(){
                        res.render('bookmarks/newbookmark', {
                              title			: 'Add New Book Mark',
                              "categories"	: category
                          });
                    },
                    //JSON response will show all blobs in JSON format
                    json: function(){
                        res.json(category);
                    }
                });
              }     
        });
    
});

router.get('/manage', function(req, res) {
    
     mongoose.model('Bookmark').find({}).populate('category')
			.exec(function (err, bookmark) {
              if (err) {
                  return console.error(err);
				 
              } else {
                 console.log(bookmark);
                  res.format({
                    
                    html: function(){
                        res.render('bookmarks/manage', {
                              title			: 'All Bookmarks',
                              "bookmarks"	: bookmark
                          });
                    },
                    //JSON response will show all blobs in JSON format
                    json: function(){
                        res.json(bookmark);
                    }
                });
              }     
        });
    
});


router.get('/delete', function(req, res) {
    //console.log('test');
	return;
      mongoose.model('Bookmark').findById(req.id, function (err, bookmark) {
	        if (err) {
	            return console.error(err);
	        } else {
	            //remove it from Mongo
	            bookmark.remove(function (err, blob) {
	                if (err) {
	                    return console.error(err);
	                } else {
	                    //Returning success messages saying it was deleted
	                    console.log('DELETE removing ID: ' + bookmark._id);
	                    res.format({
	                        //HTML returns us back to the main page, or you can create a success page
	                          html: function(){
	                               res.redirect("/bookmarks/index");
	                         },
	                         //JSON returns the item with the message that is has been deleted
	                        json: function(){
	                               res.json({message : 'deleted',
	                                   bookmarks : bookmark
	                               });
	                         }
	                      });
	                }
	            });
	        }
	    });
    
});




// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Bookmark').findById(id, function (err, bookmark) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(blob);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id/')
  .get(function(req, res) {
    mongoose.model('Bookmark').findById(req.id, function (err, bookmark) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
		  
		   var category =  mongoose.model('Category').find({}, function (err, cate) {});
		   
		   console.log(cate);
		  
        console.log('GET Retrieving ID: ' + bookmark._id);
       
        res.format({
          html: function(){
              res.render('bookmarks/manage', {
                "bookmarks" : bookmark,
				"categories": category
              });
          },
          json: function(){
              res.json(bookmark);
          }
        });
      }
    });
  });

router.route('/:id/edit')
	//GET the individual blob by Mongo ID
	.get(function(req, res) {
	    //search for the blob within Mongo
	    mongoose.model('Bookmark').findById(req.id, function (err, bookmark) {
			//console.log(bookmark);
	        if (err) {
	            console.log('GET Error: There was a problem retrieving: ' + err);
	        } else {
	            //Return the blob
				  mongoose.model('Category').find({}, function (err, category) {
					 
				console.log('GET Retrieving ID: ' + bookmark._id);
				res.format({
	                //HTML response will render the 'edit.jade' template
	                html: function(){
						console.log(bookmark)
	                       res.render('bookmarks/editbookmark', {
	                          title: 'Bookmark:' + bookmark.name,
							 "bookmarks" : bookmark,
							 "categories": category
	                      });
	                 }	                 
	             
	            });
				
				});
	        }
	    });
	})
	//PUT to update a blob by ID
	.put(function(req, res) {
	    // Get our REST or form values. These rely on the "name" attributes
	    
		 var category = req.body.category;
		var name = req.body.name;
		var url = req.body.url;

	    //find the document by ID
	    mongoose.model('Bookmark').findById(req.id, function (err, bookmark) {
	        //update it
	        bookmark.update({
	            category : category,
	            name : name,
	            url : url
	           
	        }, function (err, bookmarkID) {
	          if (err) {
	              res.send("There was a problem updating the information to the database: " + err);
	          } 
	          else {
	                  //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
	                  res.format({
	                      html: function(){
	                           res.redirect("/bookmarks/manage");
	                     },
	                     //JSON responds showing the updated values
	                    json: function(){
	                           res.json(bookmark);
	                     }
	                  });
	           }
	        })
	    });
	});
	
	router.route('/:id/delete')
	//GET the individual blob by Mongo ID
	.get(function(req, res) {
		
	    mongoose.model('Bookmark').findById(req.id, function (err, bookmark) {
	        if (err) {
	            return console.error(err);
	        } else {
	            //remove it from Mongo
	            bookmark.remove(function (err, book) {
	                if (err) {
	                    return console.error(err);
	                } else {
	                    //Returning success messages saying it was deleted
	                    console.log('DELETE removing ID: ' + bookmark._id);
	                    res.format({
	                        //HTML returns us back to the main page, or you can create a success page
	                          html: function(){
	                               res.redirect("/bookmarks/manage");
	                         },
	                         //JSON returns the item with the message that is has been deleted
	                        json: function(){
	                               res.json({message : 'deleted',
	                                   item : bookmark
	                               });
	                         }
	                      });
	                }
	            });
	        }
	    });
	});
	//DELETE a Blob by ID
	/*.delete(function (req, res){
	    //find blob by ID
	    mongoose.model('Blob').findById(req.id, function (err, blob) {
	        if (err) {
	            return console.error(err);
	        } else {
	            //remove it from Mongo
	            blob.remove(function (err, blob) {
	                if (err) {
	                    return console.error(err);
	                } else {
	                    //Returning success messages saying it was deleted
	                    console.log('DELETE removing ID: ' + blob._id);
	                    res.format({
	                        //HTML returns us back to the main page, or you can create a success page
	                          html: function(){
	                               res.redirect("/blobs");
	                         },
	                         //JSON returns the item with the message that is has been deleted
	                        json: function(){
	                               res.json({message : 'deleted',
	                                   item : blob
	                               });
	                         }
	                      });
	                }
	            });
	        }
	    });
	});*/

module.exports = router;