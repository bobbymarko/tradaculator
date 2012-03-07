document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/,'js');
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

$(function() {
  var spinner = new Spinner({
    lines: 10, // The number of lines to draw
    length: 7, // The length of each line
    width: 6, // The line thickness
    radius: 10, // The radius of the inner circle
    color: '#555', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 46, // Afterglow percentage
    shadow: false // Whether to render a shadow
  });
  
  var miniSpinner = new Spinner({
    lines: 10, // The number of lines to draw
    length: 7, // The length of each line
    width: 6, // The line thickness
    radius: 10, // The radius of the inner circle
    color: '#fff', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 46, // Afterglow percentage
    shadow: true // Whether to render a shadow
  });

  $('body.trade_in_values_template, body.library_items_template').click(function(e){
    if ($(e.target).closest('.pbw').length > 0){
    }else{
      $('.active').removeClass('active');
    }
    
    if ($(e.target).closest('#shutter').length > 0 || $(e.target).closest('.current').length > 0 || $(e.target).hasClass('modal_overlay') || $(e.target).closest('.modal_content').length > 0){ // check if we're clicking inside the shutter or our product
    }else{
      closeShutter();
    }
  });
  
  $('#back-to-top').click(function(e){
    $(window).scrollTop(0);
    e.preventDefault();
  });
  
  $('a','.share').live('click', function(e){
    $(this).closest('li').toggleClass('toggled');
    e.preventDefault();
  });
  
  $("a").on('click',function(e){
      var url = $(this).attr("href");
      if (url && e.currentTarget.host != window.location.host && url !== "#") {
          _gat._getTrackerByName('demand')._trackEvent("Outbound Links", e.currentTarget.host, url, 0);
          if (e.metaKey || e.ctrlKey) {
               var newtab = true;
          }
          if (!newtab) {
               e.preventDefault();
               setTimeout('document.location = "' + url + '"', 100);
          }
      }
  });
  
  $('.popup').live('click', function(e){
    window.open($(this).attr('href'),'popup_window','height=300,width=600');
    if (window.focus) {popup_window.focus()}
    e.preventDefault();
  });
  
  $('#value-selector').change(function(){
    window.location = '/library?vendor=' + $(this).val();
  });
  
  $('body').trdcltrModal({handler: '.sign-in-required', content:'#sign-in-modal'});
  
  $('.game-link').live('click',function(e){
    e.preventDefault();
    var me = $(this);
    var product = me.closest('.p');
    var url = $(this).attr('href');
    // add shutter loader
    miniSpinner.spin();
    product.find('.f').prepend('<div class="loading"></div>');
    product.find('.loading').append(miniSpinner.el);
    
    var positionTop = product.offset().top;
    
    $.ajax({
      url: url + "?ajax=true",
      cache: 'false',
      success: function(data){
        clicky.log(url,'PDP Ajax Load');
        _gaq.push(['_trackEvent', 'Ajax Load', 'PDP', url]);
        closeShutter(function(){
          removeLoadingUI(miniSpinner,product);
          $(window).scrollTop(product.offset().top);
          product.addClass('current');
          $('body').addClass('shuttered');

          var nextProducts = product.nextAll();
          var isAppended = false;
          nextProducts.each(function(index){ //FIND WHERE TO POSITION BY FINDING NEXT ELEMENT WITH A DIFFERENT Y POSITION AND PREPENDING
            if (positionTop !== $(this).offset().top){
              isAppended = true;
              addShutter(data, product, $(this))
              return false;
            }
          });
          if (!isAppended){
            addShutter(data, product, false);
          }
        });
      },
      error: function(){
        removeLoadingUI(miniSpinner,product);
        showAlert('loadError');
      }
    })
  });
  
  function removeLoadingUI(spinner, product){
    spinner.stop();
    product.find('.loading').remove();
  }
  
  function showAlert(state){
    var message;
    switch(state){
      case 'loadError':
        message = "Looks like a tradaculasaur ate that game :("
      break;
    }
    $('body').prepend('<div id="error-message">' + message + '</div>');
    $('#error-message').hide().slideDown(400).delay(2000).slideUp(400, function(){$(this).remove();});
  }
  
  function addShutter(data, product, priorTo){
    if (priorTo){
      priorTo.before(data);
    } else {
      var lastProduct = $('.p').last();
      lastProduct.after(data);
    }
    renderGraph();
    moveArrow(product);
    $('#shutter').append('<a href="#close" class="close" title="Close">&times;</a>');
    $('.close').click(function(e){
      closeShutter()
      e.preventDefault();
    });
  }
  
  function moveArrow(el){
    var positionLeft = el.position().left + (el.width()/2);
    $('#arrow').css('left', positionLeft+'px');
  }
  
  function closeShutter(callback){
    $('#shutter').addClass('fade-out');
    setTimeout(function(){
      $('#shutter').remove();
      $('.current').removeClass('current');
      $('body').removeClass('shuttered');
      if (callback)
        callback();
    },400)
  }
  
  
  $('.tv').live('click',function(e){
    if (!$(this).attr('href')){
      $(this).closest('.p').toggleClass('active').siblings().removeClass('active');
      clicky.log('#dropdown','Product Dropdown Clicked');
      _gaq.push(['_trackEvent', 'Ajax Load', 'Product Dropdown', $('h1 a',$(this).closest('.p')).attr('href')]);
      e.stopPropagation();
    }
  });
	
  $('a','.dd').live('click', function(e){
    e.stopPropagation();
  });

  var page = 1,
      loading = false;

  function nearBottomOfPage(){
    return $(window).scrollTop() > $(document).height() - $(window).height() - 200;
  }

  $(window).scroll(function(){
    if ($(window).scrollTop() > 200){
      $('#back-to-top').removeClass('exit-stage-right');
    }else{
      $('#back-to-top').addClass('exit-stage-right');
    }
    
    if (loading) {
      return;
    }
    
    if(nearBottomOfPage() && $('#load_more').length > 0) {
      var toLoad = $('#load_more').attr('href');
      $('#load_more').remove();

      $('#pl').append('<div class="p" id="loading"></div>');
      spinner.spin(document.getElementById('loading'));

      loading = true;
      page++;
      $.ajax({
        url: toLoad + ".js",
        type: 'get',
        cache: 'false',
        dataType: 'script',
        success: function(data) {
          spinner.stop();
          $('#loading').remove();
          //$('#pl').append(data.responseText);
          loading = false;
        },
        error: function(data, status, error){
          //console.log(data, status, error);
          spinner.stop();
          $('#loading').remove();
          $('#pl').after('<h3>Something Exploded!');
        }
      });
    }
  });
  

  if ($('#graph').length > 0){
    renderGraph();
  }
  
  function renderGraph(){
    var options = {
        xaxis: { mode: "time", tickLength: 5, timeformat: "%m/%d" },
        yaxis: { mode: "money", tickDecimals: 2, tickFormatter:
          function (v, axis) { return "$" + v.toFixed(axis.tickDecimals) }
        },
        points: {
          radius: 2,
          symbol: "circle"
        },
        series: {
          lines: { show: true, fill: false },
          points: { show: true, fill: true }
        },
        grid: {clickable: true, hoverable: true, color:'#383838', borderWidth:1},
        colors: [ '#d58103', '#4c85d2', '#d4c125' ],
        legend: {backgroundOpacity:0, noColumns:3,margin:[0,-25]}
    };
    
    function showTooltip(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css( {
            position: 'absolute',
            top: y,
            left: x
        }).appendTo("body");
    }
    
    var previousPoint = null;
    
    $("#graph").bind("plothover", function (event, pos, item) {
        if (item) {
            if (previousPoint != item.dataIndex) {
                previousPoint = item.dataIndex;
                
                $("#tooltip").remove();
                var x = item.datapoint[0].toFixed(2),
                    y = item.datapoint[1].toFixed(2);
                
                showTooltip(item.pageX, item.pageY, item.series.label + ": $" + y);
            }
        }
        else {
            $("#tooltip").remove();
            previousPoint = null;            
        }
    });
    
    var data = [
      { label: "Amazon", data: amazon },
      { label: "Best Buy", data: best_buy },
      { label: "Glyde", data: glyde }
    ];
    
    $.plot($("#graph"), data, options);
  }
}());
