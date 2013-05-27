/**
 * Simple binary search tree
 */

/*
 * Default compareKeys function will work for numbers, strings and dates
 */
function defaultCompareKeysFunction (a, b) {
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  if (a === b) { return 0; }

  throw { message: "Couldn't compare elements", a: a, b: b };
}


/**
 * Check whether two values are equal (used in non-unique deletion)
 */
function defaultCheckValueEquality (a, b) {
  return a === b;
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
  this.parent = options.parent !== undefined ? options.parent : null;
  this.key = options.key !== undefined ? options.key : null;
  this.data = options.value ? [options.value] : [];
  this.unique = options.unique || false;

  this.compareKeys = options.compareKeys || defaultCompareKeysFunction;
  this.checkValueEquality = options.checkValueEquality || defaultCheckValueEquality;
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
 * Create the left child of this BST and return it
 */
BinarySearchTree.prototype.createLeftChild = function (options) {
  var leftChild = this.createSimilar(options);
  leftChild.parent = this;
  this.left = leftChild;

  return leftChild;
};


/**
 * Create the right child of this BST and return it
 */
BinarySearchTree.prototype.createRightChild = function (options) {
  var rightChild = this.createSimilar(options);
  rightChild.parent = this;
  this.right = rightChild;

  return rightChild;
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
  if (this.key === null) {
    this.key = key;
    this.data.push(value);
    return;
  }

  // Same key as root
  if (this.compareKeys(this.key, key) === 0) {
    if (this.unique) {
      throw "Can't insert key " + key + ", it violates the unique constraint";
    } else {
      this.data.push(value);
    }
    return;
  }

  if (this.compareKeys(key, this.key) < 0) {
    // Insert in left subtree
    if (this.left) {
      this.left.insert(key, value);
    } else {
      this.createLeftChild({ key: key, value: value });
    }
  } else {
    // Insert in right subtree
    if (this.right) {
      this.right.insert(key, value);
    } else {
      this.createRightChild({ key: key, value: value });
    }
  }
};


/**
 * Search for a key
 */
BinarySearchTree.prototype.search = function (key) {
  if (this.key === null) { return []; }

  if (this.compareKeys(this.key, key) === 0) { return this.data; }

  if (this.compareKeys(key, this.key) < 0) {
    if (this.left) {
      return this.left.search(key);
    } else {
      return [];
    }
  } else {
    if (this.right) {
      return this.right.search(key);
    } else {
      return [];
    }
  }
};


/**
 * Delete a key or just a value
 * @param {Key} key
 * @param {Value} value Optional. If not set, the whole key is deleted. If set, only this value is deleted
 */
BinarySearchTree.prototype.delete = function (key, value) {
  var newData = [];

  if (this.key === null) { return; }

  if (this.compareKeys(key, this.key) < 0) {
    if (this.left) { this.left.delete(key, value); }
    return;
  }

  if (this.compareKeys(key, this.key) > 0) {
    if (this.right) { this.right.delete(key, value); }
    return;
  }

  if (this.compareKeys(key, this.key) === 0) { return; }

  // Delete only a value
  if (this.data.length > 1 && value) {
    this.data.forEach(function (d) {
      if (!this.checkValueEquality(d, value)) { newData.push(d); }
      this.data = newData;
    });
    return;
  }

  // Delete the whole node
  if (!this.left && !this.right) {

  }

};



// Interface
module.exports = BinarySearchTree;
