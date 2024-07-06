import {BSTree} from "./test-source";
import {TestOption, testTree} from "./tree-test-utils";
import {
    decreaseInsertData,
    increaseEraseData,
    increaseInsertData,
    randomEraseData,
    randomInsertData
} from "./tree-test.data";
import {TreeNode} from "../src/rb-tree/rb-node";

let tree: BSTree<number, number, TreeNode<number, number, any>>
beforeEach(() => {
    tree = new BSTree<number, number, TreeNode<number, number, any>>();
});

test('递增序列插入', () => {
    testTree(tree, increaseInsertData(1000));
});

test('递减序列插入', () => {
    testTree(tree, decreaseInsertData(1000));
});

function randomTest(n: number) {
    testTree(tree, randomInsertData(n));
}

test('随机序列插入-第一轮', () => randomTest(100));

test('随机序列插入-第二轮', () => randomTest(1000));

test('随机序列插入-第三轮', () => randomTest(10000));

test('递增删除', () => {
    testTree(tree, increaseEraseData(100));
});

test('随机删除', () => {
    testTree(tree, randomEraseData(1000, 100, 100));
});

test('删除的结点将成为根结点', () => {
    const options: TestOption<number, number>[] = [
        {type: 'insert', key: 1, value: 1},
        {type: 'insert', key: 2, value: 2},
        {type: 'insert', key: 3, value: 3},
    ];

    testTree(tree, [
        ...options,
        {type: 'erase', key: 2},
        {type: 'get', key: 2, value: null},
        {type: 'get', key: 1, value: 1},
        {type: 'get', key: 3, value: 3},
    ]);
});

test('插入相同key', () => {
    tree.insert(1, 1);
    expect(tree.get(1)).toEqual(1);
    tree.insert(1, 2);
    expect(tree.get(1)).toEqual(2);
});