var size = 4;
var game = new Game(size);
$(function() {    
    var container = document.getElementById("Game-container");
    var offset = 30;
    var canvas = document.getElementById("Game");
    canvas.width = container.clientWidth - offset;
    canvas.height = canvas.width;
    var ctx = canvas.getContext("2d");
    var ratio = 57.5 / 10;
    var padWidth = 0;
    var gridWidth = 0;
    var backGroundColors = ["#cdc1b4", "#eee4da", "#ede0c8", "#f2b179", "#f59563", "#f67c5f", "#f65e3b", "#edcf72", "#edcc61", "#edc850", "#edc53f", "#edc22e"];
    var foreGroundColors = ["#cdc1b4", "#776e65", "#776e65", "#f9f6f2", "#f9f6f2", "#f9f6f2", "#f9f6f2", "#f9f6f2", "#f9f6f2", "#f9f6f2", "#f9f6f2", "#f9f6f2"];
    function calculate() {
        padWidth = canvas.width / (size + 1 + ratio * size);
        gridWidth = padWidth * ratio;
    }
    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    function render() {
        calculate();
        clear();
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var offsetX = (i + 1) * padWidth + i * gridWidth;
                var offsetY = (j + 1) * padWidth + j * gridWidth;
                var index = 0;
                if (game.data[j][i] > 0) index = Math.round(Math.log2(game.data[j][i]));
                ctx.fillStyle = backGroundColors[index];
                ctx.fillRect(offsetX, offsetY, gridWidth, gridWidth);
                if (game.data[j][i] > 0) {
                    ctx.fillStyle = foreGroundColors[index];
                    if (window.innerWidth >= 520) {
                        if (index >= 10) {
                            ctx.font = "bold 35px sans-serif";
                        } else {
                            ctx.font = "bold 48px sans-serif";
                        }
                        
                    } else {
                        if (index >= 10) {
                            ctx.font = "bold 20px sans-serif";
                        } else {
                            ctx.font = "bold 28px sans-serif";
                        }
                    }
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(game.data[j][i], offsetX + gridWidth / 2, offsetY + gridWidth / 2);
                }
            }
        }
        $("#score").text(game.score());
        requestAnimationFrame(render);
    }
    render();
    $(window).bind("resize", function(e) {
        canvas.width = container.clientWidth - offset;
        canvas.height = canvas.width;
        render();
    });
    $(window).bind("keydown", function(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            game.Move(MOVEMENT.Right);
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            game.Move(MOVEMENT.Left);
        } else if (e.key == "Up" || e.key == "ArrowUp") {
            game.Move(MOVEMENT.Up);
        } else if (e.key == "Down" || e.key == "ArrowDown") {
            game.Move(MOVEMENT.Down);
        }
        render();
    });
    window.addEventListener('swr', function() {
        game.Move(MOVEMENT.Right);
    }, false);
    window.addEventListener('swl', function() {
        game.Move(MOVEMENT.Left);
    }, false);
    window.addEventListener('swu', function() {
        game.Move(MOVEMENT.Up);
    }, false);
    window.addEventListener('swd', function() {
        game.Move(MOVEMENT.Down);
    }, false);
    $("#start").click(function(e) {
        var times = 1;
        for (let i = 0; !game.IsGameOver() && i < times; i++) {
            let move = game.MonteCarioMove();
            game.Move(move);
            // wait(100);
            render();
        }
    });
    $("#randomStart").click(function(e) {
        var times = 1;
        for (let i = 0; !game.IsGameOver() && i < times; i++) {
            game.Move(randomElement([MOVEMENT.Up, MOVEMENT.Down, MOVEMENT.Left, MOVEMENT.Right]));
            // wait(100);
            render();
        }
    });
});