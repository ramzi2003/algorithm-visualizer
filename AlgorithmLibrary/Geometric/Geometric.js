


Algorithm.Geometric = class Geometric extends Algorithm {
    Matrix = class Matrix {
        constructor(contents, x, y) {
            this.data = contents;
            this.x = x;
            this.y = y;
        }

        transpose() {
            const newData = new Array(this.data[0].length);
            for (let i = 0; i < this.data[0].length; i++) {
                newData[i] = new Array(this.data.length);
            }
            for (let i = 0; i < this.data.length; i++) {
                for (let j = 0; j < this.data[i].length; j++) {
                    newData[j][i] = this.data[i][j];
                }
            }
            this.data = newData;
        }
    };

    // Multiply two (data only!) matrices (not complete matrix object with graphics, just the data
    multiply(lhs, rhs) {
        const resultMat = new Array(lhs.length);
        for (let i = 0; i < lhs.length; i++) {
            resultMat[i] = new Array(rhs[0].length);
        }
        for (let i = 0; i < lhs.length; i++) {
            for (let j = 0; j < rhs[0].length; j++) {
                let value = 0;
                for (let k = 0; k < rhs.length; k++) {
                    value = value + lhs[i][k] * rhs[k][j];
                }
                resultMat[i][j] = value;
            }
        }
        return resultMat;
    }

    // Add two (data only!) matrices (not complete matrix object with graphics, just the data)
    add(lhs, rhs) {
        const resultMat = new Array(lhs.length);
        for (let i = 0; i < lhs.length; i++) {
            resultMat[i] = new Array(lhs[i].length);
            for (let j = 0; j < lhs[i].length; j++) {
                resultMat[i][j] = lhs[i][j] + rhs[i][j];
            }
        }
        return resultMat;
    }

    toRadians(degrees) {
        return (degrees * 2 * Math.PI) / 360.0;
    }
};
