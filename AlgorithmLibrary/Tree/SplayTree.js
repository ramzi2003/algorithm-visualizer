

Algorithm.Tree.Splay = class SplayTree extends Algorithm.Tree.BST {
    INSERT_TOPDOWN = true;
    DELETE_TOPDOWN = true;

    ///////////////////////////////////////////////////////////////////////////////
    // After we have found or inserted an element
    // we splay the last visited node up to the top

    postFind(searchResult) {
        this.splayUp(searchResult.node);
    }

    doInsert(node, value) {
        const searchResult = this.doFind(node, value);
        if (searchResult.found && !this.ALLOW_DUPLICATES) {
            this.splayUp(searchResult.node);
            this.cmd("SetText", this.messageID, `Node ${searchResult.node} already exists`);
            this.cmd("Step");
        } else {
            const insertResult = super.doInsert(searchResult.node, value);
            this.splayUp(insertResult.node);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////
    // Delete a value from the tree

    doDelete(node, value) {
        const searchResult = this.doFind(node, value);
        this.splayUp(searchResult.node);
        if (!searchResult.found) {
            this.cmd("SetText", this.messageID, `Node ${value} doesn't exist`);
            this.cmd("Step");
            return;
        }

        this.cmd("SetText", this.messageID, "Removing root, leaving left and right trees");
        this.cmd("SetHighlight", this.treeRoot.graphicID, 1);
        this.cmd("Step");
        if (!this.treeRoot.right) {
            this.cmd("SetText", this.messageID, "No right tree, make left tree the root");
            this.removeTreeNode(this.treeRoot);
            this.cmd("Step");
            this.treeRoot = this.treeRoot.left;
            this.treeRoot.parent = null;
        } else if (!this.treeRoot.left) {
            this.cmd("SetText", this.messageID, "No left tree, make right tree the root");
            this.removeTreeNode(this.treeRoot);
            this.cmd("Step");
            this.treeRoot = this.treeRoot.right;
            this.treeRoot.parent = null;
        } else {
            this.cmd("SetText", this.messageID, "Splay largest element in left tree to root");
            const right = this.treeRoot.right;
            const left = this.treeRoot.left;
            const oldRoot = this.treeRoot;
            this.cmd("Disconnect", oldRoot.graphicID, left.graphicID);
            this.cmd("Disconnect", oldRoot.graphicID, right.graphicID);
            this.cmd("SetAlpha", oldRoot.graphicID, 0);

            left.parent = null;
            let largestLeft = left;
            this.cmd("SetAlpha", this.highlightID, 1);
            this.cmd("SetPosition", this.highlightID, largestLeft.x, largestLeft.y);
            this.cmd("Step");
            if (largestLeft.right) {
                while (largestLeft.right) {
                    largestLeft = largestLeft.right;
                    this.cmd("Move", this.highlightID, largestLeft.x, largestLeft.y);
                    this.cmd("Step");
                }
            }
            this.cmd("SetAlpha", this.highlightID, 0);
            this.splayUp(largestLeft);
            this.cmd("SetText", this.messageID, "Left tree now has no right subtree, connect left and right trees");
            this.cmd("SetHighlight", largestLeft.graphicID, 1);
            this.cmd("Step");
            this.cmd("SetHighlight", largestLeft.graphicID, 0);
            this.cmd("Connect", largestLeft.graphicID, right.graphicID, this.LINK_COLOR);
            largestLeft.parent = null;
            largestLeft.right = right;
            right.parent = largestLeft;
            this.treeRoot = largestLeft;
            this.removeTreeNode(oldRoot);
        }
        this.resizeTree();
    }

    ///////////////////////////////////////////////////////////////////////////////
    // Splay a node to the root of the tree

    splayUp(node) {
        if (node === this.treeRoot) return;
        this.cmd("SetText", this.messageID, `Now splaying ${node} up to the root`);
        this.cmd("SetHighlight", node.graphicID, 1);
        this.cmd("Step");
        this.cmd("SetHighlight", node.graphicID, 0);
        this.doSplayUp(node);
    }

    doSplayUp(node) {
        if (!node.parent) return;
        if (node.isLeftChild()) {
            if (!node.parent.parent) {
                this.singleRotateRight(node.parent);
            } else if (node.parent.isRightChild()) {
                this.doubleRotateLeft(node.parent.parent);
                this.doSplayUp(node);
            } else {
                this.zigZigRight(node.parent.parent);
                this.doSplayUp(node);
            }
        } else { // node.isRightChild()
            if (!node.parent.parent) {
                this.singleRotateLeft(node.parent);
            } else if (node.parent.isLeftChild()) {
                this.doubleRotateRight(node.parent.parent);
                this.doSplayUp(node);
            } else {
                this.zigZigLeft(node.parent.parent);
                this.doSplayUp(node);
            }
        }
    }
};
