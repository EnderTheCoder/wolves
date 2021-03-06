const mineflayer = require('mineflayer')
const Timber = require("./actions/Timber.ts")


const bot = mineflayer.createBot({
    host: '192.168.10.120', // minecraft 服务器的 ip地址
    username: 'bot_ender_1', // minecraft 用户名
    // password: '12345678' // minecraft 密码, 如果你玩的是不需要正版验证的服务器，请注释掉。
    // port: 15565,                // 默认使用25565，如果你的服务器端口不是这个请取消注释并填写。
    // version: false,             // 当你需要指定使用一个版本或快照时，请取消注释并手动填写（如："1.8.9 " 或 "1.16.5"），否则会自动设置。
    // auth: 'mojang'              // 当你需要使用微软账号登录时，请取消注释，然后将值设置为 'microsoft'，否则会自动设置为 'mojang'。
})

const { mineflayer: mineflayerViewer } = require('prismarine-viewer')

let timber = new Timber(bot)

bot.once('spawn', () => {
    mineflayerViewer(bot, { port: 3007, firstPerson: true })
    bot.waitForTicks(20).then(r => {
        timber.setAim(5)
        timber.run()
    })
})