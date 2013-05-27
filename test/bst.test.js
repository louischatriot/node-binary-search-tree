var should = require('chai').should()
  , assert = require('chai').assert
  , BinarySearchTree = require('../lib/bst')
  , _ = require('underscore')
  ;


describe('Binary search tree', function () {

  it('Upon creation, left, right and key are null, and data is empty', function () {
    var bst = new BinarySearchTree();
    assert.isNull(bst.left);
    assert.isNull(bst.right);
    assert.isNull(bst.key);
    bst.data.length.should.equal(0);
  });

  describe('Insertion', function () {

    it('Insert at the root if its the first insertion', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');

      bst.checkIsBST();
      bst.key.should.equal(10);
      _.isEqual(bst.data, ['some data']).should.equal(true);
      assert.isNull(bst.left);
      assert.isNull(bst.right);
    });

    it("Insert on the left if key is less than the root's", function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');
      bst.insert(7, 'some other data');

      bst.checkIsBST();
      assert.isNull(bst.right);
      bst.left.key.should.equal(7);
      _.isEqual(bst.left.data, ['some other data']).should.equal(true);
      assert.isNull(bst.left.left);
      assert.isNull(bst.left.right);
    });

    it("Insert on the right if key is greater than the root's", function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');
      bst.insert(14, 'some other data');

      bst.checkIsBST();
      assert.isNull(bst.left);
      bst.right.key.should.equal(14);
      _.isEqual(bst.right.data, ['some other data']).should.equal(true);
      assert.isNull(bst.right.left);
      assert.isNull(bst.right.right);
    });

    it("Recursive insertion on the left works", function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');
      bst.insert(7, 'some other data');
      bst.insert(1, 'hello');
      bst.insert(9, 'world');

      bst.checkIsBST();
      assert.isNull(bst.right);
      bst.left.key.should.equal(7);
      _.isEqual(bst.left.data, ['some other data']).should.equal(true);

      bst.left.left.key.should.equal(1);
      _.isEqual(bst.left.left.data, ['hello']).should.equal(true);

      bst.left.right.key.should.equal(9);
      _.isEqual(bst.left.right.data, ['world']).should.equal(true);
    });

    it("Recursive insertion on the right works", function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');
      bst.insert(17, 'some other data');
      bst.insert(11, 'hello');
      bst.insert(19, 'world');

      bst.checkIsBST();
      assert.isNull(bst.left);
      bst.right.key.should.equal(17);
      _.isEqual(bst.right.data, ['some other data']).should.equal(true);

      bst.right.left.key.should.equal(11);
      _.isEqual(bst.right.left.data, ['hello']).should.equal(true);

      bst.right.right.key.should.equal(19);
      _.isEqual(bst.right.right.data, ['world']).should.equal(true);
    });

  });

});
