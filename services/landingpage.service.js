"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const LandingPage = require("../models/landingpage.model");

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
                path: "/:id"
            },
            params: {
                headerContent: "string"
            },
            handler(ctx){
                return "update method";
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