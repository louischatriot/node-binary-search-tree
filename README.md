# Binary search trees for Node.js

Two implementations of binary search tree: basic and AVL (a kind of self-balancing binmary search tree). I wrote this module primarily to store indexes for <a href="https://github.com/louischatriot/nedb" target="_blank">NeDB</a> (a javascript dependency-less database).


## Installation and tests
Package name is `binary-search-tree`.

```bash
npm install binary-search-tree --save

make test
```

## Usage
The API mainly provides 3 functions: `insert`, `search` and `delete`. If you do not create a unique-type binary search tree, you can store multiple pieces of data for the same key. Doing so with a unique-type BST will result in an error being thrown. Data is always returned as an array, and you can delete all data relating to a given key, or just one piece of data.

```javascript
var BinarySearchTree = require('binary-search-tree').BinarySearchTree
  , AVLTree = require('binary-search-tree').AVLTree   // Not yet implemented

// Creating a binary search tree
var bst = new BinarySearchTree();

// Inserting some data
bst.insert(15, 'some data for key 15');
bst.insert(12, 'something else');
bst.insert(18, 'hello');

// You can insert multiple pieces of data for the same key
// if your tree doesn't enforce a unique constraint
bst.insert(18, 'world');

// Retrieving data (always returned as an array of all data stored for this key)
bst.search(15);   // Equal to ['some data for key 15']
bst.search(18);   // Equal to ['hello', 'world']
bst.search(1);    // Equal to []

// Deleting all the data relating to a key
bst.delete(15);   // bst.search(15) will now give []
bst.delete(18, 'world');   // bst.search(18) will now give ['hello']
// Delete
```
