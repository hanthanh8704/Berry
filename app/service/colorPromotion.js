export default function colorPromotion(discountValue) {
  const red = [255, 0, 0];
  const green = [255, 255, 0];
  const interpolatedColor = [
    Math.round(
      (1 - discountValue / 100) * green[0] + (discountValue / 100) * red[0]
    ),
    Math.round(
      (1 - discountValue / 100) * green[1] + (discountValue / 100) * red[1]
    ),
    Math.round(
      (1 - discountValue / 100) * green[2] + (discountValue / 100) * red[2]
    ),
  ];

  return `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`;
}
