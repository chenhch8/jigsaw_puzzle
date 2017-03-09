/**
 * Created by flyman on 16-8-15.
 */
$(function () {
    var LEVEL = [3, 4, 5];
    var imgsURL = [0, 1, 2, 3, 4, 5, 6];
    var LENGTH = 3;
    var positions = new Array();
    var GPS = new Array();
    var imgURL = "images/picture_0.jpg";
    var NUM = 500;

    changeMap(3, imgURL, false);

    // add button listener
    for (var i = 0; i < LEVEL.length; i++) {
        (function (j) {
            $("#btn_" + j).on("click", function () {
                LENGTH = LEVEL[j];
                changeMap(LENGTH, imgURL, false);
            });
        })(i);
    }

    $("#btn_3").on("click", changePicture);

    $("#btn_4").on("click", start);

    $("#btn_5").on("click", getSolution);

    // add background size listener
    $("#area").on("resize", function () {
        changeMap(LENGTH, imgURL, true);
    });

    function changeMap(length, url, isResize) {
        var left, top;
        var map = $("#map");
        var map_length = parseInt(map.css("width")) / length;

        // clean all elements in #map
        map.empty();

        for (var i = 0; i < length * length; i++) {
            if (isResize) {
                left = GPS[positions[i]][1];
                top = GPS[positions[i]][0];
            } else {
                positions[i] = i;
                left = i % length * map_length;
                top = parseInt(i / length) * map_length;
                GPS[i] = [top, left];
            }

            // var left = j % length * map_length;
            // var top = parseInt(j / length) * map_length;\

            if (i < length * length - 1) {
                // create map div
                var div = $(document.createElement("div"));

                div.addClass("LEVEL_" + length + " COMMEND");

                div.attr("value", i);
                div.css({"top":top + "px","left":left + "px"});

                // create image in map div
                var backImg = $("#background");
                var width = backImg.css("width");
                var height = backImg.css("height");

                // var imgTop = map[0].offsetTop + top;
                // var imgLeft = map[0].offsetLeft + left;
                var imgTop = map[0].offsetTop + parseInt(i / length) * map_length;
                var imgLeft = map[0].offsetLeft + i % length * map_length;

                var img = $(document.createElement("img"));
                img.attr("src", url);
                img.css({"width":width, "height":height, "position":"absolute", "top":-imgTop, "left":-imgLeft});

                div.append(img);

                map.append(div);
            }

            //positions[i] = i;
            //GPS[i] = [top, left];
        }
        $(".COMMEND").on("click", changePosition);
    }

    function changePosition(event) {
        var target = $(event.target.parentNode);
        if (!canMove(target.attr("value"), positions)) {
            return;
        }
        var newPos = swap(target.attr("value"), LENGTH * LENGTH - 1);
        target.css({"top": newPos[0], "left":newPos[1]});

        if (isSuccess(positions)) {
            alert("You win!");
        }
    }

    function changePicture() {
        var index;
        var path;
        do {
            index = parseInt(Math.random() * imgsURL.length);
            path = "images/picture_" + imgsURL[index] + ".jpg";
        } while (imgsURL[index] == imgURL)
        imgURL = path;
        changeMap(LENGTH, imgURL, false);
        $("#background").attr("src", imgURL);
    }

    function swap(a, b) {
        var c = positions[a];
        positions[a] = positions[b];
        positions[b] = c;
        return GPS[positions[a]];
    }

    function canMove(index, pos) {
        var a = pos[index];
        var b = pos[LENGTH * LENGTH - 1];
        return 1 == Math.abs(a % LENGTH - b % LENGTH) + Math.abs(parseInt(a / LENGTH) - parseInt(b / LENGTH));
    }

    function start() {
        var pos;
        for (var i = 0; i < NUM; i++) {
            do {
                pos = parseInt(Math.random() * (LENGTH * LENGTH - 1));
            } while (!canMove(pos, positions));
            swap(pos, LENGTH * LENGTH - 1);
        }
        for (var i = 0; i < LENGTH * LENGTH - 1; i++) {
            var index = positions[i];
            $(".COMMEND").eq(i).css({"top":GPS[index][0], "left":GPS[index][1]});
        }
    }

    /*
    *  ~~~~~~~~~~~~~~No finishing~~~~~~~~~~~~~
    */

    function getSolution() {
        var temp = positions.slice();
        var records = new Array();
        var flag = new Array(); // 标志哪些位置已走过, false未走，true已走
        var directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // 广搜可走的四个方向
        var index;

        for (var i = 0; i < LENGTH * LENGTH; i++) {
            flag[i] = false;
        }

        records.push(temp[LENGTH * LENGTH - 1]);

        while (records.length != 0) {
            index = records.shift();
            flag[index] = true;

            // swap
            var WHO = findWhoAccordingPosition(index);
            var c = temp[LENGTH * LENGTH - 1];
            temp[LENGTH * LENGTH - 1] = temp[WHO];
            temp[WHO] = c;

            if (isSuccess(temp)) {
                alert("OK");
                break;
            }

            var validPositions = getValidPositions(temp, directions);
            for (var i = 0; i < validPositions.length; i++) {
                var who = findWhoAccordingPosition(temp, validPositions[i])
                if (!flag[who]) {
                    records.push(validPositions[i]);
                }
            }
        }
    }
    
    function getValidPositions(temp, directions) {
        var x = parseInt(temp[LENGTH * LENGTH - 1] / LENGTH);
        var y = temp[LENGTH * LENGTH - 1] % LENGTH;
        var sets = new Array();
        for (var i = 0; i < directions.length; i++) {
            var a = x + directions[i][0];
            var b = y + directions[i][1];
            if (a < LENGTH && a >= 0 && b < LENGTH && b >= 0) {
                sets.push(a * LENGTH + b);
            }
        }
        return sets;
    }

    function findWhoAccordingPosition(temp, pos) {
        for (var i = 0; i < temp.length; i++) {
            if (temp[i] == pos)
                return i;
        }
    }

    function isSuccess(pos) {
        if (pos.length == 0) {
            return false;
        }
        for (var i = 0; i < LENGTH * LENGTH; i++) {
            if (pos[i] != i) {
                return false;
            }
        }
        return true;
    }
});