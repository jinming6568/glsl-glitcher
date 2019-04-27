attribute vec4 a_Position;
varying vec2 texCoord;

void main () {
  gl_Position = vec4(vec2(a_Position),0.0,1.0);
  texCoord = vec2(0.5, 0.5) * (vec2(a_Position)+vec2(1.0, 1.0));
}
