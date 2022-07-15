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
        user: "root",
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