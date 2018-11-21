navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
navigator.getUserMedia(
        {audio: true, video: false},
        function (stream) {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            var context = new AudioContext();
            var source = context.createMediaStreamSource(stream);
            var analyser = context.createAnalyser();
            var processor = context.createScriptProcessor(2048, 1, 1);
            var data;
            var chart;
            var dataSource;

            source.connect(analyser);
            source.connect(processor);
            analyser.connect(context.destination);
            processor.connect(context.destination);

            analyser.fftSize = 32;
            data = new Uint8Array(analyser.frequencyBinCount);

            var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");

            var timerId = setInterval(function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }, 500); //частота очистки канваса

            var z = 0;

            processor.onaudioprocess = function () {
                analyser.getByteFrequencyData(data);

                ctx.beginPath();

                for (var i = 0; i < 12; i++) {

                    switch (check_radio()) {
                        case false:
                            $('#res').css('opacity', 0);
                            ctx = circle_canvas(ctx, data[i]);
                            ctx.stroke();
                            break;
                        case 1:
                            $('#res').css('opacity', 0);
                            ctx = circle_canvas_drugs(ctx, data[i]);
                            ctx.stroke();
                            break;
                        case 2:
                            $('#res').css('opacity', 1);
                            rang_img(data);
                            break;
                        case 3:
                            $('#res').css('opacity', 0);
                            quadraticCurve_canvas(ctx, data[i], i);
                            //ctx.stroke();
                            break;
                        default:
                            $('#res').css('opacity', 0);
                            ctx = quadraticCurve_canvas(ctx, data[i]);
                    }
                }
            };
        },
        function (error) {
            console.error('GloAudio error with open stream');
        },
        );


/**
 * Отрисовка визуализации с кругами.
 *
 * @param {canvas} ctx - контекст канваса.
 * @param {number} el - значение для отрисовки.
 */

function circle_canvas(ctx, el) {
    if (el > 180) {
        ctx.strokeStyle = "red";
    } else if (el > 80) {
        ctx.strokeStyle = "blue";
    } else {
        ctx.strokeStyle = "green";
    }
    ctx.beginPath();
    ctx.arc(500, 500, el, 0, 2 * Math.PI);
    return ctx;
}
function circle_canvas_drugs(ctx, el) {
    if (el > 10) {
        ctx.strokeStyle = "red";
    } else if (el > 5) {
        ctx.strokeStyle = "blue";
    } else {
        ctx.strokeStyle = "green";
    }
    ctx.moveTo(500, 500);
    ctx.arc(500, 500, el, 0, 2 * Math.PI);
    return ctx;
}


/**
 * Отрисовка визуализации с "волнами".
 *
 * @param {canvas} ctx - контекст канваса.
 * @param {number} el - значение для отрисовки.
* @param {number} i - шаг.
 */
function quadraticCurve_canvas(ctx, el, i) {
    if (el > 120) {
        ctx.strokeStyle = "red";
    } else if (el > 80) {
        ctx.strokeStyle = "blue";
    } else {
        ctx.strokeStyle = "green";
    }
    ctx.beginPath();
    ctx.moveTo(i * 100, 400);
    ctx.quadraticCurveTo(i * 100 + 50, 400 + el * 2, i * 100 + 100, 400);
    ctx.stroke();
    ctx.moveTo(i * 100, 400);
    ctx.quadraticCurveTo(i * 100 + 50, 400 - el * 2, i * 100 + 100, 400);
    ctx.stroke();
}

function check_radio() {
    var rad = document.getElementsByName('forms');
    var res = '';
    for (var i = 0; i < rad.length; i++) {
        if (rad[i].checked) {
            if (i === 0) {
                res = false;
            } else {
                res = i;
            }
        }
    }
    return res;
}


function rang_img(data) {
    var c = '';

    if (data[0] > 250) {
        c = "red";
    } else if (data[0] > 180) {
        c = "blue";
    } else {
        c = "green";
    }
    var img = '<svg width="100%" height="100vh"viewBox="0 0 2000 2000"version="1.1"baseProfile="full"xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"xmlns:ev="http://www.w3.org/2001/xml-events"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="even-odd"><polygon stroke="' + c + '" stroke-width="3" fill="' + c + '" points="';
    img += '-' + data[0] * 5 + ',-' + data[1] * 5 + ' ' + data[3] * 5 + ',-' + data[4] * 5 + ' ' + data[5] * 5 + ',' + data[6] * 5 + ' ' + data[7] * 5 + ',-' + data[8] * 5 + ' -' + data[9] * 5 + ',-' + data[10] * 5 + ' -' + data[11] * 5 + ',-' + data[12] * 5;
    img += '"></polygon>';
    $('#res').html(img);
}
