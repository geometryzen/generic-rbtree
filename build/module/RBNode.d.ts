/**
 *
 */
export declare class RBNode<K, V> {
    key: K;
    value: V;
    /**
     * The left child link.
     */
    l: RBNode<K, V>;
    /**
     * The right child link.
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
