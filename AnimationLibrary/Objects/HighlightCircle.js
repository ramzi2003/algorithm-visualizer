

AnimatedObject.HighlightCircle = class HighlightCircle extends AnimatedObject {
    radius;
    thickness = 4;

    constructor(objectID, color, radius = 20) {
        super(null, color);
        this.objectID = objectID;
        this.radius = radius;
    }

    getWidth() {
        return this.radius * 2;
    }

    setWidth(newWidth) {
        this.radius = newWidth / 2;
    }

    draw(ctx) {
        if (!this.addedToScene) return;
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = this.foregroundColor;
        ctx.lineWidth = this.thickness;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
    }

    createUndoDelete() {
        return new UndoBlock.DeleteHighlightCircle(
            this.objectID, this.x, this.y, this.foregroundColor,
            this.radius, this.layer, this.alpha,
        );
    }
};


UndoBlock.DeleteHighlightCircle = class UndoDeleteHighlightCircle extends UndoBlock {
    constructor(objectID, x, y, foregroundColor, radius, layer, alpha) {
        super();
        this.objectID = objectID;
        this.x = x;
        this.y = y;
        this.foregroundColor = foregroundColor;
        this.radius = radius;
        this.layer = layer;
        this.alpha = alpha;
    }

    undoInitialStep(world) {
        world.addHighlightCircleObject(this.objectID, this.foregroundColor, this.radius);
        world.setLayer(this.objectID, this.layer);
        world.setNodePosition(this.objectID, this.x, this.y);
        world.setAlpha(this.objectID, this.alpha);
    }
};
