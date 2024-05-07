


Algorithm.Graph.Kruskal = class Kruskal extends Algorithm.Graph {
    HIGHLIGHT_CIRCLE_COLOR = "#000000";

    SET_ARRAY_ELEM_WIDTH = 25;
    SET_ARRAY_ELEM_HEIGHT = 25;
    SET_ARRAY_START_X = 50;
    SET_ARRAY_START_Y = 130;

    EDGE_LIST_ELEM_WIDTH = 40;
    EDGE_LIST_ELEM_HEIGHT = 40;
    EDGE_LIST_COLUMN_WIDTH = 100;
    EDGE_LIST_MAX_PER_COLUMN = 10;

    EDGE_LIST_START_X = 150;
    EDGE_LIST_START_Y = 130;

    FIND_LABEL_1_X = 30;
    FIND_LABEL_2_X = 100;
    FIND_LABEL_1_Y = 30;
    FIND_LABEL_2_Y = this.FIND_LABEL_1_Y;

    MESSAGE_LABEL_X = 30;
    MESSAGE_LABEL_Y = 50;

    HIGHLIGHT_CIRCLE_COLOR_1 = "#FFAAAA";
    HIGHLIGHT_CIRCLE_COLOR_2 = "#FF0000";

    constructor(am) {
        super();
        this.init(am);
    }

    addControls() {
        this.startButton = this.addButtonToAlgorithmBar("Run Kruskal");
        this.startButton.onclick = this.startCallback.bind(this);
        super.addControls(false);
    }

    init(am) {
        this.showEdgeCosts = true;
        super.init(am, false, false); // TODO:  add no edge label flag to this?
    }

    setup() {
        super.setup();
        this.messageID = [];
        this.commands = [];
        this.setID = new Array(this.size);
        this.setIndexID = new Array(this.size);
        this.setData = new Array(this.size);

        for (let i = 0; i < this.size; i++) {
            this.setID[i] = this.nextIndex++;
            this.setIndexID[i] = this.nextIndex++;
            this.cmd("CreateRectangle", this.setID[i], "-1", this.SET_ARRAY_ELEM_WIDTH, this.SET_ARRAY_ELEM_HEIGHT, this.SET_ARRAY_START_X, this.SET_ARRAY_START_Y + i * this.SET_ARRAY_ELEM_HEIGHT);
            this.cmd("CreateLabel", this.setIndexID[i], i, this.SET_ARRAY_START_X - this.SET_ARRAY_ELEM_WIDTH, this.SET_ARRAY_START_Y + i * this.SET_ARRAY_ELEM_HEIGHT);
            this.cmd("SetForegroundColor", this.setIndexID[i], this.VERTEX_INDEX_COLOR);
        }
        this.cmd("CreateLabel", this.nextIndex++, "Disjoint Set", this.SET_ARRAY_START_X - 1 * this.SET_ARRAY_ELEM_WIDTH, this.SET_ARRAY_START_Y - this.SET_ARRAY_ELEM_HEIGHT * 1.5, 0);
        this.animationManager.setAllLayers([0, this.currentLayer]);
        this.animationManager.StartNewAnimation(this.commands);
        this.animationManager.skipForward();
        this.animationManager.clearHistory();
    }

    startCallback(event) {
        this.implementAction(this.doKruskal.bind(this), "");
    }

    disjointSetFind(valueToFind, highlightCircleID) {
        this.cmd("SetTextColor", this.setID[valueToFind], "#FF0000");
        this.cmd("Step");
        while (this.setData[valueToFind] >= 0) {
            this.cmd("SetTextColor", this.setID[valueToFind], "#000000");
            this.cmd("Move", highlightCircleID, this.SET_ARRAY_START_X - this.SET_ARRAY_ELEM_WIDTH, this.SET_ARRAY_START_Y + this.setData[valueToFind] * this.SET_ARRAY_ELEM_HEIGHT);
            this.cmd("Step");
            valueToFind = this.setData[valueToFind];
            this.cmd("SetTextColor", this.setID[valueToFind], "#FF0000");
            this.cmd("Step");
        }
        this.cmd("SetTextColor", this.setID[valueToFind], "#000000");
        return valueToFind;
    }

    doKruskal(ignored) {
        this.commands = [];

        this.edgesListLeftID = [];
        this.edgesListRightID = [];
        this.edgesListLeft = [];
        this.edgesListRight = [];

        for (let i = 0; i < this.size; i++) {
            this.setData[i] = -1;
            this.cmd("SetText", this.setID[i], "-1");
        }

        this.recolorGraph();

        // Create Edge List

        for (let i = 0; i < this.size; i++) {
            for (let j = i + 1; j < this.size; j++) {
                if (this.adjMatrix[i][j] >= 0) {
                    this.edgesListLeftID.push(this.nextIndex++);
                    this.edgesListRightID.push(this.nextIndex++);
                    const top = this.edgesListLeftID.length - 1;
                    this.edgesListLeft.push(i);
                    this.edgesListRight.push(j);
                    this.cmd("CreateLabel", this.edgesListLeftID[top], i, this.EDGE_LIST_START_X + Math.floor(top / this.EDGE_LIST_MAX_PER_COLUMN) * this.EDGE_LIST_COLUMN_WIDTH,
                        this.EDGE_LIST_START_Y + (top % this.EDGE_LIST_MAX_PER_COLUMN) * this.EDGE_LIST_ELEM_HEIGHT);
                    this.cmd("CreateLabel", this.edgesListRightID[top], j, this.EDGE_LIST_START_X + this.EDGE_LIST_ELEM_WIDTH + Math.floor(top / this.EDGE_LIST_MAX_PER_COLUMN) * this.EDGE_LIST_COLUMN_WIDTH,
                        this.EDGE_LIST_START_Y + (top % this.EDGE_LIST_MAX_PER_COLUMN) * this.EDGE_LIST_ELEM_HEIGHT);
                    this.cmd("Connect", this.edgesListLeftID[top], this.edgesListRightID[top], this.EDGE_COLOR, 0, 0, this.adjMatrix[i][j]);
                }
            }
        }
        this.cmd("Step");

        // Sort edge list based on edge cost
        const edgeCount = this.edgesListLeftID.length;

        for (let i = 1; i < edgeCount; i++) {
            const tmpLeftID = this.edgesListLeftID[i];
            const tmpRightID = this.edgesListRightID[i];
            const tmpLeft = this.edgesListLeft[i];
            const tmpRight = this.edgesListRight[i];
            let j = i;
            while (j > 0 && this.adjMatrix[this.edgesListLeft[j - 1]][this.edgesListRight[j - 1]] > this.adjMatrix[tmpLeft][tmpRight]) {
                this.edgesListLeft[j] = this.edgesListLeft[j - 1];
                this.edgesListRight[j] = this.edgesListRight[j - 1];
                this.edgesListLeftID[j] = this.edgesListLeftID[j - 1];
                this.edgesListRightID[j] = this.edgesListRightID[j - 1];
                j = j - 1;
            }
            this.edgesListLeft[j] = tmpLeft;
            this.edgesListRight[j] = tmpRight;
            this.edgesListLeftID[j] = tmpLeftID;
            this.edgesListRightID[j] = tmpRightID;
        }
        for (let i = 0; i < edgeCount; i++) {
            this.cmd("Move", this.edgesListLeftID[i], this.EDGE_LIST_START_X + Math.floor(i / this.EDGE_LIST_MAX_PER_COLUMN) * this.EDGE_LIST_COLUMN_WIDTH,
                this.EDGE_LIST_START_Y + (i % this.EDGE_LIST_MAX_PER_COLUMN) * this.EDGE_LIST_ELEM_HEIGHT);
            this.cmd("Move", this.edgesListRightID[i], this.EDGE_LIST_START_X + this.EDGE_LIST_ELEM_WIDTH + Math.floor(i / this.EDGE_LIST_MAX_PER_COLUMN) * this.EDGE_LIST_COLUMN_WIDTH,
                this.EDGE_LIST_START_Y + (i % this.EDGE_LIST_MAX_PER_COLUMN) * this.EDGE_LIST_ELEM_HEIGHT);
        }

        this.cmd("Step");

        const findLabelLeft = this.nextIndex++;
        const findLabelRight = this.nextIndex++;
        const highlightCircle1 = this.nextIndex++;
        const highlightCircle2 = this.nextIndex++;
        const moveLabelID = this.nextIndex++;
        const messageLabelID = this.nextIndex++;

        let edgesAdded = 0;
        let nextListIndex = 0;
        this.cmd("CreateLabel", findLabelLeft, "", this.FIND_LABEL_1_X, this.FIND_LABEL_1_Y, 0);
        this.cmd("CreateLabel", findLabelRight, "", this.FIND_LABEL_2_X, this.FIND_LABEL_2_Y, 0);

        while (edgesAdded < this.size - 1 && nextListIndex < edgeCount) {
            this.cmd("SetEdgeHighlight", this.edgesListLeftID[nextListIndex], this.edgesListRightID[nextListIndex], 1);

            this.highlightEdge(this.edgesListLeft[nextListIndex], this.edgesListRight[nextListIndex], 1);
            this.highlightEdge(this.edgesListRight[nextListIndex], this.edgesListLeft[nextListIndex], 1);

            this.cmd("SetText", findLabelLeft, `find(${String(this.edgesListLeft[nextListIndex])}) = `);

            this.cmd("CreateHighlightCircle", highlightCircle1, this.HIGHLIGHT_CIRCLE_COLOR_1, this.EDGE_LIST_START_X + Math.floor(nextListIndex / this.EDGE_LIST_MAX_PER_COLUMN) * this.EDGE_LIST_COLUMN_WIDTH,
                this.EDGE_LIST_START_Y + (nextListIndex % this.EDGE_LIST_MAX_PER_COLUMN) * this.EDGE_LIST_ELEM_HEIGHT, 15);
            this.cmd("Move", highlightCircle1, this.SET_ARRAY_START_X - this.SET_ARRAY_ELEM_WIDTH, this.SET_ARRAY_START_Y + this.edgesListLeft[nextListIndex] * this.SET_ARRAY_ELEM_HEIGHT);
            this.cmd("Step");

            const left = this.disjointSetFind(this.edgesListLeft[nextListIndex], highlightCircle1);
            this.cmd("SetText", findLabelLeft, `find(${String(this.edgesListLeft[nextListIndex])}) = ${String(left)}`);

            this.cmd("SetText", findLabelRight, `find(${String(this.edgesListRight[nextListIndex])}) = `);

            this.cmd("CreateHighlightCircle", highlightCircle2, this.HIGHLIGHT_CIRCLE_COLOR_2, this.EDGE_LIST_START_X + this.EDGE_LIST_ELEM_WIDTH + Math.floor(nextListIndex / this.EDGE_LIST_MAX_PER_COLUMN) * this.EDGE_LIST_COLUMN_WIDTH,
                this.EDGE_LIST_START_Y + (nextListIndex % this.EDGE_LIST_MAX_PER_COLUMN) * this.EDGE_LIST_ELEM_HEIGHT, 15);

            this.cmd("Move", highlightCircle2, this.SET_ARRAY_START_X - this.SET_ARRAY_ELEM_WIDTH, this.SET_ARRAY_START_Y + this.edgesListRight[nextListIndex] * this.SET_ARRAY_ELEM_HEIGHT);
            this.cmd("Step");

            const right = this.disjointSetFind(this.edgesListRight[nextListIndex], highlightCircle2);
            this.cmd("SetText", findLabelRight, `find(${String(this.edgesListRight[nextListIndex])}) = ${String(right)}`);

            this.cmd("Step");

            if (left !== right) {
                this.cmd("CreateLabel", messageLabelID, `Vertices in different trees.  Add edge to tree: Union(${String(left)},${String(right)})`, this.MESSAGE_LABEL_X, this.MESSAGE_LABEL_Y, 0);
                this.cmd("Step");
                this.highlightEdge(this.edgesListLeft[nextListIndex], this.edgesListRight[nextListIndex], 1);
                this.highlightEdge(this.edgesListRight[nextListIndex], this.edgesListLeft[nextListIndex], 1);
                edgesAdded++;
                this.setEdgeColor(this.edgesListLeft[nextListIndex], this.edgesListRight[nextListIndex], "#FF0000");
                this.setEdgeColor(this.edgesListRight[nextListIndex], this.edgesListLeft[nextListIndex], "#FF0000");
                if (this.setData[left] < this.setData[right]) {
                    this.cmd("SetText", this.setID[right], "");
                    this.cmd("CreateLabel", moveLabelID, this.setData[right], this.SET_ARRAY_START_X, this.SET_ARRAY_START_Y + right * this.SET_ARRAY_ELEM_HEIGHT);
                    this.cmd("Move", moveLabelID, this.SET_ARRAY_START_X, this.SET_ARRAY_START_Y + left * this.SET_ARRAY_ELEM_HEIGHT);
                    this.cmd("Step");
                    this.cmd("Delete", moveLabelID);
                    this.setData[left] = this.setData[left] + this.setData[right];
                    this.setData[right] = left;
                } else {
                    this.cmd("SetText", this.setID[left], "");
                    this.cmd("CreateLabel", moveLabelID, this.setData[left], this.SET_ARRAY_START_X, this.SET_ARRAY_START_Y + left * this.SET_ARRAY_ELEM_HEIGHT);
                    this.cmd("Move", moveLabelID, this.SET_ARRAY_START_X, this.SET_ARRAY_START_Y + right * this.SET_ARRAY_ELEM_HEIGHT);
                    this.cmd("Step");
                    this.cmd("Delete", moveLabelID);
                    this.setData[right] = this.setData[right] + this.setData[left];
                    this.setData[left] = right;
                }
                this.cmd("SetText", this.setID[left], this.setData[left]);
                this.cmd("SetText", this.setID[right], this.setData[right]);
            } else {
                this.cmd("CreateLabel", messageLabelID, "Vertices in the same tree.  Skip edge", this.MESSAGE_LABEL_X, this.MESSAGE_LABEL_Y, 0);
                this.cmd("Step");
            }

            this.highlightEdge(this.edgesListLeft[nextListIndex], this.edgesListRight[nextListIndex], 0);
            this.highlightEdge(this.edgesListRight[nextListIndex], this.edgesListLeft[nextListIndex], 0);

            this.cmd("Delete", messageLabelID);
            this.cmd("Delete", highlightCircle1);
            this.cmd("Delete", highlightCircle2);

            this.cmd("Delete", this.edgesListLeftID[nextListIndex]);
            this.cmd("Delete", this.edgesListRightID[nextListIndex]);
            this.cmd("SetText", findLabelLeft, "");
            this.cmd("SetText", findLabelRight, "");
            nextListIndex++;
        }
        this.cmd("Delete", findLabelLeft);
        this.cmd("Delete", findLabelRight);

        return this.commands;
    }

    reset() {
        this.messageID = [];
    }
};
