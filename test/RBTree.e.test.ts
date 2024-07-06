import {RBTree} from "./test-source";

const num = 100000;
let tree: RBTree<number, number>;
beforeEach(() => {
    tree = new RBTree<number, number>();
});

test('10万级插入', () => {
    for (let i = 1; i <= num; i++) {
        tree.insert(i, i);
    }
},  1000);

test('10万级查询', () => {
    for (let i = 1; i <= num; i++) {
        tree.insert(i, i);
    }

    for (let i = 1; i <= num; i++) {
        tree.get(i);
    }
}, 1000);

test('10万级删除', () => {
    for (let i = 1; i <= num; i++) {
        tree.insert(i, i);
    }

    for (let i = 1; i <= num; i++) {
        tree.erase(i);
    }
}, 1000);