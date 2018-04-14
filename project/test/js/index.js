;(function() {
  
  // tab 切换
  var $content = $('.right_content>div');
  $('.sidebar_menu li').on('click', function() {
    var _i = $(this).index();

    $content.addClass('hide').eq(_i).removeClass('hide');
  })
})(window)