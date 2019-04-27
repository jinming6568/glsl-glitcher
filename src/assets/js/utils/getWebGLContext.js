export default function (canvas) {
  let gl;
  let glContextNames = ['webgl', 'experimental-webgl'];
  for (let i = 0; i < glContextNames.length; i ++) {
    try {
      gl = canvas.getContext(glContextNames[i],{
        // premultipliedAlpha:false
      });
    } catch (e) {
      //
    }
  }
  return gl
}
