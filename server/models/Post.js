const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let PostModel = {};

const setVal = (val) => _.escape(val).trim();

const PostSchema = new mongoose.Schema({
  contents: {
    type: String,
    required: true,
    trim: true,
    set: setVal,
  },

  author: {
    type: String,
    required: true,
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.statics.toAPI = (doc) => ({
  contents: doc.name,
  author: doc.author,
});

PostSchema.statics.findByAuthor = (username, callback) => {
  const search = {
    author: username,
  };

  return PostModel.find(search).sort({ createdData: -1 }).select('contents author')
    .exec(callback);
};

PostModel = mongoose.model('Post', PostSchema);

module.exports.PostModel = PostModel;
module.exports.PostSchema = PostSchema;
