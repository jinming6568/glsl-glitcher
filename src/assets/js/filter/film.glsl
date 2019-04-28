precision mediump float;
uniform sampler2D texture;
varying vec2 texCoord;

//uniform float time;
//uniform float nIntensity; // [0, 2]
//uniform float sIntensity;// [0, 2]
//uniform float sCount; // [0, 1000]
//uniform bool grayscale;


bool grayscale = false;
float time = 1000.0;
float nIntensity = 0.4;
float sIntensity = 0.9;
float sCount = 800.0;

void main() {

  vec4 cTextureScreen = texture2D( texture, texCoord );

  // make some noise
  float x = texCoord.x * texCoord.y * time *  1000.0;
  x = mod( x, 13.0 ) * mod( x, 123.0 );
  float dx = mod( x, 0.01 );

  // add noise
  vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx * 10.0, 0.0, 1.0 );

  // get us a sine and cosine
  vec2 sc = vec2( sin( texCoord.y * sCount ), cos( texCoord.y * sCount ) );

  // add scanlines
  cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;

  // interpolate between source and result by intensity
  cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );

  // convert to grayscale if desired
  if(grayscale) {

    cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );

  }

  gl_FragColor =  vec4( cResult, cTextureScreen.a );
}
