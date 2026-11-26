import { describe, expect, it } from "vitest";
import { contactEnd, contactStart, storyPose } from "@/lib/bloom-choreography";
import {
  gardenStart,
  gardenTimeAt,
  storyEnd,
  storyTimeAtScroll,
  timelineEnd,
} from "@/lib/bloom-timing";

describe("scroll timing", () => {
  it("gives the phone, confirmation, delivery and heart scenes space on the scroll track", () => {
    for (const [from, to, time] of [
      [0.15, 0.17, 2.48],
      [0.3, 0.32, 4.16],
      [0.39, 0.42, 4.98],
      [0.51, 0.52, 6.46],
      [0.59, 0.61, 7.58],
      [0.93, 0.94, 12.8],
    ] as const) {
      expect(storyTimeAtScroll(from)).toBe(time);
      expect(storyTimeAtScroll(to)).toBe(time);
    }
  });

  it("never reorders scenes along the track and reaches both endpoints", () => {
    expect(storyTimeAtScroll(-0.1)).toBe(0);
    let previous = 0;
    for (let step = 0; step <= 1000; step++) {
      const time = storyTimeAtScroll(step / 1000);
      expect(time).toBeGreaterThanOrEqual(previous);
      previous = time;
    }
    expect(previous).toBe(storyEnd);
    expect(storyTimeAtScroll(1.1)).toBe(storyEnd);
  });
});

describe("cinematic bouquet exchange", () => {
  it("plays the garden entrance and the original exchange after the shopping prologue", () => {
    expect(gardenTimeAt(0)).toBe(0);
    const entering = storyPose(gardenTimeAt(gardenStart));
    expect(entering.boyWalk).toBeGreaterThan(0);
    expect(entering.girlWalk).toBe(0);
    expect(entering.boyGrip).toBe(1);
    expect(gardenTimeAt(storyEnd)).toBeCloseTo(timelineEnd);
  });

  it("carries the bouquet beside the boy throughout his walk", () => {
    for (const time of [1.35, 1.7, 2.16, 2.55]) {
      const pose = storyPose(time);
      expect(pose.boyContact).toBe(1);
      expect(pose.boyGrip).toBe(1);
      expect(pose.boyArmRaise).toBe(0);
      expect(pose.girlGrip).toBe(0);
      expect(Math.abs(pose.bouquet.x - pose.boyX - 0.47)).toBeLessThan(0.056);
      expect(pose.boyPalm.y).toBeLessThan(pose.bouquet.y);
    }
    expect(storyPose(2.55).bouquet.x).toBeGreaterThan(storyPose(1.35).bouquet.x);
  });

  it("holds the wrapped handle in both rig targets before release", () => {
    for (const time of [contactStart, 5.02, 5.1]) {
      const pose = storyPose(time);
      expect(pose.boyContact).toBe(1);
      expect(pose.girlContact).toBe(1);
      expect(pose.boyArmRaise).toBe(1);
      expect(pose.boyPalm.distanceTo(pose.bouquet)).toBeLessThan(0.1);
      expect(pose.girlPalm.distanceTo(pose.bouquet)).toBeLessThan(0.1);
      for (const palm of [pose.boyPalm, pose.girlPalm]) {
        const dx = palm.x - pose.bouquet.x;
        const dy = palm.y - pose.bouquet.y;
        expect(dx * Math.cos(pose.tilt) + dy * Math.sin(pose.tilt)).toBeCloseTo(0);
      }
      expect(pose.girlPalm.y).toBeGreaterThan(pose.boyPalm.y);
    }
    expect(storyPose(5.1).girlGrip).toBe(1);
    expect(storyPose(5.44).boyGrip).toBe(0);
  });

  it("keeps the bouquet position continuous on approach, transfer and release", () => {
    for (const time of [1.26, 2.55, 4.05, contactStart, contactEnd, 5.73]) {
      expect(
        storyPose(time - 0.001).bouquet.distanceTo(storyPose(time + 0.001).bouquet),
      ).toBeLessThan(0.01);
    }
    expect(storyPose(5.73).bouquet.x).toBeGreaterThan(storyPose(contactEnd).bouquet.x);
  });
});
