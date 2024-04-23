export const hexToRgb = (hex) => {
  // Remove the hash (#) if it's there
  hex = hex.replace(/^#/, "");

  // Convert the hex values to RGB
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  // Return the RGB color
  return `rgb(${r}, ${g}, ${b})`;
};
