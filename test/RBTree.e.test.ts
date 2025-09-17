import {RBTree} from "./test-source";

const num = 1000000;
let tree: RBTree<number, number>;
beforeEach(() => {
    tree = new RBTree<number, number>();
});

test('100万级插入', () => {
    for (let i = 1; i <= num; i++) {
        tree.insert(i, i);
    }
},  1000);

test('100万级查询', () => {
    for (let i = 1; i <= num; i++) {
        tree.insert(i, i);
    }

    for (let i = 1; i <= num; i++) {
        tree.get(i);
    }
}, 1000);

test('100万级删除', () => {
    for (let i = 1; i <= num; i++) {
        tree.insert(i, i);
    }

    for (let i = 1; i <= num; i++) {
        tree.erase(i);
    }
}, 1000);