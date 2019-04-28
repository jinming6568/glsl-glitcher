import loadImage from '@/assets/js/utils/loadImage'
import getWebGLContext from '@/assets/js/utils/getWebGLContext'
import initShaders from '@/assets/js/utils-multi/initShaders'
import initVertexBuffers from '@/assets/js/utils/initVertexBuffers'
import initTexture from '@/assets/js/utils/initTextureSingle'

import imgSrc1 from '@/assets/img/logo.jpg'
import * as dat from 'dat.gui'
import draw from '@/assets/js/utils/draw'

import vshader from '@/assets/js/filter/vshader.glsl'
import glitcher from '@/assets/js/filter/glitcher.glsl'
import badtv from '@/assets/js/filter/badtv.glsl'
import film from '@/assets/js/filter/film.glsl'
import grey from '@/assets/js/filter/grey.glsl'


let filterArr = [
  {
    name: 'glitcher',
    zh: '故障特效',
    glsl: {
      vshader: vshader,
      fshader: glitcher
    }
  },
  // {
  //   name: 'badtv',
  //   zh: '坏电视特效',
  //   glsl: {
  //     vshader: vshader,
  //     fshader: badtv
  //   }
  // },
  // {
  //   name: 'grey',
  //   zh: '灰度特效',
  //   glsl: {
  //     vshader: vshader,
  //     fshader: grey
  //   }
  // },
  {
    name: 'film',
    zh: '电影特效',
    glsl: {
      vshader: vshader,
      fshader: film
    }
  },
]


async function multiRender () {
  const gui = new dat.GUI()
  let oCanvas = document.getElementById('canvas')
  let image1 = await loadImage(imgSrc1)

  oCanvas.width = image1.width
  oCanvas.height = image1.height
  let gl = getWebGLContext(oCanvas)
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.')
    return false
  }
  initVertexBuffers.common(gl)
  filterArr.forEach(item => {
    initShaders(gl, item.glsl)
    initVertexBuffers.single(gl, item.glsl.program)
    // let u_Sampler = gl.getUniformLocation(item.glsl.program, 'u_Sampler')
    //
    // gl.uniform1i(u_Sampler, 0)
  })
  let imgTexture = initTexture(gl, image1)
  let tempFramebuffers = []
  let currentFramebufferIndex = 0
  const initFramebufferObject = (gl, width, height) => {
    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    var texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    return {
      fbo,
      texture
    }
  }
  const getTempFramebuffer = function (index) {
    tempFramebuffers[index] = tempFramebuffers[index] || initFramebufferObject(gl, image1.width, image1.height)
    return tempFramebuffers[index]
  }
  const drawScene = (index) => {
    let source = null
    let target = null
    if (index === 0) {
      source = imgTexture
    } else {
      source = getTempFramebuffer(currentFramebufferIndex).texture
    }
    if (index === filterArr.length - 1) {
      target = null
    } else {
      currentFramebufferIndex = (currentFramebufferIndex + 1) % 2
      target = getTempFramebuffer(currentFramebufferIndex).fbo
    }
    gl.bindTexture(gl.TEXTURE_2D, source)
    gl.bindFramebuffer(gl.FRAMEBUFFER, target)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  let loop = () => {
    requestAnimationFrame(() => {
      // let todayDateObj = (() => {
      //   let oDate = new Date()
      //   oDate.setHours(0, 0, 0, 0)
      //   return oDate
      // })()
      // let nowDate = new Date()
      // let diffTime = nowDate.getTime() - todayDateObj.getTime()
      // gl.uniform1f(u_time, diffTime / 1000)
      filterArr.forEach((item, index) => {
        gl.useProgram(item.glsl.program)
        // let variable = gl.getUniformLocation(item.glsl.program, `u_${item.name.substring(0, 1).toUpperCase()}${item.name.substring(1)}`)
        // gl.uniform1f(variable, item.controller.getValue())
        drawScene(index)
      })
      loop()
    })
  }
  loop()
}

export default multiRender
