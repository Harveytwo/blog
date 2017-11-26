// 有个缺陷，当球位于球拍的后面时，球也会反弹，需解决

$(function () {
  var KEY = {
    UP: 38,
    DOWN: 40,
    W: 87,
    S: 83
  }
  var pinpong = {
    playgroundH: $('#playground').height() - $('.paddle').height(),
    ball: {
      speed: 3,
      x: 150,
      y: 100,
      directionX: 1,
      directionY: 1,
      width: parseInt($('#ball').width())
    },
    // player A 的比分
    scoreA: 0,
    // player B 的比分
    scoreB: 0,
  };
  // console.log(pinpong)
  pinpong.pressedKeys = [];

  // 每 30 毫秒调用一次 gameloop
  pinpong.timmer = setInterval(gameloop, 30);

  // 标记 pressedKeys 数组里某键的状态是按下还是放开
  $(document).keydown(function (e) {
    pinpong.pressedKeys[e.which] = true;
  })

  $(document).keyup(function (e) {
    pinpong.pressedKeys[e.which] = false;
  })

  function gameloop() {
    movePaddles();
    moveBall();
  }

  function gameover(opt) {
    var ball = opt.ball;
    $('#ball').css({
      left: 150 + 'px',
      top: 100 + 'px'
    })
    // A 玩家赢
    if(opt.player == 'A') {
      pinpong.ball.directionX = -1;
    } else {
      // B 玩家赢
      pinpong.ball.directionX = 1;
    }
    
    // clearInterval(pinpong.timmer);
    // return;
  }

  function movePaddles() {
    // 使用自定义定时器不断检测是否有按键被按下
    // 向上键
    if (pinpong.pressedKeys[KEY.UP]) {
      var top = parseInt($('#paddleB').css('top'));
      if (top <= 0) return;
      $('#paddleB').css('top', top - 5);
    }
    // 向下键
    if (pinpong.pressedKeys[KEY.DOWN]) {
      var top = parseInt($('#paddleB').css('top'));
      if (top >= pinpong.playgroundH) return;
      $('#paddleB').css('top', top + 5);
    }

    // W 键
    if (pinpong.pressedKeys[KEY.W]) {
      var top = parseInt($('#paddleA').css('top'));
      if (top <= 0) return;
      $('#paddleA').css('top', top - 5);
    }
    // S 键
    if (pinpong.pressedKeys[KEY.S]) {
      var top = parseInt($('#paddleA').css('top'));
      if (top >= pinpong.playgroundH) return;
      $('#paddleA').css('top', top + 5);
    }
  }

  function moveBall() {
    var ball = pinpong.ball;
    var playgroundHeight = parseInt($('#playground').height());
    var playgroundWidth = parseInt($('#playground').width());
    // console.log(playgroundHeight)
    // playground 边缘碰撞检测
    // 上边缘
    if (ball.y + ball.speed * ball.directionY < 0) {
      ball.directionY = 1;
    }
    // 下边缘
    if (ball.y + ball.speed * ball.directionY > playgroundHeight) {
      ball.directionY = -1;
    }

    // 左边缘
    if (ball.x + ball.speed * ball.directionX < 0) {
      // 玩家 A 丢分
      pinpong.scoreB++;
      $('#scoreB').text(pinpong.scoreB);
      // 重置 ball
      ball.x = 150;
      ball.y = 100;
      $('#ball').css({
        left: ball.x,
        top: ball.y
      })
      ball.directionX = 1;
    }
    // 右边缘
    if (ball.x + ball.speed * ball.directionX > playgroundWidth) {
      // 玩家 B 丢分
      pinpong.scoreA++;
      $('#scoreA').text(pinpong.scoreA)
      // 重置 ball
      ball.x = 250;
      ball.y = 100;
      $('#ball').css({
        left: ball.x,
        top: ball.y
      })
      ball.directionX = -1;
    }

    // 检测 paddle 碰撞
    //  左边 paddleA
    var paddleAX = parseInt($('#paddleA').css('left')) + 　parseInt($('#paddleA').width());
    var paddleAYTop = parseInt($('#paddleA').css('top'));
    var paddleAYBottom = parseInt($('#paddleA').css('top')) + parseInt($('#paddleA').height());
    if (ball.x + ball.speed * ball.directionX < paddleAX) {
      if (ball.y + ball.speed * ball.directionY >= paddleAYTop && ball.y + ball.speed * ball.directionY <= paddleAYBottom) {
        ball.directionX = 1;
      }
    }
    //  右边 paddleB
    var paddleBX = parseInt($('#paddleB').css('left')) - ball.width;
    var paddleBYTop = parseInt($('#paddleB').css('top'));
    var paddleBYBottom = parseInt($('#paddleB').css('top')) + parseInt($('#paddleB').height());
    if (ball.x + ball.speed * ball.directionX >= paddleBX) {
      if (ball.y + ball.speed * ball.directionY >= paddleBYTop && ball.y + ball.speed * ball.directionY <= paddleBYBottom) {
        ball.directionX = -1;
      }
    }


    // 根据速度和方向移动 ball
    ball.x += ball.speed * ball.directionX;
    ball.y += ball.speed * ball.directionY;
    $('#ball').css({
      left: ball.x,
      top: ball.y
    })

  }

})