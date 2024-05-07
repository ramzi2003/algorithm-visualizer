


Algorithm.Recursion = class Recursion extends Algorithm {
    CODE_START_X = 10;
    CODE_START_Y = 10;
    CODE_LINE_HEIGHT = 14;

    RECURSIVE_START_X = 20;
    RECURSIVE_START_Y = 120;
    RECURSIVE_DELTA_Y = 14;
    RECURSIVE_DELTA_X = 15;
    CODE_HIGHLIGHT_COLOR = "#FF0000";
    CODE_STANDARD_COLOR = "#000000";

    TABLE_INDEX_COLOR = "#0000FF";
    CODE_RECURSIVE_1_COLOR = "#339933";
    CODE_RECURSIVE_2_COLOR = "#0099FF";

    ACTIVATION_RECORD_WIDTH = 100;
    ACTIVATION_RECORD_HEIGHT = 20;

    ACTIVATION_RECORD_SPACING = 2 * this.ACTIVATION_RECORD_WIDTH + 10;

    SEPARATING_LINE_COLOR = "#0000FF";


    ActivationRecord = class ActivationRecord {
        constructor(fields) {
            this.fields = fields;
            this.values = new Array(this.fields.length);
            for (let i = 0; i < this.fields.length; i++) {
                this.values[i] = "";
            }
            this.fieldIDs = new Array(this.fields.length);
            this.labelIDs = new Array(this.fields.length);
        }
    };


    constructor(am) {
        super();
        if (am) this.init(am);
    }

    init(am) {
        super.init(am);
    }

    addCodeToCanvas(code) {
        this.codeID = this.addCodeToCanvasBase(code, this.CODE_START_X, this.CODE_START_Y, this.CODE_LINE_HEIGHT, this.CODE_STANDARD_COLOR);
        /*  this.codeID = new Array(this.code.length);
            var i, j;
            for (let i = 0; i < code.length; i++) {
                this.codeID[i] = new Array(code[i].length);
                for (let j = 0; j < code[i].length; j++) {
                    this.codeID[i][j] = this.nextIndex++;
                    this.cmd("CreateLabel", this.codeID[i][j], code[i][j], this.CODE_START_X, this.CODE_START_Y + i * this.CODE_LINE_HEIGHT, 0);
                    this.cmd("SetForegroundColor", this.codeID[i][j], this.CODE_STANDARD_COLOR);
                    if (j > 0) {
                        this.cmd("AlignRight", this.codeID[i][j], this.codeID[i][j-1]);
                    }
                }
            } */
    }

    clearOldIDs() {
        for (let i = 0; i < this.oldIDs.length; i++) {
            this.cmd("Delete", this.oldIDs[i]);
        }
        this.oldIDs = [];
        this.nextIndex = this.initialIndex;
    }

    reset() {
        this.oldIDs = [];
        this.nextIndex = this.initialIndex;
    }

    deleteActivation(activationRec) {
        for (let i = 0; i < activationRec.labelIDs.length; i++) {
            this.cmd("Delete", activationRec.labelIDs[i]);
            this.cmd("Delete", activationRec.fieldIDs[i]);
        }
        this.cmd("Delete", activationRec.separatingLineID);
        this.cmd("Delete", activationRec.nameID);
    }

    createActivation(functionName, argList, x, y, labelsOnLeft) {
        const activationRec = new this.ActivationRecord(argList);

        activationRec.nameID = this.nextIndex++;
        labelsOnLeft = (labelsOnLeft == null) ? true : labelsOnLeft;
        for (let i = 0; i < argList.length; i++) {
            const valueID = this.nextIndex++;
            activationRec.fieldIDs[i] = valueID;

            this.cmd("CreateRectangle", valueID,
                "",
                this.ACTIVATION_RECORD_WIDTH,
                this.ACTIVATION_RECORD_HEIGHT,
                x,
                y + i * this.ACTIVATION_RECORD_HEIGHT);

            const labelID = this.nextIndex++;
            activationRec.labelIDs[i] = labelID;
            this.cmd("CreateLabel", labelID, argList[i]);
            if (labelsOnLeft)
                this.cmd("AlignLeft", labelID, valueID);

            else
                this.cmd("AlignRight", labelID, valueID);
        }
        activationRec.separatingLineID = this.nextIndex++;
        this.cmd("CreateLabel", activationRec.nameID, `   ${functionName}   `);
        this.cmd("SetForegroundColor", activationRec.nameID, this.SEPARATING_LINE_COLOR);

        if (labelsOnLeft) {
            this.cmd("CreateRectangle", activationRec.separatingLineID,
                "",
                this.ACTIVATION_RECORD_WIDTH * 2,
                1,
                x - this.ACTIVATION_RECORD_WIDTH / 2,
                y - this.ACTIVATION_RECORD_HEIGHT / 2);
            this.cmd("AlignLeft", activationRec.nameID, activationRec.labelIDs[0]);
        } else {
            this.cmd("CreateRectangle", activationRec.separatingLineID,
                "",
                this.ACTIVATION_RECORD_WIDTH * 2,
                1,
                x + this.ACTIVATION_RECORD_WIDTH / 2,
                y - this.ACTIVATION_RECORD_HEIGHT / 2);
            this.cmd("AlignRight", activationRec.nameID, activationRec.labelIDs[0]);
        }
        this.cmd("SetForegroundColor", activationRec.separatingLineID, this.SEPARATING_LINE_COLOR);
        return activationRec;
    }
};
