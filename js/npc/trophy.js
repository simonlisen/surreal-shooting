import Animation from '../base/animation'
import DataBus from '../databus'

const TROPHY_IMG_SRC = 'images/trophy_1.png'//'images/enemy.png'
const TROPHY_WIDTH = 30
const TROPHY_HEIGHT = 30

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Trophy extends Animation {
  constructor() {
    super(TROPHY_IMG_SRC, TROPHY_WIDTH, TROPHY_HEIGHT)

    //this.initExplosionAnimation()
  }

  init(speed) {
    this.x = rnd(0, window.innerWidth - TROPHY_WIDTH)
    this.y = -this.height

    this[__.speed] = speed

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    // let frames = []

    // const EXPLO_IMG_PREFIX = 'images/explosion'
    // const EXPLO_FRAME_COUNT = 19

    // for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
    //   frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    // }

    // this.initFrames(frames)
  }

  // 每一帧更新战利品位置
  update() {
    this.y += this[__.speed]

    // 对象回收
    if (this.y > window.innerHeight + this.height)
      databus.removeTrophy(this)
  }
}
