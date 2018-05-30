import Sprite   from '../base/sprite'
import DataBus  from '../databus'

const BULLET_IMG_SRC = 'images/bullet.png'
const BULLET_WIDTH   = 16
const BULLET_HEIGHT  = 30

const __ = {
  speed: Symbol('speed'),
  x_speed: 0
}

let databus = new DataBus()

export default class Bullet extends Sprite {
  constructor() {
    super(BULLET_IMG_SRC, BULLET_WIDTH, BULLET_HEIGHT)
  }

  init(x, y, y_speed, x_speed = 0 ) {
    this.x = x
    this.y = y

    this[__.speed] = y_speed
    this[__.x_speed] = x_speed

    this.visible = true
  }

  // 每一帧更新子弹位置
  update() {
    this.y -= this[__.speed]
    if (this[__.x_speed] !=0){
      this.x += this[__.x_speed]
    }

    // 超出屏幕外回收自身
    if ( this.y < -this.height )
      databus.removeBullets(this)
  }
}
