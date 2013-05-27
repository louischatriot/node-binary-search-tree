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
 * Get the maximum key
 * This is equal to a traversal from the root to the right-most leaf
 */
BinarySearchTree.prototype.getMaxKey = function () {
  if (this.right) {
    return this.right.getMaxKey()
  } else {
    return this.key;
  }
};


/**
 * Get the minimum key
 * This is equal to a traversal from the root to the left-most leaf
 */
BinarySearchTree.prototype.getMinKey = function () {
  if (this.left) {
    return this.left.getMinKey()
  } else {
    return this.key;
  }
};


/**
 * Check that all BST properties are actually verified
 * Throw if they aren't
 * A priori only useful for testing
 */
BinarySearchTree.prototype.checkIsBST = function () {
  if (!this.key) { return; }

  if (this.left) {
    if (this.compareKeys(this.left.getMaxKey(), this.key) >= 0) { throw "Tree with root " + this.key + "  is not a BST"; }
    this.left.checkIsBST();
  }

  if (this.right) {
    if (this.compareKeys(this.right.getMaxKey(), this.key) <= 0) { throw "Tree with root " + this.key + "  is not a BST"; }
    this.right.checkIsBST();
  }
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



// Interface
module.exports = BinarySearchTree;
