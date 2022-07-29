"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const LandingPage = require("../models/landingpage.model");
const {MoleculerError} = require("moleculer").Errors;
const fs = require("fs/promises");
const mustache = require("mustache");
const path = require("path");


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
                const landingPage = await this.adapter.findOne({_id: ctx.params.id});                    
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
        },
        publish: {
            cache: false,
            rest: {
                method: "POST"
            },
            params: {
                id: "string",
                domain: "string"
            },
            async handler(ctx){
                const item = await this.adapter.findById(ctx.params.id);
                if(item){
                    try{
                        //generate config file
                        const configTemplatePath = path.join(__dirname, "../dockers/nginx_config/config-template");                    
                        let config = await fs.readFile(configTemplatePath, {encoding: "utf8"});
                        config = mustache.render(config, ctx.params);
                        console.log(config);
                        const configfilePath = path.join(__dirname, "../dockers/nginx_config/sites-available/" + ctx.params.domain);
                        await fs.writeFile(configfilePath, config);
                        //save html content
                        const htmlTemplatePath = path.join(__dirname, "../dockers/nginx_config/html-template");
                        let html = await fs.readFile(htmlTemplatePath, {encoding: "utf8"});
                        const object = {
                            headerScript: item.headerScript,
                            htmlContent: item.bodyContent
                        };
                        html = mustache.render(html, object);
                        const htmlFilePath = path.join(__dirname, "../dockers/nginx_config/www/" + ctx.params.domain + "/index.html");
                        this.writeFile(htmlFilePath, html);
                        return {
                            result: true
                        };
                    }catch(error){
                        console.log(error);
                        throw new MoleculerError("Internal error", 500, "ERROR");
                    }                    
                    
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
     * https://moleculer.services/docs/0.13/services.html#Methods
	 */
	methods: {
        async isExists(path){
            try{
                await fs.access(path);
                return true;
            }catch{
                return false;
            }
        },
        async writeFile(filePath, data){
            try{
                const dirname = path.dirname(filePath);
                const exist = await this.isExists(dirname);
                if(!exist){
                    await fs.mkdir(dirname, {recursive: true});
                }
                await fs.writeFile(filePath, data, "utf8");
            }catch(error){
                throw new MoleculerError("Internal error", 500, "ERROR");
            }
        }
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