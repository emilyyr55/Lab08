var mongoose = require('mongoose');
var blogsModel = mongoose.model('Blog');
                                                        
var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};  

/* GET a blog by the id */
module.exports.blogsReadOne = function(req, res) {
    console.log('Finding blog details', req.params);
    if (req.params && req.params.id) {
      blogsModel
        .findById(req.params.id)
        .then((blog) => {
            if (!blog) {
                sendJSONresponse(res, 404, {
                  "message": "id not found"
                });
                return;
            }
            console.log(blog);
            sendJSONresponse(res, 200, blog);
        }).catch((err) => {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
        });
    } else {
      console.log('No id specified');
      sendJSONresponse(res, 404, {
        "message": "No id in request"
      });
    }
  };

  module.exports.blogsList = function (req, res) {
    console.log('Getting locations list');
    blogsModel
        .find()
        .then((results) => {
            if (!results) {
                sendJSONresponse(res, 404, {
                  "message": "no locations found"
                });
                return;
            }
            console.log(results);
            sendJSONresponse(res, 200, buildBlogsList(req, res, results));
        }).catch((err) => {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
        });
  };

  var buildBlogsList = function(req, res, results) {
    var blogs = [];
    results.forEach(function(obj) {
      blogs.push({
        blogTitle: obj.blogTitle,
        blogText: obj.blogText,
        createdOn: obj.createdOn,
        ownerEmail: obj.ownerEmail,
        ownerName: obj.ownerName,
        formattedDate: new Date(obj.createdOn).toLocaleString('en-US', {timeZone: 'America/New_York', timeZoneName: 'short'}),
        _id: obj._id
      });
    });
    return blogs;
  };    

  module.exports.blogsCreateOne = function (req, res) {
    console.log("newblog");
    console.log(req);
    blogsModel
     .create({
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText,
        createdOn: req.body.createdOn,
        ownerEmail: req.payload.email,
        ownerName: req.payload.name
       }, 
       function(err, blog) {
         if (err) {
            console.log(err);
            sendJSONresponse(res, 400, err);
         } else {
            console.log(blog);
            sendJSONresponse(res, 201, blog);
         }
       }
     );
  };    

  module.exports.blogsUpdateOne = function (req, res) {
    console.log("Updating a blog entry with id of " + req.params.id);
    console.log(req.body);
    blogsModel
  	  .findOneAndUpdate(
	     { _id: req.params.id },
 	     { $set: {"blogTitle": req.body.blogTitle, "blogText": req.body.blogText, "createdOn": req.body.createdOn}},
	     function(err, response) {
	         if (err) {
	  	         sendJSONresponse(res, 400, err);
	         } else {
		        sendJSONresponse(res, 201, response);
	        }
	    }
    );
  };    

  module.exports.blogsDeleteOne = function (req, res) {
    console.log("Deleting blog entry with id of " + req.params.id);
    console.log(req.body);
    blogsModel
        .findByIdAndRemove(req.params.id)
        .then((response) => {
            sendJSONresponse(res, 204, null);
        }).catch((err) => {
            sendJSONresponse(res, 404, err);
        });
  };    