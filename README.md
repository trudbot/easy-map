# Easy-map
这是一个c++风格的map， 底层使用红黑树实现
## Install
```shell
npm install @trudbot/map
```

## 使用
> 暂时还没有进行易用性封装
```typescript
import {RBTree} from '@trudbot/map';
const tree = new RBTree<string, number>();
tree.insert('trudbot', 100);
tree.inser('trudy', 200);

console.log(tree.get('trudbot')); // 100
tree.erase('trudbot');
console.log(tree.get('trudy')); // 200
```