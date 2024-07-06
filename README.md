# Easy-map
这是一个c++风格的map， 底层使用红黑树实现
## Install
```shell
npm install @trudbot/map
```

## 使用
```typescript
import {EasyMap} from '@trudbot/map';
const map = new EasyMap<number, string>();

map.insert(1, 'a');
console.log(map.get(1))// a;
map.erase(1); 
console.log(map.get(1))// null;
```