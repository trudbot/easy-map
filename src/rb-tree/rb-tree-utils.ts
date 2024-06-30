import { RBTree } from "./rb-tree";

export function transformToMermaid(tree: RBTree<any, any>) {
  const root = tree.getRoot();
  if (!root) return '';
  let result = 'flowChart TD\n';
  function dfs(root: any) {
    if (root === null) return;
    result += `class ${root.key} ${root.isRed() ? 'red' : 'black'}\n`;
    if (root.left) {
        result += `${root.key} --> ${root.left.key}\n`;
    }
    if (root.right) {
        result += `${root.key} --> ${root.right.key}\n`;
    }
    dfs(root.left);
    dfs(root.right);
  }
  result += `classDef red fill:red,stroke:none,color:white\n`;
  result += `classDef black fill:black,stroke:none,color:white\n`;
}