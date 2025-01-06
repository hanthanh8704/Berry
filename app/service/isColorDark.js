export function isColorDark(color) {
  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);

  let brightness = (r + g + b) / 3;
  return brightness < 200;
}
