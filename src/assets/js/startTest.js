import initShaders from '@/assets/js/utils-multi/initShaders'
import loadImage from '@/assets/js/utils/loadImage'
import initTexture from '@/assets/js/utils/initTextureSingle'
import getWebGLContext from '@/assets/js/utils/getWebGLContext'
import initVertexBuffers from '@/assets/js/utils/initVertexBuffers'
import brightnessGlsl from '@/assets/js/filter/brightness.glsl'
import contrastGlsl from '@/assets/js/filter/contrast.glsl'
import greyGlsl from '@/assets/js/filter/grey.glsl'
import imageSrc from '@/assets/img/fxd-logo.png'
import * as dat from "dat.gui";

async function test () {
  // alert()
  let filterArr = [
    // {
    //   name: 'brightness',
    //   zh: '亮度',
    //   min: 0,
    //   max: 1,
    //   step: 0.01,
    //   set: 0.1,
    //   glsl: {
    //     fshader: brightnessGlsl
    //   }
    // },
    {
      name: 'contrast',
      zh: '对比度',
      min: -1,
      max: 1,
      step: 0.01,
      set: 0,
      glsl: {
        fshader: contrastGlsl
      }
    },
    // {
    //   name: 'grey',
    //   zh: '亮度',
    //   min: 0,
    //   max: 1,
    //   step: 0.01,
    //   set: 0.1,
    //   glsl: {
    //     fshader: greyGlsl
    //   }
    // }
  ]
  filterArr.forEach(item => {
    item.glsl.vshader = `
			attribute vec4 a_Position;
      varying vec2 texCoord;
      
      void main () {
        gl_Position = vec4(vec2(a_Position),0.0,1.0);
        texCoord = vec2(0.5, 0.5) * (vec2(a_Position)+vec2(1.0, 1.0));
      }
      `
  })
  const gui = new dat.GUI()
  // let imageSrc = '...' // 待加载图片路径
  let oImage = await loadImage(imageSrc) // 辅助函数见文末
  let oCanvas = document.getElementById('canvas')
  oCanvas.width = oImage.width // 初始化canvas宽高
  oCanvas.height = oImage.height
  let gl = getWebGLContext(oCanvas) // 辅助函数见文末
  // initShaders(gl, filterArr[0].glsl)
  initVertexBuffers.common(gl)
  initTexture(gl, oImage)

  filterArr.forEach(item => {
    initShaders(gl, item.glsl)
    initVertexBuffers.single(gl, item.glsl.program)
    let u_Sampler = gl.getUniformLocation(item.glsl.program, 'u_Sampler')

    gl.uniform1i(u_Sampler, 0)
    gl.useProgram(item.glsl.program)
    let variable = gl.getUniformLocation(item.glsl.program, `u_${item.name.substring(0, 1).toUpperCase()}${item.name.substring(1)}`)
    console.log(`u_${item.name.substring(0, 1).toUpperCase()}${item.name.substring(1)}`)
    item.controller = gui.add({[`u_${item.name.substring(0, 1).toUpperCase()}${item.name.substring(1)}`]: item.set}, `u_${item.name.substring(0, 1).toUpperCase()}${item.name.substring(1)}`, item.min, item.max, item.step)
    item.controller.onChange(val => {
      return ((item) => {
        console.log(item.name)
        let variable = gl.getUniformLocation(item.glsl.program, `u_${item.name.substring(0, 1).toUpperCase()}${item.name.substring(1)}`)
        // console.log(item.name)
        // console.log(variable)
        gl.uniform1f(variable, val)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4) // 此处的4代表我们将要绘制的图像是正方形
        // console.log(`u_${item.name.substring(0, 1).toUpperCase()}${item.name.substring(1)}: ${val}`)
      })(item)
    })
    console.log(`11111: ${variable}`)
    gl.uniform1f(variable, item.set)
  })
  // 设置canvas背景色
  gl.clearColor(0, 0, 0, 0)
// 清空<canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)
// 绘制
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4) // 此处的4代表我们将要绘制的图像是正方形
}

export default test
