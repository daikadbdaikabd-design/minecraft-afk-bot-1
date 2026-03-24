const mineflayer = require("mineflayer")
const express = require("express")

let bot
let afkInterval

function startBot() {

  console.log("Đang khởi động bot...")

  bot = mineflayer.createBot({
    host: "darkblademc.joinmc.world",
    port: 20674,
    username: "KimChi2k5",
    version: "1.20.1"
  })

  bot.on("login", () => {
    console.log("Bot đã login server")
  })

  bot.on("spawn", () => {

    console.log("Bot đã vào world")

    if (afkInterval) clearInterval(afkInterval)

    afkInterval = setInterval(() => {

      if (!bot.entity) return

      const actions = ["forward","back","left","right"]

      const action = actions[Math.floor(Math.random() * actions.length)]

      bot.clearControlStates()
      bot.setControlState(action,true)

      // nhảy
      bot.setControlState("jump", true)

      setTimeout(() => {
        bot.setControlState("jump", false)
        bot.clearControlStates()
      }, 500)

      // xoay đầu random
      const yaw = Math.random() * Math.PI * 2
      const pitch = (Math.random() - 0.5) * 0.5
      bot.look(yaw, pitch, true)

    }, 3000)

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
const expressApp = express()

expressApp.get("/", (req, res) => {
  res.send("Bot Minecraft đang chạy")
})

const PORT = process.env.PORT || 3000

expressApp.listen(PORT, () => {
  console.log("Web server chạy port", PORT)
})
