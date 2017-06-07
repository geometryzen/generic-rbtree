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
export { RBNode };
