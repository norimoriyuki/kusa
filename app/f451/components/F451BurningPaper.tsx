'use client';

import { useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 華氏451専用のシェーダー
const f451VertexShader = `
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

const f451FragmentShader = `
uniform float burnValue;
uniform float time;
uniform vec3 burnColor;
uniform vec3 emberColor;
uniform vec3 ignitionPoint1;
uniform vec3 ignitionPoint2;
uniform vec3 ignitionPoint3;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// 高品質なノイズ関数
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

// 複数の発火点から燃え広がるパターン
float getBurnPattern(vec2 uv, float burnVal, float t) {
  // 3つの発火点からの距離を計算
  float dist1 = distance(uv, ignitionPoint1.xy);
  float dist2 = distance(uv, ignitionPoint2.xy);
  float dist3 = distance(uv, ignitionPoint3.xy);
  
  // 各発火点の強度（時間差で発火）
  float intensity1 = ignitionPoint1.z;
  float intensity2 = ignitionPoint2.z;
  float intensity3 = ignitionPoint3.z;
  
  // 複数スケールのノイズ
  float largeNoise = fbm(uv * 2.0 + t * 0.03);
  float mediumNoise = fbm(uv * 6.0 + t * 0.08);
  float smallNoise = fbm(uv * 15.0 + t * 0.15);
  
  // 各発火点からの燃焼進行を計算
  float burnProgress1 = (burnVal * intensity1) - dist1 * 1.5;
  float burnProgress2 = (burnVal * intensity2) - dist2 * 1.5;
  float burnProgress3 = (burnVal * intensity3) - dist3 * 1.5;
  
  // 最も進んでいる燃焼を採用（複数の火が合流する効果）
  float maxBurnProgress = max(max(burnProgress1, burnProgress2), burnProgress3);
  
  // ノイズを重ね合わせて自然な燃焼境界
  float combinedNoise = largeNoise * 0.4 + mediumNoise * 0.3 + smallNoise * 0.2;
  
  return maxBurnProgress + combinedNoise * 0.25;
}

void main() {
  vec2 uv = vUv;
  
  // 燃焼パターンを計算
  float burnPattern = getBurnPattern(uv, burnValue, time);
  
  // 古い紙の色（少し黄ばんだ白）
  vec3 paperColor = vec3(0.95, 0.92, 0.85);
  
  // 燃焼段階の閾値
  float emberThreshold = -0.05;
  float charThreshold = 0.08;
  float ashThreshold = 0.2;
  float burnThreshold = 0.3;
  
  if (burnPattern > burnThreshold) {
    // 完全に燃え尽きた部分 - 透明にして背景の文字を見せる
    discard;
    
  } else if (burnPattern > ashThreshold) {
    // 灰の段階
    float ashIntensity = (burnPattern - ashThreshold) / (burnThreshold - ashThreshold);
    vec3 ashColor = vec3(0.6, 0.6, 0.6);
    vec3 darkAsh = vec3(0.2, 0.2, 0.2);
    vec3 finalColor = mix(ashColor, darkAsh, ashIntensity);
    
    float alpha = 1.0 - ashIntensity * 0.8;
    gl_FragColor = vec4(finalColor, alpha);
    
  } else if (burnPattern > charThreshold) {
    // 焦げた段階
    float charIntensity = (burnPattern - charThreshold) / (ashThreshold - charThreshold);
    vec3 brownColor = vec3(0.5, 0.3, 0.15);
    vec3 charColor = vec3(0.2, 0.15, 0.1);
    vec3 blackColor = vec3(0.08, 0.06, 0.04);
    
    vec3 finalColor;
    if (charIntensity < 0.5) {
      finalColor = mix(brownColor, charColor, charIntensity * 2.0);
    } else {
      finalColor = mix(charColor, blackColor, (charIntensity - 0.5) * 2.0);
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
    
  } else if (burnPattern > emberThreshold) {
    // 燃えている境界
    float fireIntensity = (burnPattern - emberThreshold) / (charThreshold - emberThreshold);
    
    vec3 deepRed = vec3(0.9, 0.1, 0.0);
    vec3 brightOrange = vec3(1.0, 0.5, 0.0);
    vec3 yellow = vec3(1.0, 0.9, 0.3);
    
    vec3 fireColor;
    if (fireIntensity < 0.5) {
      fireColor = mix(deepRed, brightOrange, fireIntensity * 2.0);
    } else {
      fireColor = mix(brightOrange, yellow, (fireIntensity - 0.5) * 2.0);
    }
    
    // 炎の揺らぎ
    float flicker1 = sin(time * 6.0 + uv.x * 12.0 + uv.y * 8.0) * 0.2 + 0.8;
    float flicker2 = sin(time * 9.0 + uv.y * 15.0) * 0.15 + 0.85;
    fireColor *= flicker1 * flicker2;
    
    gl_FragColor = vec4(fireColor, 1.0);
    
  } else {
    // 通常の紙
    float paperNoise = snoise(uv * 40.0) * 0.03;
    vec3 finalPaperColor = paperColor + paperNoise;
    
    gl_FragColor = vec4(finalPaperColor, 1.0);
  }
}
`;

interface F451BurningPaperProps {
  burnSpeed?: number;
  autoStart?: boolean;
  onBurnComplete?: () => void;
}

export interface F451BurningPaperRef {
  reset: () => void;
  start: () => void;
  getBurnValue: () => number;
}

export const F451BurningPaper = forwardRef<F451BurningPaperRef, F451BurningPaperProps>(({ 
  burnSpeed = 0.005,
  autoStart = false,
  onBurnComplete 
}, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const burnValueRef = useRef(autoStart ? -0.8 : -1.0);
  const timeRef = useRef(0);

  const shaderMaterial = useMemo(() => {
    // ランダムな発火点を3つ生成
    const generateRandomIgnitionPoints = () => {
      const points = [];
      for (let i = 0; i < 3; i++) {
        points.push(new THREE.Vector3(
          Math.random() * 0.8 + 0.1, // x: 0.1-0.9の範囲
          Math.random() * 0.8 + 0.1, // y: 0.1-0.9の範囲
          0.7 + Math.random() * 0.6   // z: 0.7-1.3の範囲（発火強度/タイミング）
        ));
      }
      return points;
    };

    const ignitionPoints = generateRandomIgnitionPoints();

    return new THREE.ShaderMaterial({
      vertexShader: f451VertexShader,
      fragmentShader: f451FragmentShader,
      uniforms: {
        burnValue: { value: burnValueRef.current },
        time: { value: 0 },
        burnColor: { value: new THREE.Color(1.0, 0.5, 0.0) },
        emberColor: { value: new THREE.Color(0.9, 0.1, 0.0) },
        ignitionPoint1: { value: ignitionPoints[0] },
        ignitionPoint2: { value: ignitionPoints[1] },
        ignitionPoint3: { value: ignitionPoints[2] }
      },
      transparent: true,
      side: THREE.DoubleSide,
      alphaTest: 0.1,
    });
  }, []);

  const resetBurn = () => {
    burnValueRef.current = -0.8;
    timeRef.current = 0;
    
    if (materialRef.current) {
      // 新しいランダムな発火点を生成
      const newIgnitionPoints = [];
      for (let i = 0; i < 3; i++) {
        newIgnitionPoints.push(new THREE.Vector3(
          Math.random() * 0.8 + 0.1, // x: 0.1-0.9の範囲
          Math.random() * 0.8 + 0.1, // y: 0.1-0.9の範囲
          0.7 + Math.random() * 0.6   // z: 0.7-1.3の範囲（発火強度/タイミング）
        ));
      }

      materialRef.current.uniforms.burnValue.value = burnValueRef.current;
      materialRef.current.uniforms.time.value = timeRef.current;
      materialRef.current.uniforms.ignitionPoint1.value = newIgnitionPoints[0];
      materialRef.current.uniforms.ignitionPoint2.value = newIgnitionPoints[1];
      materialRef.current.uniforms.ignitionPoint3.value = newIgnitionPoints[2];
    }
  };

  const startBurn = () => {
    if (burnValueRef.current >= 1.0) {
      resetBurn();
    }
  };

  const getBurnValue = () => burnValueRef.current;

  useImperativeHandle(ref, () => ({
    reset: resetBurn,
    start: startBurn,
    getBurnValue
  }));

  useFrame((state, delta) => {
    if (materialRef.current) {
      timeRef.current += delta;
      materialRef.current.uniforms.time.value = timeRef.current;

      if (autoStart && burnValueRef.current < 1.2) {
        // ゆっくりとした燃焼進行
        const windEffect = Math.sin(timeRef.current * 0.3) * 0.05 + 1.0;
        const finalBurnSpeed = burnSpeed * windEffect;
        
        burnValueRef.current += finalBurnSpeed * delta;
        materialRef.current.uniforms.burnValue.value = burnValueRef.current;

        if (burnValueRef.current >= 1.0 && onBurnComplete) {
          onBurnComplete();
        }
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/* 画面全体を覆う大きな平面 */}
      <planeGeometry args={[8, 6, 256, 192]} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={f451VertexShader}
        fragmentShader={f451FragmentShader}
        uniforms={shaderMaterial.uniforms}
        transparent={true}
        side={THREE.DoubleSide}
        alphaTest={0.1}
      />
    </mesh>
  );
});

F451BurningPaper.displayName = 'F451BurningPaper'; 