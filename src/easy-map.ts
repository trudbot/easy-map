import {Compare, RBTree} from "./rb-tree/rb-tree";
import {RBNode} from "./rb-tree/rb-node";

export class EasyMap<K, V> extends RBTree<K, V>{
    private __size: number = 0;
    private values_cache: V[] | null = null;
    private keys_cache: K[] | null = null;
    private entries_cache: {key: K, value: V}[] | null = null;

    constructor(compare?: Compare<K>) {
        super(compare);
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
    }

    insert(key: K, value: V) {
        this.__size ++;
        return super.insert(key, value, (node) => {
            this.__size --;
            node.value = value;
        });
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

    size() {
        return this.__size;
    }

    clear() {
        this.root = null;
        this.__size = 0;
        this.clearCache();
    }

    get(key: K) {
        const value = super.get(key);
        return value;
    }

    keys() {
        if (this.keys_cache === null) {
            this.getEntries();
        }
        return this.keys_cache;
    }

    values() {
        if (this.values_cache === null) {
            this.getEntries();
        }
        return this.values_cache;
    }

    entries() {
        if (this.entries_cache === null) {
            this.getEntries();
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
}
