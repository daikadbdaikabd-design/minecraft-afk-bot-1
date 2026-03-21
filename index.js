const mineflayer = require("mineflayer")
const express = require("express")

let bot
let afkInterval

function startBot() {

  console.log("Đang khởi động bot...")

  bot = mineflayer.createBot({
    host: "192.168.1.36:25566",
    port: 25566,
    username: "Drdount",
    version: "1.20.1"
  })

  bot.on("login", () => {
    console.log("Bot đã login server")
  })

  bot.on("spawn", () => {

    console.log("Bot đã vào world")

    if (afkInterval) clearInterval(afkInterval)

    // chống AFK (jump mỗi 1s)
    afkInterval = setInterval(() => {

      if (!bot.entity) return

      bot.setControlState("jump", true)

      setTimeout(() => {
        bot.setControlState("jump", false)
      }, 200)

    }, 1000)

  })

  bot.on("message", (jsonMsg) => {

    const msg = jsonMsg.toString()

    if (msg.includes("/register")) {
      bot.chat("/register bot123 bot123")
    }

    if (msg.includes("/login")) {
      bot.chat("/login bot123")
    }

  })

  bot.on("kicked", (reason) => {
    console.log("Bot bị kick:", reason)
  })

  bot.on("error", (err) => {
    console.log("Lỗi:", err.message)
  })

  bot.on("end", () => {

    console.log("Bot mất kết nối, reconnect sau 30s...")

    if (afkInterval) clearInterval(afkInterval)

    setTimeout(() => {
      startBot()
    }, 30000)

  })
}

startBot()

// web server cho Render / UptimeRobot
const app = express()

app.get("/", (req, res) => {
  res.send("Bot Minecraft đang chạy")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Web server chạy port", PORT)
})
