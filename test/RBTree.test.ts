import {RBTree} from "../src/rb-tree/rb-tree";
import {testRBTree, testTree} from "./tree-test-utils";
import {
    decreaseInsertData,
    increaseEraseData,
    increaseInsertData,
    randomEraseData,
    randomInsertData
} from "./tree-test.data";
import {TreeNode} from "../src/rb-tree/rb-node";

test('空树', () => {
    const tree = new RBTree<number, number>();
    expect(tree.getRoot()).toBeNull();
    expect(tree.get(1)).toBeNull();
    expect(tree.erase(1)).toBeNull();
});

test('递增序列插入', () => {
    const tree = new RBTree<number, number>();
    testTree(tree, increaseInsertData(1000));
    testRBTree(tree);
});

test('递减序列插入', () => {
    const tree = new RBTree<number, number>();
    testTree(tree, decreaseInsertData(1000));
    testRBTree(tree);
});

function randomTest(n: number) {
    const tree = new RBTree<number, number>();
    testTree(tree, randomInsertData(n));
}

test('随机序列插入-第一轮', () => randomTest(100));

test('随机序列插入-第二轮', () => randomTest(1000));

test('随机序列插入-第三轮', () => randomTest(10000));

test('递增删除', () => {
    const tree = new RBTree<number, number>();
    testTree(tree, increaseEraseData(10));
    testRBTree(tree);
});

test('随机删除', () => {
    const tree = new RBTree<number, number>();
    testTree(tree, randomEraseData(1000, 100, 100));
    testRBTree(tree);
});