


Algorithm.Recursion.Reverse = class Reverse extends Algorithm.Recursion {
    ACTIVATION_FIELDS = ["word ", "subProblem ", "subSolution ", "solution "];

    CODE = [
        ["def ", "reverse(word)", ":"],
        ["     if ", "(word === \"\"): "],
        ["          return word"],
        ["     else:"],
        ["          subProblem = ", "word[1:]"],
        ["          subSolution = ", "reverse(subProblem)"],
        ["          solution = ", "subSolution + word[0]"],
        ["          return = ", "solution"],
    ];

    RECURSIVE_DELTA_Y = this.ACTIVATION_FIELDS.length * this.ACTIVATION_RECORD_HEIGHT;

    ACTIVATION_RECORT_START_X = 375;
    ACTIVATION_RECORT_START_Y = 20;

    constructor(am) {
        super();
        this.init(am);
    }

    init(am) {
        super.init(am);
        this.nextIndex = 0;
        this.addControls();
        this.code = this.CODE;

        this.addCodeToCanvas(this.code);

        this.animationManager.StartNewAnimation(this.commands);
        this.animationManager.skipForward();
        this.animationManager.clearHistory();
        this.initialIndex = this.nextIndex;
        this.oldIDs = [];
        this.commands = [];
    }

    addControls() {
        this.controls = [];
        this.reverseField = this.addControlToAlgorithmBar("Text", "", {maxlength: 10, size: 10});
        this.addReturnSubmit(this.reverseField, "ALPHA", this.reverseCallback.bind(this));
        this.controls.push(this.reverseField);

        this.reverseButton = this.addButtonToAlgorithmBar("Reverse");
        this.reverseButton.onclick = this.reverseCallback.bind(this);
        this.controls.push(this.reverseButton);
    }

    reverseCallback(event) {
        const revValue = this.reverseField.value;
        if (revValue !== "") {
            this.implementAction(this.doReverse.bind(this), revValue);
        }
    }

    doReverse(value) {
        this.commands = [];

        this.clearOldIDs();

        this.currentY = this.ACTIVATION_RECORT_START_Y;
        this.currentX = this.ACTIVATION_RECORT_START_X;

        const final = this.reverse(value);
        const resultID = this.nextIndex++;
        this.oldIDs.push(resultID);
        this.cmd("CreateLabel", resultID, `reverse(${String(value)}) = ${String(final)}`,
            this.CODE_START_X, this.CODE_START_Y + (this.code.length + 1) * this.CODE_LINE_HEIGHT, 0);
        return this.commands;
    }

    reverse(value) {
        const activationRec = this.createActivation("reverse     ", this.ACTIVATION_FIELDS, this.currentX, this.currentY);
        this.cmd("SetText", activationRec.fieldIDs[0], value);
        //    this.cmd("CreateLabel", ID, "", 10, this.currentY, 0);
        const oldX = this.currentX;
        const oldY = this.currentY;
        this.currentY += this.RECURSIVE_DELTA_Y;
        if (this.currentY + this.RECURSIVE_DELTA_Y > this.getCanvasHeight()) {
            this.currentY = this.ACTIVATION_RECORT_START_Y;
            this.currentX += this.ACTIVATION_RECORD_SPACING;
        }
        this.cmd("SetForegroundColor", this.codeID[0][1], this.CODE_HIGHLIGHT_COLOR);
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.codeID[0][1], this.CODE_STANDARD_COLOR);
        this.cmd("SetForegroundColor", this.codeID[1][1], this.CODE_HIGHLIGHT_COLOR);
        this.cmd("Step");
        this.cmd("SetForegroundColor", this.codeID[1][1], this.CODE_STANDARD_COLOR);
        if (value !== "") {
            this.cmd("SetForegroundColor", this.codeID[4][0], this.CODE_HIGHLIGHT_COLOR);
            this.cmd("SetForegroundColor", this.codeID[4][1], this.CODE_HIGHLIGHT_COLOR);
            const subProblem = value.substr(1);
            this.cmd("SetText", activationRec.fieldIDs[1], subProblem);
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.codeID[4][0], this.CODE_STANDARD_COLOR);
            this.cmd("SetForegroundColor", this.codeID[4][1], this.CODE_STANDARD_COLOR);
            this.cmd("SetForegroundColor", this.codeID[5][1], this.CODE_HIGHLIGHT_COLOR);
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.codeID[5][1], this.CODE_STANDARD_COLOR);

            const subSolution = this.reverse(subProblem);

            this.cmd("SetForegroundColor", this.codeID[5][0], this.CODE_HIGHLIGHT_COLOR);
            this.cmd("SetForegroundColor", this.codeID[5][1], this.CODE_HIGHLIGHT_COLOR);
            this.cmd("SetText", activationRec.fieldIDs[2], subSolution);
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.codeID[5][0], this.CODE_STANDARD_COLOR);
            this.cmd("SetForegroundColor", this.codeID[5][1], this.CODE_STANDARD_COLOR);

            this.cmd("SetForegroundColor", this.codeID[6][0], this.CODE_HIGHLIGHT_COLOR);
            this.cmd("SetForegroundColor", this.codeID[6][1], this.CODE_HIGHLIGHT_COLOR);
            const solution = subSolution + value[0];
            this.cmd("SetText", activationRec.fieldIDs[3], solution);
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.codeID[6][0], this.CODE_STANDARD_COLOR);
            this.cmd("SetForegroundColor", this.codeID[6][1], this.CODE_STANDARD_COLOR);

            this.cmd("SetForegroundColor", this.codeID[7][0], this.CODE_HIGHLIGHT_COLOR);
            this.cmd("SetForegroundColor", this.codeID[7][1], this.CODE_HIGHLIGHT_COLOR);

            this.cmd("Step");
            this.deleteActivation(activationRec);
            this.currentY = oldY;
            this.currentX = oldX;
            this.cmd("CreateLabel", this.nextIndex, `Return Value = "${solution}"`, oldX, oldY);
            this.cmd("SetForegroundColor", this.nextIndex, this.CODE_HIGHLIGHT_COLOR);
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.codeID[7][0], this.CODE_STANDARD_COLOR);
            this.cmd("SetForegroundColor", this.codeID[7][1], this.CODE_STANDARD_COLOR);
            this.cmd("Delete", this.nextIndex);

            //        this.cmd("SetForegroundColor", this.codeID[4][3], this.CODE_HIGHLIGHT_COLOR);
            //        this.cmd("Step");
            return solution;
        } else {
            this.cmd("SetForegroundColor", this.codeID[2][0], this.CODE_HIGHLIGHT_COLOR);
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.codeID[2][0], this.CODE_STANDARD_COLOR);

            this.currentY = oldY;
            this.currentX = oldX;
            this.deleteActivation(activationRec);
            this.cmd("CreateLabel", this.nextIndex, "Return Value = \"\"", oldX, oldY);
            this.cmd("SetForegroundColor", this.nextIndex, this.CODE_HIGHLIGHT_COLOR);
            this.cmd("Step");
            this.cmd("Delete", this.nextIndex);

            return "";
        }
    }
};
