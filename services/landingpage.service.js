"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const LandingPage = require("../models/landingpage.model");
const {MoleculerError} = require("moleculer").Errors;

// const ApiGateway = require("moleculer-web");
module.exports = {
    name: "landingpage",
    // version: 1,
    settings: {},
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.MONGO_URI, {
        user: "litchi",
        password: "password",
        keepAlive: true
    }),
    model: LandingPage,
    // mixins: [ApiGateway],
    actions: {
        create:{
            // rest: "POST /create",
            rest: {
                method: "POST",
                // path: "/create"
            },
            params: {
                headerScript: {type: "string", optional: true},
                bodyContent: "string"
            },
            async handler(ctx){
                let landingpage = {
                    headerScript: ctx.params.headerScript ? ctx.params.headerScript : "",
                    bodyContent: ctx.params.bodyContent ? ctx.params.bodyContent : ""
                };
                await this.adapter.insert(landingpage);
                return landingpage;
            }
        },
        update: {
            rest: {
                method: "POST",                
            },
            params: {
                id: "string",
                headerScript: {type: "string", optional: true},
                bodyContent: "string"
            },
            async handler(ctx){
                const landingPage = await this.adapter.findOne({id: ctx.params.id});
                let object = {};
                if(landingPage){
                    object.headerScript = ctx.params.headerScript ? ctx.params.headerScript : landingPage.headerScript;
                    object.bodyContent = ctx.params.bodyContent;
                    object.updateAt = new Date();
                    await this.adapter.updateById(ctx.params.id, {$set: object});
                    return object;
                }else{
                    throw new MoleculerError("Item not found", 401, "NOT_FOUND");
                }                
            }
        },
        list: {
            cache: false,//avoid moleculer cache the request
            rest: {
                method: "GET"
            },
            params: {
                size: {type: "number", positive: true, max: 50, integer: true, convert: true},
                index: {type: "number", min: 0, integer: true, convert: true}
            },
            async handler(ctx){
                let result = {};
                let lps = await this.adapter.find({
                    limit: ctx.params.size,
                    offset: ctx.params.index
                }); 
                const total = await this.adapter.count();    
                result.items = lps;      
                result.total = total; 
                result.page = ctx.params.index;
                result.size = ctx.params.size;      
                return result;
            }
        },
        get: {
            cache: false,
            rest: {
                method: "GET"
            },
            params: {
                id: "string"
            },
            async handler(ctx){
                const item = await this.adapter.findById(ctx.params.id);
                return item;
            }
        }
    },
    /**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
}