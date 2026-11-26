export const timelineEnd = 8;
export const ease = (time: number, start: number, end: number) => {
  const progress = Math.min(1, Math.max(0, (time - start) / (end - start)));
  return progress * progress * (3 - 2 * progress);
};

export const gardenStart = 8.2;
const gardenEntry = 1.64;
export const storyEnd = gardenStart + timelineEnd - gardenEntry;
export const gardenTimeAt = (time: number) => Math.max(0, time - gardenStart + gardenEntry);

// Repeating a time gives the viewer room to see the result before the next scene.
const scrollBeats = [
  [0, 0],
  [0.07, 1.02],
  [0.145, 2.48],
  [0.18, 2.48], // Instagram profile
  [0.25, 3.54],
  [0.295, 4.16],
  [0.325, 4.16], // Bouquet and order button
  [0.38, 4.98],
  [0.425, 4.98], // Order confirmation
  [0.505, 6.46],
  [0.528, 6.46], // Parcel arrives
  [0.582, 7.58],
  [0.62, 7.58], // Bouquet and smile
  [0.71, 9.49],
  [0.79, 10.65],
  [0.87, 11.54],
  [0.923, 12.8],
  [0.949, 12.8], // Heart backdrop
  [0.984, storyEnd],
  [1, storyEnd],
] as const;

export function storyTimeAtScroll(progress: number) {
  if (progress <= 0) return 0;
  for (let index = 1; index < scrollBeats.length; index++) {
    const [end, endTime] = scrollBeats[index]!;
    if (progress <= end) {
      const [start, startTime] = scrollBeats[index - 1]!;
      return startTime + ((progress - start) / (end - start)) * (endTime - startTime);
    }
  }
  return storyEnd;
}
