precision highp float;
uniform sampler2D texture;
varying vec2 texCoord;
uniform lowp float u_Contrast;
void main () {
  lowp vec4 textureColor = texture2D(texture, texCoord);
  if (u_Contrast > 0.0) {
    textureColor.rgb = (textureColor.rgb - 0.5) / (1.0 - u_Contrast) + 0.5;
  } else {
    textureColor.rgb = (textureColor.rgb - 0.5) * (1.0 + u_Contrast) + 0.5;
  }
  gl_FragColor = textureColor;
}
