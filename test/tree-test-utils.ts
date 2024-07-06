import {BSTree, RBTree, RBNode} from "./test-source";
import hirestime from "hirestime";

export type TestOption<K, V> = {
    type: 'insert',
    key: K,
    value: V
} | {
    type: 'get',
    key: K,
    value: V | null
} | {
    type: 'erase',
    key: K
}

export function shuffle(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function generateRandomSequence(n: number): number[] {
    const sequence: number[] = [];
    for (let i = 1; i <= n; i++) {
        sequence.push(i);
    }
    return shuffle(sequence);
}

export function testTree<K, V, T extends BSTree<K, V, any>>(tree: T, options: TestOption<K, V>[]) {
    for (const option of options) {
        switch (option.type) {
            case 'insert':
                tree.insert(option.key, option.value);
                break;
            case 'get':
                expect(tree.get(option.key)).toBe(option.value);
                break;
            case 'erase':
                tree.erase(option.key);
                break;
        }
    }
    testBSTree(tree);
}

// 检查红黑树性质
export function testRBTree<K, V>(tree: RBTree<K, V>) {
    const root = tree.getRoot();
    if (!root) return;
    function dfs(root: RBNode<K, V> | null): number {
        if (root === null) return 0;
        // 不能有连续的红色结点
        root.left && expect(!(root.isRed() && root.left.isRed())).toBeTruthy();
        root.right && expect(!(root.isRed() && root.right.isRed())).toBeTruthy();
        const leftCnt = dfs(root.left);
        const rightCnt = dfs(root.right);
        // 左右子树黑色深度相等
        expect(leftCnt === rightCnt).toBeTruthy();
        return leftCnt + (root.isBlack() ? 1 : 0);
    }
    dfs(root);
}

// 检查搜索树性质
export function testBSTree<K, V>(tree: BSTree<K, V, any>) {
    const root = tree.getRoot();
    if (!root) return;
    function dfs(root: RBNode<K, V> | null) {
        if (root === null) return 0;
        if (root.left) {
            expect(root.key > root.left.key).toBeTruthy();
        }
        if (root.right) {
            expect(root.key < root.right.key).toBeTruthy();
        }
        dfs(root.left);
        dfs(root.right);
    }
    dfs(root);
}

export function getRandomInt(min: number, max: number): number {
    // Math.random() 生成一个0到1之间的随机数
    // Math.floor 将数值向下取整
    // (max - min + 1) 是范围的大小，加1是因为要包括max
    // min 是偏移量，确保随机数在[min, max]之间
    return Math.floor(Math.random() * (max - min + 1)) + min;
}