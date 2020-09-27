const MOVEMENT = {
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3
}
function constructArray(dimensions, fillIn) {
    var ret = [];
    var constructor = function (array, index) {
        if (index < dimensions.length - 1) {
            for (var i = 0; i < dimensions[index]; i++) {
                array.push([]);
                array[i] = constructor(array[i], index + 1);
            }
        }
        else if (index === dimensions.length - 1)
            for (var i = 0; i < dimensions[index]; i++)
                array.push(fillIn);
        return array;
    };
    return constructor(ret, 0);
}
function randomElement(arr) {
    return arr[Math.min(Math.floor(Math.random() * arr.length), arr.length - 1)];
}
function copyTwoDimensionArr(arr) {
    var ret = [];
    for (var i = 0; i < arr.length; i++) {
        ret[i] = [];
        for (var j = 0; j < arr[i].length; j++) {
            ret[i][j] = arr[i][j];
        }
    }
    return ret;
}
function PrintTwoDimensionArr(arr) {
    for (var i = 0; i < arr.length; i++) {
        var row = i + ": ";
        for (var j = 0; j < arr[i].length; j++) {
            row += arr[i][j] + " ";
        }
        console.log(row);
    }
}
var Game = /** @class */ (function () {
    /**
     * @param size - Integer and Bigger than zero
     */
    function Game(size, data) {
        this.size = size;
        if (arguments.length == 1) {
            this.data = constructArray([size, size], 0);
            this.generateBlock(2);
        }
        else {
            this.setData(data);
        }
    }
    Game.getRandomBlock = function () {
        var candidates = [];
        for (var i = 0; i < Game.chancesOfBlock.length; ++i) {
            var num = Math.pow(Game.base, i);
            for (var j = 0; j < Game.chancesOfBlock[i]; ++j) {
                candidates.push(Math.pow(Game.base, i));
            }
        }
        return randomElement(candidates);
    };
    Game.getRandomNum = function () {
        var candidates = [];
        for (var i = 0; i < Game.chanceOfNumOfBlock.length; ++i) {
            for (var j = 0; j < Game.chanceOfNumOfBlock[i]; ++j) {
                candidates.push(i);
            }
        }
        return randomElement(candidates);
    };
    /**
     * generateBlock generates blocks the number of which is smaller or equal to num.
     * @param num - Number and Bigger than zero
     * @returns true, if successfully adding at least one block | false, if no candidates
     */
    Game.prototype.generateBlock = function (num) {
        var candidates = [];
        for (var i = 1; i < this.size - 1; i++) {
            if (this.data[0][i] === 0)
                candidates.push([0, i]);
            if (this.data[this.size - 1][i] === 0)
                candidates.push([this.size - 1, i]);
            if (this.data[i][0] === 0)
                candidates.push([i, 0]);
            if (this.data[i][this.size - 1] === 0)
                candidates.push([i, this.size - 1]);
        }
        if (this.data[0][0] === 0) candidates.push([0, 0]);
        if (this.data[this.size - 1][0] === 0) candidates.push([this.size - 1, 0]);
        if (this.data[0][this.size - 1] === 0) candidates.push([0, this.size - 1]);
        if (this.data[this.size - 1][this.size - 1] === 0) candidates.push([this.size - 1, this.size - 1]);
        if (candidates.length === 0)
            return false;
        for (var i = 0; i < num && i < candidates.length; i++) {
            var pos = randomElement(candidates);
            this.data[pos[0]][pos[1]] = Game.getRandomBlock();
        }
    };
    Game.prototype.score = function () {
        var accum = 0;
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                accum += this.data[i][j];
            }
        }
        return accum;
    };
    Game.prototype.setData = function (data) {
        this.data = copyTwoDimensionArr(data);
    };
    Game.prototype.upDownOverTurn = function () {
        for (var col = 0; col < this.size; col++) {
            for (var row = 0; row < Math.floor(this.size / 2); row++) {
                var tmp = this.data[row][col];
                this.data[row][col] = this.data[this.size - 1 - row][col];
                this.data[this.size - 1 - row][col] = tmp;
            }
        }
    };
    Game.prototype.leftRightOverTurn = function () {
        for (var row = 0; row < this.size; row++) {
            for (var col = 0; col < Math.floor(this.size / 2); col++) {
                var tmp = this.data[row][col];
                this.data[row][col] = this.data[row][this.size - 1 - col];
                this.data[row][this.size - 1 - col] = tmp;
            }
        }
    };
    Game.prototype.upMovement = function () {
        for (var col = 0; col < this.size; col++) {
            var newIndex = 0, ptrIndex = 0, curIndex = 0;
            for (; ptrIndex < this.size; ptrIndex++) {
                if (this.data[ptrIndex][col] !== 0)
                    this.data[newIndex++][col] = this.data[ptrIndex][col];
            }
            curIndex = newIndex;
            newIndex = 0;
            ptrIndex = 0;
            for (; ptrIndex < curIndex; ptrIndex++) {
                if (ptrIndex == curIndex - 1 || this.data[ptrIndex][col] === Game.maximumNum || this.data[ptrIndex][col] !== this.data[ptrIndex + 1][col]) {
                    this.data[newIndex++][col] = this.data[ptrIndex][col];
                    continue;
                }
                this.data[newIndex++][col] = this.data[ptrIndex][col] + this.data[ptrIndex + 1][col];
                ptrIndex++;
            }
            ptrIndex = newIndex;
            for (; ptrIndex < this.size; ptrIndex++) {
                this.data[ptrIndex][col] = 0;
            }
        }
    };
    Game.prototype.leftMovement = function () {
        for (var row = 0; row < this.size; row++) {
            var newIndex = 0, ptrIndex = 0, curIndex = 0;
            for (; ptrIndex < this.size; ptrIndex++) {
                if (this.data[row][ptrIndex] !== 0)
                    this.data[row][newIndex++] = this.data[row][ptrIndex];
            }
            curIndex = newIndex;
            newIndex = 0;
            ptrIndex = 0;
            for (; ptrIndex < curIndex; ptrIndex++) {
                if (ptrIndex == curIndex - 1 || this.data[row][ptrIndex] === Game.maximumNum || this.data[row][ptrIndex] !== this.data[row][ptrIndex + 1]) {
                    this.data[row][newIndex++] = this.data[row][ptrIndex];
                    continue;
                }
                this.data[row][newIndex++] = this.data[row][ptrIndex] + this.data[row][ptrIndex + 1];
                ptrIndex++;
            }
            ptrIndex = newIndex;
            for (; ptrIndex < this.size; ptrIndex++) {
                this.data[row][ptrIndex] = 0;
            }
        }
    };
    Game.prototype.Move = function (move) {
        if (this.IsGameOver())
            return;
        switch (move) {
            case MOVEMENT.Up:
                this.upMovement();
                break;
            case MOVEMENT.Down:
                this.upDownOverTurn();
                this.upMovement();
                this.upDownOverTurn();
                break;
            case MOVEMENT.Left:
                this.leftMovement();
                break;
            case MOVEMENT.Right:
                this.leftRightOverTurn();
                this.leftMovement();
                this.leftRightOverTurn();
                break;
        }
        this.generateBlock(Game.getRandomNum());
    };
    Game.prototype.MonteCarioMove = function () {
        var movements = [MOVEMENT.Up, MOVEMENT.Down, MOVEMENT.Left, MOVEMENT.Right];
        var scores = [0, 0, 0, 0];
        for (var i = 0; i < movements.length; i++) {
            for (var j = 0; j < Game.monteCarioSimulations; j++) {
                var newGame = new Game(this.size, this.data);
                newGame.Move(movements[i]);
                for (let step = 0; !newGame.IsGameOver() && step < Game.monteCarioSimulationSteps; step++) {
                    newGame.Move(randomElement(movements));
                }
                scores[i] += newGame.score();
            }
            scores[i] /= Game.monteCarioSimulations;
        }
        var maximumIndex = 0;
        for (var i = 1; i < movements.length; i++) {
            if (scores[i] > scores[maximumIndex])
                maximumIndex = i;
        }
        return movements[maximumIndex];
    };
    Game.prototype.IsGameOver = function () {
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                if (this.data[i][j] !== 0)
                    return false;
            }
        }
        return true;
    };
    Game.base = 2;
    Game.maximumNum = Math.pow(Game.base, 11);
    Game.monteCarioSimulations = 50;
    Game.monteCarioSimulationSteps = 200;
    /* require to be positive integer number */
    Game.chancesOfBlock = [0, 7, 3]; // 2^0, 2^1, 2^2
    Game.chanceOfNumOfBlock = [0, 7, 3]; // 0, 1, 2
    return Game;
}());
