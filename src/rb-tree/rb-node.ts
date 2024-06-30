type COLOR = "RED" | "BLACK";
export type NIL = null;
export enum DIRECTION {
  LEFT = 'left',
  RIGHT = 'right',
  ROOT = 'root'
}

export class TreeNode<K, V, N extends TreeNode<K, V, N>> {
  key: K;
  value: V;
  left: N | NIL = null;
  right: N | NIL = null;
  parent: N | NIL = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }

  isRoot() {
    return this.parent === null;
  }

  isLeaf() {
    return this.left === null && this.right === null;
  }
  
  setLeftChild(child: N | null) {
    this.left = child;
    child && (child.parent = this as unknown as N);
    return this;
  }
  
  setRightChild(child: N | null) {
    this.right = child;
    child && (child.parent = this as unknown as N);
    return this;
  }

  direction() {
    if (this.parent === null) return DIRECTION.ROOT;
    if (this.parent.left === this as unknown as N) return DIRECTION.LEFT;
    else return DIRECTION.RIGHT;
  }

  sibling() {
    const direct = this.direction();
    if (direct === DIRECTION.LEFT) {
      return this.parent?.right;
    } else {
      return this.parent?.left;
    }
  }

  hasSibling() {
    return !this.isRoot() && this.sibling();
  }

  uncle() {
    return this.parent?.sibling() || null;
  }

  hasUncle() {
    return this.parent?.hasSibling();
  }
}

const tree = new TreeNode('1', 2);

export class RBNode<K, V> extends TreeNode<K, V, RBNode<K, V>> {
  color: COLOR = "RED";

  constructor(key: K, value: V) {
    super(key, value);
  }

  isRed() {
    return this.color === "RED";
  }
  
  isBlack() {
    return this.color === "BLACK"
  }

  setBlack() {
    this.color = "BLACK";
    return this;
  }
  
  setRed() {
    this.color = "RED";
    return this;
  }

  static isRed(node: RBNode<any, any> | null) {
    return node && node.isRed();
  }

  static isBlack(node: RBNode<any, any> | null) {
    return !node || node.isBlack();
  }
}
