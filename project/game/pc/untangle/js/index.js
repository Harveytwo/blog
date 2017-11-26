var untangleGame = {
  circles: [],
  thinLineThickness: 1,
  boldLineThickness: 5,
  lines: [],
};
$(function() {


  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  
  
  // 画圆
  function drawCircle(ctx, x, y, radius) {
    ctx.fillStyle = 'rgba(200, 200, 100, .9)';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }
  // 记录圆
  function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  // 画线
  function drawLine(ctx, x1, y1, x2, y2, thickness) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = thickness;
    ctx.strokeStyle = '#cfc';
    ctx.stroke();
  }
  // 记录线
  function Line(startPoint, endPoint, thickness) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.thickness = thickness;
  }

  // 清除 canvas
  function clear(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // 为每个圆分配连线函数
  function connectCircles() {
    // 将每个圆用线相互连接
    untangleGame.lines.length = 0;
    for(var i=0; i<untangleGame.circles.length; i++) {
      var startPoint = untangleGame.circles[i];
      for(var j=0; j<i; j++) {
        var endPoint = untangleGame.circles[j];
        // drawLine(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, untangleGame.thinLineThickness);
        untangleGame.lines.push(new Line(startPoint, endPoint, untangleGame.thinLineThickness));
      }
    }
  }

  // 检测线的交点
  function isIntersect(line1, line2) {
    // 转换 line1 成一般式：Ax + By = C
    // console.log(line1)
    var a1 = line1.endPoint.y - line1.startPoint.y;
    var b1= line1.startPoint.x - line1.endPoint.x;
    var c1 = a1 * line1.startPoint.x + b1 * line1.startPoint.y;

    // 转换 line2 成一般式：Ax + By = C
    var a2 = line2.endPoint.y - line2.startPoint.y;
    var b2= line2.startPoint.x - line2.endPoint.x;
    var c2 = a2 * line2.startPoint.x + b2 * line2.startPoint.y;

    // 计算交点
    var d = a1 * b2 - a2 * b1;
    // 当 d 等于 0 时，两直线平行
    if(d == 0) {
      return false;
    }

    var x = (b2 * c1 - b1 * c2) / d;
    var y = (a1 * c2 - a2 * c1) / d;
    // 检测交点是否在两条直线上
    if((isInBetween(line1.startPoint.x, x, line1.endPoint.x) || isInBetween(line1.startPoint.y, y, line1.endPoint.y)) && (isInBetween(line2.startPoint.x, x, line2.endPoint.x) || isInBetween(line2.startPoint.y, y, line2.endPoint.y))) {
      return true;
    }

    return false;

  }

  // 如果 b 在 a 与 c 之间返回 true
  // 当 a == b 或 b == c 时排除结果，返回 false
  function isInBetween(a, b, c) {
    // 如果 b 几乎等于 a 或 c， 返回 false
    // 为了避免在浮点运算时两值几乎相等，但存在相差 0.00000...0001 的情况出现，
    // 使用下面方式进行避免
    if (Math.abs(a-b) < 0.000001 || Math.abs(b-c) < 0.000001) {
      return false;
    }
    // 如果 b 在 a 与 c 之间返回 true
    return (a < b && b < c) || (c < b && b < a);
  }

  // 检测相交线并加粗
  function updateLineIntersection() {
    for(var i=0; i<untangleGame.lines.length; i++) {
      var line1 = untangleGame.lines[i];
      line1.thickness = untangleGame.thinLineThickness;
      for(var j=0; j<i; j++) {
        // console.log(line1)
        var line2 = untangleGame.lines[j];
        // 如果检测到两条线相交，将加粗
        if(isIntersect(line1, line2)) {
          line1.thickness = untangleGame.boldLineThickness;
          line2.thickness = untangleGame.boldLineThickness;
        }
      }
    }
  }


  var circleRadius = 10;
  var width = canvas.width;
  var height = canvas.height;
  // 随机画 5 个圆
  var circleCount = 4;
  for(var i=0; i<circleCount; i++ ) {
    var x = width * Math.random();
    var y = height * Math.random();
    drawCircle(ctx, x, y, circleRadius);
    untangleGame.circles.push(new Circle(x, y, circleRadius));
  }

  // 连线
  connectCircles();
  updateLineIntersection();

  // 给 canvas 添加事件监听器
  // 检测按下鼠标的位置在任意一个圆上
  // 并设置那个圆为拖拽目标
  $('#game').on('mousedown', function(e){
    // console.log(1)
    var canvasPosition = $(this).offset();
    var mouseX = (e.pageX - canvasPosition.left) || 0;
    var mouseY = (e.pageY - canvasPosition.top) || 0;

    for(var i=0; i<untangleGame.circles.length; i++) {
      var circleX = untangleGame.circles[i].x;
      var circleY = untangleGame.circles[i].y;
      var radius = untangleGame.circles[i].radius;
      if(Math.pow(mouseX - circleX, 2) + Math.pow(mouseY - mouseY, 2) < Math.pow(radius, 2)) {
        untangleGame.targetCircle = i;
        break;
      }
    }
  })

  // 当鼠标移动时，移动拖拽目标小球
  $('#game').on('mousemove', function(e) {
    // console.log(2)
    if(untangleGame.targetCircle != undefined) {
      var canvasPosition = $(this).offset();
      var mouseX = (e.pageX - canvasPosition.left) || 0;
      var mouseY = (e.pageY - canvasPosition.top) || 0;
      var radius = untangleGame.circles[untangleGame.targetCircle].radius;
      untangleGame.circles[untangleGame.targetCircle] = new Circle(mouseX, mouseY, radius);
      connectCircles();
      updateLineIntersection();
    }
  })
  // 当放开鼠标时，清除拖拽目标小球的数据
  $('#game').on('mouseup', function() {
    untangleGame.targetCircle = undefined;
  })

  // 设置游戏主循环的循环间隔
  setInterval(function() {
    gameloop(ctx);
  }, 30);

  function gameloop(ctx) {

    // 重绘前清空 canvas
    clear(ctx);

    // 绘制所有保存的线
    for(var i=0; i<untangleGame.lines.length; i++) {
      var line = untangleGame.lines[i];
      var startPoint = line.startPoint;
      var endPoint = line.endPoint;
      var thickness = line.thickness;
      drawLine(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, thickness);
    }

    // 绘制所有保存的圆
    for(var i=0; i<untangleGame.circles.length; i++) {
      var circle = untangleGame.circles[i];
      drawCircle(ctx, circle.x, circle.y, circle.radius);
    }

  }
  
})