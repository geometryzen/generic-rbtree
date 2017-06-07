import { RBNode } from './RBNode';
import { RBTree } from './RBTree';

class KeyThing {
    constructor(public value: number) {
        // Do nothing;
    }
    toString(): string {
        return `KeyThing(${this.value})`;
    }
    static LOWEST = new KeyThing(Number.MIN_SAFE_INTEGER);
    static HIGHEST = new KeyThing(Number.MAX_SAFE_INTEGER);
}

class ValThing {
    constructor(public data: number) {
        // Do nothing;
    }
    toString(): string {
        return `ValThing(${this.data})`;
    }
    static random(): ValThing {
        return new ValThing(Math.random());
    }
    static NIL = new ValThing(Number.MAX_SAFE_INTEGER);
}

function keycmp(a: KeyThing, b: KeyThing): -1 | 1 | 0 {
    return a.value < b.value ? -1 : (a.value > b.value ? 1 : 0);
}

function red<K, V>(node: RBNode<K, V>): boolean {
    return node.flag;
}

function black<K, V>(node: RBNode<K, V>): boolean {
    return !node.flag;
}

function expectInvariants<K, V>(tree: RBTree<K, V>): void {
    expect(tree.heightInvariant).toBe(true, `The height invariant is being violated for the tree with root ${tree.root.key}`);
    expect(tree.colorInvariant).toBe(true, `The color invariant is being violated for the tree with root ${tree.root.key}`);
    expect(black(tree.root)).toBe(true, `The root of the tree should always be blue ${tree.root.key}`);
}

function expect123<V>(tree: RBTree<KeyThing, V>): void {
    expect(tree.root.key.value).toBe(2);
    expect(tree.root.l.key.value).toBe(1);
    expect(tree.root.r.key.value).toBe(3);
    expectInvariants(tree);
}

function expectRed<V>(node: RBNode<KeyThing, V>, key: number): void {
    expect(node.key.value).toBe(key);
    expect(red(node)).toBe(true);
}

function expectBlue<V>(node: RBNode<KeyThing, V>, key: number): void {
    expect(node.key.value).toBe(key);
    expect(black(node)).toBe(true);
}

describe("RBTree", function () {
    describe("constructor", function () {
        const tree = new RBTree<KeyThing, ValThing>(KeyThing.LOWEST, KeyThing.HIGHEST, ValThing.NIL, keycmp);
        const z = tree.z;
        // const head = tree.head;
        it("should create the dummy node", function () {
            expect(z).toBeDefined();
        });
        it("should satisfy z.l = z", function () {
            expect(z.l).toBe(z);
        });
        it("should satisfy z.r = z", function () {
            expect(z.r).toBe(z);
        });
        it("should satisfy z.value = constructer nil argument", function () {
            expect(z.value).toBe(ValThing.NIL);
        });
        it("should satisfy root (head.r) = z", function () {
            expect(tree.root).toBe(z);
        });
        it("should set the number of keys inserted to zero", function () {
            expect(tree.N).toBe(0);
        });
    });
    describe("insert", function () {
        it("should update the count of nodes inserted", function () {
            const tree = new RBTree<KeyThing, ValThing>(KeyThing.LOWEST, KeyThing.HIGHEST, ValThing.NIL, keycmp);
            for (let i = 1; i <= 10; i++) {
                tree.insert(new KeyThing(i), ValThing.random());
                expect(tree.N).toBe(i);
            }
        });
        it("should not allow key = head key", function () {
            const lowKey = 100;
            const tree = new RBTree<KeyThing, ValThing>(new KeyThing(lowKey), KeyThing.HIGHEST, ValThing.NIL, keycmp);
            tree.insert(new KeyThing(lowKey + 1), ValThing.random());
            expect(tree.N).toBe(1);
            expect(function () {
                tree.insert(new KeyThing(lowKey), ValThing.random());
            }).toThrowError();
        });
        it("should not allow key < head key", function () {
            const lowKey = new KeyThing(100);
            const tree = new RBTree<KeyThing, ValThing>(lowKey, KeyThing.HIGHEST, ValThing.NIL, keycmp);
            tree.insert(new KeyThing(lowKey.value + 1), ValThing.random());
            expect(tree.N).toBe(1);
            expect(function () {
                tree.insert(new KeyThing(lowKey.value - 1), ValThing.random());
            }).toThrowError();
        });
        describe("one node permutation", function () {
            it('[1] should insert to root', function () {
                const tree = new RBTree<KeyThing, ValThing>(KeyThing.LOWEST, KeyThing.HIGHEST, ValThing.NIL, keycmp);
                tree.insert(new KeyThing(1), new ValThing(10));
                expect(tree.root.key.value).toBe(1);
                expect(tree.root.value.data).toBe(10);
                expect(red(tree.root)).toBe(false);
            });
        });
        describe("two node permutations", function () {
            it('[1, 2] inserts 1 to root and 2 to right', function () {
                const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, -1, keycmp);
                const z = tree.z;
                tree.insert(new KeyThing(1), 10);
                tree.insert(new KeyThing(2), 20);
                expect(tree.root.key.value).toBe(1);
                expect(tree.root.l).toBe(z);
                expect(tree.root.r.key.value).toBe(2);
                expect(red(tree.root)).toBe(false);
                expect(red(tree.root.r)).toBe(true);
            });
            it('[2, 1] inserts 2 to root and 1 to left', function () {
                const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, -1, keycmp);
                const z = tree.z;
                tree.insert(new KeyThing(2), 20);
                tree.insert(new KeyThing(1), 10);
                expect(tree.root.key.value).toBe(2);
                expect(tree.root.l.key.value).toBe(1);
                expect(tree.root.r).toBe(z);
                expect(red(tree.root)).toBe(false);
                expect(red(tree.root.l)).toBe(true);
            });
        });
        describe("three node permutations", function () {
            it('[2, 1, 3] inserts balanced', function () {
                const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, -1, keycmp);
                tree.insert(new KeyThing(2), 20);
                tree.insert(new KeyThing(1), 10);
                tree.insert(new KeyThing(3), 30);
                expect123(tree);
                expect(red(tree.root.l)).toBe(true);
                expect(red(tree.root.r)).toBe(true);
            });
            it('[2, 3, 1] inserts balanced', function () {
                const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, -1, keycmp);
                tree.insert(new KeyThing(2), 20);
                tree.insert(new KeyThing(3), 30);
                tree.insert(new KeyThing(1), 10);
                expect123(tree);
                expect(red(tree.root.l)).toBe(true);
                expect(red(tree.root.r)).toBe(true);
            });
            it('[1, 2, 3] inserts balanced', function () {
                const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, -1, keycmp);
                tree.insert(new KeyThing(1), 10);
                tree.insert(new KeyThing(2), 20);
                tree.insert(new KeyThing(3), 30);
                expect123(tree);
                expect(black(tree.root.l)).toBe(true);
                expect(black(tree.root.r)).toBe(true);
            });
            it('[1, 3, 2] inserts balanced', function () {
                const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, -1, keycmp);
                tree.insert(new KeyThing(1), 10);
                tree.insert(new KeyThing(3), 30);
                tree.insert(new KeyThing(2), 20);
                expect123(tree);
                expect(black(tree.root.l)).toBe(true);
                expect(black(tree.root.r)).toBe(true);
            });
            it('[3, 1, 2] inserts balanced', function () {
                const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, -1, keycmp);
                tree.insert(new KeyThing(3), 30);
                tree.insert(new KeyThing(1), 10);
                tree.insert(new KeyThing(2), 20);
                expect123(tree);
                expect(black(tree.root.l)).toBe(true);
                expect(black(tree.root.r)).toBe(true);
            });
            it('[3, 2, 1] inserts balanced', function () {
                const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, -1, keycmp);
                tree.insert(new KeyThing(3), 30);
                tree.insert(new KeyThing(2), 20);
                tree.insert(new KeyThing(1), 10);
                expect123(tree);
                expect(black(tree.root.l)).toBe(true);
                expect(black(tree.root.r)).toBe(true);
            });
        });
        describe("four node permutations", function () {
            it('[4, 2, 1, 3]', function () {
                const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, -1, keycmp);
                tree.insert(new KeyThing(4), 40);
                tree.insert(new KeyThing(2), 20);
                tree.insert(new KeyThing(1), 10);
                tree.insert(new KeyThing(3), 30);
                expectInvariants(tree);
                expectBlue(tree.root, 2);
                expectBlue(tree.root.l, 1);
                expectBlue(tree.root.r, 4);
                expectRed(tree.root.r.l, 3);
            });
            it('[4, 2, 3, 1]', function () {
                const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, -1, keycmp);
                tree.insert(new KeyThing(4), 40);
                tree.insert(new KeyThing(2), 20);
                tree.insert(new KeyThing(3), 30);
                tree.insert(new KeyThing(1), 10);
                expectInvariants(tree);
                expectBlue(tree.root, 3);
                expectBlue(tree.root.l, 2);
                expectBlue(tree.root.r, 4);
                expectRed(tree.root.l.l, 1);
            });
            it('[4, 3, 2, 1]', function () {
                const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, -1, keycmp);
                tree.insert(new KeyThing(4), 40);
                tree.insert(new KeyThing(3), 30);
                tree.insert(new KeyThing(2), 20);
                tree.insert(new KeyThing(1), 10);
                expectInvariants(tree);
                expectBlue(tree.root, 3);
                expectBlue(tree.root.l, 2);
                expectBlue(tree.root.r, 4);
                expectRed(tree.root.l.l, 1);
            });
            it('[3, 4, 2, 1]', function () {
                const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, -1, keycmp);
                tree.insert(new KeyThing(3), 30);
                tree.insert(new KeyThing(4), 40);
                tree.insert(new KeyThing(2), 20);
                tree.insert(new KeyThing(1), 10);
                expectInvariants(tree);
                expectBlue(tree.root, 3);
                expectBlue(tree.root.l, 2);
                expectBlue(tree.root.r, 4);
                expectRed(tree.root.l.l, 1);
            });
        });
        describe("misc", function () {
            it('[50, 40, 30, 15, 20, 10]', function () {
                const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, -1, keycmp);
                tree.insert(new KeyThing(50), 500);
                tree.insert(new KeyThing(40), 400);
                tree.insert(new KeyThing(30), 300);
                tree.insert(new KeyThing(15), 150);
                tree.insert(new KeyThing(20), 200);
                tree.insert(new KeyThing(10), 100);
                expectInvariants(tree);
                expectBlue(tree.root.r, 50);
                expectBlue(tree.root, 40);
                expectBlue(tree.root.l.r, 30);
                expectBlue(tree.root.l.l, 15);
                expectRed(tree.root.l, 20);
                expectRed(tree.root.l.l.l, 10);
            });
        });
    });
    describe("search", function () {
        it("should find an internal node", function () {
            const zValue = -1;
            const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, zValue, keycmp);
            const value = Math.random();
            tree.insert(new KeyThing(23), value);
            expect(tree.search(new KeyThing(23))).toBe(value);
            expect(tree.search(new KeyThing(3))).toBe(zValue);
        });
    });

    describe("remove", function () {
        it("should find an internal node", function () {
            const zValue = -1;
            const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, zValue, keycmp);
            tree.insert(new KeyThing(4), 40);
            tree.insert(new KeyThing(2), 20);
            tree.insert(new KeyThing(6), 60);
            tree.insert(new KeyThing(1), 10);
            tree.insert(new KeyThing(3), 30);
            tree.insert(new KeyThing(5), 50);
            tree.insert(new KeyThing(7), 70);

            tree.remove(new KeyThing(4));

            expect(tree.search(new KeyThing(1))).toBe(10);
            expect(tree.search(new KeyThing(2))).toBe(20);
            expect(tree.search(new KeyThing(3))).toBe(30);
            expect(tree.search(new KeyThing(4))).toBe(zValue);
            expect(tree.search(new KeyThing(5))).toBe(50);
            expect(tree.search(new KeyThing(6))).toBe(60);
            expect(tree.search(new KeyThing(7))).toBe(70);

            // expect(tree.root.key).toBe(5);
        });
    });
    describe("glb - Greatest Lower Bound", function () {
        it("should return the next lowest key", function () {
            const tree = new RBTree<KeyThing, ValThing>(KeyThing.LOWEST, KeyThing.HIGHEST, ValThing.NIL, keycmp);

            tree.insert(new KeyThing(2), ValThing.random());
            tree.insert(new KeyThing(3), ValThing.random());
            tree.insert(new KeyThing(5), ValThing.random());
            tree.insert(new KeyThing(8), ValThing.random());

            expect(tree.glb(new KeyThing(0)).value).toBe(KeyThing.LOWEST.value);
            expect(tree.glb(new KeyThing(1)).value).toBe(KeyThing.LOWEST.value);
            expect(tree.glb(new KeyThing(2)).value).toBe(2);
            expect(tree.glb(new KeyThing(3)).value).toBe(3);
            expect(tree.glb(new KeyThing(4)).value).toBe(3);
            expect(tree.glb(new KeyThing(5)).value).toBe(5);
            expect(tree.glb(new KeyThing(6)).value).toBe(5);
            expect(tree.glb(new KeyThing(7)).value).toBe(5);
            expect(tree.glb(new KeyThing(8)).value).toBe(8);
            expect(tree.glb(new KeyThing(9)).value).toBe(8);
        });
    });
    describe("lub - Least Upper Bound", function () {
        it("should return the next highest key", function () {
            const tree = new RBTree<KeyThing, ValThing>(KeyThing.LOWEST, KeyThing.HIGHEST, ValThing.NIL, keycmp);

            tree.insert(new KeyThing(2), ValThing.random());
            tree.insert(new KeyThing(3), ValThing.random());
            tree.insert(new KeyThing(5), ValThing.random());
            tree.insert(new KeyThing(8), ValThing.random());

            expect(tree.lub(new KeyThing(0)).value).toBe(2);
            expect(tree.lub(new KeyThing(1)).value).toBe(2);
            expect(tree.lub(new KeyThing(2)).value).toBe(2);
            expect(tree.lub(new KeyThing(3)).value).toBe(3);
            expect(tree.lub(new KeyThing(4)).value).toBe(5);
            expect(tree.lub(new KeyThing(5)).value).toBe(5);
            expect(tree.lub(new KeyThing(6)).value).toBe(8);
            expect(tree.lub(new KeyThing(7)).value).toBe(8);
            expect(tree.lub(new KeyThing(8)).value).toBe(8);
            expect(tree.lub(new KeyThing(9)).value).toBe(KeyThing.HIGHEST.value);
        });
    });
});


describe("debug", function () {
    describe("insert", function () {
        describe("seven node permutation", function () {
            it('[1, 2, 3, 4, 5, 6, 7]', function () {
                const tree = new RBTree<KeyThing, number>(KeyThing.LOWEST, KeyThing.HIGHEST, -1, keycmp);
                expectInvariants(tree);

                const head = tree.head;
                const z = tree.z;

                // The tree is currently empty.
                expect(head.key.value).toBe(KeyThing.LOWEST.value);
                expect(black(head)).toBeTruthy();
                expect(head.l.key).toBe(z.key);
                expect(head.r.key).toBe(z.key);

                const n1 = tree.insert(new KeyThing(1), 10);
                expectInvariants(tree);

                expect(black(n1)).toBeTruthy();

                expect(head.key.value).toBe(KeyThing.LOWEST.value);
                expect(head.l.key).toBe(z.key);
                expect(head.r.key.value).toBe(1);
                expect(tree.root.key.value).toBe(1);
                expect(red(tree.root)).toBe(false);
                expect(tree.root.l).toBe(z);
                expect(tree.root.r).toBe(z);

                const n2 = tree.insert(new KeyThing(2), 20);
                expectInvariants(tree);

                expect(black(n1)).toBeTruthy();
                expect(red(n2)).toBeTruthy();

                expect(tree.root.key.value).toBe(1);
                expect(tree.root.l.key).toBe(z.key);
                expect(tree.root.r.key.value).toBe(2);
                expect(tree.root.r.l).toBe(z);
                expect(tree.root.r.r).toBe(z);

                const n3 = tree.insert(new KeyThing(3), 30);
                expect(tree.root.key.value).toBe(2);
                expect(tree.root.l.key.value).toBe(1);
                expect(tree.root.r.key.value).toBe(3);
                expect(black(n1)).toBeTruthy();
                expect(black(n2)).toBeTruthy();
                expect(black(n3)).toBeTruthy();
                expectInvariants(tree);

                const n4 = tree.insert(new KeyThing(4), 40);
                expect(tree.root.key.value).toBe(2);
                expect(tree.root.l.key.value).toBe(1);
                expect(tree.root.r.key.value).toBe(3);
                expect(tree.root.r.r.key.value).toBe(4);
                expect(black(n1)).toBeTruthy();
                expect(black(n2)).toBeTruthy();
                expect(black(n3)).toBeTruthy();
                expect(red(n4)).toBeTruthy();
                expectInvariants(tree);

                const n5 = tree.insert(new KeyThing(5), 50);
                expect(black(n1)).toBeTruthy();
                expect(black(n2)).toBeTruthy();
                expect(black(n3)).toBeTruthy();
                expect(red(n4)).toBeTruthy();
                expect(black(n5)).toBeTruthy();
                expectInvariants(tree);

                const n6 = tree.insert(new KeyThing(6), 60);
                expect(black(n1)).toBeTruthy();
                expect(black(n2)).toBeTruthy();
                expect(black(n3)).toBeTruthy();
                expect(red(n4)).toBeTruthy();
                expect(black(n5)).toBeTruthy();
                expect(red(n6)).toBeTruthy();
                expectInvariants(tree);

                const n7 = tree.insert(new KeyThing(7), 70);
                expect(black(n1)).toBeTruthy();
                expect(black(n2)).toBeTruthy();
                expect(black(n3)).toBeTruthy();
                expect(black(n4)).toBeTruthy();
                expect(black(n5)).toBeTruthy();
                expect(black(n6)).toBeTruthy();
                expect(black(n7)).toBeTruthy();

                expect(tree.root.key.value).toBe(4);
                expect(tree.root.l.key.value).toBe(2);
                expect(tree.root.r.key.value).toBe(6);
                expect(tree.root.l.l.key.value).toBe(1);
                expect(tree.root.l.r.key.value).toBe(3);
                expect(tree.root.r.l.key.value).toBe(5);
                expect(tree.root.r.r.key.value).toBe(7);
            });
        });
    });
});

