# Easy-map
这是一个c++风格的map， 底层使用红黑树实现
## Install
```shell
npm install @trudbot/map
```

## Usage

```typescript
import {EasyMap} from '@trudbot/map';

const map = new EasyMap<number, number>();

map.insert(1, 2);
map.insert(2, 3);
console.log(map.get(1)); // 2

map.erase(1);

console.log(map.get(1)); // null

const proxy = map.createProxy(p => {
    if (typeof p === 'number') return p;
    if (typeof p === 'string') {
        const num = parseInt(p);
        return isNaN(num) ? null : num;
    }
    return null;
}, 0);

console.log(proxy.get(2)); // 3
proxy[2] = 4;
console.log(proxy.get(2)); // 4
proxy[2] ++;
console.log(proxy.get(2)); // 5
```

## API

### `EasyMap<K, V>`
#### `constructor(config?: {compare?: Compare<K>})`
- `compare` 比较函数， 需要返回`COMPARE_RESULT`枚举值
```typescript
export type Compare<K> = (a: K, b: K) =>
    COMPARE_RESULT.MORE |  // a > b
    COMPARE_RESULT.EQUAL |  // a === b
    COMPARE_RESULT.LESS;  // a < b
```
**请注意, 当`compare`未提供时, 会直接使用key进行比较得到结果， 请确保是否符合预期尤其是key为引用类型时**

#### `insert(key: K, value: V): RBNode<K, V>`
插入一个键值对， 返回值为插入的节点
#### `set(key: K, value: V): RBNode<K, V>`
`insert`的别名
#### `erase(key: K): RBNode<K, V> | null`
删除一个键值对， 返回删除的节点
#### `get(key: K): V | null`
获取一个键值对， 如果不存在则返回`null`
#### `clear()`
清空所有键值对
#### `keys(): K[]`
返回所有的键, 按键升序
#### `values(): V[]`
返回所有的值, 按键升序
#### `entries(): {key: K, value:V}[]`
返回所有的键值对, 按键升序
#### `size(): number`
返回map中键值对的数量
#### `count(key: K): number`
返回指定键的数量， 0或1
#### `has(key: K): boolean`
返回map中是否存在指定键
#### `createProxy(transform: (key: K) => T, defaultValue: V): ProxyMap<T>`
创建一个map代理, 代理 支持通过中括号表达式存取键值对。
#### `forEach(callback: (value: V, key: K, map: EasyMap<K, V>) => void): void`
按键升序遍历map中的键值对
### ProxyMap
proxyMap支持通过中括号表达式存取键值对, 更贴近cpp风格的map。
通过`createProxy`方法创建proxyMap。
#### `transform(p: PropertyKey): V`
在createProxy时传入的转换函数， 用于将中括号表达式的键转换为map中的键
`PropertyKey`是`string | number | symbol`的联合类型。
```typescript
const map = new map<number, number>({defaultValue: 0});
const proxy = map.createProxy(p => {
    if (typeof p === 'number') return p;
    if (typeof p === 'string') {
        const num = parseInt(p);
        return isNaN(num) ? null : num;
    }
    return null;
});

proxy[1] // map.get(1)
proxy[1] = 2 // map.insert(1, 2)， 此处与insert不完全等价, 因为proxy[1]只会返回true
delete proxy[1] // map.erase(1), 此处与erase不完全等价, 因为delete proxy[1]只会返回true
1 in proxy  // map.has(1)
proxy[1] ++ // map.insert(1, map.get(1))
// ...
```
#### `defaultValue: V` 默认值
该值只会在使用`proxy`时起作用, 如
```typescript
const map = new map<number, number>();
const proxy = map.createProxy(p => {
    if (typeof p === 'number') return p;
    if (typeof p === 'string') {
        const num = parseInt(p);
        return isNaN(num) ? null : num;
    }
    return null;
}, 100);

console.log(proxy[1]); // 100
```