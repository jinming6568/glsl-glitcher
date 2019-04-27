export default {
  common (gl) {
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
  },
  single (gl, program) {
    let a_Position = gl.getAttribLocation(program, 'a_Position')
    const FSIZE = Float32Array.BYTES_PER_ELEMENT
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0)
    gl.enableVertexAttribArray(a_Position)
  }
  
}
