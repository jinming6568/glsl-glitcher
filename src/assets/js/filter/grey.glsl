precision mediump float;
uniform sampler2D texture;
varying vec2 texCoord;

//uniform lowp float u_Brightness;
float u_Brightness = 0.1;

void main(void) {
  vec4 color = texture2D(texture, texCoord);
  gl_FragColor = vec4(color.rgb+u_Brightness*2.0-1.0, color.a);
}
