$(function() {
  var matchingGame = {};
  matchingGame.deck = [
    'cardAK', 'cardAK',
    'cardAQ', 'cardAQ',
    'cardAJ', 'cardAJ',
    'cardBK', 'cardBK',
    'cardBQ', 'cardBQ',
    'cardBJ', 'cardBJ',
  ]
  function shuffle() {
    return 0.5 - Math.random();
  }
  matchingGame.deck.sort(shuffle);

  // 复制 12 张纸牌
  for(var i=0; i<11; i++) {
    $('.card:first-child').clone().appendTo($('#cards'));
  }
  // 初始化每张牌的位置
  $('#cards').children().each(function(index) {
    // 纸牌 4x3 的形式对齐
    $(this).css({
      left: ($(this).width() + 20) * (index % 4),
      top: ($(this).height() + 20) * Math.floor(index / 4)
    })

    // 从已洗过的纸牌中获取图案
    var pattern = matchingGame.deck.pop();
    // 应用纸牌的背面图案，并让其可见
    $(this).find('.back').addClass(pattern);
    // 把图案数据嵌入DOM元素中
    $(this).attr('data-pattern', pattern);
    // 监听每张纸牌的点击事件
    $(this).on('click', selectCard);

    function selectCard() {
      // console.log($(this).data('pattern'))
      // 如果已经翻开两张纸牌，将进行判断
      if($('.card_flipped').size() > 1) {
        return;
      }
      $(this).addClass('card_flipped');
      // 0.7 秒后，检测两张已翻开的牌的图案
      if($('.card_flipped').size() == 2) {
        setTimeout(checkPattern, 700);
      }
    }

    function checkPattern() {
      if(isMatchPattern()) {
        $('.card_flipped').removeClass('card_flipped').addClass('card_removed');
        $('.card_removed').on('transitionEnd', removeTookCards);
      } else {
        $('.card_flipped').removeClass('card_flipped');
      }
    }

    function isMatchPattern() {
      var cards = $('.card_flipped');
      var pattern = $(cards[0]).data('pattern');
      var anotherPattern = $(cards[1]).data('pattern');
      // console.log(pattern,anotherPattern)
      return pattern == anotherPattern;
    }
    
    function removeTookCards() {
      $('.card_removed').remove();
    }
  })

})