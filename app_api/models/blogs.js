var mongoose = require( 'mongoose' );

var blogSchema = new mongoose.Schema({
    blogTitle: {type: String, required: true},
    blogText: String,
    createdOn: {type: Date, default: Date.now},
    ownerEmail: {type: String, required: true},
    ownerName: {type: String, required: true}
});

mongoose.model('Blog', blogSchema);
