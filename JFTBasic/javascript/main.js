$(function () {
    $(document).keydown(function (_0x224b44) {
      var _0x1dffcb = _0x224b44.keyCode;
      if (_0x1dffcb == 0x74) {
        return false;
      }
    });
  });
  var initializer = function () {
    this.dis_img = function () {
      $("img").attr("onmousedown", "return false");
      $("img").attr("onselectstart", "return false");
      $(document).on("contextmenu", function (_0x4b03c5) {
        return false;
      });
    };
    this.reset_input = function () {
      $('#shortanswer').val('');
    };
    this.he_resize = function () {
      hsize = $(window).height();
      $('#container,.exam_base,.intro_base,.outro_base,.result_base,.exam_base').css("height", hsize + 'px');
      $("#intro_area,#outro_area,#exam_area,#exam_intro").css("height", hsize - 0x83 + 'px');
      if (hsize >= 0x29b) {
        $(".exam_footer").css("top", hsize - 0x6a + 'px');
        $('#result_area').css("height", hsize - 0xaa + 'px');
        $("#startexam_button,.next_prev,.flag_button,#backtoexam_button").css("top", hsize - 0x26 + 'px');
        $('.preference_button,#introduction_button').css("top", hsize - 0x24 + 'px');
      } else {
        $(".exam_footer").css('top', "563px");
        $('#result_area').css("height", "496px");
        $("#startexam_button,.next_prev,.flag_button,#backtoexam_button").css('top', "631px");
        $('.preference_button,#introduction_button').css("top", "635px");
      }
    };
  };
  $(window).on('load', function () {
    var _0x56720a = new initializer();
    _0x56720a.dis_img();
    _0x56720a.reset_input();
    _0x56720a.he_resize();
  });
  $(window).resize(function () {
    var _0xe4428 = new initializer();
    _0xe4428.he_resize();
  });
  function setsumon_nb_check() {
    $setsumon = $("div.current").attr('id').slice(0x5);
    $setsumon_txt = $("#item_number").html();
    if ($setsumon == 0x1) {
      $("#item_number").html($setsumon_txt.replace(/[0-9]/, '1'));
    } else {
      if ($setsumon == 0x2) {
        $("#item_number").html($setsumon_txt.replace(/[0-9]/, '2'));
      } else {
        if ($setsumon == 0x3) {
          $('#item_number').html($setsumon_txt.replace(/[0-9]/, '3'));
        } else if ($setsumon == 0x4) {
          $("#item_number").html($setsumon_txt.replace(/[0-9]/, '4'));
        }
      }
    }
  }
  $(function () {
    $("#exam").on("click", 'div#finish_button', function () {
      calcClose();
      var _0x40068d = {
        'flag': 0x1,
        'on': 0x2,
        'off': 0x4
      };
      var _0x3ce908 = $("#item_button>a>img");
      var _0x1f9df1 = 0x0;
      Object.keys(_0x3ce908).forEach(function (_0x1b1c37) {
        Object.keys(_0x40068d).forEach(function (_0x2f165f) {
          var _0x4f7889 = new RegExp(_0x2f165f);
          if (_0x4f7889.test(_0x3ce908[_0x1b1c37].src)) {
            _0x1f9df1 |= _0x40068d[_0x2f165f];
          }
        });
      });
      if ((_0x1f9df1 & 5) === 5) {
        location.href = "#open01_flag_off";
      } else {
        if ((_0x1f9df1 & 0x1) === 0x1) {
          location.href = '#open01_flag';
        } else if ((_0x1f9df1 & 0x4) === 0x4) {
          location.href = "#open01_off";
        } else {
          location.href = "#open01";
        }
      }
    });
  });
  function nextprevbt(_0x2f5a7f) {
    var _0x5abcdc = $("#item_button a img");
    var _0x3f764b = $(".itembt").index($(".current_itembutton"));
    $All_item_button = $("#item_button a img");
    $All_item_button.removeClass('current_itembutton');
    if (_0x2f5a7f == 'next') {
      _0x3f764b = (_0x3f764b + 0x1) % _0x5abcdc.length;
    } else if (_0x2f5a7f == 'prev') {
      _0x3f764b = (_0x3f764b - 0x1) % _0x5abcdc.length;
    }
    $(_0x5abcdc).each(function (_0x2d6118, _0x29210d) {
      _0x29210d.src = "img/button_item_" + (_0x2d6118 + 0x1 < 0xa ? '0' : '') + (_0x2d6118 + 0x1) + (_0x29210d.className.match('sentakuzumi_button') ? "_on" : "_off") + (_0x2d6118 == _0x3f764b ? "_cl" : '') + (_0x29210d.className.match("flagged") ? "_flag" : '') + ".png";
      var _0x164a3c = "#item_button0" + (_0x2d6118 + 0x1);
      if (_0x2d6118 == _0x3f764b) {
        $(_0x164a3c).addClass("current_itembutton");
      }
    });
  }
  $(function () {
    $("body").on("click", ".next_prev a", function () {
      $current_exam_item = $('#exam_area div.current');
      $("[id^=exam0]").hide().removeClass("current").addClass("notcurrent");
      $("#next, #back").removeClass("point_none");
      $next_prev_name = $(this).attr('id');
      if ($next_prev_name == "next") {
        $current_exam_item = $current_exam_item.next();
        $current_exam_item.show().removeClass("notcurrent").addClass("current");
      } else if ($next_prev_name == 'back') {
        $current_exam_item = $current_exam_item.prev();
        $current_exam_item.show().removeClass('notcurrent').addClass("current");
      }
      calcClose();
      nextprevbt_img();
      setsumon_nb_check();
    });
  });
  function nextprevbt_img() {
    $current_exam_item = $('#exam_area div.current');
    $Back_button = $('#back_button_image');
    $Next_button = $("#next_button_image");
    $Back_button.attr("src", $Back_button.attr("src").replace("_off.", "_on."));
    $Next_button.attr('src', $Next_button.attr('src').replace("_off.", "_on."));
    if ($current_exam_item.is("div#exam01")) {
      $Back_button.attr("src", $Back_button.attr("src").replace("_on.", '_off.'));
      $("#back").addClass("point_none");
    } else if ($current_exam_item.is("div#exam04")) {
      $Next_button.attr('src', $Next_button.attr("src").replace("_on.", "_off."));
      $("#next").addClass("point_none");
    }
  }
  $(function () {
    $("body").on('click', "#proadmin_startButton", function () {
      $('.proadmin').hide();
      $("#confirmation_detail").show();
    });
  });
  $(function () {
    $("body").on("click", "#confirmation_detail_confirm_button", function () {
      calcClose();
      $('#confirmation_detail').hide();
      $("#intro").show();
    });
  });
  $(function () {
    $("body").on('click', "#startexam", function () {
      $("#open07").show();
      setTimeout(start_exam, 0x4b0);
    });
  });
  function start_exam() {
    $('#open07').hide();
    $("#intro").hide();
    $("#exam").show();
    $("#backtoexam_button").hide();
    count_start();
  }
  $(function () {
    $("body").on("click", '#preference', function () {
      calcClose();
    });
  });
  $(function () {
    $('body').on("click", "#finish_modal", function () {
      $("#intro").hide();
      $("#exam").hide();
      $("#outro").show();
    });
  });
  $(function () {
    $("body").on('click', "#timeexpire_modal", function () {
      $("#intro").hide();
      $('#exam').hide();
      $("#outro").show();
    });
  });
  $(function () {
    $("body").on('click', "#finish_button_outro", function () {
      $("#open07").show();
      setTimeout(end_exam, 0x4b0);
    });
  });
  function end_exam() {
    $("#open07").hide();
    $('#open08').show();
  }
  $(function () {
    $("body").on("click", "#introduction_button,#backtoexam_button", function () {
      $("div.current,#introduction_button,#item_button,#item_number,#progress,#finish_button,#backtoexam_button,div.flag_button,div.next_prev,#section_name,#section_name,#section_name_intro_hide,#exam_intro").toggle();
      calcClose();
    });
  });
  const eb_cd = ["_off_cl.", "_off.", "_on_cl.", "_on.", "_off_cl_flag.", "_off_flag.", "_on_cl_flag.", "_on_flag."];
  const nx_bt = $('#next_button_image');
  const bk_bt = $("#back_button_image");
  $(function () {
    $('body').on('click', "#item_button a", function () {
      $cib = $('.current_itembutton');
      $cib.attr("src", $cib.attr('src').replace("_cl", ''));
      $item_num = $(this).attr('id').slice(-0x2);
      $("[id^=exam0]").hide().removeClass("current").addClass("notcurrent");
      $cib.removeClass('current_itembutton');
      $("img", this).addClass("current_itembutton");
      $cib = $('.current_itembutton');
      $cib.attr("src", $cib.attr('src').replace(eb_cd[0x1], eb_cd[0x0]));
      $cib.attr("src", $cib.attr("src").replace(eb_cd[0x3], eb_cd[0x2]));
      $cib.attr("src", $cib.attr("src").replace(eb_cd[0x5], eb_cd[0x4]));
      $cib.attr("src", $cib.attr('src').replace(eb_cd[0x7], eb_cd[0x6]));
      $('#next, #back').removeClass("point_none");
      $('#back_button_image').attr("src", $('#back_button_image').attr("src").replace("_off.", "_on."));
      $("#next_button_image").attr("src", $("#next_button_image").attr('src').replace('_off.', "_on."));
      $("#exam" + $item_num).show().removeClass("notcurrent").addClass("current");
      nextprevbt_img();
      setsumon_nb_check();
      if ($("#exam03").hasClass("notcurrent")) {
        calcClose();
      }
    });
  });
  $(function () {
    $("body").on("click", '.flag_button a', function () {
      $cib = $('.current_itembutton');
      if ($cib.attr('src').match('_off_cl.png')) {
        $cib.attr("src", $cib.attr("src").replace(eb_cd[0x0], eb_cd[0x4]));
        $cib.addClass('flagged');
      } else {
        if ($cib.attr("src").match("_on_cl.png")) {
          $cib.attr("src", $cib.attr('src').replace(eb_cd[0x2], eb_cd[0x6]));
          $cib.addClass("flagged");
        } else {
          if ($cib.attr("src").match('_off_cl_flag.png')) {
            $cib.attr('src', $cib.attr('src').replace(eb_cd[0x4], eb_cd[0x0]));
            $cib.removeClass('flagged');
          } else {
            if ($cib.attr('src').match('_on_cl_flag.png')) {
              $cib.attr("src", $cib.attr('src').replace(eb_cd[0x6], eb_cd[0x2]));
              $cib.removeClass("flagged");
            } else {}
          }
        }
      }
    });
  });
  function it_bt_set(_0x29532f, _0x2a905f) {
    var _0x37c44c = _0x29532f;
    $cib = $(".current_itembutton");
    $current_exam = $(".current div");
    if ($(_0x37c44c).hasClass('item_selected') && _0x2a905f == "s01") {
      $(_0x37c44c).removeClass("item_selected");
    } else {
      if ($(_0x37c44c).not('item_selected') && _0x2a905f == "s01") {
        $current_exam.removeClass("item_selected");
        $(_0x37c44c).addClass("item_selected");
      } else {
        if ($(_0x37c44c).hasClass("item_selected") && _0x2a905f == "s02") {
          $(_0x37c44c).removeClass("item_selected");
          var _0x37c44c = $("#exam02 div");
        } else {
          if ($(_0x37c44c).not("item_selected") && _0x2a905f == "s02") {
            $(_0x37c44c).addClass("item_selected");
          } else {
            if ($(_0x37c44c).val() == '' && _0x2a905f == 's03') {
              $(_0x37c44c).removeClass('item_selected');
              $cib = $("#item_button03");
            } else {
              if ($(_0x37c44c).val().match(/./) && _0x2a905f == "s03") {
                $(_0x37c44c).addClass("item_selected");
                $cib = $("#item_button03");
              } else {
                if ($(_0x37c44c).val() == '' && _0x2a905f == "s04") {
                  $(_0x37c44c).removeClass("item_selected");
                  $cib = $("#item_button04");
                } else {
                  if ($(_0x37c44c).val().match(/./) && _0x2a905f == "s04") {
                    $(_0x37c44c).addClass("item_selected");
                    $cib = $("#item_button04");
                  } else {
                    if (_0x2a905f == 's05') {
                      ;
                    } else {}
                  }
                }
              }
            }
          }
        }
      }
    }
    if ($cib.attr("src").match("_on_cl.png") && $(_0x37c44c).hasClass("item_selected")) {
      ;
    } else {
      if ($cib.attr("src").match("_on_cl_flag.png") && $(_0x37c44c).hasClass("item_selected")) {
        ;
      } else {
        if ($cib.attr("src").match('_off_cl.png') && $(_0x37c44c).hasClass("item_selected")) {
          $cib.attr("src", $cib.attr("src").replace("_off_cl.", '_on_cl.'));
        } else {
          if ($cib.attr("src").match("_off_cl_flag.png") && $(_0x37c44c).hasClass('item_selected')) {
            $cib.attr('src', $cib.attr("src").replace("_off_cl_flag.", "_on_cl_flag."));
          } else {
            if ($cib.attr("src").match('_on_cl_flag.png') && $(_0x37c44c).not('item_selected')) {
              $cib.attr("src", $cib.attr('src').replace("_on_cl_flag.", "_off_cl_flag."));
            } else {
              if ($cib.attr("src").match('_on_cl.png') && $(_0x37c44c).not("item_selected")) {
                $cib.attr('src', $cib.attr('src').replace("_on_cl.", '_off_cl.'));
              } else {}
            }
          }
        }
      }
    }
    item03check();
  }
  $(function () {
    $('#exam01 div,#exam05 div').click(function () {
      it_bt_set(this, 's01');
      removestrikethrough(this);
      if ($(this).hasClass("item_selected")) {
        $cib.addClass("sentakuzumi_button");
      } else {
        $cib.removeClass("sentakuzumi_button");
      }
    });
  });
  function addstrikethrough(_0x227504) {
    $(_0x227504).css("text-decoration", "line-through");
    $(_0x227504).addClass("strikethrough");
  }
  function removestrikethrough(_0x49e2cf) {
    $(_0x49e2cf).css("text-decoration", "none");
    $(_0x49e2cf).removeClass('strikethrough');
  }
  $(function () {
    $("#exam02 div").click(function () {
      removestrikethrough(this);
      it_bt_set(this, "s02");
      countselecteditem();
    });
  });
  function countselecteditem() {
    var _0x21eba2 = $("#exam01 div.item_selected").length;
    var _0x53d82d = $('#exam02 div.item_selected').length;
    if (_0x21eba2 > 0x0 || _0x53d82d > 0x0) {
      $cib.addClass('sentakuzumi_button');
    } else {
      $cib.removeClass("sentakuzumi_button");
    }
  }
  $(function () {
    $("#exam03 textarea").keyup(function () {
      it_bt_set(this, "s03");
      if ($(this).hasClass('item_selected')) {
        $cib.addClass("sentakuzumi_button");
      } else {
        $cib.removeClass("sentakuzumi_button");
      }
    });
  });
  $(function () {
    $("#essay04").bind("input propertychange", function () {
      it_bt_set(this, "s04");
      if ($(this).hasClass("item_selected")) {
        $cib.addClass('sentakuzumi_button');
      } else {
        $cib.removeClass("sentakuzumi_button");
      }
      let _0x6990df = textCount(this);
      alertCheck(this, _0x6990df);
    });
  });
  function alertCheck(_0x2ac6bc, _0x22c29d) {
    var _0x596402 = _0x2ac6bc.value;
    var _0x3e6a3f = _0x596402.length - _0x22c29d;
    if (_0x22c29d > 0x64) {
      $('#essay04').val($("#essay04").val().substring(0x0, 0x64 + _0x3e6a3f));
      $('.reachCountLimit_txt').show();
      setTimeout(function () {
        $(".reachCountLimit_txt").fadeOut(0x3e8);
      }, 0xbb8);
    }
  }
  function textCount(_0x203e06) {
    var _0x36b2ca = document.getElementById("essay04").value;
    var _0x1c56b6 = _0x36b2ca.replace(/\n|\r\n/g, '');
    _0x36b2ca = _0x1c56b6.length;
    return _0x36b2ca;
  }
  function item03check() {
    $exam03val = $("#exam03 textarea").val();
    $exam03src = $("#item03 img").attr('src');
    if (!$exam03val.length && $exam03src.match("03_on")) {
      $("#item03 img").attr("src");
      var _0x165fbe = $("#item03 img").attr('src').replace("03_on", "03_off");
      $("#item03 img").attr("src", _0x165fbe);
    } else {
      if ($exam03val.length && $exam03src.match("03_off")) {
        $("#item03 img").attr("src");
        var _0x165fbe = $("#item03 img").attr("src").replace('03_off', "03_on");
        $("#item03 img").attr('src', _0x165fbe);
      }
    }
  }
  $(function () {
    $('#dialog').dialog({
      'autoOpen': false,
      'title': '電卓',
      'width': 0x172,
      'height': 0x1bd,
      'closeText': "閉じる",
      'position': {
        'my': "center",
        'at': "center center+50",
        'of': "#container"
      }
    });
    $('#calc_dialog-link').click(function (_0x50ead3) {
      $('iframe[name=ifdialog]').attr({
        'src': $(this).val()
      });
      $("iframe[name=ifdialog]")[0x0].onload = function () {
        $("#dialog").dialog("open");
      };
      $(this).addClass("link-open");
      $(this).prop("disabled", true);
    });
    $(".ui-dialog-titlebar-close").click(function (_0x3c1e18) {
      $("#dialog").dialog('close');
      _0x3c1e18.preventDefault();
      $("#calc_dialog-link").removeClass("link-open");
      $("#calc_dialog-link").removeClass("ui-state-hover");
      $('#calc_dialog-link').prop('disabled', false);
    });
  });
  $("#calc_dialog-link, #icons li").mouseover(function () {
    $(this).addClass('ui-state-hover');
  }).mouseout(function () {
    $(this).removeClass("ui-state-hover");
  });
  $(window).resize(function () {
    if ($('#calc_dialog-link').hasClass("link-open")) {
      calcClose();
      $("#calcForceCloseLink")[0x0].click();
    }
  });
  function calcClose() {
    $('#dialog').dialog("close");
    $("#calc_dialog-link").removeClass("link-open");
    $("#calc_dialog-link").removeClass("ui-state-hover");
    $("#calc_dialog-link").prop("disabled", false);
  }
  function count_start() {
    var _0x1085d1 = 0x384;
    var _0x4812f0 = 0x0;
    var _0x3e7f47 = 0x0;
    var _0x5aa1ed = null;
    _0x5aa1ed = setInterval(_0xa254f, 0x3e8);
    function _0xa254f() {
      if ($("#outro").css("display") == "block") {
        clearInterval(_0x5aa1ed);
      } else {
        if (_0x1085d1 === 0x12d) {
          var _0x3f427f = document.getElementById("timer_popup");
          $(function () {
            $(_0x3f427f).slideToggle();
          });
          _0x423ed5();
        } else {
          if (_0x1085d1 === 0x128) {
            var _0x3f427f = document.getElementById("timer_popup");
            $(function () {
              $(_0x3f427f).slideToggle();
            });
            _0x423ed5();
          } else {
            if (_0x1085d1 === 0x1) {
              var _0x59490f = document.getElementById("default");
              _0x59490f.innerHTML = "残り時間：<br>00:00:00";
              location.href = "#open06";
              calcClose();
              clearInterval(_0x5aa1ed);
            } else {
              _0x423ed5();
            }
          }
        }
      }
    }
    function _0x423ed5() {
      _0x1085d1--;
      _0x4812f0 = parseInt(_0x1085d1 / 0x3c);
      _0x3e7f47 = _0x1085d1 % 0x3c;
      var _0x1aa3a9 = document.getElementById("default");
      _0x1aa3a9.innerHTML = "残り時間：<br>00:" + ('0' + _0x4812f0).slice(-0x2) + ':' + ('0' + _0x3e7f47).slice(-0x2);
      var _0x5bf050 = document.getElementById("last5_timer");
      _0x5bf050.innerHTML = "残り時間：<br>00:" + ('0' + _0x4812f0).slice(-0x2) + ':' + ('0' + _0x3e7f47).slice(-0x2);
    }
  }