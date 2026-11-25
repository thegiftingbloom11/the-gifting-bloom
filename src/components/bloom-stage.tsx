import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { storyPose } from "@/lib/bloom-choreography";
import { ease } from "@/lib/bloom-timing";
import castImage from "@/assets/story-cast-illustration.webp";
import bouquetImage from "@/assets/story-sunflower-bouquet.webp";
import gripImage from "@/assets/story-grip.webp";
import walkingArt from "@/assets/story-walking-legs.webp";
import type { WalkingLegArt } from "./bloom-walk-rig";
import { artworkSprite, prepareArtwork } from "./bloom-art-sprite";
import {
  makeIllustratedCharacter,
  poseIllustratedCharacter,
  type CharacterArt,
  type GripArt,
} from "./bloom-cast";

export type Playhead = { time: number; render?: (() => void) | undefined };
const shadeGeo = new THREE.CircleGeometry(1, 56);
const shadeMat = [1, 0.72, 0.47].map(
  (scale) =>
    new THREE.MeshBasicMaterial({
      color: "#794b5b",
      transparent: true,
      opacity: 0.065 * scale,
      depthWrite: false,
    }),
);

const man: CharacterArt = {
  frame: [169, 15, 553, 1009],
  ground: [335, 1010],
  shoulder: [393, 265],
  elbow: [453, 370],
  grip: [621, 371],
  gripWrist: [552, 376],
  freeShoulder: [253, 234],
  freeWrist: [263, 522],
  restingWrist: [260, 524],
  tuckedSleeveEdge: [
    [420, 242],
    [410, 280],
    [410, 405],
    [423, 442],
  ],
  restingHand: [
    [244, 519],
    [259, 517],
    [275, 515],
    [277, 524],
    [282, 535],
    [290, 547],
    [293, 559],
    [296, 579],
    [293, 588],
    [293, 598],
    [290, 601],
    [286, 596],
    [286, 604],
    [288, 613],
    [285, 619],
    [281, 619],
    [276, 615],
    [272, 616],
    [266, 611],
    [262, 605],
    [255, 601],
    [249, 597],
    [243, 593],
    [242, 575],
    [242, 555],
    [245, 541],
    [244, 529],
  ],
  restingAnkles: [269, 365],
  legFade: [467, 565],
  handOutline: [298, 620],
  entryDistance: 3.01,
  closingDistance: 0.46,
  height: 3.08,
  facing: 1,
};
const woman: CharacterArt = {
  frame: [802, 75, 576, 949],
  ground: [1171, 1008],
  shoulder: [1139, 285],
  elbow: [1055, 402],
  grip: [927, 375],
  gripWrist: [972, 381],
  freeShoulder: [1240, 305],
  freeWrist: [1247, 551],
  restingWrist: [1249, 536],
  restingHand: [
    [1238, 531],
    [1250, 530],
    [1262, 532],
    [1261, 548],
    [1259, 562],
    [1261, 578],
    [1264, 593],
    [1262, 608],
    [1260, 614],
    [1254, 621],
    [1248, 626],
    [1241, 632],
    [1235, 638],
    [1231, 638],
    [1228, 635],
    [1231, 626],
    [1234, 617],
    [1234, 604],
    [1231, 594],
    [1230, 606],
    [1232, 611],
    [1229, 618],
    [1225, 618],
    [1224, 612],
    [1222, 603],
    [1221, 594],
    [1222, 581],
    [1227, 565],
    [1233, 554],
    [1236, 540],
  ],
  restingAnkles: [1166, 1211],
  legFade: [881, 902],
  entryDistance: 3.15,
  closingDistance: 0.37,
  skirt: true,
  height: 2.89,
  facing: -1,
};

const manGrip: GripArt = {
  frame: [164, 159, 640, 389],
  anchor: [744, 307],
  wrist: [190, 438],
  scale: 0.00043,
};
const womanGrip: GripArt = {
  frame: [1373, 195, 651, 364],
  anchor: [1427, 313],
  wrist: [1973, 468],
  scale: 0.00038,
};
const trouserLeg: WalkingLegArt = {
  frame: [257, 64, 369, 944],
  hip: [421, 104],
  knee: [399, 511],
  ankle: [372, 892],
  heel: [325, 987],
  toe: [582, 984],
  shoeTop: 872,
  scale: 0.0018,
};
const dressLeg: WalkingLegArt = {
  frame: [929, 426, 310, 583],
  hip: [1148, 474],
  knee: [1159, 697],
  ankle: [1154, 892],
  heel: [1193, 987],
  toe: [954, 985],
  shoeTop: 876,
  scale: 0.00125,
};
const bouquetScale = 0.00081;
const bouquetKnot = [437, 941] as const;
const ribbons = [
  { frame: [864, 72, 132, 1100], anchor: [930, 83], angle: -0.25 },
  { frame: [1064, 72, 123, 1100], anchor: [1135, 83], angle: 0.22 },
] as const;

function createBouquet(texture: THREE.Texture) {
  const group = new THREE.Group();
  const wrap = artworkSprite(texture, [0, 0, 856, 1180], bouquetKnot, bouquetScale);
  wrap.renderOrder = 3;
  const tails = ribbons.map(({ frame, anchor, angle }) => {
    const sprite = artworkSprite(texture, frame, anchor, bouquetScale);
    sprite.renderOrder = 3.1;
    sprite.scale.set(0.54, 0.32, 1);
    sprite.position.set(angle * 0.055, -0.007, 0.02);
    return { sprite, angle };
  });
  group.add(wrap, ...tails.map(({ sprite }) => sprite));
  return { group, wrap, tails };
}

function createStage(
  cast: THREE.Texture,
  bouquetTexture: THREE.Texture,
  hands: THREE.Texture,
  legs: THREE.Texture,
) {
  const stage = new THREE.Group();
  prepareArtwork(bouquetTexture);
  prepareArtwork(hands);
  prepareArtwork(legs);
  const boy = makeIllustratedCharacter(prepareArtwork(cast), man, hands, manGrip, legs, trouserLeg);
  const girl = makeIllustratedCharacter(cast, woman, hands, womanGrip, legs, dressLeg);
  const bouquet = createBouquet(bouquetTexture);
  stage.add(boy.root, girl.root, bouquet.group);
  const shadows = [boy, girl].map(() =>
    shadeMat.map((material, index) => {
      const shadow = new THREE.Mesh(shadeGeo, material);
      shadow.scale.set(0.59 - index * 0.115, 0.29 - index * 0.043, 1);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.002 + index * 0.001;
      stage.add(shadow);
      return shadow;
    }),
  );
  return { stage, boy, girl, bouquet, shadows };
}

function Scene({ playhead, onReady }: { playhead: Playhead; onReady: () => void }) {
  const { invalidate, camera, size, gl } = useThree();
  const textures = useLoader(THREE.TextureLoader, [castImage, bouquetImage, gripImage, walkingArt]);
  const set = useMemo(
    () => createStage(textures[0]!, textures[1]!, textures[2]!, textures[3]!),
    [textures],
  );
  useEffect(() => {
    playhead.render = invalidate;
    const canvas = gl.domElement;
    function contextLost(event: Event) {
      event.preventDefault();
    }
    const contextRestored = () => invalidate();
    canvas.addEventListener("webglcontextlost", contextLost);
    canvas.addEventListener("webglcontextrestored", contextRestored);
    onReady();
    return () => {
      playhead.render = undefined;
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      for (const sprite of [
        set.bouquet.wrap,
        ...set.bouquet.tails.map(({ sprite }) => sprite),
        set.boy.fingers,
        set.girl.fingers,
        set.boy.restingHand,
        set.girl.restingHand,
        ...set.boy.legs.map(({ sprite }) => sprite),
        ...set.girl.legs.map(({ sprite }) => sprite),
      ]) {
        sprite.geometry.dispose();
        sprite.material.dispose();
      }
      for (const actor of [set.boy, set.girl]) {
        actor.geometry.dispose();
        actor.material.dispose();
      }
    };
  }, [playhead, invalidate, onReady, gl, set]);
  useFrame(() => {
    const t = playhead.time;
    const pose = storyPose(t);
    const ortho = camera as THREE.OrthographicCamera;
    const ratio = size.width / Math.max(1, size.height);
    const closeUp = ease(t, 4.34, 4.91) * (1 - ease(t, 5.32, 5.98));
    const portrait = 1 - ease(ratio, 0.7, 0.96);
    const meeting = ease(t, 3.14, 3.9);
    const pairWidth = THREE.MathUtils.clamp(pose.girlX - pose.boyX + 1.34, 3.52, 4.45);
    const portraitWidth = THREE.MathUtils.lerp(2.52, pairWidth, meeting);
    const frameWidth = THREE.MathUtils.lerp(4.24 - 0.64 * closeUp, portraitWidth, portrait);
    const vertical =
      Math.max(3.8 - 0.48 * closeUp, frameWidth / Math.max(0.1, ratio)) + 0.28 * ease(t, 5.85, 6.8);
    ortho.top = vertical / 2;
    ortho.bottom = -vertical / 2;
    ortho.left = (-vertical * ratio) / 2;
    ortho.right = (vertical * ratio) / 2;
    const widePan =
      -0.43 * ease(t, 1.23, 2.38) + 0.59 * ease(t, 2.73, 3.96) - 0.16 * ease(t, 4.14, 5.55);
    const portraitPan = THREE.MathUtils.lerp(
      pose.boyX + 0.22,
      (pose.boyX + pose.girlX) / 2 + 0.04,
      meeting,
    );
    const pan = THREE.MathUtils.lerp(widePan, portraitPan, portrait);
    ortho.position.set(pan, 2.05 + 0.78 * (1 - ease(t, 0.24, 1.46)), 8);
    ortho.lookAt(pan, 1.41 + 0.18 * closeUp, 0.04);
    ortho.updateProjectionMatrix();
    set.boy.root.visible = t > 1.17;
    set.girl.root.visible = t > 2.5;
    poseIllustratedCharacter(
      set.boy,
      pose.boyX,
      pose.boyWalk,
      pose.boyStep,
      t,
      pose.boyContact,
      pose.boyGrip,
      pose.boyPalm,
      pose.boyArmRaise,
    );
    poseIllustratedCharacter(
      set.girl,
      pose.girlX,
      pose.girlWalk,
      pose.girlStep,
      t,
      pose.girlContact,
      pose.girlGrip,
      pose.girlPalm,
      pose.girlContact,
    );
    for (const [i, shadows] of set.shadows.entries()) {
      const actor = i ? set.girl : set.boy;
      for (const shadow of shadows) {
        shadow.position.x = actor.root.position.x;
        shadow.visible = actor.root.visible;
      }
    }
    const { bouquet } = set;
    bouquet.group.visible = set.boy.root.visible;
    bouquet.group.position.copy(pose.bouquet);
    bouquet.group.rotation.z = pose.tilt;
    for (const { sprite, angle } of bouquet.tails) {
      sprite.rotation.z = angle + pose.ribbonSway * (angle < 0 ? 1 : 0.73);
    }
  });
  return <primitive object={set.stage} />;
}

export default function BloomStage({
  playhead,
  onReady,
}: {
  playhead: Playhead;
  onReady: () => void;
}) {
  const touchScreen = window.matchMedia("(pointer: coarse)").matches;
  return (
    <Canvas
      orthographic
      camera={{ near: 0.01, far: 24, position: [0, 2.05, 8] }}
      frameloop="demand"
      dpr={[1, touchScreen ? 1 : 1.35]}
      gl={{ alpha: true, antialias: true }}
    >
      <Scene playhead={playhead} onReady={onReady} />
    </Canvas>
  );
}
