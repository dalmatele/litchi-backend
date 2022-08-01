"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let DomainSchema = new Schema({
    domain: {
        type: String,
        // https://mongoosejs.com/docs/api.html#schematype_SchemaType-index
        index: {
            unique: true
        }
    },
    ownerId: {
        type: String
    }
},{
    timestamps: true
});

module.exports = mongoose.model("Domain", DomainSchema);