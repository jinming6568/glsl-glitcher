// import initShaders from '@/assets/js/utils/initShaders'
import initShaders from '@/assets/js/utils-multi/initShaders'
import loadImage from '@/assets/js/utils/loadImage'
import initTexture from '@/assets/js/utils/initTextureSingle'
import getWebGLContext from '@/assets/js/utils/getWebGLContext'
import initVertexBuffers from '@/assets/js/utils/initVertexBuffers'
import imgSrc1 from '@/assets/img/logo.jpg'
import * as dat from 'dat.gui'
import glitcherGlsl from '@/assets/js/filter/glitcher.glsl'
import draw from '@/assets/js/utils/draw'
import vshader from '@/assets/js/filter/vshader.glsl'
import glitcher from '@/assets/js/filter/glitcher.glsl'
import badtv from '@/assets/js/filter/badtv.glsl'
import brightnessGlsl from '@/assets/js/filter/brightness.glsl'
import contrastGlsl from '@/assets/js/filter/contrast.glsl'

let filterArr = [
  {
    name: 'glitcher',
    zh: '故障特效',
    min: 0,
    max: 1,
    step: 0.01,
    set: 0.1,
    glsl: {
      vshader: vshader,
      fshader: glitcher
    }
  },
  {
    name: 'badtv',
    zh: '坏电视',
    min: -1,
    max: 1,
    step: 0.01,
    set: 0,
    glsl: {
      vshader: vshader,
      fshader: badtv
    }
  }
]

filterArr.forEach(item => {
  item.glsl.VSHADER_SOURCE = `
			attribute vec4 a_Position;
      varying vec2 texCoord;
      
      void main () {
        gl_Position = vec4(vec2(a_Position),0.0,1.0);
        texCoord = vec2(0.5, 0.5) * (vec2(a_Position)+vec2(1.0, 1.0));
      }
      `
})

console.log(filterArr)

async function singleRender () {
  let filterArr = [
    {
      name: 'brightness',
      zh: '亮度',
      min: 0,
      max: 1,
      step: 0.01,
      set: 0.1,
      glsl: {
        FSHADER_SOURCE: brightnessGlsl
      }
    },
    // {
    //   name: 'contrast',
    //   zh: '对比度',
    //   min: -1,
    //   max: 1,
    //   step: 0.01,
    //   set: 0,
    //   glsl: {
    //     FSHADER_SOURCE: contrastGlsl
    //   }
    // }
  ]
  const gui = new dat.GUI()
  let oCanvas = document.getElementById('canvas')
  let image1 = await loadImage(imgSrc1)
  let imgTexture = null
  oCanvas.width = image1.width
  oCanvas.height = image1.height
  let gl = getWebGLContext(oCanvas)
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.')
    return false
  }
  initVertexBuffers.common(gl)
  imgTexture = initTexture(gl, image1)
  filterArr.forEach(item => {
    initShaders(gl, item.glsl)
    initVertexBuffers.single(gl, item.glsl.program)
    let u_Sampler = gl.getUniformLocation(item.glsl.program, 'u_Sampler')

    gl.uniform1i(u_Sampler, 0)

    let variable = gl.getUniformLocation(item.glsl.program, `u_${item.name.substring(0, 1).toUpperCase()}${item.name.substring(1)}`)
    console.log(`u_${item.name.substring(0, 1).toUpperCase()}${item.name.substring(1)}`)
    item.controller = gui.add({[item.name]: item.set}, 'u_' + item.name, item.min, item.max, item.step)
    item.controller.onChange(val => {
      return ((item) => {
        console.log(item.name)
        let variable = gl.getUniformLocation(item.glsl.program, `u_${item.name.substring(0, 1).toUpperCase()}${item.name.substring(1)}`)
        // console.log(item.name)
        // console.log(variable)
        gl.uniform1f(variable, val)
        // console.log(`u_${item.name.substring(0, 1).toUpperCase()}${item.name.substring(1)}: ${val}`)
      })(item)
    })
    console.log(`11111: ${variable}`)
    gl.uniform1f(variable, item.set)
  })

  let u_time = gl.getUniformLocation(gl.program, 'time')

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  // let tempFramebuffers = []
  // let currentFramebufferIndex = 0
  // let createFramebufferTexture = function (width, height) {
  //   var fbo = gl.createFramebuffer()
  //   gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  //
  //   // var renderbuffer = gl.createRenderbuffer()
  //   // gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer)
  //
  //   var texture = gl.createTexture()
  //   gl.bindTexture(gl.TEXTURE_2D, texture)
  //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  //
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  //
  //   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
  //
  //   // gl.bindTexture(gl.TEXTURE_2D, null)
  //   // gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  //
  //   return {fbo: fbo, texture: texture}
  // }
  // let getTempFramebuffer = function (index) {
  //   tempFramebuffers[index] = tempFramebuffers[index] || createFramebufferTexture(image1.width, image1.height)
  //   return tempFramebuffers[index]
  // }
  // const drawScene = (index) => {
  //   let source = null
  //   let target = null
  //
  //   // gl.bindTexture(gl.TEXTURE_2D, imgTexture)
  //   // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  //   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  //   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  //   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  //   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  //   // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1)
  //   // gl.bindTexture(gl.TEXTURE_2D, null)
  //
  //   // gl.bindTexture(gl.TEXTURE_2D, null)
  //
  //   if (index === 0) {
  //     // First draw call - use the source texture
  //     source = imgTexture
  //   } else {
  //     // All following draw calls use the temp buffer last drawn to
  //     source = getTempFramebuffer(currentFramebufferIndex).texture
  //   }
  //   // Set up the target
  //   //  && !(flags & DRAW.INTERMEDIATE
  //   if (index === filterArr.length - 1) {
  //     // Last filter in our chain - draw directly to the WebGL Canvas. We may
  //     // also have to flip the image vertically now
  //     target = null
  //     // console.log(target)
  //   } else {
  //     // Intermediate draw call - get a temp buffer to draw to
  //     currentFramebufferIndex = (currentFramebufferIndex + 1) % 2
  //     target = getTempFramebuffer(currentFramebufferIndex).fbo
  //     // console.log(target)
  //   }
  //
  //   // Bind the source and target
  //   gl.bindTexture(gl.TEXTURE_2D, source)
  //   gl.bindFramebuffer(gl.FRAMEBUFFER, target)
  //   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  // }
  //
  // let loop = () => {
  //   requestAnimationFrame(() => {
  //     let todayDateObj = (() => {
  //       let oDate = new Date()
  //       oDate.setHours(0, 0, 0, 0)
  //       return oDate
  //     })()
  //     let nowDate = new Date()
  //     let diffTime = nowDate.getTime() - todayDateObj.getTime()
  //     gl.uniform1f(u_time, diffTime / 1000)
  //     drawScene(index)
  //     // filterArr.forEach((item, index) => {
  //     //   gl.useProgram(item.glsl.program)
  //     //   // let variable = gl.getUniformLocation(item.glsl.program, `u_${item.name.substring(0, 1).toUpperCase()}${item.name.substring(1)}`)
  //     //   // gl.uniform1f(variable, item.controller.getValue())
  //     //   drawScene(index)
  //     // })
  //     loop()
  //   })
  // }
  // loop()
}

async function multiRender () {
  const gui = new dat.GUI()
  let oCanvas = document.getElementById('canvas')
  let image1 = await loadImage(imgSrc1)
  let imgTexture = null
  oCanvas.width = image1.width
  oCanvas.height = image1.height
  let gl = getWebGLContext(oCanvas)
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.')
    return false
  }
  filterArr.forEach(item => {
    initShaders(gl, item.glsl)
  })
}

export default singleRender
