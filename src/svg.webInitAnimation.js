/**
 * @Author:      ly
 * @Email:       lyhubei123@163.com
 * @DateTime:    2017-04-06 16:26:43
 * @Description: 基于svg.js实现网页初始化线条动画效果
 */
jQuery && SVG && (function($) {
    $(function() {
        var screenHeight = window.screen.height;
        var screenWidth = window.screen.width;
        //创建绘制面板
        var svgContent = $('<div id="web_init_svg" width="' + screenWidth + '" height="' + screenHeight + '" style="position:absolute;top:0;left:0;z-index:9999999999999999;background-color: white;"></div>');
        $("body").prepend(svgContent);
        var draw = SVG("web_init_svg").size(screenWidth, screenHeight);

        //绘制参数设定
        var bgcolor = $("body").css("background-color");
        var stroke_opt = { color: '#ffffff', width: 1.5, linecap: 'round', linejoin: 'round' };

        //保存计时器，用于监听是否完成绘制
        var interArray = [];
        var beginDraw = false;

        //开始执行
        function doInit() {
            var doms = $(".init_border,.init_chartline,.init_pie");
            doms.each(function(index, item) {
                item = $(item);
                var height = item.height();
                var width = item.width();
                var position = item.offset();
                var left = position.left;
                var top = position.top;
                if (item.hasClass("init_border")) {
                    var rect = draw.rect(width, height).radius(5).move(left, top).fill(bgcolor);
                    var bd_totalLength = rect.node.getTotalLength();
                    rect.stroke(stroke_opt).stroke({ dasharray: [1, bd_totalLength] });
                    drawLine(rect, bd_totalLength);
                }
                if (item.hasClass("init_chartline")) {
                    //表示4个点所在位置区域中的百分比
                    var pointsPst = [
                        [0.1, 0.75],
                        [0.33, 0.38],
                        [0.64, 0.59],
                        [0.87, 0.15]
                    ];
                    for (var i = 0; i < pointsPst.length; i++) {
                        pointsPst[i][0] = left + width * pointsPst[i][0];
                        pointsPst[i][1] = top + height * pointsPst[i][1];
                    }
                    var polyline = draw.polyline(pointsPst);
                    var pl_totalLength = polyline.node.getTotalLength();
                    polyline.fill('none');
                    polyline.stroke(stroke_opt).stroke({ dasharray: [1, pl_totalLength] });
                    drawLine(polyline, pl_totalLength);
                }
                if (item.hasClass("init_pie")) {
                    var contentDis = width >= height ? height : width;
                    var cx = left + width / 2,
                        cy = top + height / 2;
                    var r = contentDis * 0.9 / 2;
                    var rpath = ['M', cx, cy, "V" + (cy - r), "A", r, r, 0, 1, 0, cx + Math.sin(Math.PI / 180 * 60) * r, cy - Math.cos(Math.PI / 180 * 60) * r, "Z"];

                    var pie = draw.path(rpath.join(' ')).fill(bgcolor);
                    var pie_totalLength = pie.node.getTotalLength();
                    pie.stroke(stroke_opt).stroke({ dasharray: [1, pie_totalLength] });
                    drawLine(pie, pie_totalLength);
                }
            });
        }

        //绘制线条
        function drawLine(pathObj, totalLength) {
            beginDraw = true;
            var rate = 60 / 30000;
            var length = 0;
            var movedis = totalLength * rate;
            var inter = setInterval(function() {
                length += movedis;
                pathObj.stroke({
                    dasharray: [length, totalLength]
                });
                if (length >= totalLength) {
                    clearInterval(inter);
                    var index = interArray.indexOf(inter);
                    interArray.splice(index, 1);
                }
            }, 1);
            interArray.push(inter);
        }

        if ($("body").hasClass("bg-fill")) {
            var circle = draw.circle(0).fill(bgcolor).move(0, 200).animate({ ease: '<', delay: '0s' }).attr({
                r: screenWidth * 1.5
            }).after(doInit);
        } else {
            doInit();
        }

        //监听完成绘制
        var doneInter = setInterval(function() {
            if (beginDraw && interArray.length === 0) {
                clearInterval(doneInter);
                svgContent.remove();
            }
        }, 1);
    });
})(jQuery);
