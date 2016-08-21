
export default {

  /**
   * Takes 2 3-dimensional arrays and adds them
   */
  addNodes( a, b ) {
    return [ a[0]+b[0], a[1]+b[1], a[2]+b[2] ];
  },

  /**
   * Checks to see if a head node is included in a list of nodes
   */
  isNodeIncluded( head, nodes ) {
    nodes = nodes.map((node) => {
      return node.join('$');
    });
    return nodes.includes( head.join('$') );
  },

  hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
  },

  rgbToHex(r, g, b) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  colorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i*2,2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00"+c).substr(c.length);
    }

    return rgb;
  },

  assignKeys( obj ) {
    for ( key in obj ) {
      this[key] = obj[key];
    }
  }
  
};
