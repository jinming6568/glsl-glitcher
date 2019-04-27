let loadShader = function (gl, type, source) {
  // 创建着色器对象
  var shader = gl.createShader(type)
  if (shader == null) {
    console.log('无法创建着色器')
    return null
  }

  // 设置着色器源代码
  gl.shaderSource(shader, source)

  // 编译着色器
  gl.compileShader(shader)

  // 检查着色器的编译状态
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader)
    console.log('Failed to compile shader: ' + error)
    gl.deleteShader(shader)
    return null
  }

  return shader
}
let createProgram = function (gl, fragmentSource) {
  let vshader = fragmentSource.VSHADER_SOURCE
  let fshader = fragmentSource.FSHADER_SOURCE
  // 创建着色器对象
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader)
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader)
  if (!vertexShader || !fragmentShader) {
    return null
  }

  // 创建程序对象
  var program = gl.createProgram()
  if (!program) {
    return null
  }

  // 为程序对象分配顶点着色器和片元着色器
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  // 连接着色器
  gl.linkProgram(program)

  // 检查连接
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!linked) {
    var error = gl.getProgramInfoLog(program)
    console.log('无法连接程序对象: ' + error)
    gl.deleteProgram(program)
    gl.deleteShader(fragmentShader)
    gl.deleteShader(vertexShader)
    return null
  }
  fragmentSource.program = program
  return program
}
export default function (gl, fragmentSource) {
  let program = fragmentSource.program
  if (!program) {
    program = createProgram(gl, fragmentSource)
  }
  if (!program) {
    console.log('无法创建程序对象')
    return false
  }

  // gl.useProgram(program)

  return true
}
