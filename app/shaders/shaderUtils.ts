export async function loadShader(path: string): Promise<string> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load shader: ${path}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading shader:', error);
    return '';
  }
}

export const paperBurnVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normal;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const paperBurnFragmentShader = `
uniform float burnValue;
uniform float time;
uniform vec3 burnColor;
uniform vec3 emberColor;
uniform float noiseScale;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// 高品質なノイズ関数（Simplex noise approximation）
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// フラクタルノイズ（複数オクターブ）
float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  
  for (int i = 0; i < 6; i++) {
    value += amplitude * snoise(st);
    st *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// 燃焼パターン生成
float getBurnPattern(vec2 uv, float burnVal, float t) {
  // 複数スケールのノイズを組み合わせ
  float largeNoise = fbm(uv * 3.0 + t * 0.05);      // 大きな燃焼パターン
  float mediumNoise = fbm(uv * 8.0 + t * 0.1);      // 中程度の詳細
  float smallNoise = fbm(uv * 20.0 + t * 0.2);      // 細かい燃焼の縁
  
  // 中心からの距離（燃焼の起点）
  vec2 center = vec2(0.5, 0.3); // 少し下から燃え始める
  float distFromCenter = distance(uv, center);
  
  // 燃焼の進行パターン
  float burnProgress = burnVal - distFromCenter * 0.8;
  
  // ノイズを重ね合わせて自然な燃焼境界を作成
  float combinedNoise = largeNoise * 0.4 + mediumNoise * 0.3 + smallNoise * 0.2;
  
  return burnProgress + combinedNoise * 0.3;
}

void main() {
  vec2 uv = vUv;
  
  // 燃焼パターンを計算
  float burnPattern = getBurnPattern(uv, burnValue, time);
  
  // 紙の基本色（わずかに黄ばんだ白）
  vec3 paperColor = vec3(0.96, 0.94, 0.88);
  
  // 燃焼段階の閾値
  float emberThreshold = -0.05;   // 赤い炎の境界
  float charThreshold = 0.1;      // 焦げ始める境界  
  float ashThreshold = 0.25;      // 灰になる境界
  float burnThreshold = 0.35;     // 完全に燃え尽きる境界
  
  if (burnPattern > burnThreshold) {
    // 完全に燃え尽きた部分 - 穴を開ける
    discard;
    
  } else if (burnPattern > ashThreshold) {
    // 灰の段階（薄いグレー）
    float ashIntensity = (burnPattern - ashThreshold) / (burnThreshold - ashThreshold);
    vec3 ashColor = vec3(0.7, 0.7, 0.7);
    vec3 darkAsh = vec3(0.3, 0.3, 0.3);
    vec3 finalColor = mix(ashColor, darkAsh, ashIntensity);
    
    // 灰は徐々に透明になる
    float alpha = 1.0 - ashIntensity * 0.7;
    gl_FragColor = vec4(finalColor, alpha);
    
  } else if (burnPattern > charThreshold) {
    // 焦げた段階（茶色→黒）
    float charIntensity = (burnPattern - charThreshold) / (ashThreshold - charThreshold);
    vec3 brownColor = vec3(0.4, 0.2, 0.1);    // 茶色
    vec3 charColor = vec3(0.15, 0.1, 0.05);   // 焦げ茶
    vec3 blackColor = vec3(0.05, 0.03, 0.02); // ほぼ黒
    
    vec3 finalColor;
    if (charIntensity < 0.5) {
      finalColor = mix(brownColor, charColor, charIntensity * 2.0);
    } else {
      finalColor = mix(charColor, blackColor, (charIntensity - 0.5) * 2.0);
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
    
  } else if (burnPattern > emberThreshold) {
    // 燃えている境界（赤い炎）
    float fireIntensity = (burnPattern - emberThreshold) / (charThreshold - emberThreshold);
    
    // 炎の色グラデーション
    vec3 deepRed = vec3(0.8, 0.1, 0.0);      // 深い赤
    vec3 brightOrange = vec3(1.0, 0.4, 0.0); // 明るいオレンジ
    vec3 yellow = vec3(1.0, 0.8, 0.2);       // 黄色
    
    vec3 fireColor;
    if (fireIntensity < 0.5) {
      fireColor = mix(deepRed, brightOrange, fireIntensity * 2.0);
    } else {
      fireColor = mix(brightOrange, yellow, (fireIntensity - 0.5) * 2.0);
    }
    
    // 炎の動的な揺らぎ
    float flicker1 = sin(time * 8.0 + uv.x * 15.0 + uv.y * 10.0) * 0.15 + 0.85;
    float flicker2 = sin(time * 12.0 + uv.y * 20.0) * 0.1 + 0.9;
    float totalFlicker = flicker1 * flicker2;
    
    fireColor *= totalFlicker;
    
    // 炎の縁は少し透明に
    float fireAlpha = 0.9 + fireIntensity * 0.1;
    gl_FragColor = vec4(fireColor, fireAlpha);
    
  } else {
    // 通常の紙
    // 微細なテクスチャを追加
    float paperNoise = snoise(uv * 50.0) * 0.02;
    vec3 finalPaperColor = paperColor + paperNoise;
    
    gl_FragColor = vec4(finalPaperColor, 1.0);
  }
}
`; 