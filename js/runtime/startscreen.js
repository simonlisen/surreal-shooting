import Sprite from '../base/sprite'

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

const SS_IMG_SRC = 'images/start_screen.png'
const SS_WIDTH     = 375
const SS_HEIGHT    = 812

/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class StartScreen extends Sprite {
  constructor(ctx) {
    super(SS_IMG_SRC, SS_WIDTH, SS_HEIGHT)
    //sleep(3000)
    this.render(ctx)
  }

  // update() {
  //   this.top += 2

  //   if ( this.top >= screenHeight )
  //     this.top = 0
  // }

  /**
   * 背景图重绘函数
   * 绘制两张图片，两张图片大小和屏幕一致
   * 第一张漏出高度为top部分，其余的隐藏在屏幕上面
   * 第二张补全除了top高度之外的部分，其余的隐藏在屏幕下面
   */
  render(ctx) {
   // debugger;
    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      0,
      0,
      screenWidth,
      screenHeight
    )
    //debugger;
    // ctx.drawImage(
    //   this.img,
    //   0,
    //   0,
    //   this.width,
    //   this.height,
    //   0,
    //   this.top,
    //   screenWidth,
    //   screenHeight
    // )
  }
}
