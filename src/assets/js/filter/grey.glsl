precision mediump float;
uniform sampler2D texture;
varying vec2 texCoord;

//uniform lowp float u_Brightness;
float u_Brightness = 0.1;

void main(void) {
  vec4 color = texture2D(texture, texCoord);
  float gray = 0.2989*color.r+0.5870*color.g+0.1140*color.b;
      gl_FragColor = vec4(gray,gray,gray , color.a);
}
