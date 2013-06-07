var should = require('chai').should()
  , assert = require('chai').assert
  , BinarySearchTree = require('../lib/avltree')
  , AVLTree = require('../lib/avltree')
  , _ = require('underscore')
  , customUtils = require('../lib/customUtils')
  ;


describe('AVL tree', function () {

  describe.only('Insertion', function () {

    it('Insert at the root if its the first insertion', function () {
      var avlt = new AVLTree();

      avlt.insert(10, 'some data');

      avlt.checkIsBST();
      avlt.tree.key.should.equal(10);
      _.isEqual(avlt.tree.data, ['some data']).should.equal(true);
      assert.isNull(avlt.tree.left);
      assert.isNull(avlt.tree.right);
    });

    it('If uniqueness constraint not enforced, we can insert different data for same key', function () {
      var avlt = new AVLTree();

      avlt.insert(10, 'some data');
      avlt.insert(3, 'hello');
      avlt.insert(3, 'world');

      avlt.checkIsBST();
      _.isEqual(avlt.search(3), ['hello', 'world']).should.equal(true);

      avlt.insert(12, 'a');
      avlt.insert(12, 'b');

      avlt.checkIsBST();
      _.isEqual(avlt.search(12), ['a', 'b']).should.equal(true);
    });

    it('If uniqueness constraint is enforced, we cannot insert different data for same key', function () {
      var avlt = new AVLTree({ unique: true });

      avlt.insert(10, 'some data');
      avlt.insert(3, 'hello');
      try {
        avlt.insert(3, 'world');
      } catch (e) {
        e.errorType.should.equal('uniqueViolated');
        e.key.should.equal(3);
      }

      avlt.checkIsBST();
      _.isEqual(avlt.search(3), ['hello']).should.equal(true);

      avlt.insert(12, 'a');
      try {
        avlt.insert(12, 'world');
      } catch (e) {
        e.errorType.should.equal('uniqueViolated');
        e.key.should.equal(12);
      }

      avlt.checkIsBST();
      _.isEqual(avlt.search(12), ['a']).should.equal(true);
    });

    it('Can insert 0 or the empty string', function () {
      var avlt = new AVLTree();

      avlt.insert(0, 'some data');

      avlt.checkIsBST();
      avlt.tree.key.should.equal(0);
      _.isEqual(avlt.tree.data, ['some data']).should.equal(true);

      avlt = new AVLTree();

      avlt.insert('', 'some other data');

      avlt.checkIsBST();
      avlt.tree.key.should.equal('');
      _.isEqual(avlt.tree.data, ['some other data']).should.equal(true);
    });

    it('Auto-balancing insertions', function () {
      var avlt = new AVLTree()
        , avlt2 = new AVLTree()
        , avlt3 = new AVLTree()
        ;

      // Balancing insertions on the left
      avlt.tree.getNumberOfKeys().should.equal(0);
      avlt.insert(18);
      avlt.tree.getNumberOfKeys().should.equal(1);
      avlt.tree.checkIsBST();
      avlt.insert(15);
      avlt.tree.getNumberOfKeys().should.equal(2);
      avlt.tree.checkIsBST();
      avlt.insert(13);
      avlt.tree.getNumberOfKeys().should.equal(3);
      avlt.tree.checkIsBST();
      avlt.insert(10);
      avlt.tree.getNumberOfKeys().should.equal(4);
      avlt.tree.checkIsBST();
      avlt.insert(8);
      avlt.tree.getNumberOfKeys().should.equal(5);
      avlt.tree.checkIsBST();
      avlt.insert(5);
      avlt.tree.getNumberOfKeys().should.equal(6);
      avlt.tree.checkIsBST();
      avlt.insert(3);
      avlt.tree.getNumberOfKeys().should.equal(7);
      avlt.tree.checkIsBST();

      // Balancing insertions on the right
      avlt2.tree.getNumberOfKeys().should.equal(0);
      avlt2.insert(3);
      avlt2.tree.getNumberOfKeys().should.equal(1);
      avlt2.tree.checkIsBST();
      avlt2.insert(5);
      avlt2.tree.getNumberOfKeys().should.equal(2);
      avlt2.tree.checkIsBST();
      avlt2.insert(8);
      avlt2.tree.getNumberOfKeys().should.equal(3);
      avlt2.tree.checkIsBST();
      avlt2.insert(10);
      avlt2.tree.getNumberOfKeys().should.equal(4);
      avlt2.tree.checkIsBST();
      avlt2.insert(13);
      avlt2.tree.getNumberOfKeys().should.equal(5);
      avlt2.tree.checkIsBST();
      avlt2.insert(15);
      avlt2.tree.getNumberOfKeys().should.equal(6);
      avlt2.tree.checkIsBST();
      avlt2.insert(18);
      avlt2.tree.getNumberOfKeys().should.equal(7);
      avlt2.tree.checkIsBST();

      // Balancing already-balanced insertions
      avlt3.tree.getNumberOfKeys().should.equal(0);
      avlt3.insert(10);
      avlt3.tree.getNumberOfKeys().should.equal(1);
      avlt3.tree.checkIsBST();
      avlt3.insert(5);
      avlt3.tree.getNumberOfKeys().should.equal(2);
      avlt3.tree.checkIsBST();
      avlt3.insert(15);
      avlt3.tree.getNumberOfKeys().should.equal(3);
      avlt3.tree.checkIsBST();
      avlt3.insert(3);
      avlt3.tree.getNumberOfKeys().should.equal(4);
      avlt3.tree.checkIsBST();
      avlt3.insert(8);
      avlt3.tree.getNumberOfKeys().should.equal(5);
      avlt3.tree.checkIsBST();
      avlt3.insert(13);
      avlt3.tree.getNumberOfKeys().should.equal(6);
      avlt3.tree.checkIsBST();
      avlt3.insert(18);
      avlt3.tree.getNumberOfKeys().should.equal(7);
      avlt3.tree.checkIsBST();
    });

    it('Can insert a lot of keys and still get an AVLT (sanity check)', function () {
      var avlt = new AVLTree({ unique: true });

      customUtils.getRandomArray(1000).forEach(function (n) {
        avlt.insert(n, 'some data');
        avlt.checkIsBST();
      });

    });

  });   // ==== End of 'Insertion' ==== //


  describe('Search', function () {

    it('Can find data in a BST', function () {
      var bst = new BinarySearchTree()
        , i;

      customUtils.getRandomArray(100).forEach(function (n) {
        bst.insert(n, 'some data for ' + n);
      });

      bst.checkIsBST();

      for (i = 0; i < 100; i += 1) {
        _.isEqual(bst.search(i), ['some data for ' + i]).should.equal(true);
      }
    });

    it('If no data can be found, return an empty array', function () {
      var bst = new BinarySearchTree();

      customUtils.getRandomArray(100).forEach(function (n) {
        if (n !== 63) {
          bst.insert(n, 'some data for ' + n);
        }
      });

      bst.checkIsBST();

      bst.search(-2).length.should.equal(0);
      bst.search(100).length.should.equal(0);
      bst.search(101).length.should.equal(0);
      bst.search(63).length.should.equal(0);
    });

  });   /// ==== End of 'Search' ==== //


  describe('Deletion', function () {

    it('Deletion does nothing on an empty tree', function () {
      var bst = new BinarySearchTree()
        , bstu = new BinarySearchTree({ unique: true });

      bst.getNumberOfKeys().should.equal(0);
      bstu.getNumberOfKeys().should.equal(0);

      bst.delete(5);
      bstu.delete(5);

      assert.isNull(bst.key);
      assert.isNull(bstu.key);

      bst.data.length.should.equal(0);
      bstu.data.length.should.equal(0);

      bst.getNumberOfKeys().should.equal(0);
      bstu.getNumberOfKeys().should.equal(0);
    });

    it('Deleting a non-existent key doesnt have any effect', function () {
      var bst = new BinarySearchTree();

      [10, 5, 3, 8, 15, 12, 37].forEach(function (k) {
        bst.insert(k, 'some ' + k);
      });

      function checkBst () {
        [10, 5, 3, 8, 15, 12, 37].forEach(function (k) {
          _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
        });
      }

      checkBst();
      bst.getNumberOfKeys().should.equal(7);

      bst.delete(2);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
      bst.delete(4);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
      bst.delete(9);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
      bst.delete(6);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
      bst.delete(11);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
      bst.delete(14);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
      bst.delete(20);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
      bst.delete(200);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
    });

    it('Able to delete the rootif it is also a leaf', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'hello');
      bst.key.should.equal(10);
      _.isEqual(bst.data, ['hello']).should.equal(true);
      bst.getNumberOfKeys().should.equal(1);

      bst.delete(10);
      assert.isNull(bst.key);
      bst.data.length.should.equal(0);
      bst.getNumberOfKeys().should.equal(0);
    });

    it('Able to delete leaf nodes that are non-root', function () {
      var bst;

      function recreateBst () {
        bst = new BinarySearchTree();

        // With this insertion order the tree is well balanced
        // So we know the leaves are 3, 8, 12, 37
        [10, 5, 3, 8, 15, 12, 37].forEach(function (k) {
          bst.insert(k, 'some ' + k);
        });

        bst.getNumberOfKeys().should.equal(7);
      }

      function checkOnlyOneWasRemoved (theRemoved) {
        [10, 5, 3, 8, 15, 12, 37].forEach(function (k) {
          if (k === theRemoved) {
            bst.search(k).length.should.equal(0);
          } else {
            _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
          }
        });

        bst.getNumberOfKeys().should.equal(6);
      }

      recreateBst();
      bst.delete(3);
      bst.checkIsBST();
      checkOnlyOneWasRemoved(3);
      assert.isNull(bst.left.left);

      recreateBst();
      bst.delete(8);
      bst.checkIsBST();
      checkOnlyOneWasRemoved(8);
      assert.isNull(bst.left.right);

      recreateBst();
      bst.delete(12);
      bst.checkIsBST();
      checkOnlyOneWasRemoved(12);
      assert.isNull(bst.right.left);

      recreateBst();
      bst.delete(37);
      bst.checkIsBST();
      checkOnlyOneWasRemoved(37);
      assert.isNull(bst.right.right);
    });

    it('Able to delete the root if it has only one child', function () {
      var bst;

      // Root has only one child, on the left
      bst = new BinarySearchTree();
      [10, 5, 3, 6].forEach(function (k) {
        bst.insert(k, 'some ' + k);
      });
      bst.getNumberOfKeys().should.equal(4);
      bst.delete(10);
      bst.checkIsBST();
      bst.getNumberOfKeys().should.equal(3);
      [5, 3, 6].forEach(function (k) {
        _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
      });
      bst.search(10).length.should.equal(0);

      // Root has only one child, on the right
      bst = new BinarySearchTree();
      [10, 15, 13, 16].forEach(function (k) {
        bst.insert(k, 'some ' + k);
      });
      bst.getNumberOfKeys().should.equal(4);
      bst.delete(10);
      bst.checkIsBST();
      bst.getNumberOfKeys().should.equal(3);
      [15, 13, 16].forEach(function (k) {
        _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
      });
      bst.search(10).length.should.equal(0);
    });

    it('Able to delete non root nodes that have only one child', function () {
      var bst;

      function recreateBst () {
        bst = new BinarySearchTree();

        [10, 5, 15, 3, 1, 4, 20, 17, 25].forEach(function (k) {
          bst.insert(k, 'some ' + k);
        });

        bst.getNumberOfKeys().should.equal(9);
      }

      function checkOnlyOneWasRemoved (theRemoved) {
        [10, 5, 15, 3, 1, 4, 20, 17, 25].forEach(function (k) {
          if (k === theRemoved) {
            bst.search(k).length.should.equal(0);
          } else {
            _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
          }
        });

        bst.getNumberOfKeys().should.equal(8);
      }

      recreateBst();
      bst.delete(5);
      bst.checkIsBST();
      checkOnlyOneWasRemoved(5);

      recreateBst();
      bst.delete(15);
      bst.checkIsBST();
      checkOnlyOneWasRemoved(15);
    });

    it('Can delete the root if it has 2 children', function () {
      var bst;

      bst = new BinarySearchTree();
      [10, 5, 3, 8, 15, 12, 37].forEach(function (k) {
        bst.insert(k, 'some ' + k);
      });
      bst.getNumberOfKeys().should.equal(7);
      bst.delete(10);
      bst.checkIsBST();
      bst.getNumberOfKeys().should.equal(6);
      [5, 3, 8, 15, 12, 37].forEach(function (k) {
        _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
      });
      bst.search(10).length.should.equal(0);
    });

    it('Can delete a non-root node that has two children', function () {
      var bst;

      bst = new BinarySearchTree();
      [10, 5, 3, 1, 4, 8, 6, 9, 15, 12, 11, 13, 20, 19, 42].forEach(function (k) {
        bst.insert(k, 'some ' + k);
      });
      bst.getNumberOfKeys().should.equal(15);
      bst.delete(5);
      bst.checkIsBST();
      bst.getNumberOfKeys().should.equal(14);
      [10, 3, 1, 4, 8, 6, 9, 15, 12, 11, 13, 20, 19, 42].forEach(function (k) {
        _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
      });
      bst.search(5).length.should.equal(0);

      bst = new BinarySearchTree();
      [10, 5, 3, 1, 4, 8, 6, 9, 15, 12, 11, 13, 20, 19, 42].forEach(function (k) {
        bst.insert(k, 'some ' + k);
      });
      bst.getNumberOfKeys().should.equal(15);
      bst.delete(15);
      bst.checkIsBST();
      bst.getNumberOfKeys().should.equal(14);
      [10, 5, 3, 1, 4, 8, 6, 9, 12, 11, 13, 20, 19, 42].forEach(function (k) {
        _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
      });
      bst.search(15).length.should.equal(0);
    });

    it('If no value is provided, it will delete the entire node even if there are multiple pieces of data', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'yes');
      bst.insert(5, 'hello');
      bst.insert(3, 'yes');
      bst.insert(5, 'world');
      bst.insert(8, 'yes');

      assert.deepEqual(bst.search(5), ['hello', 'world']);
      bst.getNumberOfKeys().should.equal(4);

      bst.delete(5);
      bst.search(5).length.should.equal(0);
      bst.getNumberOfKeys().should.equal(3);
    });

    it('Can remove only one value from an array', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'yes');
      bst.insert(5, 'hello');
      bst.insert(3, 'yes');
      bst.insert(5, 'world');
      bst.insert(8, 'yes');

      assert.deepEqual(bst.search(5), ['hello', 'world']);
      bst.getNumberOfKeys().should.equal(4);

      bst.delete(5, 'hello');
      assert.deepEqual(bst.search(5), ['world']);
      bst.getNumberOfKeys().should.equal(4);
    });

    it('Removes nothing if value doesnt match', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'yes');
      bst.insert(5, 'hello');
      bst.insert(3, 'yes');
      bst.insert(5, 'world');
      bst.insert(8, 'yes');

      assert.deepEqual(bst.search(5), ['hello', 'world']);
      bst.getNumberOfKeys().should.equal(4);

      bst.delete(5, 'nope');
      assert.deepEqual(bst.search(5), ['hello', 'world']);
      bst.getNumberOfKeys().should.equal(4);
    });

    it('If value provided but node contains only one value, remove entire node', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'yes');
      bst.insert(5, 'hello');
      bst.insert(3, 'yes2');
      bst.insert(5, 'world');
      bst.insert(8, 'yes3');

      assert.deepEqual(bst.search(3), ['yes2']);
      bst.getNumberOfKeys().should.equal(4);

      bst.delete(3, 'yes2');
      bst.search(3).length.should.equal(0);
      bst.getNumberOfKeys().should.equal(3);
    });

    it('Can remove the root from a tree with height 2 when the root has two children (special case)', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'maybe');
      bst.insert(5, 'no');
      bst.insert(15, 'yes');
      bst.getNumberOfKeys().should.equal(3);

      bst.delete(10);
      bst.checkIsBST();
      bst.getNumberOfKeys().should.equal(2);
      assert.deepEqual(bst.search(5), ['no']);
      assert.deepEqual(bst.search(15), ['yes']);
    });

    it('Can remove the root from a tree with height 3 when the root has two children (special case where the two children themselves have children)', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'maybe');
      bst.insert(5, 'no');
      bst.insert(15, 'yes');
      bst.insert(2, 'no');
      bst.insert(35, 'yes');
      bst.getNumberOfKeys().should.equal(5);

      bst.delete(10);
      bst.checkIsBST();
      bst.getNumberOfKeys().should.equal(4);
      assert.deepEqual(bst.search(5), ['no']);
      assert.deepEqual(bst.search(15), ['yes']);
    });

  });   // ==== End of 'Deletion' ==== //


  describe('Execute on every node (=tree traversal)', function () {

    it('Can execute a function on every node', function () {
      var bst = new BinarySearchTree()
        , keys = []
        , executed = 0
        ;

      bst.insert(10, 'yes');
      bst.insert(5, 'hello');
      bst.insert(3, 'yes2');
      bst.insert(8, 'yes3');
      bst.insert(15, 'yes3');
      bst.insert(159, 'yes3');
      bst.insert(11, 'yes3');

      bst.executeOnEveryNode(function (node) {
        keys.push(node.key);
        executed += 1;
      });

      assert.deepEqual(keys, [3, 5, 8, 10, 11, 15, 159]);
      executed.should.equal(7);
    });

  });   // ==== End of 'Execute on every node' ==== //


  // This test performs several inserts and deletes at random, always checking the content
  // of the tree are as expected and the binary search tree constraint is respected
  // This test is important because it can catch bugs other tests can't
  // By their nature, BSTs can be hard to test (many possible cases, bug at one operation whose
  // effect begins to be felt only after several operations etc.)
  describe.skip('Randomized test (takes much longer than the rest of the test suite)', function () {
    var bst = new BinarySearchTree()
      , data = {};

    // Check a bst against a simple key => [data] object
    function checkDataIsTheSame (bst, data) {
      var bstDataElems = [];

      // bstDataElems is a simple array containing every piece of data in the tree
      bst.executeOnEveryNode(function (node) {
        var i;
        for (i = 0; i < node.data.length; i += 1) {
          bstDataElems.push(node.data[i]);
        }
      });

      // Number of key and number of pieces of data match
      bst.getNumberOfKeys().should.equal(Object.keys(data).length);
      _.reduce(_.map(data, function (d) { return d.length; }), function (memo, n) { return memo + n; }, 0).should.equal(bstDataElems.length);

      // Compare data
      Object.keys(data).forEach(function (key) {
        checkDataEquality(bst.search(key), data[key]);
      });
    }

    // Check two pieces of data coming from the bst and data are the same
    function checkDataEquality (fromBst, fromData) {
      if (fromBst.length === 0) {
        if (fromData) { fromData.length.should.equal(0); }
      }

      assert.deepEqual(fromBst, fromData);
    }

    // Tests the tree structure (deletions concern the whole tree, deletion of some data in a node is well tested above)
    it('Inserting and deleting entire nodes', function () {
      // You can skew to be more insertive or deletive, to test all cases
      function launchRandomTest (nTests, proba) {
        var i, key, dataPiece, possibleKeys;

        for (i = 0; i < nTests; i += 1) {
          if (Math.random() > proba) {   // Deletion
            possibleKeys = Object.keys(data);

            if (possibleKeys.length > 0) {
              key = possibleKeys[Math.floor(possibleKeys.length * Math.random()).toString()];
            } else {
              key = Math.floor(70 * Math.random()).toString();
            }

            delete data[key];
            bst.delete(key);
          } else {   // Insertion
            key = Math.floor(70 * Math.random()).toString();
            dataPiece = Math.random().toString().substring(0, 6);
            bst.insert(key, dataPiece);
            if (data[key]) {
              data[key].push(dataPiece);
            } else {
              data[key] = [dataPiece];
            }
          }

          // Check the bst constraint are still met and the data is correct
          bst.checkIsBST();
          checkDataIsTheSame(bst, data);
        }
      }

      launchRandomTest(1000, 0.65);
      launchRandomTest(2000, 0.35);
    });

  });   // ==== End of 'Randomized test' ==== //

});


describe('Specific to AVL tree', function () {

  it('The root has a height of 1', function () {
    var avlt = new AVLTree();

    avlt.insert(10, 'root');
    avlt.tree.height.should.equal(1);
  });

  it('Newly created children have a height of 1', function () {
    var avlt = new AVLTree();

    avlt.insert(10, 'root');
    avlt.tree.createLeftChild({ key: 5, value: 'leftchild' }).height.should.equal(1);
    avlt.tree.left.height.should.equal(1);
    avlt.tree.createRightChild({ key: 5, value: 'leftchild' }).height.should.equal(1);
    avlt.tree.right.height.should.equal(1);
  });

  it('Checking that all nodes heights are correct', function () {
    var _AVLTree = AVLTree._AVLTree
      , avlt = new _AVLTree({ key: 10 })
      , l = new _AVLTree({ key: 5 })
      , r = new _AVLTree({ key: 15 })
      , ll = new _AVLTree({ key: 3 })
      , lr = new _AVLTree({ key: 8 })
      , rl = new _AVLTree({ key: 13 })
      , rr = new _AVLTree({ key: 18 })
      , lrl = new _AVLTree({ key: 7 })
      , lrll = new _AVLTree({ key: 6 })
      ;


    // With a balanced tree
    avlt.left = l;
    avlt.right = r;
    l.left = ll;
    l.right = lr;
    r.left = rl;
    r.right = rr;

    (function () { avlt.checkHeightCorrect() }).should.throw();
    avlt.height = 1;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    l.height = 1;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    r.height = 1;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    ll.height = 1;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    lr.height = 1;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    rl.height = 1;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    rr.height = 1;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    avlt.height = 2;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    l.height = 2;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    r.height = 2;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    avlt.height = 3;
    avlt.checkHeightCorrect();   // Correct

    // With an unbalanced tree
    lr.left = lrl;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    lrl.left = lrll;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    lrl.height = 1;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    lrll.height = 1;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    lrl.height = 2;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    lr.height = 3;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    l.height = 4;
    (function () { avlt.checkHeightCorrect() }).should.throw();
    avlt.height = 5;
    avlt.checkHeightCorrect();   // Correct
  });

  it('Calculate the balance factor', function () {
    var _AVLTree = AVLTree._AVLTree
      , avlt = new _AVLTree({ key: 10 })
      , l = new _AVLTree({ key: 5 })
      , r = new _AVLTree({ key: 15 })
      , ll = new _AVLTree({ key: 3 })
      , lr = new _AVLTree({ key: 8 })
      , rl = new _AVLTree({ key: 13 })
      , rr = new _AVLTree({ key: 18 })
      , lrl = new _AVLTree({ key: 7 })
      , lrll = new _AVLTree({ key: 6 })
      ;


    // With a balanced tree
    avlt.left = l;
    avlt.right = r;
    l.left = ll;
    l.right = lr;
    r.left = rl;
    r.right = rr;

    ll.height = 1;
    rl.height = 1;
    rr.height = 1;
    avlt.height = 2;
    r.height = 2;
    lr.left = lrl;
    lrl.left = lrll;
    lrl.height = 1;
    lrll.height = 1;
    lrl.height = 2;
    lr.height = 3;
    l.height = 4;
    avlt.height = 5;
    avlt.checkHeightCorrect();   // Correct

    lrll.balanceFactor().should.equal(0);
    lrl.balanceFactor().should.equal(1);
    ll.balanceFactor().should.equal(0);
    lr.balanceFactor().should.equal(2);
    rl.balanceFactor().should.equal(0);
    rr.balanceFactor().should.equal(0);
    l.balanceFactor().should.equal(-2);
    r.balanceFactor().should.equal(0);
    avlt.balanceFactor().should.equal(2);
  });

  it('Can check that a tree is balanced', function () {
    var _AVLTree = AVLTree._AVLTree
      , avlt = new _AVLTree({ key: 10 })
      , l = new _AVLTree({ key: 5 })
      , r = new _AVLTree({ key: 15 })
      , ll = new _AVLTree({ key: 3 })
      , lr = new _AVLTree({ key: 8 })
      , rl = new _AVLTree({ key: 13 })
      , rr = new _AVLTree({ key: 18 })

    avlt.left = l;
    avlt.right = r;
    l.left = ll;
    l.right = lr;
    r.left = rl;
    r.right = rr;

    ll.height = 1;
    lr.height = 1;
    rl.height = 1;
    rr.height = 1;
    l.height = 2;
    r.height = 2;
    avlt.height = 3;
    avlt.checkBalanceFactors();

    r.height = 0;
    (function () { avlt.checkBalanceFactors(); }).should.throw();
    r.height = 4;
    (function () { avlt.checkBalanceFactors(); }).should.throw();
    r.height = 2;
    avlt.checkBalanceFactors();

    ll.height = -1;
    (function () { avlt.checkBalanceFactors(); }).should.throw();
    ll.height = 3;
    (function () { avlt.checkBalanceFactors(); }).should.throw();
    ll.height = 1;
    avlt.checkBalanceFactors();

    rl.height = -1;
    (function () { avlt.checkBalanceFactors(); }).should.throw();
    rl.height = 3;
    (function () { avlt.checkBalanceFactors(); }).should.throw();
    rl.height = 1;
    avlt.checkBalanceFactors();
  });


});







