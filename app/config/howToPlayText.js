/*
  Text for the HowToPlayOverlay
  Each line has it's X position set here to offset properly.
  Lines have a fixed separation between them
  Font size is set in the overlay

  Object properties:
  x -> adds onto the base X value
  y -> overrides the indexed Y value, but still counts as an indexed line so other lines after it count its original placement
  size -> overrides the font size for this line
*/
module.exports = [
  { text: "Your snake can move", x: 430, size: 40 },
  {},
  { text: "in three dimensions!", x: 430, y: 0, size: 40 },
  {},
  {},
  {},
  {},
  {},
  {},
  { text: "Do some more stuff" },
  { text: "And some more!" },
];
