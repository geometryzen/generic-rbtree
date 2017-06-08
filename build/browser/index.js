(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.EIGHT = global.EIGHT || {})));
}(this, (function (exports) { 'use strict';

/**
 *
 */
var RBNode = (function () {
    /**
     * Constructs a red-black binary tree node.
     */
    function RBNode(key, value) {
        this.key = key;
        this.value = value;
        /**
         * The red (true) / black (false) flag.
         */
        this.flag = false;
        this.l = this;
        this.r = this;
        this.p = this;
    }
    /*
    get red(): boolean {
        return this.flag;
    }
    set red(red: boolean) {
        this.flag = red;
    }
    get black(): boolean {
        return !this.flag;
    }
    set black(black: boolean) {
        this.flag = !black;
    }
    */
    RBNode.prototype.toString = function () {
        return (this.flag ? 'red' : 'black') + " " + this.key;
    };
    return RBNode;
}());

var RBTree = (function () {
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
    function RBTree(lowKey, highKey, nilValue, comp) {
        this.highKey = highKey;
        this.comp = comp;
        /**
         * The number of keys inserted.
         */
        this.N = 0;
        this.lowNode = new RBNode(lowKey, nilValue);
        this.highNode = new RBNode(highKey, nilValue);
        // Notice that z does not have a key because it has to be less than and greater than every other key.
        var z = new RBNode(null, nilValue);
        this.head = new RBNode(lowKey, nilValue);
        // Head left is never used or changed so we'll store the tail node there.
        this.head.l = z;
        // Head right refers the the actual tree root which is currently empty.
        this.head.r = z;
        this.head.p = this.head;
    }
    Object.defineProperty(RBTree.prototype, "root", {
        get: function () {
            return this.head.r;
        },
        set: function (root) {
            this.head.r = root;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RBTree.prototype, "z", {
        /**
         * The "tail" node.
         * This allows our subtrees never to be undefined or null.
         * All searches will result in a node, but misses will return the tail node.
         */
        get: function () {
            return this.head.l;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RBTree.prototype, "lowKey", {
        get: function () {
            return this.head.key;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Legal means that is greater than the key stored in the head node.
     * The key does not have to exist.
     */
    RBTree.prototype.assertLegalKey = function (key, comp) {
        if (comp(key, this.lowKey) <= 0) {
            throw new Error("key, " + key + ", must be greater than the low key, " + this.lowKey + ".");
        }
        if (comp(key, this.highKey) >= 0) {
            throw new Error("key, " + key + ", must be less than the high key, " + this.highKey + ".");
        }
    };
    /**
     *
     */
    RBTree.prototype.insert = function (key, value) {
        var comp = this.comp;
        this.assertLegalKey(key, comp);
        var n = new RBNode(key, value);
        rbInsert(this, n, comp);
        this.root.flag = false;
        // Update the count of nodes inserted.
        this.N += 1;
        return n;
    };
    /**
     * Greatest Lower Bound of a key.
     * Returns the node corresponding to the key if it exists, or the next lowest key.
     * Returns null if there is no smaller key in the tree.
     */
    RBTree.prototype.glb = function (key) {
        var comp = this.comp;
        this.assertLegalKey(key, comp);
        var low = this.lowNode;
        var node = glb(this, this.root, key, comp, low);
        if (node !== low) {
            return node;
        }
        else {
            return null;
        }
    };
    /**
     * Least Upper Bound of a key.
     * Returns the node corresponding to the key if it exists, or the next highest key.
     * Returns null if there is no greater key in the tree.
     */
    RBTree.prototype.lub = function (key) {
        var comp = this.comp;
        this.assertLegalKey(key, comp);
        var high = this.highNode;
        var node = lub(this, this.root, key, comp, high);
        if (node !== high) {
            return node;
        }
        else {
            return null;
        }
    };
    /**
     *
     */
    RBTree.prototype.search = function (key) {
        var comp = this.comp;
        this.assertLegalKey(key, comp);
        /**
         * The current node for the search.
         */
        var x = this.root;
        // The search will always be "successful" but may end with z.
        this.z.key = key;
        while (comp(key, x.key) !== 0) {
            x = comp(key, x.key) < 0 ? x.l : x.r;
        }
        return x.value;
    };
    /**
     *
     * @param key
     */
    RBTree.prototype.remove = function (key) {
        var comp = this.comp;
        this.assertLegalKey(key, comp);
        var head = this.head;
        var z = this.z;
        /**
         * The current node for the search, we begin at the root.
         */
        var x = this.root;
        /**
         * The parent of the current node.
         */
        var p = head;
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
        var t = x;
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
            var c = t.r;
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
    };
    Object.defineProperty(RBTree.prototype, "heightInvariant", {
        /**
         * Determines whether this tree satisfies the height invariant.
         * The height invariant is that the number of black nodes in every path to leaf nodes should be the same.
         * This property is for testing only; it traverses the tree and so affects performance.
         */
        get: function () {
            return heightInv(this.root, this.z);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RBTree.prototype, "colorInvariant", {
        /**
         * Determines whether this tree satisfies the color invarant.
         * The color invariant is that no two adjacent nodes should be colored red.
         * This property is for testing only; it traverses the treeand so affects performance.
         */
        get: function () {
            return colorInv(this.root, this.head.flag, this.z);
        },
        enumerable: true,
        configurable: true
    });
    return RBTree;
}());
function colorFlip(p, g, gg) {
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
function diamondLeftToVic(lead) {
    var m = lead.p;
    var z = lead;
    var x = z.l;
    var y = x.r;
    var a = y.l;
    var b = y.r;
    x.flag = false;
    y.l = x;
    x.p = y;
    y.r = z;
    z.p = y;
    x.r = a;
    a.p = x;
    z.l = b;
    b.p = z;
    if (m.r === lead) {
        m.r = y;
    }
    else {
        m.l = y;
    }
    y.p = m;
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
function diamondRightToVic(lead) {
    var m = lead.p;
    var x = lead;
    var z = x.r;
    var y = z.l;
    var a = y.l;
    var b = y.r;
    z.flag = false;
    y.l = x;
    x.p = y;
    y.r = z;
    z.p = y;
    x.r = a;
    a.p = x;
    z.l = b;
    b.p = z;
    if (m.r === lead) {
        m.r = y;
    }
    else {
        m.l = y;
    }
    y.p = m;
    return y;
}
function echelonLeftToVic(lead) {
    var m = lead.p;
    var z = lead;
    var y = z.l;
    var a = y.r;
    y.l.flag = false;
    y.r = z;
    z.p = y;
    z.l = a;
    a.p = z;
    if (m.r === lead) {
        m.r = y;
    }
    else {
        m.l = y;
    }
    y.p = m;
    return y;
}
function echelonRightToVic(lead) {
    var m = lead.p;
    var x = lead;
    var y = x.r;
    var a = y.l;
    y.r.flag = false;
    y.l = x;
    x.p = y;
    x.r = a;
    a.p = x;
    if (m.r === lead) {
        m.r = y;
    }
    else {
        m.l = y;
    }
    y.p = m;
    return y;
}
function colorInv(node, redParent, z) {
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
function heightInv(node, z) {
    return blackHeight(node, z) >= 0;
}
/**
 * Computes the number of black nodes (including z) on the path from x to leaf, not counting x.
 * The height does not include itself.
 * z nodes are black.
 */
function blackHeight(x, z) {
    if (x === z) {
        return 0;
    }
    else {
        var hL = blackHeight(x.l, z);
        if (hL >= 0) {
            var hR = blackHeight(x.r, z);
            if (hR >= 0) {
                if (hR === hR) {
                    return x.flag ? hL : hL + 1;
                }
            }
        }
        return -1;
    }
}
function rbInsert(tree, n, comp) {
    var key = n.key;
    var z = tree.z;
    var x = tree.root;
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
function rbInsertFixup(tree, n) {
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
        var p = n.p;
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
        var lead = p.p;
        // Establish the n = red, p = red, g = black condition for a transformation.
        if (p.flag && !lead.flag) {
            if (p === lead.l) {
                var aux = lead.r;
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
                var aux = lead.l;
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
/**
 * Recursive implementation to compute the Greatest Lower Bound.
 * The largest key such that glb <= key.
 */
function glb(tree, node, key, comp, low) {
    if (node === tree.z) {
        return low;
    }
    else if (comp(key, node.key) >= 0) {
        // The node key is a valid lower bound, but may not be the greatest.
        // Take the right link in search of larger keys.
        return maxNode(node, glb(tree, node.r, key, comp, low), comp);
    }
    else {
        // Take the left link in search of smaller keys.
        return glb(tree, node.l, key, comp, low);
    }
}
/**
 * Recursive implementation to compute the Least Upper Bound.
 * The smallest key such that key <= lub.
 */
function lub(tree, node, key, comp, high) {
    if (node === tree.z) {
        return high;
    }
    else if (comp(key, node.key) <= 0) {
        // The node key is a valid upper bound, but may not be the least.
        return minNode(node, lub(tree, node.l, key, comp, high), comp);
    }
    else {
        // Take the right link in search of bigger keys.
        return lub(tree, node.r, key, comp, high);
    }
}
function maxNode(a, b, comp) {
    if (comp(a.key, b.key) > 0) {
        return a;
    }
    else if (comp(a.key, b.key) < 0) {
        return b;
    }
    else {
        return a;
    }
}
function minNode(a, b, comp) {
    if (comp(a.key, b.key) < 0) {
        return a;
    }
    else if (comp(a.key, b.key) > 0) {
        return b;
    }
    else {
        return a;
    }
}

exports.RBNode = RBNode;
exports.RBTree = RBTree;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
