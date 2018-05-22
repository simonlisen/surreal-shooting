import Player from './player/index'
import Enemy from './npc/enemy'
import Trophy from './npc/trophy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'

let ctx = canvas.getContext('2d')
let databus = new DataBus()
//fire a bullet every 50 frames. The smaller this value, the faster player shoots.
var fireInterval = 50
//every blue gem increase atk spd by 20%.
const FIRE_INTERVAL_REDUCTION = 0.2
//minimum fire interval is 1 shot per 10 frames.
const MIN_FIRE_INTERVAL = 10

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0

    this.restart()
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.bg = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 30 === 0) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(6)
      databus.enemys.push(enemy)
    }
  }

  /**
   * 随着帧数变化的战利品生成逻辑
   * 帧数取模定义成生成的频率
   */
  trophyGenerate() {
    if (databus.frame % 200 === 0) {
      let tp = databus.pool.getItemByClass('trophy', Trophy)
      tp.init(5)
      databus.trophies.push(tp)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this
    
    //detect bullet - enemy collision
    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          enemy.playAnimation()
          that.music.playExplosion()

          bullet.visible = false
          databus.score += 1

          break
        }
      }
    })
    
    //detect player - enemy collision
    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true

        break
      }
    }
    
    //detect player - trophy collision
    for (let i = 0, il = databus.trophies.length; i < il; i++) {
      let tp = databus.trophies[i]
      let division = 1 + FIRE_INTERVAL_REDUCTION
      if (this.player.isCollideWith(tp)) {
        //reduce fire interval  - MIN_FIRE_INTERVAL
        if (parseInt (fireInterval / division) > MIN_FIRE_INTERVAL){
          fireInterval = parseInt(fireInterval / division) 
        }        
        databus.removeTrophy(tp)
        break
      }
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea

    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY)
      this.restart()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)

    databus.bullets
      .concat(databus.enemys)
      .concat(databus.trophies)
      .forEach((item) => {
        item.drawToCanvas(ctx)
      })

    this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.score)
    this.gameinfo.renderFireInterval(ctx, fireInterval)

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)

      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  //execute update() every other frame;
  update() {
    if (databus.gameOver)
      return;

    this.bg.update()

    databus.bullets
      .concat(databus.enemys)
      .concat(databus.trophies)
      .forEach((item) => {
        item.update()
      })

    this.enemyGenerate()
    this.trophyGenerate()

    this.collisionDetection()

    if (databus.frame % fireInterval === 0) {
      //debugger;
      this.player.shoot()
      this.music.playShoot()
    }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
