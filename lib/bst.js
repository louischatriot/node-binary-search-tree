/**
 * Simple binary search tree
 */

// Default compare function will work for numbers, strings and dates
function defaultCompareFunction (a, b) {
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  if (a === b) { return 0; }

  throw { message: "Couldn't compare elements", a: a, b: b };
}


/**
 * Constructor
 * @param {Object} options Optional
 * @param {Boolean}  options.unique Whether to enforce a 'unique' constraint on the key or not
 * @param {Key}      options.key Initialize this BST's key with key
 * @param {Value}    options.value Initialize this BST's data with [value]
 * @param {Function} options.compareKeys Initialize this BST's compareKeys
 */
function BinarySearchTree (options) {
  options = options || {};

  this.left = null;
  this.right = null;
  this.key = options.key || null;
  this.data = options.value ? [options.value] : [];
  this.unique = options.unique || false;

  this.compareKeys = options.compareKeys || defaultCompareFunction;
}


/**
 * Create a BST similar (i.e. same options except for key and value) to the current one
 * @param {Object} options see constructor
 */
BinarySearchTree.prototype.createSimilar = function (options) {
  options = options || {};
  options.unique = options.unique || this.unique;
  options.compareKeys = options.compareKeys || this.compareKeys;

  return new BinarySearchTree(options);
};


/**
 * Insert a new element
 */
BinarySearchTree.prototype.insert = function (key, value) {
  // Empty tree, insert as root
  if (!this.key) {
    this.key = key;
    this.data.push(value);
    return;
  }

  // Same key as root
  if (this.key === key) {
    if (this.unique) {
      throw "Can't insert key " + key + ", it violates the unique constraint";
    } else {
      this.data.push(value);
    }
  }

  if (this.compareKeys(key, this.key) < 0) {
    // Insert in left subtree
    if (this.left) {
      this.left.insert(key, value);
    } else {
      this.left = this.createSimilar({ key: key, value: value });
    }
  } else {
    // Insert in right subtree
    if (this.right) {
      this.right.insert(key, value);
    } else {
      this.right = this.createSimilar({ key: key, value: value });
    }
  }
};

var bst = new BinarySearchTree();
console.log(bst);


// Interface
module.exports = BinarySearchTree;
