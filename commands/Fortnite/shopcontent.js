const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const axios = require('axios');
const FortniteAPI = require("fortnite-api-io");
const BasePaginator = require('discord-paginator.js')
const clientio = new FortniteAPI(config.fortniteapiio, {
    defaultLanguage: 'fr', // Optional - will default to 'en'
    ignoreWarnings: false // Optional -will default to false
});

module.exports = {
    name: "shopcontent",
    category: "Fortnite",
    aliases: [],
    cooldown: 4,
    usage: "",
    description: "",
    run: async (client, message, args, user, text, prefix) => {
        const embeds = []

        const shop = await axios.get("https://fortniteapi.io/v2/shop", {
            params : {
                lang : "fr"
            },
            headers : {
                Authorization : config.fortniteapiio
            }
        })
        //const shop = await clientio.v2.getDailyShop()
        
        const data = shop.data.shop
        data.forEach(data => {
            data.mainId = new Discord.MessageEmbed()
            .setColor(ee.color)
            .setTitle(data.displayName)
            .setImage(data.displayAssets[0].full_background)
            .setThumbnail(data.displayAssets[0].url)
            .addField("Nom du cosmetique" , data.displayName)
            .addField("ID", data.mainId)
            .addField("Prix", data.price.finalPrice)
            .addField("Rareté", data.rarity.name)
            .setDescription(data.displayDescription)

            console.log(data.displayName)
            console.log(data.displayAssets[0].full_background)
            embeds.push(data.mainId)
        })
        const Paginator = new BasePaginator({
            pages: embeds, //the pages
            timeout: 120000, //the timeout for the reaction collector ended (in ms)
            page: 'Page {current}/{total}', //Show the page counter to the message
            filter: (reaction, user) => user.id == message.author.id //to filter the reaction collector
        })
        
        Paginator.spawn(message.channel)
    }
}