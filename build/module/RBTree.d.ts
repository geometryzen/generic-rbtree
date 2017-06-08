import { RBNode } from './RBNode';
export interface Comparator<K> {
    (a: K, b: K): (-1 | 1 | 0);
}
export declare class RBTree<K, V> {
    readonly highKey: K;
    private comp;
    /**
     * The "head" node is provided to make insertion easier.
     * It is not the root.
     * It is not actually part of the tree.
     * The right link of head points to the actual root node of the tree.
     * The left link of the `head` is not used, so we store the tail node, z in it.
     * The key for head is smaller than all other keys, consistent with the use of the right link.
     */
    readonly head: RBNode<K, V>;
    /**
     * The number of keys inserted.
     */
    N: number;
    private highNode;
    private lowNode;
    /**
     * Initializes an RBTree.
     * It is important to define a key that is smaller than all expected keys
     * so that the first insert becomes the root (head.r).
     *
     * @param lowKey A key that is smaller than all expected keys.
     * @param highKey A key that is larger than all expected keys.
     * @param nilValue The value to return when a search is not successful.
     * @param comp The comparator used for comparing keys.
     */
    constructor(lowKey: K, highKey: K, nilValue: V, comp: Comparator<K>);
    root: RBNode<K, V>;
    /**
     * The "tail" node.
     * This allows our subtrees never to be undefined or null.
     * All searches will result in a node, but misses will return the tail node.
     */
    readonly z: RBNode<K, V>;
    readonly lowKey: K;
    /**
     * Legal means that is greater than the key stored in the head node.
     * The key does not have to exist.
     */
    private assertLegalKey(key, comp);
    /**
     *
     */
    insert(key: K, value: V): RBNode<K, V>;
    /**
     * Greatest Lower Bound of a key.
     * Returns the node corresponding to the key if it exists, or the next lowest key.
     * Returns null if there is no smaller key in the tree.
     */
    glb(key: K): RBNode<K, V> | null;
    /**
     * Least Upper Bound of a key.
     * Returns the node corresponding to the key if it exists, or the next highest key.
     * Returns null if there is no greater key in the tree.
     */
    lub(key: K): RBNode<K, V> | null;
    /**
     *
     */
    search(key: K): V;
    /**
     *
     * @param key
     */
    remove(key: K): void;
    /**
     * Determines whether this tree satisfies the height invariant.
     * The height invariant is that the number of black nodes in every path to leaf nodes should be the same.
     * This property is for testing only; it traverses the tree and so affects performance.
     */
    readonly heightInvariant: boolean;
    /**
     * Determines whether this tree satisfies the color invarant.
     * The color invariant is that no two adjacent nodes should be colored red.
     * This property is for testing only; it traverses the treeand so affects performance.
     */
    readonly colorInvariant: boolean;
}
