"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const domainModel = require("../models/domain.model");
const {MoleculerError} = require("moleculer").Errors;

module.exports = {
    name: "domain",
    // version: 1,
    settings: {},
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.MONGO_URI, {
        user: process.env.MONGO_USER,
        password: process.env.MONGO_PASSWORD,
        keepAlive: true
    }),
    model: domainModel,
    actions: {
        list:{
            cache: false,
            rest: {
                method: "GET",                
            },
            params: {
                size: {type: "number", positive: true, max: 50, integer: true, convert: true},
                index: {type: "number", min: 0, integer: true, convert: true}
            },
            async handler(ctx){
                let result = {};
                let domains = await this.adapter.find({
                    limit: ctx.params.size,
                    offset: ctx.params.index
                }); 
                const total = await this.adapter.count();    
                result.items = domains;      
                result.total = total; 
                result.page = ctx.params.index;
                result.size = ctx.params.size;      
                return result;
            }
        },
        create: {
            rest: {
                method: "POST"
            },
            params: {
                domain: "string"
            },
            async handler(ctx){
                try{
                    let domain = {
                        domain: ctx.params.domain
                    }
                    domain = await this.adapter.insert(domain);
                    return domain;
                }catch(error){
                    throw new MoleculerError("Item is existed", 403, "DUPLICATED");
                }
                
            }
        }
    }
}