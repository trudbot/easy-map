import {COMPARE_RESULT, EasyMap} from "./test-source";
import {generateRandomSequence, getRandomInt} from "./tree-test-utils";

let map: EasyMap<number, number>;
let seq: number[];
let seq100: number[];
beforeEach(() => {
    map = new EasyMap<number, number>();
    seq = generateRandomSequence(1000);
    seq100 = generateRandomSequence(100);
});

test('map 插入-查询测试', () => {
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

test('insert别名set 测试', () => {
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

    seq.forEach(n => map.insert(n, n));

    expect(map.erase(2000)).toBeNull();
    expect(map.erase(200)?.key).toEqual(200);
});

test('size测试---插入相同的key', () => {
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
    map.insert(1, 2);
    expect(map.size()).toEqual(1);
    map.erase(1);
    expect(map.size()).toEqual(0);
    map.erase(1);
    expect(map.size()).toEqual(0);
});


test('keys 测试', () => {
    const sorted_seq = seq.toSorted((a, b) => a - b);
    seq.forEach(n => map.insert(n, n));

    expect(map.keys()).toEqual(sorted_seq);
    expect(map.values()).toEqual(sorted_seq);
    expect(map.entries()).toEqual(sorted_seq.map(n => ({key: n,value: n})));
});

test('values 测试', () => {
    const sorted_seq = seq.toSorted((a, b) => a - b);
    seq.forEach(n => map.insert(n, n));

    expect(map.values()).toEqual(sorted_seq);
    expect(map.keys()).toEqual(sorted_seq);
    expect(map.entries()).toEqual(sorted_seq.map(n => ({key: n,value: n})));
});

test('values 测试', () => {
    const sorted_seq = seq.toSorted((a, b) => a - b);
    seq.forEach(n => map.insert(n, n));

    expect(map.entries()).toEqual(sorted_seq.map(n => ({key: n,value: n})));
    expect(map.values()).toEqual(sorted_seq);
    expect(map.keys()).toEqual(sorted_seq);
});

test('clear 测试', () => {
    seq.forEach(n => map.insert(n, n));
    expect(map.size()).toEqual(seq.length);
    expect(map.keys()).toEqual(seq.toSorted((a, b) => a - b));
    map.clear();
    expect(map.size()).toEqual(0);
    expect(map.keys()).toEqual([]);
});

test('count 测试', () => {
    seq.forEach(n => map.insert(n, n));
    seq.forEach(n => expect(map.count(n)).toEqual(1));
    seq.forEach(n => expect(map.has(n)).toBeTruthy());
    map.erase(seq[3]);
    expect(map.count(seq[3])).toEqual(0);
    expect(map.has(10000)).toBeFalsy();
    expect(map.count(10000)).toEqual(0);
});

test('forEach 测试', () => {
    const sorted_seq = seq.toSorted((a, b) => a - b);
    seq.forEach(n => map.insert(n, n));
    let i = 0;
    map.forEach((value, _key) => {
        expect(value).toEqual(sorted_seq[i ++]);
    });
});

test('插入后forEach', () => {
    map.insert(1, 1);
    map.forEach((value, key) => {
        expect(value).toEqual(1);
        expect(key).toEqual(1);
    });

    map.insert(2, 2);
    let result: number[] = [];
    map.forEach((value, key) => {
        result.push(key);
    });
    expect(result).toEqual([1, 2]);
});

test('删除后forEach', () => {
    map.insert(1, 1);
    map.insert(2, 2);
    let result: number[] = [];
    map.forEach((value, key) => {
        result.push(key);
    });
    expect(result).toEqual([1, 2]);

    map.erase(1);
    result = [];
    map.forEach((value, key) => {
        result.push(key);
    });
    expect(result).toEqual([2]);
});

test('修改后forEach', () => {
    map.insert(1, 1);
    map.insert(2, 2);
    let result: number[] = [];
    map.forEach((value, key) => {
        result.push(key);
    });
    expect(result).toEqual([1, 2]);
    
    map.insert(1, 3);
    result = [];
    let values: number[] = [];
    map.forEach((value, key) => {
        result.push(key);
        values.push(value);
    });
    expect(result).toEqual([1, 2]);
    expect(values).toEqual([3, 2]);
})

test('与js map对比测试', () => {
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
                map.erase(key);
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
                break;
            }
            case 6: {
                map.clear();
                jsMap.clear();
                expect(map.size()).toEqual(0);
                break;
            }
        }
    }
});

describe('proxy测试', () => {
    let proxy = new EasyMap<number, number>().createProxy(() => 0, 0);
    const defaultValue =  0;
    beforeEach(() => {
        map = new EasyMap<number, number>();
        proxy = map.createProxy((p) => {
            if (typeof p === 'number') return p;
            if (typeof p === 'string') {
                const num = parseInt(p);
                if (isNaN(num)) return null;
                return num;
            }
            return null;
       }, defaultValue);
    });

    test('插入-查询测试', () => {
        seq.forEach(n => proxy[n] = n);
        seq.forEach(n => expect(proxy[n]).toEqual(n));
        seq.forEach(n => expect(n in proxy).toBeTruthy());
    });

    test('delete测试', () => {
        seq.forEach(n => proxy[n] = n);

        seq.forEach(() => {
            const idx = getRandomInt(0, seq.length - 1);
            const value = seq[idx];
            expect(proxy[value]).toEqual(value);
            delete proxy[value];
            seq.splice(idx, 1);
            expect(proxy[value]).toEqual(defaultValue);
        });
    });

    test('+=, ++, -=, -- 测试', () => {
        proxy[1] = 2;
        proxy[1] ++;
        expect(proxy[1]).toEqual(3);
        proxy[1] += 10;
        expect(proxy[1]).toEqual(13);
        proxy[1] --;
        expect(proxy[1]).toEqual(12);
        proxy[1] -= 5;
        expect(proxy[1]).toEqual(7);
    });

    test('访问不存在的key 测试', () => {
       seq.forEach(n => expect(proxy[n]).toEqual(defaultValue));
    });

    test('错误key测试', () => {
        expect(() => proxy['abc']).toThrow();
        expect(() => proxy[`{a: 1}`]).toThrow();
        expect(() => proxy['abc'] = 1).toThrow();
        expect(() => '{}' in proxy).toThrow();
        expect(() => delete proxy['=']).toThrow();
    });

    describe('proxy默认值测试', () => {

        test('默认值测试', () => {
            seq100.forEach(n => expect(proxy[n]).toEqual(defaultValue));
            expect(1 in proxy).toBeFalsy();
        });

        test('+=, ++, -=, -- 测试', () => {
            expect(proxy[100]).toEqual(0);
            proxy[100] ++;
            expect(proxy[100]).toEqual(1);
            proxy[100] += 10;
            expect(proxy[100]).toEqual(11);
            proxy[100] --;
            expect(proxy[100]).toEqual(10);
            proxy[100] -= 5;
            expect(proxy[100]).toEqual(5);
        });
    });

    describe('proxy和get/insert共同使用', () => {
        test('insert插入, proxy查询', () => {
            seq100.forEach(n => map.insert(n, n + 1));
            seq100.forEach(n => expect(proxy[n]).toEqual(n + 1));
        });

        test('proxy插入, get查询', () => {
            seq100.forEach(n => proxy[n] = n - 1);
            seq100.forEach(n => expect(map.get(n)).toEqual(n - 1));
        });

        test('erase后proxy测试', () => {
            seq100.forEach(n => map.insert(n, n));
            expect(proxy[seq100[0]]).toEqual(seq100[0]);
            map.erase(seq100[0]);
            expect(proxy[seq100[0]]).toEqual(defaultValue);
        });

        test('clear后proxy测试', () => {
            seq100.forEach(n => proxy[n] = n);
            expect(proxy[seq100[0]]).toEqual(seq100[0]);
            map.clear();
            seq100.length && expect(proxy[seq100[0]]).toEqual(defaultValue);
            seq100.length > 50 && expect(proxy[seq100[50]]).toEqual(defaultValue);
        });

        test('erase返回值测试', () => {
            seq100.forEach(n => proxy[n] = n);
            seq100.sort((a, b) => a - b);
            expect(map.entries()).toEqual(seq100.map(n => ({key: n, value: n})));
            for (let i = 0; i < 3; i ++) {
                const idx = getRandomInt(0, seq100.length - 1);
                const value = seq100[idx];
                seq100.splice(idx, 1);
                delete proxy[value];
            }
            expect(map.entries().length).toEqual(seq100.length);
            expect(map.entries()).toEqual(seq100.map(n => ({key: n, value: n})));
        })
    });

    describe('proxy 遍历测试', () => {
        test('遍历测试', () => {
            seq100.forEach(n => proxy[n] = n);
            for (const entry of proxy) {
                expect(map.get(entry[0])).toEqual(entry[1]);
            }
        })
    })
});

describe('复杂key测试', () => {
    test('对象', () => {
        const map = new EasyMap<{a: number, b: number}, number>({
            compare: (a, b) => {
                const sa = a.a + a.b;
                const sb = b.a + b.b;
                return sa > sb ? COMPARE_RESULT.MORE : sa < sb ? COMPARE_RESULT.LESS : COMPARE_RESULT.EQUAL;
            }
        });

        map.set({a: 1, b: 2}, 0);
        expect(map.get({a: 1, b: 2})).toEqual(0);
        map.set({a: 1, b: 1}, 1);
        expect(map.size()).toEqual(2);
        map.set({a: 2, b: 1}, 1);
        expect(map.size()).toEqual(2);
        expect(map.get({a: 1, b: 2})).toEqual(1);
    });

    test('proxy', () => {
        const map = new EasyMap<{a: number, b: number}, number>({
            compare: (a, b) => {
                const sa = a.a + a.b;
                const sb = b.a + b.b;
                return sa > sb ? COMPARE_RESULT.MORE : sa < sb ? COMPARE_RESULT.LESS : COMPARE_RESULT.EQUAL;
            }
        });
        const proxy = map.createProxy((p) => {
            if (typeof p === 'string') {
                try {
                    const obj = JSON.parse(p);
                    if (typeof obj.a === 'number' && typeof obj.b === 'number') {
                        return obj;
                    }
                    return null;
                } catch {
                    return null;
                }
            }
            return null;
        }, 0);

        proxy['{"a": 1, "b": 2}'] = 0;
        expect(proxy['{"a": 1, "b": 2}']).toEqual(0);
        proxy['{"a": 1, "b": 1}'] = 1;
        expect(map.size()).toEqual(2);
        proxy['{"a": 2, "b": 1}'] = 1;
        expect(map.size()).toEqual(2);
        expect(proxy['{"a": 1, "b": 2}']).toEqual(1);
    })
});