import {Compare, RBTree} from "./rb-tree/rb-tree";
import {RBNode} from "./rb-tree/rb-node";

export class EasyMap<K extends {}, V> extends RBTree<K, V>{
    private __size: number = 0;
    private values_cache: Readonly<V>[] | null = null;
    private keys_cache: Readonly<K>[] | null = null;
    private entries_cache: Readonly<{key: K, value: V}>[] | null = null;

    constructor(config?: {compare?: Compare<K>}) {
        super(config?.compare);
    }

    private clearCache() {
        this.values_cache = null;
        this.keys_cache = null;
        this.entries_cache = null;
    }

    private getEntries() {
        this.entries_cache = [];
        this.keys_cache = [];
        this.values_cache = [];

        const dfs = (node: RBNode<K, V> | null) => {
            if (node === null) return;
            dfs(node.left);
            this.entries_cache!.push({key: node.key, value: node.value});
            this.keys_cache!.push(node.key);
            this.values_cache!.push(node.value);
            dfs(node.right);
        }

        dfs(this.root);

        return {
            entries: this.entries_cache,
            keys: this.keys_cache,
            values: this.values_cache
        }
    }

    insert(key: K, value: V) {
        this.__size ++;
        this.clearCache();
        return super.insert(key, value, (node) => {
            this.__size --;
            node.value = value;
        });
    }

    set(key: K, value: V) {
        this.insert(key, value);
    }

    erase(key: K): null | RBNode<K, V> {
        const node =  super.erase(key);
        if (node !== null) {
            this.__size --;
            this.clearCache();
        }
        return node;
    }

    count(key: K) {
        return this.searchNode(this.root, key) ? 1 : 0;
    }

    has(key: K) {
        return this.count(key) > 0;
    }

    size() {
        return this.__size;
    }

    clear() {
        this.root = null;
        this.__size = 0;
        this.clearCache();
    }

    get(key: K) {
        return super.get(key);
    }

    keys() {
        if (this.keys_cache === null) {
            return this.getEntries()['keys'];
        }
        return this.keys_cache;
    }

    values() {
        if (this.values_cache === null) {
            return this.getEntries()['values'];
        }
        return this.values_cache;
    }

    entries() {
        if (this.entries_cache === null) {
            return this.getEntries()['entries'];
        }
        return this.entries_cache;
    }

    forEach(callback: (value: V, key: K, map: EasyMap<K, V>) => void) {
        if (this.entries_cache === null) {
            this.getEntries();
        }
        this.entries_cache!.forEach(entry => {
            callback(entry.value, entry.key, this);
        });
    }

    createProxy(transform: (p: PropertyKey) => K | null, defaultValue: V) {
        const _map = this;
        type TargetType = {
            [key: string]: V;
            [Symbol.iterator]: () => IterableIterator<Readonly<[Readonly<K>, Readonly<V>]>>;
        }
        const target: TargetType = {
            *[Symbol.iterator]() {
                for (const entry of _map.entries()) {
                    yield [entry.key, entry.value];
                }
            }
        };
        type ProxyReturn<A> = A extends (typeof Symbol.iterator) 
            ? IterableIterator<Readonly<[Readonly<K>, Readonly<V>]>> :
            A extends PropertyKey ? V : never;

        return new Proxy(target, {
            get<P extends (PropertyKey | typeof Symbol.iterator)>(_target: TargetType, p: P): ProxyReturn<P> {
                if (p === Symbol.iterator) {
                    return target[Symbol.iterator] as ProxyReturn<P>;
                }
                const key = transform(p);
                if (key === null) throw new Error('Invalid key');
                const v = _map.get(key);
                if (v === null) return defaultValue as ProxyReturn<P>;
                return v as ProxyReturn<P>;
            },
            set(_target, p: PropertyKey, value: V): boolean {
                const key = transform(p);
                if (key === null) return false;
                _map.insert(key, value);
                return true;
            },
            has(_target, p: PropertyKey): boolean {
                const key = transform(p);
                if (key === null) throw new Error('Invalid key');
                return _map.count(key) > 0;
            },
            deleteProperty(_target, p: PropertyKey): boolean {
                const key = transform(p);
                if (key === null) return false;
                _map.erase(key);
                return true;
            }
        });
    }
}
