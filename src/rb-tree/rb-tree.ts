import { RBNode, NIL, DIRECTION, TreeNode } from './rb-node';
const isDev = false;

export enum COMPARE_RESULT {
  EQUAL = 0,
  LESS = -1,
  MORE = 1
}

export type Compare<K> = (a: K, b: K) =>
  COMPARE_RESULT.MORE |  // a > b
  COMPARE_RESULT.EQUAL |  // a === b
  COMPARE_RESULT.LESS;  // a < b

/**
 * newChild替换oldChild的位置, par
 * @param parent oldChild的父结点
 * @param oldChild 原结点
 * @param newChild 新结点
 * @param setRoot 将新结点设置为根结点
 */
function changeChild<N extends TreeNode<any, any, N>>(parent: N, oldChild: N, newChild: N | null, setRoot?: (node: N | null) => void) {
  switch (oldChild.direction()) {
    case DIRECTION.LEFT:
      parent.setLeftChild(newChild);
      break;
    case DIRECTION.RIGHT:
      parent.setRightChild(newChild);
      break;
    case DIRECTION.ROOT:
      setRoot && setRoot(newChild);
      break;
  }
}

export class BSTree<K, V, N extends TreeNode<K, V, N>> {
  protected root: N | NIL = null;
  protected compare: Compare<K>;

  constructor(compare?: Compare<K>) {
    this.compare = compare || ((a, b) => {
      return a === b ? 0 : (a > b ? 1 : -1);
    });
  }

  setRoot(node: N | null) {
    this.root = node;
    node && (node.parent = null);
  }

  getRoot() {
    return this.root;
  }

  /**
   * 递归地将结点插入二叉搜索树
   * @param root 被插入的树的根
   * @param node 插入的结点
   * @param replace 结点key相同时是否直接替换
   * @returns 是否先插入了一个结点
   */
  protected insertNode(root: N | null, node: N, replace: boolean = true): N {
    if (root === null) {
      this.setRoot(node);
      return node;
    }
    const compareResult = this.compare(root.key, node.key);
    if (compareResult === COMPARE_RESULT.EQUAL) {
      replace && (root.value = node.value);
      return root;
    } else if (compareResult === COMPARE_RESULT.MORE) {
      if (root.left !== null) {
        return this.insertNode(root.left, node, replace);
      } else {
        root.setLeftChild(node);
      }
    } else {
      if (root.right !== null) {
        return this.insertNode(root.right, node, replace);
      } else {
        root.setRightChild(node);
      }
    }
    return node;
  }

  insert(key: K, value: V) {
    const node = new TreeNode(key, value) as N;
    return this.insertNode(this.root, node);
  }

  erase(key: K): N | null {
    return this.eraseNode(this.root, key);
  }

  get(key: K) {
    const node = this.searchNode(this.root, key);
    return node ? node.value : null;
  }

  /**
   * 根据键值在树中查找结点
   * @param root 子树根
   * @param key 欲删除的键值
   * @returns 查找结果 Node | null
   */
  protected searchNode(root: N | null, key: K): N | null {
    if (root === null) return null;
    const compareResult = this.compare(root.key, key);
    switch (compareResult) {
      case COMPARE_RESULT.EQUAL:
        return root;
      case COMPARE_RESULT.LESS:
        return this.searchNode(root.right, key);
      case COMPARE_RESULT.MORE:
        return this.searchNode(root.left, key);
    }
  }

  /**
   * 根据键值在树中删除一个结点, 并返回删除的结点
   * 
   */
  protected eraseNode(root: N | null, key: K, swapData?: (target: N, source: N) => void): N | null {
    const node = this.searchNode(root, key);

    if (node === null) return null;

    if (node.left && node.right) {
      // node有两个孩子, 使用前驱结点替换node
      const leftMax = this.leftMaxNode(node)!;
      console.assert(leftMax !== null, "leftMax should not be null when node has two children");
      // 前驱结点与node交换数据
      if (swapData) {
        swapData(node, leftMax!);
      } else {
        const tempKey = node.key;
        const tempValue = node.value;
        node.key = leftMax.key;
        node.value = leftMax.value;
        leftMax.key = tempKey;
        leftMax.value = tempValue;
      }

      // 删除原前驱结点, 前驱结点必然没有右儿子
      const leftMaxParent = leftMax.parent!;
      console.assert(leftMaxParent !== null, "leftMax should have parent");
      console.assert(leftMax.right === null, "leftMax should not have right child");
      changeChild<N>(leftMaxParent, leftMax, leftMax.left, (node) => {
        this.setRoot(node);
      });
      return leftMax;
    } else if (node.left) {
      // 左结点顶替node位置
      const parent = node.parent;
      changeChild(parent!, node, node.left, (node) => {
        this.setRoot(node);
      });
    } else if (node.right) {
      // 右结点顶替node位置
      const parent = node.parent;
      changeChild(parent!, node, node.right, (node) => {
        this.setRoot(node);
      });
    } else {
      // node为叶子结点, 直接删除
      changeChild<N>(node.parent!, node, null, (node) => {
        this.setRoot(node);
      });
    }
    return node;
  }

  /**
   * 左子树中的最大key结点
   * @param root 子树根
   * @returns 
   */
  protected leftMaxNode(root: N | null): N | null {
    if (root === null || root.left === null) return null;
    let node = root.left!;
    while (node.right !== null) {
      node = node.right;
    }
    return node;
  }

  /**
   * 左旋操作
   * @param node 左旋的子树根结点, 需要保证不为空且右子树不为空
   *
   *        g           p
   *       / \         / \
   *      u   p  -->  g   n
   *         / \     / \
   *        m   n   u   m
   */
  protected rotateLeft(node: N) {
    console.assert(node !== null && node.right !== null, "node and node->left should not be null in rotateLeft");
    const parent = node.parent;
    const direction = node.direction();
    const successor = node.right!;
    // 左旋核心操作, 根变为successor的左子树, successor变为根
    node.setRightChild(successor.left);
    successor.setLeftChild(node);

    // node的位置为successor取代, 需要更新node的父结点与successor的关系
    switch (direction) {
      case DIRECTION.LEFT:
        console.assert(parent !== null, "parent should not be null when direction is left");
        parent!.setLeftChild(successor);
        break;
      case DIRECTION.RIGHT:
        console.assert(parent !== null, "parent should not be null when direction is right");
        parent!.setRightChild(successor);
        break;
      case DIRECTION.ROOT:
        this.setRoot(successor);
        break;
    }
  }

  /**
   * 右旋操作
   * @param node 右旋的子树根结点, 需要保证不为空且左子树不为空
   *
   *        g           p
   *       / \         / \
   *      p   u  -->  n   g
   *     /  \            / \
   *    n    m          m   u
   */
  protected rotateRight(node: N) {
    console.assert(node !== null && node.left !== null, "node and node->left should not be null in rotateRight");

    const parent = node.parent;
    const direction = node.direction();
    const successor = node.left!;

    node.setLeftChild(successor.right);
    successor.setRightChild(node);

    switch (direction) {
      case DIRECTION.LEFT:
        console.assert(parent !== null, "parent should not be null when direction is left");
        parent!.setLeftChild(successor);
        break;
      case DIRECTION.RIGHT:
        console.assert(parent !== null, "parent should not be null when direction is right");
        parent!.setRightChild(successor);
        break;
      case DIRECTION.ROOT:
        this.setRoot(successor);
        break;
    }
  }
}

/**
 * 红黑树
 * 参考linux红黑树源码: https://elixir.bootlin.com/linux/latest/source/lib/rbtree.c
 * 遵循性质如下:
 * 1. 每个结点要么是红色, 要么是黑色
 * 2. root是黑色
 * 3. 每个叶结点(NIL)是黑色
 * 4. 红色结点的子结点都是黑色
 * 5. 从任意结点到其每个叶结点的路径上包含相同数量的黑色结点
 * 
 */
export class RBTree<K, V> extends BSTree<K, V, RBNode<K, V>> {

  constructor(compare?: Compare<K>) {
    super(compare);
  }

  get(key: K) {
    const node = this.searchNode(this.root, key);
    return node ? node.value : null;
  }

  insert(key: K, value: V, alearyExist?: (node: RBNode<K, V>) => void) {
    const search = this.searchNode(this.root, key);
    if (search) {
        alearyExist ? alearyExist(search) : (search.value = value);
        return search;
    } else {
      const node = this.insertNode(this.root, new RBNode(key, value));
      this.afterInsert(node);
      return node;
    }
  }

  /**
   * 维护插入结点后的树使其满足红黑树性质
   * @node 刚被插入的结点
   */
  protected afterInsert(node: RBNode<K, V>) {
    /**
     * case1: 插入的结点为根节点
     * 将其染黑即可
     */
    if (node.isRoot()) {
      node.setBlack();
      isDev && console.log('case1');
      return;
    }

    // 插入结点的父结点, 以父亲代称
    const parent = node.parent!;

    console.assert(parent !== null, "parent should not be null while node is not root");

    /**
     * case2: 插入结点的父结点为黑色
     * 不会破坏红黑树性质, 直接结束
     */
    if (parent.isBlack()) {
      isDev && console.log('case2');
      return;
    }

    // 插入结点的爷爷结点, 以爷爷代称
    // 爷爷必然存在, 因为如果父亲是根节点, 必然是黑色, 那么不会进入这一步
    const gparent = parent.parent!;
    console.assert(gparent !== null, "gparent should not be null in pass case2");

    // 叔叔
    const uncle = gparent && node.uncle();

    /**
     * case3: 父亲和叔叔都为红色
     *
     *       G            g
     *      / \          / \
     *     p   u  -->   P   U
     *    /            /
     *   n            n
     * step1: 将爷爷变为红色, 叔叔和父亲变为黑色
     *  此时爷爷子树符合红黑树性质且深度不变, 但由于爷爷变为了红色可能会破坏更上层的性质, 所以需要递归维护爷爷
     * step2: 将爷爷视为刚插入的红色结点, 递归的进行维护
     */
    if (RBNode.isRed(uncle)) {
      isDev && console.log('case3');
      console.assert(uncle !== null, "uncle should not be null when uncle is red");
      uncle!.setBlack();
      parent.setBlack();
      gparent.setRed();
      this.afterInsert(gparent);
      return;
    }

    /**
     * 叔叔为黑色(或不存在)
     */
    if (RBNode.isBlack(uncle)) {
      /**
       * case4: 父亲为红色, 叔叔为黑色(或不存在), 且插入结点与父结点异向(LR/RL型失衡)
       * 👎p方向为左， 则对p进行左旋; 反之右旋。
       * 以左举例, p左旋后, p和n的方向都变为了左, 即同向, 此时问题转化为了case5(插入的结点变成了parent
       *        G           G
       *       / \         / \
       *      p   U  -->  n   U
       *     /  \        / \
       *    m    n      p   q
       *        / \    / \
       *       o   q  m   o
       */

      if (parent.direction() !== node.direction()) {
        isDev && console.log('case4');
        if (parent.direction() === DIRECTION.LEFT) {
          this.rotateLeft(parent);
        } else {
          this.rotateRight(parent);
        }
        this.afterInsert(parent);
        return;
      }

      /**
       * case5: 父亲为红色, 叔叔为黑色(或不存在), 且插入结点与父结点同向(LL/RR型失衡)
       *
       *        (LL型失衡——右旋)
       *        G           P
       *       / \         / \
       *      p   U  -->  n   g
       *     /  \            / \
       *    n    m          m   U
       * 
       *         (RR型失衡——左旋)
       *        G           P
       *       / \         / \
       *      U   p  -->  g   n
       *         / \     / \
       *        m   n   U   m
       * 
       * 初始情况: 不符合(4)
       * step1: 基于爷爷做(LL: 右旋, RR: 左旋)
       * 此时父亲移动到了爷爷的位置, 爷爷在叔叔方向下移， 此时插入结点所在分支的黑色深度减一
       * 此时情况: 不符合(4)(5)
       * step2: 将父亲变为黑色， 爷爷变为红色
       * 爷爷所在分支黑色深度减一
       * 父亲变为黑色后， 整个子树的黑色深度加一， 插入前后的黑色深度没有变化
       * 同时p和n颜色也不同
       * 此时情况: 符合所有性质
       */
      if (parent.direction() === node.direction()) {
        isDev && console.log('case5');
        if (node.direction() === DIRECTION.LEFT) {
          // LL型失衡
          this.rotateRight(gparent);
        } else {
          // RR型失衡
          this.rotateLeft(gparent);
        }

        parent.setBlack();
        gparent.setRed();
      }
      return;
    }
    console.assert(false, "should not reach here in afterInsert");
  }

  erase(key: K) {
    // 注意此时delNode已从树中删除， 但delNode的parent、left、right等属性仍然可用
    let delNode = this.eraseNode(this.root, key, (target, source) => {
      const tempKey = target.key;
      const tempValue = target.value;
      target.key = source.key;
      target.value = source.value;
      source.key = tempKey;
      source.value = tempValue;
    });

    console.assert(delNode === null || delNode.key === key, `delNode should have the same key as key, ${key}, ${delNode?.key}`);
    /**
     * 当删除结点为null或者红色结点或者为树中唯一的结点时, 不需要进行调整
     */
    if (delNode === null || delNode.isRed() || this.root === null) return delNode;

    /**
     * 删除结点为黑色结点 && 有一个孩子(必为红色)
     * 直接将孩子染黑即可
     */
    if (delNode.left || delNode.right) {
      console.assert(!(delNode.left && delNode.right), "delNode should not have two children");
      delNode.left && delNode.left.setBlack();
      delNode.right && delNode.right.setBlack();
      return delNode;
    }
    /**
     * 删除结点为黑色叶子
     */
    this.afterErase(delNode.parent!, null);
    return delNode;
  }

  /**
   * node子树的黑色深度减一, 需要修正红黑树性质
   * @param parent 被删除结点的父结点
   * @param node 被删除的结点， 事实上node只需要用来帮助确认sibling和direction
   */
  protected afterErase(parent: RBNode<K, V>, node: RBNode<K, V> | null) {
    isDev && console.log('erase maintain');
    // 一直向上递归直到根节点,
    if (!parent) {
      isDev && console.log('case0');
      return;
    }
    /**
     * node必然有siblings, 因为node子树的黑色整体减一, 说明原来的黑色深度不为0， 所以sibling子树不为空
     */
    const sibling = (parent.left === node ? parent.right : parent.left)!;
    const direction = parent.left === node ? DIRECTION.LEFT : DIRECTION.RIGHT;
    console.assert(sibling !== null, "delNode must have sibling");

    /**
     * case1: sibling为红色
     * 此时p必然为黑色, n的侄子也必然为黑色
     * 以N方向为左举例
     * 1. 就p进行左旋
     * 2. 将p染红, 将s染黑
     * 
     * 此时N的sibling为Sl为黑色, 且S子树右分支性质未破坏
     * 继续维护即可
     *     P               S
     *    / \             / \
     *   N   s    -->    p   Sr
     *      / \         / \
     *     Sl  Sr      N   Sl
     *
     *     P               S
     *    / \             / \
     *   N   s    -->    p   Sr
     *      / \         / \
     *     Sl  Sr      N   Sl
     */
    if (sibling.isRed()) {
      isDev && console.log('case1');
      if (direction === DIRECTION.LEFT) {
        this.rotateLeft(parent);
      } else {
        this.rotateRight(parent);
      }
      sibling.setBlack();
      parent.setRed();
      this.afterErase(parent, node);
      return;
    }

    // closeNephew: sibling的方向与node相同的孩子
    // distantNephew: sibling的方向与node相反的孩子
    const closeNephew = sibling.direction() === DIRECTION.RIGHT ? sibling.left : sibling.right;
    const distantNephew = sibling.direction() === DIRECTION.RIGHT ? sibling.right : sibling.left;
    
    if (RBNode.isBlack(closeNephew) && RBNode.isBlack(distantNephew)) {
      sibling.setRed();
      /**
       * case2: sibling为黑色 && sibling的两个子结点都为黑色 && parent为红色
       * 将sibling染红, parent染黑即可
       * sibling分支的黑色数量不变, node分支的黑色数量+1抵消了node删除后减1
       */
      if (parent.isRed()) {
        isDev && console.log('case2');
        parent.setBlack();
        return;
      }
      /**
       * case3: sibling为黑色 && sibling的两个子结点都为黑色 && parent为黑色
       * 将sibling染红, 此时parent子树整体黑色深度减一, 将parent看作被删除的node, 递归维护
       */
      isDev && console.log('case3');
      this.afterErase(parent.parent!, parent);
      return;
    }

    /**
     * case4: closeNephew为红色, distantNephew为黑色
     * 基于sibling进行旋转, 转化为case5
     */
    if (RBNode.isRed(closeNephew) && RBNode.isBlack(distantNephew)) {
      isDev && console.log('case4');
      console.assert(closeNephew !== null, "closeNephew should not be null when closeNephew is red")
      if (direction === DIRECTION.LEFT) {
        this.rotateRight(sibling);
      } else {
        this.rotateLeft(sibling);
      }
      closeNephew?.setBlack();
      sibling.setRed();
      this.afterErase(parent, node);
      return;
    }

    /**
     * case5: closeNephew为黑色或红色, distantNephew为红色
     * 1. 基于parent进行旋转
     * 2. 将sibling的颜色变为parent的颜色, parent和distantNephew变为黑色
     */
    if (RBNode.isRed(distantNephew)) {
      isDev && console.log('case5');
      console.assert(distantNephew !== null, "distantNephew should not be null when distantNephew is red");
      if (sibling.direction() === DIRECTION.RIGHT) {
        this.rotateLeft(parent);
      } else {
        this.rotateRight(parent);
      }
      sibling.color = parent.color;
      parent.setBlack();
      distantNephew && distantNephew.setBlack();
    }
  }
}