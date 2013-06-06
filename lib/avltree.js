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

AVLTree.prototype.insert = function (key, value) {
  var insertPath = [], currentNode = this;

  // Empty tree, insert as root
  if (this.key === null) {
    this.key = key;
    this.data.push(value);
    return;
  }

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

    if (currentNode.compareKeys(key, currentNode.key) < 0) {
      if (!currentNode.left) {
        currentNode.createLeftChild({ key: key, value: value });
        break;
      } else {
        currentNode = currentNode.left;
      }
    } else {
      if (!currentNode.right) {
        currentNode.createRightChild({ key: key, value: value });
        break;
      } else {
        currentNode = currentNode.right;
      }
    }
  }
};




// Interface
module.exports = AVLTree;
