export function fitDiagram(
  width: number,
  height: number,
  boxWidth: number,
  boxHeight: number,
  maximum = 1,
) {
  if (width <= 0 || height <= 0 || boxWidth <= 0 || boxHeight <= 0) return { width: 0, height: 0 }
  const scale = Math.max(0, Math.min(boxWidth / width, boxHeight / height, maximum))
  return { width: width * scale, height: height * scale }
}
