const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assumes you have a User model
      required: true
    },
    content: {
      type: String,
      trim: true,
      maxlength: 1000,
      required: true
    },
    images: [
      {
        type: String // store image URLs or filenames
      }
    ],
    file: {
      type: String, // store uploaded file name or path
      required: true
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Post", postSchema);
