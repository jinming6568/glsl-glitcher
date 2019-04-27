precision mediump float;
varying vec2 texCoord;
uniform sampler2D texture;
uniform lowp float u_Brightness;
void main(void) {
  vec4 color = texture2D(texture, texCoord);
  gl_FragColor = vec4(color.rgb+u_Brightness*2.0-1.0, color.a);
}
