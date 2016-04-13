var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), 
    bodyParser = require('body-parser'); 
    methodOverride = require('method-override'), 
	validation    =     require("validator");
	
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
      
        mongoose.model('Category').find({}, function (err, category) {
              if (err) {
                  return console.error(err);
				 
              } else {
                 console.log(category);
                  res.format({
                    
                    html: function(){
                        res.render('bookmarks/category', {
                              title			: 'All Categories',
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
    })
    //POST a new category
    .post(function(req, res) {
       
		var category = req.body.category;

		if(validation.isNull(category)) {
			
		}
      
        //call the create function for our database
        mongoose.model('Category').create({
            category : category,
           
        }, function (err, category) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //Blob has been created
                  console.log('POST creating new category: ' + category);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("category");
                        // And forward to success page
                        res.redirect("/category");
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(category);
                    }
                });
              }
        })
	
    });

/* GET New Blob page. */
router.get('/new', function(req, res) {
    res.render('bookmarks/new', { title: 'Add New Category' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Category').findById(id, function (err, category) {
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
    mongoose.model('Category').findById(req.id, function (err, category) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + category._id);
        
        res.format({
          html: function(){
              res.render('bookmarks/category', {
                "blobdob" : blobdob,
                "blob" : blob
              });
          },
          json: function(){
              res.json(blob);
          }
        });
      }
    });
  });

router.route('/:id/edit')
	//GET the individual blob by Mongo ID
	.get(function(req, res) {
		
	    //search for the blob within Mongo
	    mongoose.model('Category').findById(req.id, function (err, category) {
	        if (err) {
	            console.log('GET Error: There was a problem retrieving: ' + err);
	        } else {
	            //Return the blob
	            console.log('GET Retrievings ID: ' + category._id);
         
	            res.format({
	                //HTML response will render the 'edit.jade' template
	                html: function(){
	                       res.render('bookmarks/editcat', {
	                          title: 'Category: ' + category.category,
							"category" : category
	                      });
	                 },
	                 //JSON response will return the JSON output
	                json: function(){
	                       res.json(category);
	                 }
	            });
	        }
	    });
	})
	//PUT to update a blob by ID
	.put(function(req, res) {
	    // Get our REST or form values. These rely on the "name" attributes
	    var cate = req.body.category;
	  //find the document by ID
	    mongoose.model('Category').findById(req.id, function (err, category) {
	        //update it
	        category.update({
	            category : cate
	           
	        }, function (err, categoryID) {
	          if (err) {
	              res.send("There was a problem updating the information to the database: " + err);
	          } 
	          else {
	                  //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
	                  res.format({
	                      html: function(){
							  res.redirect("/category");
	                     },
	                     //JSON responds showing the updated values
	                    json: function(){
	                           res.json(category);
	                     }
	                  });
	           }
	        })
	    });
	});
	
	router.route('/:id/delete')
	//GET the individual blob by Mongo ID
	.get(function(req, res) {
		
	    mongoose.model('Category').findById(req.id, function (err, category) {
	        if (err) {
	            return console.error(err);
	        } else {
	            //remove it from Mongo
	            category.remove(function (err, cat) {
	                if (err) {
	                    return console.error(err);
	                } else {
	                    //Returning success messages saying it was deleted
	                    console.log('DELETE removing ID: ' + category._id);
	                    res.format({
	                        //HTML returns us back to the main page, or you can create a success page
	                          html: function(){
	                               res.redirect("/category");
	                         },
	                         //JSON returns the item with the message that is has been deleted
	                        json: function(){
	                               res.json({message : 'deleted',
	                                   item : category
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
	    mongoose.model('Category').findById(req.id, function (err, category) {
	        if (err) {
	            return console.error(err);
	        } else {
	            //remove it from Mongo
	            category.remove(function (err, blob) {
	                if (err) {
	                    return console.error(err);
	                } else {
	                    //Returning success messages saying it was deleted
	                    console.log('DELETE removing ID: ' + category._id);
	                    res.format({
	                        //HTML returns us back to the main page, or you can create a success page
	                          html: function(){
	                               res.redirect("/category");
	                         },
	                         //JSON returns the item with the message that is has been deleted
	                        json: function(){
	                               res.json({message : 'deleted',
	                                   item : category
	                               });
	                         }
	                      });
	                }
	            });
	        }
	    });
	});*/

module.exports = router;