"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let LandingPageSchema = new Schema({
    headerScript: {
        type: String
    },
    bodyContent: {
        type: String
    },
    lpName: {
        type: String
    },
    ownerId: {
        type: String
    },
    domainId:{
        type: String
    },
    isPublished: {
        type: Boolean
    }
},{
    timestamps: true
});

module.exports = mongoose.model("LandingPage", LandingPageSchema);