import * as THREE from 'three';
import { LSystemConfig } from './lsystem';

interface TurtleState {
  position: THREE.Vector3;
  direction: THREE.Vector3;
  up: THREE.Vector3;
  right: THREE.Vector3;
  length: number;
  thickness: number;
}

export class PlantGeometry {
  private config: LSystemConfig;
  private vertices: number[] = [];
  private indices: number[] = [];
  private colors: number[] = [];

  constructor(config: LSystemConfig) {
    this.config = config;
  }

  generateGeometry(lSystemString: string): THREE.BufferGeometry {
    this.vertices = [];
    this.indices = [];
    this.colors = [];

    const stack: TurtleState[] = [];
    let currentState: TurtleState = {
      position: new THREE.Vector3(0, 0, 0),
      direction: new THREE.Vector3(0, 1, 0),
      up: new THREE.Vector3(0, 0, 1),
      right: new THREE.Vector3(1, 0, 0),
      length: this.config.length,
      thickness: this.config.thickness
    };

    let vertexIndex = 0;

    for (const char of lSystemString) {
      switch (char) {
        case 'F':
        case 'A':
          // 前進して線分を描画
          this.drawSegment(currentState, vertexIndex);
          vertexIndex += 8; // 円柱は8頂点

          // 位置を更新
          const moveVector = currentState.direction.clone().multiplyScalar(currentState.length);
          currentState.position.add(moveVector);
          
          // 長さと太さを減衰
          currentState.length *= this.config.lengthDecay;
          currentState.thickness *= this.config.thicknessDecay;
          break;

        case 'L':
          // 葉を描画
          this.drawLeaf(currentState, vertexIndex);
          vertexIndex += 6; // 葉は6頂点（2つの三角形）
          break;

        case '+':
          // Z軸周りの右回転
          this.rotateAroundAxis(currentState, currentState.up, this.config.angle);
          break;

        case '-':
          // Z軸周りの左回転
          this.rotateAroundAxis(currentState, currentState.up, -this.config.angle);
          break;

        case '&':
          // X軸周りの下向き回転
          this.rotateAroundAxis(currentState, currentState.right, this.config.angle);
          break;

        case '^':
          // X軸周りの上向き回転
          this.rotateAroundAxis(currentState, currentState.right, -this.config.angle);
          break;

        case '\\':
          // Y軸周りの右回転
          this.rotateAroundAxis(currentState, currentState.direction, this.config.angle);
          break;

        case '/':
          // Y軸周りの左回転
          this.rotateAroundAxis(currentState, currentState.direction, -this.config.angle);
          break;

        case '[':
          // 状態をスタックにプッシュ
          stack.push(this.cloneState(currentState));
          break;

        case ']':
          // 状態をスタックからポップ
          if (stack.length > 0) {
            currentState = stack.pop()!;
          }
          break;

        default:
          // その他の文字は無視
          break;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(this.colors, 3));
    geometry.setIndex(this.indices);
    geometry.computeVertexNormals();

    return geometry;
  }

  private drawSegment(state: TurtleState, startIndex: number): void {
    const startPos = state.position.clone();
    const endPos = startPos.clone().add(state.direction.clone().multiplyScalar(state.length));
    
    // 円柱の頂点を生成（簡略化して4角柱）
    const radius = state.thickness;
    const segments = 4;
    
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // 開始点の頂点
      const startVertex = startPos.clone().add(
        state.right.clone().multiplyScalar(x).add(state.up.clone().multiplyScalar(z))
      );
      this.vertices.push(startVertex.x, startVertex.y, startVertex.z);
      
      // 終了点の頂点
      const endVertex = endPos.clone().add(
        state.right.clone().multiplyScalar(x).add(state.up.clone().multiplyScalar(z))
      );
      this.vertices.push(endVertex.x, endVertex.y, endVertex.z);
      
      // 色を追加（茶色から緑へのグラデーション）
      const brown = new THREE.Color(0.4, 0.2, 0.1);
      const green = new THREE.Color(0.2, 0.6, 0.2);
      const t = Math.min(state.length / this.config.length, 1);
      const color = brown.clone().lerp(green, 1 - t);
      
      this.colors.push(color.r, color.g, color.b);
      this.colors.push(color.r, color.g, color.b);
    }
    
    // インデックスを追加
    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments;
      const base = startIndex + i * 2;
      const nextBase = startIndex + next * 2;
      
      // 側面の三角形
      this.indices.push(base, base + 1, nextBase);
      this.indices.push(nextBase, base + 1, nextBase + 1);
    }
  }

  private drawLeaf(state: TurtleState, startIndex: number): void {
    const leafSize = this.config.leafSize;
    const center = state.position.clone();
    
    // 葉の向きを3Dでランダムに変える
    const randomAngleY = (Math.random() - 0.5) * 120; // Y軸回転 -60度から+60度
    const randomAngleX = (Math.random() - 0.5) * 60;  // X軸回転 -30度から+30度
    const randomAngleZ = (Math.random() - 0.5) * 40;  // Z軸回転 -20度から+20度
    
    const leafDirection = state.direction.clone();
    const leafRight = state.right.clone();
    const leafUp = state.up.clone();
    
    // 3つの軸でランダム回転を適用
    const rotY = new THREE.Matrix4().makeRotationAxis(leafDirection, randomAngleY * Math.PI / 180);
    const rotX = new THREE.Matrix4().makeRotationAxis(leafRight, randomAngleX * Math.PI / 180);
    const rotZ = new THREE.Matrix4().makeRotationAxis(leafUp, randomAngleZ * Math.PI / 180);
    
    leafDirection.applyMatrix4(rotY).applyMatrix4(rotX).applyMatrix4(rotZ);
    leafRight.applyMatrix4(rotY).applyMatrix4(rotX).applyMatrix4(rotZ);
    leafUp.applyMatrix4(rotY).applyMatrix4(rotX).applyMatrix4(rotZ);
    
    // 楕円形の葉を作成（より3D的な形状）
    const leafRightVec = leafRight.clone().multiplyScalar(leafSize * 0.4);
    const leafUpVec = leafDirection.clone().multiplyScalar(leafSize);
    const leafDepthVec = leafUp.clone().multiplyScalar(leafSize * 0.1); // 深さを追加
    
    // 葉の頂点を定義（3D的な配置）
    const tip = center.clone().add(leafUpVec);
    const leftBase = center.clone().add(leafRightVec.clone().multiplyScalar(-1)).add(leafDepthVec.clone().multiplyScalar(0.5));
    const rightBase = center.clone().add(leafRightVec).add(leafDepthVec.clone().multiplyScalar(-0.5));
    const leftMid = center.clone().add(leafUpVec.clone().multiplyScalar(0.4)).add(leafRightVec.clone().multiplyScalar(-0.8));
    const rightMid = center.clone().add(leafUpVec.clone().multiplyScalar(0.4)).add(leafRightVec.clone().multiplyScalar(0.8));
    const base = center.clone().add(leafUpVec.clone().multiplyScalar(-0.2));
    
    // 頂点を追加
    this.vertices.push(tip.x, tip.y, tip.z);
    this.vertices.push(leftMid.x, leftMid.y, leftMid.z);
    this.vertices.push(rightMid.x, rightMid.y, rightMid.z);
    this.vertices.push(leftBase.x, leftBase.y, leftBase.z);
    this.vertices.push(rightBase.x, rightBase.y, rightBase.z);
    this.vertices.push(base.x, base.y, base.z);
    
    // 葉の色（より多様な緑色）
    const leafColors = [
      new THREE.Color(0.1, 0.7, 0.1),
      new THREE.Color(0.2, 0.8, 0.2),
      new THREE.Color(0.15, 0.6, 0.15),
      new THREE.Color(0.3, 0.9, 0.3),
      new THREE.Color(0.05, 0.5, 0.05),
      new THREE.Color(0.25, 0.75, 0.25)
    ];
    const leafColor = leafColors[Math.floor(Math.random() * leafColors.length)];
    
    // 各頂点に色を追加
    for (let i = 0; i < 6; i++) {
      this.colors.push(leafColor.r, leafColor.g, leafColor.b);
    }
    
    // インデックスを追加（両面描画のため表裏両方）
    // 表面
    this.indices.push(startIndex, startIndex + 1, startIndex + 2);
    this.indices.push(startIndex + 1, startIndex + 3, startIndex + 5);
    this.indices.push(startIndex + 2, startIndex + 5, startIndex + 4);
    this.indices.push(startIndex + 1, startIndex + 5, startIndex + 2);
    
    // 裏面（法線を逆にするため頂点順序を逆に）
    this.indices.push(startIndex, startIndex + 2, startIndex + 1);
    this.indices.push(startIndex + 1, startIndex + 5, startIndex + 3);
    this.indices.push(startIndex + 2, startIndex + 4, startIndex + 5);
    this.indices.push(startIndex + 1, startIndex + 2, startIndex + 5);
  }

  private rotateAroundAxis(state: TurtleState, axis: THREE.Vector3, angle: number): void {
    const radians = (angle * Math.PI) / 180;
    const rotationMatrix = new THREE.Matrix4().makeRotationAxis(axis.clone().normalize(), radians);
    
    state.direction.applyMatrix4(rotationMatrix);
    state.up.applyMatrix4(rotationMatrix);
    state.right.applyMatrix4(rotationMatrix);
    
    // ベクトルを正規化
    state.direction.normalize();
    state.up.normalize();
    state.right.normalize();
    
    // 直交性を保つために再計算
    state.right = state.direction.clone().cross(state.up).normalize();
    state.up = state.right.clone().cross(state.direction).normalize();
  }

  private cloneState(state: TurtleState): TurtleState {
    return {
      position: state.position.clone(),
      direction: state.direction.clone(),
      up: state.up.clone(),
      right: state.right.clone(),
      length: state.length,
      thickness: state.thickness
    };
  }
} 