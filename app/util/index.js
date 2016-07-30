
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
      return node.join('');
    });
    return nodes.includes( head.join('') );
  }

};
