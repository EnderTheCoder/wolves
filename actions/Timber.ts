// const mineflayer = require('mineflayer')
const {pathfinder, Movements, goals} = require('mineflayer-pathfinder')
// let mcData

// const GoalFollow = goals.GoalFollow
// const GoalBlock = goals.GoalBlock
// const mcData = require('minecraft-data')(this.bot.version)

class Timber {
    //初始构造器
    bot
    wood
    // pathfinder
    aim
    count
    switchMark

    // mcData
    constructor(bot) {
        this.bot = bot
        // this.mcData = require('minecraft-data')(this.bot.version)
        // this.pathfinder = require("mineflayer-pathfinder")
        // mcData = require('minecraft-data')(this.bot.version)
        this.switchMark = true
        this.count = 0
    }

    //砍树起点函数
    run() {
        console.log("run")
        if (this.switchMark === false) return
        if (this.locate()) this.go()
    }

    //设置目标砍树数量
    setAim(aim) {
        this.aim = aim
    }

    //定位最近的树的位置
    locate() {
        console.log("locate")

        const mcData = require('minecraft-data')(this.bot.version)

        let wood_list = ["oak_log", "spruce_log", "birch_log", "jungle_log", "acacia_log", "dark_oak_log"];
        let i = 0;
        while (!this.wood) {
            if (i < wood_list.length) this.wood = this.bot.findBlock({
                // matching: mcData.findItemOrBlockByName(wood_list[i]).id,
                matching: mcData.blocksByName[wood_list[i]].id,
                // matching: mcData.blocksByName.wood
                maxDistance: 128
            })
            else break;
            i++
        }
        // console.log(this.wood)
        // this.wood = this.bot.findBlock({
        //     matching: mcData.blocks.
        //     maxDistance: 32
        // })

        //
        // if (!this.wood) {
        //     this.wood = this.bot.findBlock({
        //         matching: mcData.blocksByName.oak_log.id,
        //         maxDistance: 32
        //     })
        // }
        // if (!this.wood) {
        //     this.wood = this.bot.findBlock({
        //         matching: mcData.blocksByName.spruce_log.id,
        //         maxDistance: 32
        //     })
        // }
        // if (!this.wood) {
        //     this.wood = this.bot.findBlock({
        //         matching: mcData.blocksByName.birch_log.id,
        //         maxDistance: 32
        //     })
        // }
        // if (!this.wood) {
        //     this.wood = this.bot.findBlock({
        //         matching: mcData.blocksByName.jungle_log.id,
        //         maxDistance: 32
        //     })
        // }
        // if (!this.wood) {
        //     this.wood = this.bot.findBlock({
        //         matching: mcData.blocksByName.acacia_log.id,
        //         maxDistance: 32
        //     })
        // }
        // if (!this.wood) {
        //     this.wood = this.bot.findBlock({
        //         matching: mcData.blocksByName.dark_oak_log.id,
        //         maxDistance: 32
        //     })
        // }


        if (!this.wood) {
            this.abort()
            return false
        }
        console.log(this.wood.position)
        // this.bot.chat("已获取最近的木头坐标:x"+ this.wood.position.x.toString() + "/y:" + this.wood.position.y.toString() + "/z:" + this.wood.position.z.toString())
        return true
    }

    //砍树
    hack() {
        console.log("hack")
        if (!this.bot.canDigBlock(this.wood)) {
            this.abort()
        } else {
            this.bot.dig(this.wood).then(r => {
                this.complete()
            })
        }
    }

    //走向树
    go() {
        const mcData = require('minecraft-data')(this.bot.version)
        this.bot.loadPlugin(pathfinder)
        const goal = new goals.GoalNear(this.wood.position.x, this.wood.position.y, this.wood.position.z, 4)


        const movements = new Movements(this.bot, mcData)
        movements.scafoldingBlocks = [this.wood]
        this.bot.pathfinder.setMovements(movements)

        this.bot.pathfinder.goto(goal, (err, result) => {
            console.log(result)
            if (err) {
                console.log(err)
                this.abort()
            } else {
                this.hack()
            }
        }).then(r => {
        })
        // this.bot.chat("正在前往目标木头")
        console.log("go")

    }

    //因意外终止砍树
    abort() {
        this.switchMark = false
        this.bot.chat("发生意外，终止砍树")
        console.log("abort")

    }

    //完成一次砍树
    complete() {
        this.wood = null
        this.count++
        this.bot.chat("成功获取木头" + this.count + "/" + this.aim)
        if (this.aim === this.count) this.switchMark = false
        console.log("complete")

        this.run()

    }
}

module.exports = Timber