


Algorithm.Recursion.Factorial = class Factorial extends Algorithm.Recursion {
    MAX_VALUE = 20;

    ACTIVATION_FIELDS = ["n ", "subValue ", "returnValue "];
    CODE = [["def ", "factorial(n)", ":"],
        ["     if ", "(n <= 1): "],
        ["          return 1"],
        ["     else:"],
        ["          subSolution = ", "factorial(n - 1)"],
        ["          solution = ", "subSolution * n"],
        ["          return ", "solution"]];

    RECURSIVE_DELTA_Y = this.ACTIVATION_FIELDS.length * this.ACTIVATION_RECORD_HEIGHT;

    ACTIVATION_RECORT_START_X = 330;
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

        this.factorialField = this.addControlToAlgorithmBar("Text", "", {maxlength: 2, size: 2});
        this.addReturnSubmit(this.factorialField, "int", this.factorialCallback.bind(this));
        this.controls.push(this.factorialField);

        this.factorialButton = this.addButtonToAlgorithmBar("Factorial");
        this.factorialButton.onclick = this.factorialCallback.bind(this);
        this.controls.push(this.factorialButton);
    }

    factorialCallback(event) {
        let factValue = this.normalizeNumber(this.factorialField.value);
        if (factValue) {
            factValue = Math.min(factValue, this.MAX_VALUE);
            this.factorialField.value = factValue;
            this.implementAction(this.doFactorial.bind(this), factValue);
        }
    }

    doFactorial(value) {
        this.commands = [];

        this.clearOldIDs();

        this.currentY = this.ACTIVATION_RECORT_START_Y;
        this.currentX = this.ACTIVATION_RECORT_START_X;

        const final = this.factorial(value);
        const resultID = this.nextIndex++;
        this.oldIDs.push(resultID);
        this.cmd("CreateLabel", resultID, `factorial(${String(value)}) = ${String(final)}`,
            this.CODE_START_X, this.CODE_START_Y + (this.code.length + 1) * this.CODE_LINE_HEIGHT, 0);
        // this.cmd("SetText", functionCallID, "factorial(" + String(value) + ") = " + String(final));
        return this.commands;
    }

    factorial(value) {
        const activationRec = this.createActivation("factorial     ", this.ACTIVATION_FIELDS, this.currentX, this.currentY);
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
        if (value > 1) {
            this.cmd("SetForegroundColor", this.codeID[4][1], this.CODE_HIGHLIGHT_COLOR);
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.codeID[4][1], this.CODE_STANDARD_COLOR);

            const firstValue = this.factorial(value - 1);

            this.cmd("SetForegroundColor", this.codeID[4][0], this.CODE_HIGHLIGHT_COLOR);
            this.cmd("SetForegroundColor", this.codeID[4][1], this.CODE_HIGHLIGHT_COLOR);
            this.cmd("SetText", activationRec.fieldIDs[1], firstValue);
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.codeID[4][0], this.CODE_STANDARD_COLOR);
            this.cmd("SetForegroundColor", this.codeID[4][1], this.CODE_STANDARD_COLOR);

            this.cmd("SetForegroundColor", this.codeID[5][0], this.CODE_HIGHLIGHT_COLOR);
            this.cmd("SetForegroundColor", this.codeID[5][1], this.CODE_HIGHLIGHT_COLOR);
            this.cmd("SetText", activationRec.fieldIDs[2], firstValue * value);
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.codeID[5][0], this.CODE_STANDARD_COLOR);
            this.cmd("SetForegroundColor", this.codeID[5][1], this.CODE_STANDARD_COLOR);

            this.cmd("SetForegroundColor", this.codeID[6][0], this.CODE_HIGHLIGHT_COLOR);
            this.cmd("SetForegroundColor", this.codeID[6][1], this.CODE_HIGHLIGHT_COLOR);

            this.cmd("Step");
            this.deleteActivation(activationRec);
            this.currentY = oldY;
            this.currentX = oldX;
            this.cmd("CreateLabel", this.nextIndex, `Return Value = ${String(firstValue * value)}`, oldX, oldY);
            this.cmd("SetForegroundColor", this.nextIndex, this.CODE_HIGHLIGHT_COLOR);
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.codeID[6][0], this.CODE_STANDARD_COLOR);
            this.cmd("SetForegroundColor", this.codeID[6][1], this.CODE_STANDARD_COLOR);
            this.cmd("Delete", this.nextIndex);

            //        this.cmd("SetForegroundColor", this.codeID[4][3], this.CODE_HIGHLIGHT_COLOR);
            //        this.cmd("Step");
            return firstValue * value;
        } else {
            this.cmd("SetForegroundColor", this.codeID[2][0], this.CODE_HIGHLIGHT_COLOR);
            this.cmd("Step");
            this.cmd("SetForegroundColor", this.codeID[2][0], this.CODE_STANDARD_COLOR);

            this.currentY = oldY;
            this.currentX = oldX;
            this.deleteActivation(activationRec);
            this.cmd("CreateLabel", this.nextIndex, "Return Value = 1", oldX, oldY);
            this.cmd("SetForegroundColor", this.nextIndex, this.CODE_HIGHLIGHT_COLOR);
            this.cmd("Step");
            this.cmd("Delete", this.nextIndex);

            return 1;
        }
    }
};
