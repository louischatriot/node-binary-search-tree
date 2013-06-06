/**
 * Self-balancing binary search tree using the AVL implementation
 */
var BinarySearchTree = require('./bst')
  , customUtils = require('./customUtils')
  , util = require('util')
  ;

/**
 * Constructor
 * @param {Object} options Optional
 * @param {Boolean}  options.unique Whether to enforce a 'unique' constraint on the key or not
 * @param {Key}      options.key Initialize this BST's key with key
 * @param {Value}    options.value Initialize this BST's data with [value]
 * @param {Function} options.compareKeys Initialize this BST's compareKeys
 */
function AVLTree (options) {
  options = options || {};

  this.left = null;
  this.right = null;
  this.parent = options.parent !== undefined ? options.parent : null;
  this.key = options.key !== undefined ? options.key : null;
  this.data = options.value ? [options.value] : [];
  this.unique = options.unique || false;

  this.compareKeys = options.compareKeys || customUtils.defaultCompareKeysFunction;
  this.checkValueEquality = options.checkValueEquality || customUtils.defaultCheckValueEquality;
}


/**
 * Inherit basic functions from the basic binary search tree
 */
util.inherits(AVLTree, BinarySearchTree);


/**
 * Check the recorded height is correct for every node
 * Throws if one height doesn't match
 */
AVLTree.prototype.checkHeightCorrect = function () {
  var leftH, rightH;

  if (!this.key) { return; }   // Empty tree

  if (this.left && this.left.height === undefined) { throw "Undefined height for node " + this.left.key; }
  if (this.right && this.right.height === undefined) { throw "Undefined height for node " + this.right.key; }
  if (this.height === undefined) { throw "Undefined height for node " + this.key; }

  leftH = this.left ? this.left.height : 0;
  rightH = this.right ? this.right.height : 0;


  if (this.height !== 1 + Math.max(leftH, rightH)) { throw "Height constraint failed for node " + this.key; }
  if (this.left) { this.left.checkHeightCorrect(); }
  if (this.right) { this.right.checkHeightCorrect(); }
};


/**
 * Insert a key, value pair in the tree while maintaining the AVL tree height constraint
 */
AVLTree.prototype.insert = function (key, value) {
  var insertPath = [], currentNode = this, i;

  // Empty tree, insert as root
  if (this.key === null) {
    this.key = key;
    this.data.push(value);
    this.height = 1;
    return;
  }

  // Insert new leaf at the right place
  while (true) {
    // Same key: no change in the tree structure
    if (currentNode.compareKeys(currentNode.key, key) === 0) {
      if (currentNode.unique) {
        throw { message: "Can't insert key " + key + ", it violates the unique constraint"
              , key: key
              , errorType: 'uniqueViolated'
              };
      } else {
        currentNode.data.push(value);
      }
      return;
    }

    insertPath.push(currentNode);

    if (currentNode.compareKeys(key, currentNode.key) < 0) {
      if (!currentNode.left) {
        insertPath.push(currentNode.createLeftChild({ key: key, value: value }));
        break;
      } else {
        currentNode = currentNode.left;
      }
    } else {
      if (!currentNode.right) {
        insertPath.push(currentNode.createRightChild({ key: key, value: value }));
        break;
      } else {
        currentNode = currentNode.right;
      }
    }
  }

  // Update all heights
  for (i = currentNode.length - 2; i >= 0; i -= 1) {
    if (currentNode[i].height >= currentNode[i+1].height + 1) {
      break;   // From that point on the nodes height wasn't changed by this insertion
    } else {
      currentNode[i].height = currentNode[i+1].height + 1;
    }
  }
};




// Interface
module.exports = AVLTree;
