// Type definitions for generic-rbtree 1.0.0
// Project: https://github.com/geometryzen/generic-rbtree
//
// This file was created manually in order to support the generic-rbtree library.

export class RBNode<K, V> {
    /**
     * The left child link node.
     */
    l: RBNode<K, V>;
    /**
     * The right child link node.
     */
    r: RBNode<K, V>;
    /**
     * The parent of the node.
     */
    p: RBNode<K, V>;
    /**
     * The red (true) / black (false) flag.
     */
    flag: boolean;
    /**
     * Constructs a red-black binary tree node.
     */
    constructor(key: K, value: V);
    toString(): string;
}

/**
 * Defines the function used for comparing keys.
 */
export interface Comparator<K> {
    (a: K, b: K): -1 | 1 | 0;
}

/**
 * 
 */
export class RBTree<K, V> {
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
     * The "tail" node.
     * This allows our subtrees never to be undefined or null.
     * All searches will result in a node, but misses will return the tail node.
     */
    readonly z: RBNode<K, V>;
    /**
     * 
     */
    readonly highKey: K;
    /**
     * 
     */
    readonly lowKey: K;
    /**
     * The root property is the top level node in the tree.
     */
    root: RBNode<K, V>;
    /**
     * The number of keys inserted.
     */
    readonly N: number;
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
    /**
     * Initializes the RBTree.
     * It is important to define a key that is smaller than all expected keys
     * so that the first insert becomes the root (head.r).
     *
     * @param lowKey A key that is smaller than all expected keys.
     * @param highKey A key that is larger than all expected keys.
     * @param nilValue The value returned when a search is not successful.
     * @param comp The comparator used for comparing keys.
     */
    constructor(lowKey: K, highKey: K, nilValue: V, comp: Comparator<K>);
    /**
     * Inserts a (key, value) pair into the tree.
     */
    insert(key: K, value: V): RBNode<K, V>;
    /**
     * Searches for a value in the tree based upon a key.
     */
    search(key: K): V;
    /**
     * Removes the node specified by the key.
     */
    remove(key: K): void;
}
