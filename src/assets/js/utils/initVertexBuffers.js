export default function (gl, program) {
  const vertices = new Float32Array([
    -1, 1, 0.0, 1.0,
    -1, -1, 0.0, 0.0,
    1, 1, 1.0, 1.0,
    1, -1, 1.0, 0.0
  ])
  // 创建缓冲区对象
  let vertexBuffer = gl.createBuffer()
  // 绑定buffer到缓冲对象上
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // 向缓冲对象写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  // let a_Position = gl.getAttribLocation(program, 'a_Position')

  // let a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord')

  // const FSIZE = Float32Array.BYTES_PER_ELEMENT

  // 向顶点写入缓冲数据
  // gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0)

  // 使用缓冲数据建立程序代码到着色器代码的联系
  // gl.enableVertexAttribArray(a_Position)

  // 向顶点写入缓冲数据
  // gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)

  // 使用缓冲数据建立程序代码到着色器代码的联系
  // gl.enableVertexAttribArray(a_TexCoord)
}
