import {EasyMap} from "./test-source";
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
    map.erase(seq[3]);
    expect(map.count(seq[3])).toEqual(0);
    expect(map.count(10000)).toEqual(0);
});

test('forEach 测试', () => {
    const sorted_seq = seq.toSorted((a, b) => a - b);
    seq.forEach(n => map.insert(n, n));
    let i = 0;
    map.forEach((value, key) => {
        expect(value).toEqual(sorted_seq[i ++]);
    });
});

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

describe('proxy测试', () => {
    let proxy: {[key: string]: number | null};
    beforeEach(() => {
       proxy = map.createProxy((p) => {
           if (typeof p === 'number') return p;
           if (typeof p === 'string') {
               const num = parseInt(p);
               if (isNaN(num)) return null;
                return num;
           }
           return null;
       });
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
            expect(proxy[value]).toEqual(null);
        });
    });

    test('+=, ++, -=, -- 测试', () => {
        proxy[1] = 2;
        (proxy[1] as number) ++;
        expect(proxy[1]).toEqual(3);
        (proxy[1] as number) += 10;
        expect(proxy[1]).toEqual(13);
        (proxy[1] as number) --;
        expect(proxy[1]).toEqual(12);
        (proxy[1] as number) -= 5;
        expect(proxy[1]).toEqual(7);
    });

    test('访问不存在的key 测试', () => {
       seq.forEach(n => expect(proxy[n]).toBeNull());
    });

    test('错误key测试', () => {
        expect(() => proxy['abc']).toThrow();
        expect(() => proxy[`{a: 1}`]).toThrow();
        expect(() => proxy['abc'] = 1).toThrow();
        expect(() => '{}' in proxy).toThrow();
        expect(() => delete proxy['=']).toThrow();
    });

    describe('带默认值的proxy测试', () => {
        beforeEach(() => {
           map = new EasyMap<number, number>({
                defaultValue: 0
           });
           proxy = map.createProxy((p) => {
               if (typeof p === 'number') return p;
               if (typeof p === 'string') return parseInt(p);
               return null;
           });
        });

        test('默认值测试', () => {
            seq100.forEach(n => expect(proxy[n]).toEqual(0));
            expect(1 in proxy).toBeFalsy();
        });

        test('+=, ++, -=, -- 测试', () => {
            expect(proxy[100]).toEqual(0);
            (proxy[100] as number) ++;
            expect(proxy[100]).toEqual(1);
            (proxy[100] as number) += 10;
            expect(proxy[100]).toEqual(11);
            (proxy[100] as number) --;
            expect(proxy[100]).toEqual(10);
            (proxy[100] as number) -= 5;
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
            expect(proxy[seq100[0]]).toEqual(null);
        });

        test('clear后proxy测试', () => {
            seq100.forEach(n => proxy[n] = n);
            expect(proxy[seq100[0]]).toEqual(seq100[0]);
            map.clear();
            seq100.length && expect(proxy[seq100[0]]).toEqual(null);
            seq100.length > 50 && expect(proxy[seq100[50]]).toEqual(null);
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
});