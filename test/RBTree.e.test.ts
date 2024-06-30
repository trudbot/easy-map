import {RBTree} from "../src/rb-tree/rb-tree";
import {expectTime} from "./tree-test-utils";

const num = 100000;

test('10万级插入', () => {
    const tree = new RBTree<number, number>();
    const time = expectTime(() => {
        for (let i = 1; i <= num; i++) {
            tree.insert(i, i);
        }
    }, 10000);
    console.log('10万级插入', time);
});

test('10万级查询', () => {
    const tree = new RBTree<number, number>();
    for (let i = 1; i <= num; i++) {
        tree.insert(i, i);
    }
    const time = expectTime(() => {
        for (let i = 1; i <= num; i++) {
            tree.get(i);
        }
    }, 1000);
    console.log('10万级查询', time);
});

test('10万级删除', () => {
    const tree = new RBTree<number, number>();
    for (let i = 1; i <= 100000; i++) {
        tree.insert(i, i);
    }
    const time = expectTime(() => {
        for (let i = 1; i <= 100000; i++) {
            tree.erase(i);
        }
    }, 1000);
    console.log('10万级删除', time);
});