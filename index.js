const mineflayer = require('mineflayer')
const express = require('express')

const app = express()

app.get("/", (req,res)=>{
res.send("Bot running")
})

app.listen(3000, ()=>{
console.log("Web server started")
})

const host = "darkblademc.falix.dev"
const port = 31985
const password = "123456"

const botCount = 90

function createBot(id){

const bot = mineflayer.createBot({
host: host,
port: port,
username: "bot_"+id
})

bot.on("spawn",()=>{

console.log("bot_"+id+" joined")

setTimeout(()=>{
bot.chat(`/register ${password} ${password}`)
bot.chat(`/login ${password}`)
},3000)

setInterval(()=>{
bot.setControlState("jump",true)

setTimeout(()=>{
bot.setControlState("jump",false)
},400)

},5000)

})

bot.on("end",()=>{
console.log("bot_"+id+" reconnecting")

setTimeout(()=>{
createBot(id)
},10000)

})

bot.on("kicked",(reason)=>{
console.log("bot_"+id+" kicked:",reason)
})

bot.on("error",(err)=>{
console.log("bot_"+id+" error:",err)
})

}

for(let i=1;i<=botCount;i++){

setTimeout(()=>{
createBot(i)
},i*2000)

}
