


Algorithm.Graph.ToposortIndegree = class ToposortIndegree extends Algorithm.Graph {
    INDEGREE_ARRAY_ELEM_WIDTH = 25;
    INDEGREE_ARRAY_ELEM_HEIGHT = 25;
    INDEGREE_ARRAY_START_X = 50;
    INDEGREE_ARRAY_START_Y = 60;

    STACK_START_X = this.INDEGREE_ARRAY_START_X + 100;
    STACK_START_Y = this.INDEGREE_ARRAY_START_Y;
    STACK_HEIGHT = this.INDEGREE_ARRAY_ELEM_HEIGHT;

    TOPO_ARRAY_START_X = this.STACK_START_X + 150;
    TOPO_ARRAY_START_Y = this.INDEGREE_ARRAY_START_Y;
    TOPO_HEIGHT = this.INDEGREE_ARRAY_ELEM_HEIGHT;

    MESSAGE_LABEL_1_X = 70;
    MESSAGE_LABEL_1_Y = 10;

    MESSAGE_LABEL_2_X = 70;
    MESSAGE_LABEL_2_Y = 40;

    HIGHLIGHT_CIRCLE_COLOR = "#000000";
    MESSAGE_COLOR = "#0000FF";

    constructor(am) {
        super();
        this.init(am);
    }

    addControls() {
        this.startButton = this.addButtonToAlgorithmBar("Do Topological Sort");
        this.startButton.onclick = this.startCallback.bind(this);
        super.addControls(false);
    }

    init(am) {
        this.showEdgeCosts = false;
        super.init(am, true, true); // TODO:  add no edge label flag to this?
    }

    setup() {
        super.setup();
        this.messageID = [];
        this.animationManager.setAllLayers([0, this.currentLayer]);

        this.messageID = [];
        this.commands = [];
        this.indegreeID = new Array(this.size);
        this.setIndexID = new Array(this.size);
        this.indegree = new Array(this.size);
        this.orderID = new Array(this.size);

        for (let i = 0; i < this.size; i++) {
            this.indegreeID[i] = this.nextIndex++;
            this.setIndexID[i] = this.nextIndex++;
            this.orderID[i] = this.nextIndex++;
            this.cmd("CreateLabel", this.orderID[i], "", 0, 0); // HACK!!
            this.cmd("CreateRectangle", this.indegreeID[i], " ", this.INDEGREE_ARRAY_ELEM_WIDTH, this.INDEGREE_ARRAY_ELEM_HEIGHT, this.INDEGREE_ARRAY_START_X, this.INDEGREE_ARRAY_START_Y + i * this.INDEGREE_ARRAY_ELEM_HEIGHT);
            this.cmd("CreateLabel", this.setIndexID[i], i, this.INDEGREE_ARRAY_START_X - this.INDEGREE_ARRAY_ELEM_WIDTH, this.INDEGREE_ARRAY_START_Y + i * this.INDEGREE_ARRAY_ELEM_HEIGHT);
            this.cmd("SetForegroundColor", this.setIndexID[i], this.VERTEX_INDEX_COLOR);
        }
        this.cmd("CreateLabel", this.nextIndex++, "Indegree", this.INDEGREE_ARRAY_START_X - 1 * this.INDEGREE_ARRAY_ELEM_WIDTH, this.INDEGREE_ARRAY_START_Y - this.INDEGREE_ARRAY_ELEM_HEIGHT * 1.5, 0);

        this.message1ID = this.nextIndex++;
        this.message2ID = this.nextIndex++;
        this.cmd("CreateLabel", this.message1ID, "", this.MESSAGE_LABEL_1_X, this.MESSAGE_LABEL_1_Y, 0);
        this.cmd("SetTextColor", this.message1ID, this.MESSAGE_COLOR);
        this.cmd("CreateLabel", this.message2ID, "", this.MESSAGE_LABEL_2_X, this.MESSAGE_LABEL_2_Y);
        this.cmd("SetTextColor", this.message2ID, this.MESSAGE_COLOR);

        this.stackLabelID = this.nextIndex++;
        this.topoLabelID = this.nextIndex++;
        this.cmd("CreateLabel", this.stackLabelID, "", this.STACK_START_X, this.STACK_START_Y - this.STACK_HEIGHT);
        this.cmd("CreateLabel", this.topoLabelID, "", this.TOPO_ARRAY_START_X, this.TOPO_ARRAY_START_Y - this.TOPO_HEIGHT);

        this.animationManager.StartNewAnimation(this.commands);
        this.animationManager.skipForward();
        this.animationManager.clearHistory();

        this.highlightCircleL = this.nextIndex++;
        this.highlightCircleAL = this.nextIndex++;
        this.highlightCircleAM = this.nextIndex++;

        this.initialIndex = this.nextIndex;
    }

    startCallback(event) {
        this.implementAction(this.doTopoSort.bind(this), "");
    }

    doTopoSort(ignored) {
        this.commands = [];
        const stack = new Array(this.size);
        const stackID = new Array(this.size);
        let stackTop = 0;

        for (let vertex = 0; vertex < this.size; vertex++) {
            this.cmd("SetText", this.indegreeID[vertex], "0");
            this.indegree[vertex] = 0;
            stackID[vertex] = this.nextIndex++;
            this.cmd("Delete", this.orderID[vertex]);
        }

        this.cmd("SetText", this.message1ID, "Calculate this.indegree of all verticies by going through every edge of the graph");
        this.cmd("SetText", this.topoLabelID, "");
        this.cmd("SetText", this.stackLabelID, "");
        for (let vertex = 0; vertex < this.size; vertex++) {
            let adjListIndex = 0;
            for (let neighbor = 0; neighbor < this.size; neighbor++)
                if (this.adjMatrix[vertex][neighbor] >= 0) {
                    adjListIndex++;
                    this.highlightEdge(vertex, neighbor, 1);
                    this.cmd("Step");

                    this.cmd("CreateHighlightCircle", this.highlightCircleL, this.HIGHLIGHT_CIRCLE_COLOR, this.xPosLogical[neighbor], this.yPosLogical[neighbor]);
                    this.cmd("SetLayer", this.highlightCircleL, 1);
                    this.cmd("CreateHighlightCircle", this.highlightCircleAL, this.HIGHLIGHT_CIRCLE_COLOR, this.adjListXStart + adjListIndex * (this.adjListWidth + this.adjListSpacing), this.adjListYStart + vertex * this.adjListHeight);
                    this.cmd("SetLayer", this.highlightCircleAL, 2);
                    this.cmd("CreateHighlightCircle", this.highlightCircleAM, this.HIGHLIGHT_CIRCLE_COLOR, this.adjMatrixXStart + neighbor * this.adjMatrixWidth, this.adjMatrixYStart - this.adjMatrixHeight);
                    this.cmd("SetLayer", this.highlightCircleAM, 3);

                    this.cmd("Move", this.highlightCircleL, this.INDEGREE_ARRAY_START_X - this.INDEGREE_ARRAY_ELEM_WIDTH, this.INDEGREE_ARRAY_START_Y + neighbor * this.INDEGREE_ARRAY_ELEM_HEIGHT);

                    this.cmd("Move", this.highlightCircleAL, this.INDEGREE_ARRAY_START_X - this.INDEGREE_ARRAY_ELEM_WIDTH, this.INDEGREE_ARRAY_START_Y + neighbor * this.INDEGREE_ARRAY_ELEM_HEIGHT);
                    this.cmd("Move", this.highlightCircleAM, this.INDEGREE_ARRAY_START_X - this.INDEGREE_ARRAY_ELEM_WIDTH, this.INDEGREE_ARRAY_START_Y + neighbor * this.INDEGREE_ARRAY_ELEM_HEIGHT);

                    this.cmd("Step");
                    this.indegree[neighbor] = this.indegree[neighbor] + 1;
                    this.cmd("SetText", this.indegreeID[neighbor], this.indegree[neighbor]);
                    this.cmd("SetTextColor", this.indegreeID[neighbor], "#FF0000");
                    this.cmd("Step");
                    this.cmd("Delete", this.highlightCircleL);
                    this.cmd("Delete", this.highlightCircleAL);
                    this.cmd("Delete", this.highlightCircleAM);
                    this.cmd("SetTextColor", this.indegreeID[neighbor], this.EDGE_COLOR);
                    this.highlightEdge(vertex, neighbor, 0);
                }
        }
        this.cmd("SetText", this.message1ID, "Collect all vertices with 0 this.indegree onto a stack");
        this.cmd("SetText", this.stackLabelID, "Zero Indegree Vertices");

        for (let vertex = 0; vertex < this.size; vertex++) {
            this.cmd("SetHighlight", this.indegreeID[vertex], 1);
            this.cmd("Step");
            if (this.indegree[vertex] === 0) {
                stack[stackTop] = vertex;
                this.cmd("CreateLabel", stackID[stackTop], vertex, this.INDEGREE_ARRAY_START_X - this.INDEGREE_ARRAY_ELEM_WIDTH, this.INDEGREE_ARRAY_START_Y + vertex * this.INDEGREE_ARRAY_ELEM_HEIGHT);
                this.cmd("Move", stackID[stackTop], this.STACK_START_X, this.STACK_START_Y + stackTop * this.STACK_HEIGHT);
                this.cmd("Step");
                stackTop++;
            }
            this.cmd("SetHighlight", this.indegreeID[vertex], 0);
        }
        this.cmd("SetText", this.topoLabelID, "Topological Order");

        let nextInOrder = 0;
        while (stackTop > 0) {
            stackTop--;
            const nextElem = stack[stackTop];
            this.cmd("SetText", this.message1ID, "Pop off top vertex with this.indegree 0, add to topological sort");
            this.cmd("CreateLabel", this.orderID[nextInOrder], nextElem, this.STACK_START_X, this.STACK_START_Y + stackTop * this.STACK_HEIGHT);
            this.cmd("Delete", stackID[stackTop]);
            this.cmd("Step");
            this.cmd("Move", this.orderID[nextInOrder], this.TOPO_ARRAY_START_X, this.TOPO_ARRAY_START_Y + nextInOrder * this.TOPO_HEIGHT);
            this.cmd("Step");
            this.cmd("SetText", this.message1ID, `Find all neigbors of vertex ${String(nextElem)}, decrease their this.indegree.  If this.indegree becomes 0, add to stack`);
            this.cmd("SetHighlight", this.circleID[nextElem], 1);
            this.cmd("Step");

            let adjListIndex = 0;

            for (let vertex = 0; vertex < this.size; vertex++) {
                if (this.adjMatrix[nextElem][vertex] >= 0) {
                    adjListIndex++;
                    this.highlightEdge(nextElem, vertex, 1);
                    this.cmd("Step");

                    this.cmd("CreateHighlightCircle", this.highlightCircleL, this.HIGHLIGHT_CIRCLE_COLOR, this.xPosLogical[vertex], this.yPosLogical[vertex]);
                    this.cmd("SetLayer", this.highlightCircleL, 1);
                    this.cmd("CreateHighlightCircle", this.highlightCircleAL, this.HIGHLIGHT_CIRCLE_COLOR, this.adjListXStart + adjListIndex * (this.adjListWidth + this.adjListSpacing), this.adjListYStart + nextElem * this.adjListHeight);
                    this.cmd("SetLayer", this.highlightCircleAL, 2);
                    this.cmd("CreateHighlightCircle", this.highlightCircleAM, this.HIGHLIGHT_CIRCLE_COLOR, this.adjMatrixXStart + vertex * this.adjMatrixWidth, this.adjMatrixYStart - this.adjMatrixHeight);
                    this.cmd("SetLayer", this.highlightCircleAM, 3);

                    this.cmd("Move", this.highlightCircleL, this.INDEGREE_ARRAY_START_X - this.INDEGREE_ARRAY_ELEM_WIDTH, this.INDEGREE_ARRAY_START_Y + vertex * this.INDEGREE_ARRAY_ELEM_HEIGHT);

                    this.cmd("Move", this.highlightCircleAL, this.INDEGREE_ARRAY_START_X - this.INDEGREE_ARRAY_ELEM_WIDTH, this.INDEGREE_ARRAY_START_Y + vertex * this.INDEGREE_ARRAY_ELEM_HEIGHT);
                    this.cmd("Move", this.highlightCircleAM, this.INDEGREE_ARRAY_START_X - this.INDEGREE_ARRAY_ELEM_WIDTH, this.INDEGREE_ARRAY_START_Y + vertex * this.INDEGREE_ARRAY_ELEM_HEIGHT);

                    this.cmd("Step");
                    this.indegree[vertex] = this.indegree[vertex] - 1;
                    this.cmd("SetText", this.indegreeID[vertex], this.indegree[vertex]);
                    this.cmd("SetTextColor", this.indegreeID[vertex], "#FF0000");
                    this.cmd("Step");
                    if (this.indegree[vertex] === 0) {
                        stack[stackTop] = vertex;
                        this.cmd("CreateLabel", stackID[stackTop], vertex, this.INDEGREE_ARRAY_START_X - this.INDEGREE_ARRAY_ELEM_WIDTH, this.INDEGREE_ARRAY_START_Y + vertex * this.INDEGREE_ARRAY_ELEM_HEIGHT);
                        this.cmd("Move", stackID[stackTop], this.STACK_START_X, this.STACK_START_Y + stackTop * this.STACK_HEIGHT);
                        this.cmd("Step");
                        stackTop++;
                    }
                    this.cmd("Delete", this.highlightCircleL);
                    this.cmd("Delete", this.highlightCircleAL);
                    this.cmd("Delete", this.highlightCircleAM);
                    this.cmd("SetTextColor", this.indegreeID[vertex], this.EDGE_COLOR);
                    this.highlightEdge(nextElem, vertex, 0);
                }
            }
            this.cmd("SetHighlight", this.circleID[nextElem], 0);
            nextInOrder++;
        }

        this.cmd("SetText", this.message1ID, "");
        this.cmd("SetText", this.stackLabelID, "");
        return this.commands;
    }

    setupLarge() {
        this.dXPos = this.D_X_POS_LARGE;
        this.dYPos = this.D_Y_POS_LARGE;
        this.fXPos = this.F_X_POS_LARGE;
        this.fYPos = this.F_Y_POS_LARGE;
        super.setupLarge();
    }

    setupSmall() {
        this.dXPos = this.D_X_POS_SMALL;
        this.dYPos = this.D_Y_POS_SMALL;
        this.fXPos = this.F_X_POS_SMALL;
        this.fYPos = this.F_Y_POS_SMALL;
        super.setupSmall();
    }

    dfsVisit(startVertex, messageX, printCCNum) {
        let nextMessage = this.nextIndex++;
        this.messageID.push(nextMessage);
        this.cmd("CreateLabel", nextMessage, `DFS(${String(startVertex)})`, messageX, this.messageY, 0);

        this.messageY = this.messageY + 20;
        if (!this.visited[startVertex]) {
            this.d_times[startVertex] = this.currentTime++;
            this.cmd("CreateLabel", this.d_timesID_L[startVertex], `d = ${String(this.d_times[startVertex])}`, this.dXPos[startVertex], this.dYPos[startVertex]);
            this.cmd("CreateLabel", this.d_timesID_AL[startVertex], `d = ${String(this.d_times[startVertex])}`, this.adjListXStart - 2 * this.adjListWidth, this.adjListYStart + startVertex * this.adjListHeight - 1 / 4 * this.adjListHeight);
            this.cmd("SetLayer", this.d_timesID_L[startVertex], 1);
            this.cmd("SetLayer", this.d_timesID_AL[startVertex], 2);

            this.visited[startVertex] = true;
            this.cmd("Step");
            for (let neighbor = 0; neighbor < this.size; neighbor++) {
                if (this.adjMatrix[startVertex][neighbor] > 0) {
                    this.highlightEdge(startVertex, neighbor, 1);
                    if (this.visited[neighbor]) {
                        nextMessage = this.nextIndex;
                        this.cmd("CreateLabel", nextMessage, `Vertex ${String(neighbor)} already this.visited.`, messageX, this.messageY, 0);
                    }
                    this.cmd("Step");
                    this.highlightEdge(startVertex, neighbor, 0);
                    if (this.visited[neighbor]) {
                        this.cmd("Delete", nextMessage, "DNM");
                    }

                    if (!this.visited[neighbor]) {
                        this.cmd("Disconnect", this.circleID[startVertex], this.circleID[neighbor]);
                        this.cmd("Connect", this.circleID[startVertex], this.circleID[neighbor], this.DFS_TREE_COLOR, this.curve[startVertex][neighbor], 1, "");
                        this.cmd("Move", this.highlightCircleL, this.xPosLogical[neighbor], this.yPosLogical[neighbor]);
                        this.cmd("Move", this.highlightCircleAL, this.adjListXStart - this.adjListWidth, this.adjListYStart + neighbor * this.adjListHeight);
                        this.cmd("Move", this.highlightCircleAM, this.adjMatrixXStart - this.adjMatrixWidth, this.adjMatrixYStart + neighbor * this.adjMatrixHeight);

                        this.cmd("Step");
                        this.dfsVisit(neighbor, messageX + 10, printCCNum);
                        nextMessage = this.nextIndex;
                        this.cmd("CreateLabel", nextMessage, `Returning from recursive call: DFS(${String(neighbor)})`, messageX + 20, this.messageY, 0);

                        this.cmd("Move", this.highlightCircleAL, this.adjListXStart - this.adjListWidth, this.adjListYStart + startVertex * this.adjListHeight);
                        this.cmd("Move", this.highlightCircleL, this.xPosLogical[startVertex], this.yPosLogical[startVertex]);
                        this.cmd("Move", this.highlightCircleAM, this.adjMatrixXStart - this.adjMatrixWidth, this.adjMatrixYStart + startVertex * this.adjMatrixHeight);
                        this.cmd("Step");
                        this.cmd("Delete", nextMessage, 18);
                    }
                    this.cmd("Step");
                }
            }

            this.f_times[startVertex] = this.currentTime++;
            this.cmd("CreateLabel", this.f_timesID_L[startVertex], `f = ${String(this.f_times[startVertex])}`, this.fXPos[startVertex], this.fYPos[startVertex]);
            this.cmd("CreateLabel", this.f_timesID_AL[startVertex], `f = ${String(this.f_times[startVertex])}`, this.adjListXStart - 2 * this.adjListWidth, this.adjListYStart + startVertex * this.adjListHeight + 1 / 4 * this.adjListHeight);

            this.cmd("SetLayer", this.f_timesID_L[startVertex], 1);
            this.cmd("SetLayer", this.f_timesID_AL[startVertex], 2);

            this.cmd("Step");

            for (let i = this.topoOrderArrayL.length; i > 0; i--) {
                this.topoOrderArrayL[i] = this.topoOrderArrayL[i - 1];
                this.topoOrderArrayAL[i] = this.topoOrderArrayAL[i - 1];
                this.topoOrderArrayAM[i] = this.topoOrderArrayAM[i - 1];
            }

            let nextVertexLabel = this.nextIndex++;
            this.messageID.push(nextVertexLabel);
            this.cmd("CreateLabel", nextVertexLabel, startVertex, this.xPosLogical[startVertex], this.yPosLogical[startVertex]);
            this.cmd("SetLayer", nextVertexLabel, 1);
            this.topoOrderArrayL[0] = nextVertexLabel;

            nextVertexLabel = this.nextIndex++;
            this.messageID.push(nextVertexLabel);
            this.cmd("CreateLabel", nextVertexLabel, startVertex, this.adjListXStart - this.adjListWidth, this.adjListYStart + startVertex * this.adjListHeight);
            this.cmd("SetLayer", nextVertexLabel, 2);
            this.topoOrderArrayAL[0] = nextVertexLabel;

            nextVertexLabel = this.nextIndex++;
            this.messageID.push(nextVertexLabel);
            this.cmd("CreateLabel", nextVertexLabel, startVertex, this.adjMatrixXStart - this.adjMatrixWidth, this.adjMatrixYStart + startVertex * this.adjMatrixHeight);
            this.cmd("SetLayer", nextVertexLabel, 3);
            this.topoOrderArrayAM[0] = nextVertexLabel;

            for (let i = 0; i < this.topoOrderArrayL.length; i++) {
                this.cmd("Move", this.topoOrderArrayL[i], this.ORDERING_INITIAL_X,
                    this.ORDERING_INITIAL_Y + i * this.ORDERING_DELTA_Y);
                this.cmd("Move", this.topoOrderArrayAL[i], this.ORDERING_INITIAL_X,
                    this.ORDERING_INITIAL_Y + i * this.ORDERING_DELTA_Y);
                this.cmd("Move", this.topoOrderArrayAM[i], this.ORDERING_INITIAL_X,
                    this.ORDERING_INITIAL_Y + i * this.ORDERING_DELTA_Y);
            }
            this.cmd("Step");
        }
    }

    reset() {
        this.nextIndex = this.oldNextIndex;
        this.messageID = [];
        this.nextIndex = this.initialIndex;
    }
};
