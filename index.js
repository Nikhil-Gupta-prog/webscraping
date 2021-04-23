const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");


async function getPriceFeed(){
    try {
        const siteUrl = "https://coinmarketcap.com/"

        const {data} = await axios({
            method: "GET",
            url: siteUrl
        })
        const $ = cheerio.load(data)
        const elementSelecter = "#__next > div > div.main-content > div.sc-57oli2-0.dEqHl.cmc-body-wrapper > div > div > div.tableWrapper___3utdq.cmc-table-homepage-wrapper___22rL4 > table > tbody > tr"

        const keys = [
            "rank",
            "name",
            "price",
            "24h",
            "7d",
            "marketCap",
            "volume",
            "circulatingSupply"
        ]
        const coinArray = []

        $(elementSelecter).each((parentIndex, parementElement) => {
            let keyIndex = 0
            const coinObj ={}


            if(parentIndex <= 9){
               $(parementElement).children().each((childIndex, childElement) =>{
                   let tdValue = $(childElement).text()

                   if(keyIndex===1 || keyIndex ===6){
                    tdValue = $("p:first-child",$(childElement).html()).text();
                   }
                   
                   if(tdValue){
                    coinObj[keys[keyIndex]] = tdValue
                    keyIndex++
                   }
               })
               coinArray.push(coinObj)
            }
           
        })        
        return coinArray;


    } catch (error) {
        console.log(error);
    }
}



const app = express()

app.listen(3000, ()=>{
    console.log("running on port 3000");
})

app.get('/api/price-data', async(req,res) =>{
    try {
        const priceFeed = await getPriceFeed()
        
        return res.status(200).json(priceFeed)

    } catch (error) {
        return res.status(500).json({
            err: err.toString()
        })
    }
})
