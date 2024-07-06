import {EasyMap} from "../src/index";
import {generateRandomSequence, getRandomInt} from "./tree-test-utils";

test('map 插入-查询测试', () => {
    const map = new EasyMap<number, number>();
    const seq = generateRandomSequence(1000);

    seq.forEach(n => {
        const node = map.insert(n, n);
        expect(node).not.toBeNull();
        expect(node.key).toEqual(n);
    });

    seq.forEach(() => {
        const idx = getRandomInt(0, seq.length - 1);
        expect(map.get(seq[idx])).toEqual(seq[idx]);
    });
});

test('删除-查询测试', () => {
    const map = new EasyMap<number, number>();
    const seq = generateRandomSequence(1000);

    seq.forEach(n => map.insert(n, n));

    seq.forEach(() => {
        const idx = getRandomInt(0, seq.length - 1);
        const value = seq[idx];
        map.erase(value);
        seq.splice(idx, 1);
        expect(map.get(value)).toEqual(null);
    });
});

test('erase返回值测试', () => {
    const map = new EasyMap<number, number>();
    const seq = generateRandomSequence(1000);

    seq.forEach(n => map.insert(n, n));

    expect(map.erase(2000)).toBeNull();
    expect(map.erase(200)?.key).toEqual(200);
});

test('size测试---插入相同的key', () => {
    const map = new EasyMap<number, number>();
    map.insert(1, 2);
    expect(map.size()).toEqual(1);
    map.insert(1, 3);
    expect(map.size()).toEqual(1);
    expect(map.get(1)).toEqual(3);
    map.insert(2, 3);
    expect(map.size()).toEqual(2);
    expect(map.get(2)).toEqual(3);
});

test('size测试---删除相同的key', () => {
    const map = new EasyMap<number, number>();
    map.insert(1, 2);
    expect(map.size()).toEqual(1);
    map.erase(1);
    expect(map.size()).toEqual(0);
    map.erase(1);
    expect(map.size()).toEqual(0);
});


test('keys 测试', () => {
    const map = new EasyMap<number, number>();
    const seq = generateRandomSequence(100);
    const sorted_seq = seq.toSorted((a, b) => a - b);
    seq.forEach(n => map.insert(n, n));

    expect(map.keys()).toEqual(sorted_seq);
    expect(map.values()).toEqual(sorted_seq);
    expect(map.entries()).toEqual(sorted_seq.map(n => ({key: n,value: n})));
});

test('values 测试', () => {
    const map = new EasyMap<number, number>();
    const seq = generateRandomSequence(100);
    const sorted_seq = seq.toSorted((a, b) => a - b);
    seq.forEach(n => map.insert(n, n));

    expect(map.values()).toEqual(sorted_seq);
    expect(map.keys()).toEqual(sorted_seq);
    expect(map.entries()).toEqual(sorted_seq.map(n => ({key: n,value: n})));
});

test('values 测试', () => {
    const map = new EasyMap<number, number>();
    const seq = generateRandomSequence(100);
    const sorted_seq = seq.toSorted((a, b) => a - b);
    seq.forEach(n => map.insert(n, n));

    expect(map.entries()).toEqual(sorted_seq.map(n => ({key: n,value: n})));
    expect(map.values()).toEqual(sorted_seq);
    expect(map.keys()).toEqual(sorted_seq);
});

test('clear 测试', () => {
    const map = new EasyMap<number, number>();
    const seq = generateRandomSequence(10);
    seq.forEach(n => map.insert(n, n));
    expect(map.size()).toEqual(10);
    expect(map.keys()).toEqual(seq.toSorted((a, b) => a - b));
    map.clear();
    expect(map.size()).toEqual(0);
    expect(map.keys()).toEqual([]);
});

test('count 测试', () => {
    const map = new EasyMap<number, number>();
    const seq = generateRandomSequence(10);
    seq.forEach(n => map.insert(n, n));
    seq.forEach(n => expect(map.count(n)).toEqual(1));
    map.erase(seq[3]);
    expect(map.count(seq[3])).toEqual(0);
    expect(map.count(100)).toEqual(0);
});

test('forEach 测试', () => {
    const map = new EasyMap<number, number>();
    const seq = generateRandomSequence(10);
    const sorted_seq = seq.toSorted((a, b) => a - b);
    seq.forEach(n => map.insert(n, n));
    let i = 0;
    map.forEach((value, key) => {
        expect(value).toEqual(sorted_seq[i ++]);
    });
});

test('与js map对比测试', () => {
    const map = new EasyMap<number, number>();
    const jsMap = new Map<number, number>();

    for (let i = 0; i < 100000; i ++) {
        switch (getRandomInt(1, 6)) {
            case 1: {
                const key = getRandomInt(1, 100);
                const value = getRandomInt(1, 100);
                map.insert(key, value);
                jsMap.set(key, value);
                expect(map.size()).toEqual(jsMap.size);
                break;
            }
            case 2: {
                const key = getRandomInt(1, 100);
                const v = map.get(key);
                if (v === null) {
                    expect(jsMap.get(key)).toBeUndefined();
                } else {
                    expect(jsMap.get(key)).toEqual(v);
                }
                break;
            }
            case 3: {
                const key = getRandomInt(1, 100);
                const node = map.erase(key);
                jsMap.delete(key);
                break;
            }
            case 4: {
                expect(map.size()).toEqual(jsMap.size);
                break;
            }
            case 5: {
                const key = getRandomInt(1, 100);
                expect(map.count(key)).toEqual(jsMap.has(key) ? 1 : 0);
            }
            case 6: {
                map.clear();
                jsMap.clear();
                expect(map.size()).toEqual(0);
            }
        }
    }
});