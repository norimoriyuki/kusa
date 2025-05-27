uniform float burnValue;
uniform float time;
uniform vec3 burnColor;
uniform vec3 emberColor;
uniform float noiseScale;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// ノイズ関数（Simplex noise approximation）
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 0.0;
  
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(st);
    st *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 st = vUv * noiseScale;
  
  // 時間による動的ノイズ
  float dynamicNoise = fbm(st + time * 0.1);
  
  // 燃焼の進行度を計算（中心から外側へ）
  vec2 center = vec2(0.5, 0.5);
  float distanceFromCenter = distance(vUv, center);
  
  // 燃焼パターン（不規則な境界）
  float burnPattern = burnValue + dynamicNoise * 0.3 - distanceFromCenter * 0.5;
  
  // 紙の基本色
  vec3 paperColor = vec3(0.95, 0.92, 0.85);
  
  // 燃焼段階の判定（順序を修正：赤い炎→焦げ→燃え尽き）
  float fireThreshold = -0.1;    // 炎が現れる境界
  float charThreshold = 0.05;    // 焦げ始める境界
  float burnThreshold = 0.1;     // 完全に燃え尽きる境界
  
  if (burnPattern > burnThreshold) {
    // 完全に燃え尽きた部分
    discard;
  } else if (burnPattern > charThreshold) {
    // 焦げた部分（黒）
    float charIntensity = (burnPattern - charThreshold) / (burnThreshold - charThreshold);
    vec3 charColor = vec3(0.1, 0.05, 0.02);
    vec3 finalColor = mix(charColor, vec3(0.0, 0.0, 0.0), charIntensity);
    
    gl_FragColor = vec4(finalColor, 1.0);
  } else if (burnPattern > fireThreshold) {
    // 燃えている境界部分（赤い炎）
    float fireIntensity = (burnPattern - fireThreshold) / (charThreshold - fireThreshold);
    vec3 finalColor = mix(emberColor, burnColor, fireIntensity);
    
    // 炎の揺らぎ
    float flicker = sin(time * 10.0 + vUv.x * 20.0) * 0.1 + 0.9;
    finalColor *= flicker;
    
    gl_FragColor = vec4(finalColor, 1.0);
  } else {
    // 通常の紙
    gl_FragColor = vec4(paperColor, 1.0);
  }
} 