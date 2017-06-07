/**
 * 
 */
export class RBNode<K, V> {
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
    flag = false;
    /**
     * Constructs a red-black binary tree node.
     */
    constructor(public key: K, public value: V) {
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
    toString(): string {
        return `${this.flag ? 'red' : 'black'} ${this.key}`;
    }
}
