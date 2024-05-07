


Algorithm.Stack.Array = class ArrayStack extends Algorithm.Stack {
    SIZE = 15;
    INDEX_COLOR = "#0000FF";

    constructor(am) {
        super();
        this.init(am);
    }

    init(am) {
        super.init(am);
        this.addControls();
        this.resetAll();
    }

    sizeChanged() {
        this.resetAll();
    }

    addControls() {
        this.pushField = this.addControlToAlgorithmBar("Text", "", {maxlength: 4, size: 4});
        this.addReturnSubmit(this.pushField, "ALPHANUM", this.pushCallback.bind(this));
        this.pushButton = this.addButtonToAlgorithmBar("Push");
        this.pushButton.onclick = this.pushCallback.bind(this);
        this.addBreakToAlgorithmBar();

        this.popButton = this.addButtonToAlgorithmBar("Pop");
        this.popButton.onclick = this.popCallback.bind(this);
        this.addBreakToAlgorithmBar();

        this.clearButton = this.addButtonToAlgorithmBar("Clear");
        this.clearButton.onclick = this.clearCallback.bind(this);
    }

    resetAll() {
        this.animationManager.resetAll();
        this.nextIndex = 0;
        this.commands = [];

        this.leftoverLabelID = this.nextIndex++;
        this.cmd("CreateLabel", this.leftoverLabelID, "", this.getArrayX(6), 2 * this.getArrayElemHeight());

        this.top = 0;
        this.topID = this.nextIndex++;
        this.topLabelID = this.nextIndex++;
        this.cmd("CreateRectangle", this.topID, 0, this.getArrayElemWidth(), this.getArrayElemHeight(), this.getArrayX(3), 2 * this.getArrayElemHeight());
        this.cmd("CreateLabel", this.topLabelID, "top:  ", 0, 0);
        this.cmd("AlignLeft", this.topLabelID, this.topID);

        this.arrayData = [];
        this.arrayID = [];
        this.arrayLabelID = [];
        for (let i = 0; i < this.SIZE; i++) {
            this.arrayID[i] = this.nextIndex++;
            this.arrayLabelID[i] = this.nextIndex++;
            this.cmd("CreateRectangle", this.arrayID[i], "", this.getArrayElemWidth(), this.getArrayElemHeight(), this.getArrayX(i), this.getArrayY(i));
            this.cmd("CreateLabel", this.arrayLabelID[i], i, this.getArrayX(i), this.getArrayLabelY(i));
            this.cmd("SetForegroundColor", this.arrayLabelID[i], this.INDEX_COLOR);
        }

        this.highlightID = this.nextIndex++;

        this.initialIndex = this.nextIndex;
        this.animationManager.StartNewAnimation(this.commands);
        this.animationManager.skipForward();
        this.animationManager.clearHistory();
    }

    reset() {
        this.top = 0;
        this.nextIndex = this.initialIndex;
    }

    ///////////////////////////////////////////////////////////////////////////////
    // Calculating canvas positions and sizes

    getArrayX(i) {
        return this.getArrayXY(i).x;
    }

    getArrayY(i) {
        return this.getArrayXY(i).y;
    }

    getArrayLabelY(i) {
        return this.getArrayY(i) + this.getArrayElemHeight() * 0.9;
    }

    getArrayXY(i) {
        let x = 1.5 * this.getArrayElemWidth();
        let y = 4.5 * this.getArrayElemHeight();
        for (let k = 0; k < i; k++) {
            x += this.getArrayElemWidth();
            if (x + this.getArrayElemWidth() > this.getCanvasWidth()) {
                x = 1.5 * this.getArrayElemWidth();
                y += 2.5 * this.getArrayElemHeight();
            }
        }
        return {x: x, y: y};
    }

    getArrayElemWidth() {
        let nrows = 1;
        while (true) {
            const w = nrows * this.getCanvasWidth() / (this.SIZE + 2 * nrows);
            if (w >= 25) return w;
            nrows++;
        }
    }

    getArrayElemHeight() {
        return this.getArrayElemWidth() * 0.8;
    }

    ///////////////////////////////////////////////////////////////////////////////
    // Callback functions for the algorithm control bar

    pushCallback(event) {
        const pushVal = this.pushField.value;
        if (pushVal !== "") {
            this.pushField.value = "";
            this.implementAction(this.push.bind(this), pushVal);
        }
    }

    popCallback(event) {
        this.implementAction(this.pop.bind(this), "");
    }

    clearCallback(event) {
        this.implementAction(this.clearAll.bind(this), "");
    }

    ///////////////////////////////////////////////////////////////////////////////
    // Functions that do the actual work

    clearAll() {
        this.commands = [];
        this.cmd("SetText", this.leftoverLabelID, "");
        for (let i = 0; i < this.SIZE; i++) {
            this.arrayData[i] = null;
            this.cmd("SetText", this.arrayID[i], "");
        }
        this.top = 0;
        this.cmd("SetText", this.topID, this.top);
        return this.commands;
    }

    push(elemToPush) {
        this.commands = [];
        if (this.top >= this.SIZE) {
            this.cmd("SetText", this.leftoverLabelID, "Stack full!");
            return this.commands;
        }

        const labPushValID1 = this.nextIndex++;
        const labPushValID2 = this.nextIndex++;
        this.arrayData[this.top] = elemToPush;

        this.cmd("SetText", this.leftoverLabelID, "Pushing value:  ");
        this.cmd("CreateLabel", labPushValID1, elemToPush, 0, 0);
        this.cmd("CreateLabel", labPushValID2, elemToPush, 0, 0);
        this.cmd("AlignRight", labPushValID1, this.leftoverLabelID);
        this.cmd("AlignRight", labPushValID2, this.leftoverLabelID);
        this.cmd("Step");

        this.cmd("CreateHighlightCircle", this.highlightID, this.INDEX_COLOR, 0, 0);
        this.cmd("SetWidth", this.highlightID, this.getArrayElemHeight());
        this.cmd("AlignMiddle", this.highlightID, this.topID);
        this.cmd("Step");

        this.cmd("Move", this.highlightID, this.getArrayX(this.top), this.getArrayLabelY(this.top));
        this.cmd("Step");

        this.cmd("Move", labPushValID1, this.getArrayX(this.top), this.getArrayY(this.top));
        this.cmd("Step");

        this.cmd("Settext", this.arrayID[this.top], elemToPush);
        this.cmd("Delete", labPushValID1);
        this.cmd("Delete", this.highlightID);
        this.cmd("SetHighlight", this.topID, 1);
        this.cmd("Step");

        this.top++;
        this.cmd("SetText", this.topID, this.top);
        this.cmd("Step");

        this.cmd("SetText", this.leftoverLabelID, "");
        this.cmd("Delete", labPushValID2);
        this.cmd("SetHighlight", this.topID, 0);

        return this.commands;
    }

    pop(ignored) {
        this.commands = [];
        if (this.top === 0) {
            this.cmd("SetText", this.leftoverLabelID, "Stack empty!");
            return this.commands;
        }

        const labPopValID = this.nextIndex++;

        this.cmd("SetText", this.leftoverLabelID, "Popping value:  ");
        this.cmd("SetHighlight", this.topID, 1);
        this.cmd("Step");

        this.top--;
        this.cmd("SetText", this.topID, this.top);
        this.cmd("Step");

        this.cmd("SetHighlight", this.topID, 0);
        this.cmd("CreateHighlightCircle", this.highlightID, this.INDEX_COLOR, 0, 0);
        this.cmd("SetWidth", this.highlightID, this.getArrayElemHeight());
        this.cmd("AlignMiddle", this.highlightID, this.topID);
        this.cmd("Step");

        this.cmd("Move", this.highlightID, this.getArrayX(this.top), this.getArrayLabelY(this.top));
        this.cmd("Step");

        this.cmd("CreateLabel", labPopValID, this.arrayData[this.top], 0, 0);
        this.cmd("AlignMiddle", labPopValID, this.arrayID[this.top]);
        this.cmd("Settext", this.arrayID[this.top], "");
        this.cmd("MoveToAlignRight", labPopValID, this.leftoverLabelID);
        this.cmd("Step");

        this.cmd("Delete", labPopValID);
        this.cmd("Delete", this.highlightID);
        this.cmd("SetText", this.leftoverLabelID, `Popped value:  ${this.arrayData[this.top]}`);

        return this.commands;
    }
};
