

AnimatedObject.Connection = class Connection extends AnimatedObject {
    node1;
    node2;
    color;
    curve;
    directed;
    anchorPoint;

    addedToScene = true;
    arrowHeight = 8;
    arrowWidth = 4;
    highlightDiff = 0;

    constructor(n1, n2, color, curve = 0, directed = false, label = "", anchorPoint = 0, highlightColor = undefined, labelColor = undefined) {
        super(color, color, highlightColor, labelColor);
        this.node1 = n1;
        this.node2 = n2;
        this.color = color || this.foregroundColor;
        this.curve = curve;
        this.directed = directed;
        this.label = label;
        this.anchorPoint = anchorPoint;
    }

    getColor() {
        return this.color;
    }

    setColor(newColor) {
        this.color = newColor;
    }

    hasNode(n) {
        return this.node1 === n || this.node2 === n;
    }

    draw(ctx) {
        if (!this.addedToScene) return;

        ctx.globalAlpha = this.alpha;

        if (this.highlighted) {
            ctx.fillStyle = ctx.strokeStyle = this.highlightColor;
            ctx.lineWidth = this.highlightDiff;
        } else {
            ctx.fillStyle = ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
        }

        const fromPos = this.node1.getTailPointerAttachPos(this.node2.x, this.node2.y, this.anchorPoint);
        const toPos = this.node2.getHeadPointerAttachPos(this.node1.x, this.node1.y);

        const deltaX = toPos[0] - fromPos[0];
        const deltaY = toPos[1] - fromPos[1];
        const midX = deltaX / 2 + fromPos[0];
        const midY = deltaY / 2 + fromPos[1];
        const controlX = midX - deltaY * this.curve;
        const controlY = midY + deltaX * this.curve;

        ctx.beginPath();
        ctx.moveTo(fromPos[0], fromPos[1]);
        ctx.quadraticCurveTo(controlX, controlY, toPos[0], toPos[1]);
        ctx.stroke();

        if (this.label != null && this.label !== "") {
            // Position of the edge label:  First, we will place it right along the
            // middle of the curve (or the middle of the line, for curve == 0)
            let labelPosX = 0.25 * fromPos[0] + 0.5 * controlX + 0.25 * toPos[0];
            let labelPosY = 0.25 * fromPos[1] + 0.5 * controlY + 0.25 * toPos[1];

            // Next, we push the edge position label out just a little in the direction of
            // the curve, so that the label doesn't intersect the cuve (as long as the label
            // is only a few characters, that is)
            const midLen = Math.sqrt(deltaY * deltaY + deltaX * deltaX);
            if (midLen !== 0) {
                const sign = Math.sign(this.curve) || 1;
                labelPosX += (-deltaY * sign) / midLen * 10;
                labelPosY += (deltaX * sign) / midLen * 10;
            }

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `${this.textHeight}px sans-serif`;
            ctx.fillText(this.label, labelPosX, labelPosY);
        }

        if (this.directed) {
            let xVec = controlX - toPos[0];
            let yVec = controlY - toPos[1];
            const len = Math.sqrt(xVec * xVec + yVec * yVec);
            if (len > 0) {
                xVec = xVec / len;
                yVec = yVec / len;
                ctx.beginPath();
                ctx.moveTo(toPos[0], toPos[1]);
                ctx.lineTo(toPos[0] + xVec * this.arrowHeight - yVec * this.arrowWidth, toPos[1] + yVec * this.arrowHeight + xVec * this.arrowWidth);
                ctx.lineTo(toPos[0] + xVec * this.arrowHeight + yVec * this.arrowWidth, toPos[1] + yVec * this.arrowHeight - xVec * this.arrowWidth);
                ctx.lineTo(toPos[0], toPos[1]);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            }
        }
    }

    createUndoDisconnect() {
        return new UndoBlock.Connection(this.node1.objectID, this.node2.objectID, true, this.color, this.directed, this.curve, this.label, this.anchorPoint);
    }
};


UndoBlock.Connection = class UndoConnection extends UndoBlock {
    constructor(node1, node2, connect, color, directed, curve, label, anchorPoint) {
        super();
        this.fromID = node1;
        this.toID = node2;
        this.connect = connect;
        this.color = color;
        this.directed = directed;
        this.curve = curve;
        this.label = label;
        this.anchorPoint = anchorPoint;
    }

    undoInitialStep(world) {
        if (this.connect) {
            world.connectEdge(this.fromID, this.toID, this.color, this.curve, this.directed, this.label, this.anchorPoint);
        } else {
            world.disconnectEdge(this.fromID, this.toID);
        }
    }
};
