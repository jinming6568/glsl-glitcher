export default function (gl, image, program) {
  let texture = gl.createTexture()
  // let u_Sampler = gl.getUniformLocation(program, 'u_Sampler')
  // 对纹理图像进行y轴翻转
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  // 开启0号纹理单元
  // gl.activeTexture(gl.TEXTURE0)
  // 绑定纹理对象
  gl.bindTexture(gl.TEXTURE_2D, texture)
  // 配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  // 配置纹理图像
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  // 将0号纹理传递给着色器的取样器变量
  // gl.uniform1i(u_Sampler, 0)
  return texture
}
