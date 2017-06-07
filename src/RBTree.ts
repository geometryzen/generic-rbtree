import { RBNode } from './RBNode';

export interface Comparator<K> {
    (a: K, b: K): (-1 | 1 | 0);
}

export class RBTree<K, V> {
    /**
     * The "head" node is provided to make insertion easier.
     * It is not the root.
     * It is not actually part of the tree.
     * The right link of head points to the actual root node of the tree.
     * The left link of the `head` is not used, so we store the tail node, z in it.
     * The key for head is smaller than all other keys, consistent with the use of the right link.
     */
    public readonly head: RBNode<K, V>;
    /**
     * The number of keys inserted.
     */
    public N = 0;

    /**
     * Initializes an RBTree.
     * It is important to define a key that is smaller than all expected keys
     * so that the first insert becomes the root (head.r).
     *
     * @param lowKey A key that is smaller than all expected keys.
     * @param nilValue The value to return when a search is not successful.
     * @param comp The comparator used for comparing keys.
     */
    constructor(lowKey: K, nilValue: V, private comp: Comparator<K>) {
        const z = new RBNode<K, V>(lowKey, nilValue);
        this.head = new RBNode<K, V>(lowKey, nilValue);
        // Head left is never used or changed so we'll store the tail node there.
        this.head.l = z;
        // Head right refers the the actual tree root which is currently empty.
        this.head.r = z;
        this.head.p = this.head;
    }

    get root(): RBNode<K, V> {
        return this.head.r;
    }

    set root(root: RBNode<K, V>) {
        this.head.r = root;
    }

    /**
     * The "tail" node.
     * This allows our subtrees never to be undefined or null.
     * All searches will result in a node, but misses will return the tail node.
     */
    get z(): RBNode<K, V> {
        return this.head.l;
    }

    private assertLegalKey(key: K, comp: Comparator<K>): void {
        if (comp(key, this.head.key) <= 0) {
            throw new Error(`key, ${key}, must be greater than the head key, ${this.head.key}.`);
        }
    }

    /**
     *
     */
    insert(key: K, value: V): RBNode<K, V> {
        const comp = this.comp;
        this.assertLegalKey(key, comp);

        const n = new RBNode(key, value);

        rbInsert(this, n, comp);

        this.root.flag = false;
        // Update the count of nodes inserted.
        this.N += 1;
        return n;
    }

    /**
     *
     */
    search(key: K): V {
        const comp = this.comp;
        this.assertLegalKey(key, comp);
        /**
         * The current node for the search.
         */
        let x = this.root;

        // The search will always be "successful" but may end with z.
        this.z.key = key;

        while (comp(key, x.key) !== 0) {
            x = comp(key, x.key) < 0 ? x.l : x.r;
        }

        return x.value;
    }

    /**
     *
     * @param key
     */
    remove(key: K): void {
        const comp = this.comp;
        this.assertLegalKey(key, comp);

        const head = this.head;
        const z = this.z;
        /**
         * The current node for the search, we begin at the root.
         */
        let x = this.root;

        /**
         * The parent of the current node.
         */
        let p = head;

        // The search will always be "successful" but may end with z.
        z.key = key;

        // Search in the normal way to get p and x.
        while (comp(key, x.key) !== 0) {
            p = x;
            x = comp(key, x.key) < 0 ? x.l : x.r;
        }

        // Our search has terminated and x is either the node to be removed or z.
        /**
         * A reference to the node that we will be removing.
         * This may point to z, but the following code also works in that case.
         */
        const t = x;

        // From now on we will be making x reference the node that replaces t.

        if (t.r === z) {
            // The node t has no right child.
            // The node that replaces t will be the left child of t.
            x = t.l;
        }
        else if (t.r.l === z) {
            // The node t has a right child with no left child.
            // This empty slot can be used to accept t.l
            x = t.r;
            x.l = t.l;
        }
        else {
            // The node with the next highest key must be in the r-l-l-l-l... path with a left child equal to z.
            // It can't be anywhere else of there would be an intervening key.
            // Note also that the previous tests have eliminated the case where
            // there is no highets key. This node with the next highest key must have
            // the property that it has an empty left child.
            let c = t.r;
            while (c.l.l !== z) {
                c = c.l;
            }
            // We exit from the loop when c.l.l equals z, which means that c.l is the node that
            // we want to use to replace t.
            x = c.l;

            c.l = x.r;
            x.l = t.l;
            x.r = t.r;
        }
        // We can now free the t node (if we need to do so).
        // Finally, account for whether t was the left or right child of p.
        if (comp(key, p.key) < 0) {
            p.l = x;
        }
        else {
            p.r = x;
        }
    }

    /**
     * Determines whether this tree satisfies the height invariant.
     * The height invariant is that the number of black nodes in every path to leaf nodes should be the same.
     * This property is for testing only; it traverses the tree and so affects performance.
     */
    get heightInvariant(): boolean {
        return heightInv(this.root, this.z);
    }
    /**
     * Determines whether this tree satisfies the color invarant.
     * The color invariant is that no two adjacent nodes should be colored red.
     * This property is for testing only; it traverses the treeand so affects performance.
     */
    get colorInvariant(): boolean {
        return colorInv(this.root, this.head.flag, this.z);
    }
}

function colorFlip<K, V>(p: RBNode<K, V>, g: RBNode<K, V>, gg: RBNode<K, V>): RBNode<K, V> {
    p.flag = false;
    g.flag = true;
    gg.flag = false;
    return g;
}

/**
 * z, x, y are in diamond-left formation.
 * z is the initial leader and is black.
 * x and y are initially red.
 *
 * z moves right and back.
 * y takes the lead.
 * children a,b of y are adopted by x and z.
 * x becomes black.
 *
 *    z          y
 * x    =>    x     z
 *    y        a   b
 *  a   b
 */
function diamondLeftToVic<K, V>(lead: RBNode<K, V>): RBNode<K, V> {
    const m = lead.p;
    const z = lead;
    const x = z.l;
    const y = x.r;
    const a = y.l;
    const b = y.r;
    x.flag = false;
    y.l = x; x.p = y;
    y.r = z; z.p = y;
    x.r = a; a.p = x;
    z.l = b; b.p = z;
    if (m.r === lead) { m.r = y; } else { m.l = y; } y.p = m;
    return y;
}

/**
 * x, z, y are in diamond-right formation.
 * x is the initial leader and is black.
 * z and y are initially red.
 *
 * x moves left and back
 * y takes the lead.
 * z becomes black.
 *
 *    x          y
 *       z => x     z
 *    y        a   b
 *  a   b
 */
function diamondRightToVic<K, V>(lead: RBNode<K, V>): RBNode<K, V> {
    const m = lead.p;
    const x = lead;
    const z = x.r;
    const y = z.l;
    const a = y.l;
    const b = y.r;
    z.flag = false;
    y.l = x; x.p = y;
    y.r = z; z.p = y;
    x.r = a; a.p = x;
    z.l = b; b.p = z;
    if (m.r === lead) { m.r = y; } else { m.l = y; } y.p = m;
    return y;
}

function echelonLeftToVic<K, V>(lead: RBNode<K, V>): RBNode<K, V> {
    const m = lead.p;
    const z = lead;
    const y = z.l;
    const a = y.r;
    y.l.flag = false;
    y.r = z; z.p = y;
    z.l = a; a.p = z;
    if (m.r === lead) { m.r = y; } else { m.l = y; } y.p = m;
    return y;
}

function echelonRightToVic<K, V>(lead: RBNode<K, V>): RBNode<K, V> {
    const m = lead.p;
    const x = lead;
    const y = x.r;
    const a = y.l;
    y.r.flag = false;
    y.l = x; x.p = y;
    x.r = a; a.p = x;
    if (m.r === lead) { m.r = y; } else { m.l = y; } y.p = m;
    return y;
}

function colorInv<K, V>(node: RBNode<K, V>, redParent: boolean, z: RBNode<K, V>): boolean {
    if (node === z) {
        return true;
    }
    else if (redParent && node.flag) {
        return false;
    }
    else {
        return colorInv(node.l, node.flag, z) && colorInv(node.r, node.flag, z);
    }
}

function heightInv<K, V>(node: RBNode<K, V>, z: RBNode<K, V>): boolean {
    return blackHeight(node, z) >= 0;
}

/**
 * Computes the number of black nodes (including z) on the path from x to leaf, not counting x.
 * The height does not include itself.
 * z nodes are black.
 */
function blackHeight<K, V>(x: RBNode<K, V>, z: RBNode<K, V>): number {
    if (x === z) {
        return 0;
    }
    else {
        const hL = blackHeight(x.l, z);
        if (hL >= 0) {
            const hR = blackHeight(x.r, z);
            if (hR >= 0) {
                if (hR === hR) {
                    return x.flag ? hL : hL + 1;
                }
            }
        }
        return -1;
    }
}

function rbInsert<K, V>(tree: RBTree<K, V>, n: RBNode<K, V>, comp: Comparator<K>): void {
    const key = n.key;
    const z = tree.z;
    let x = tree.root;
    x.p = tree.head;

    while (x !== z) {
        x.l.p = x;
        x.r.p = x;
        x = comp(key, x.key) < 0 ? x.l : x.r;
    }

    n.p = x.p;

    if (x.p === tree.head) {
        tree.root = n;
    }
    else {
        if (comp(key, x.p.key) < 0) {
            x.p.l = n;
        }
        else {
            x.p.r = n;
        }
    }
    n.l = z;
    n.r = z;
    if (n.p.flag) {
        rbInsertFixup(tree, n);
    }
    else {
        n.flag = true;
    }
}

/**
 * In this algorithm we start with the node that has been inserted and make our way up the tree.
 * This requires carefully maintaining parent pointers.
 */
function rbInsertFixup<K, V>(tree: RBTree<K, V>, n: RBNode<K, V>): void {
    // When inserting the node (at any place other than the root), we always color it red.
    // This is so that we don't violate the height invariant.
    // However, this may violate the color invariant, which we address by recursing back up the tree.
    n.flag = true;

    if (!n.p.flag) {
        throw new Error("n.p must be red.");
    }

    while (n.flag) {
        /**
         * The parent of n.
         */
        const p = n.p;
        if (n === tree.root) {
            tree.root.flag = false;
            return;
        }
        else if (p === tree.root) {
            tree.root.flag = false;
            return;
        }
        /**
         * The leader of the formation.
         */
        const lead = p.p;
        // Establish the n = red, p = red, g = black condition for a transformation.
        if (p.flag && !lead.flag) {
            if (p === lead.l) {
                const aux = lead.r;
                if (aux.flag) {
                    n = colorFlip(p, lead, aux);
                }
                else if (n === p.r) {
                    n = diamondLeftToVic(lead);
                }
                else {
                    n = echelonLeftToVic(lead);
                }
            }
            else {
                const aux = lead.l;
                if (aux.flag) {
                    n = colorFlip(p, lead, aux);
                }
                else if (n === n.p.l) {
                    n = diamondRightToVic(lead);
                }
                else {
                    n = echelonRightToVic(lead);
                }
            }
        }
        else {
            break;
        }
    }
    tree.root.flag = false;
}
