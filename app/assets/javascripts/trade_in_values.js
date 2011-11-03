(function() {
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
  
  
  $('html').removeClass('no-js');

  $('body').click(function(e){
    if ($(e.target).closest('.pbw').length > 0){
    }else{
      $('.active').removeClass('active');
    }
    
    if ($(e.target).closest('#shutter').length > 0 || $(e.target).closest('.current').length > 0){ // check if we're clicking inside the shutter or our product
    }else{
      closeShutter();
    }

  });
  
  $('.game-link').live('click',function(e){
    var me = $(this);
    var product = me.closest('.p');
    var url = $(this).attr('href');
    $.ajax({
      url: url + "?ajax=true",
      cache: 'false',
      success: function(data){
        clicky.log('url','PDP Ajax Load');
        closeShutter(product);
        product.addClass('current');
        $('body').addClass('shuttered');
        //FIND WHERE TO POSITION BY FINDING NEXT ELEMENT WITH A DIFFERENT Y POSITION AND PREPENDING
        var positionTop = product.offset().top;
        $(window).scrollTo(positionTop, {duration:500});

        product.nextAll().each(function(){
          if (positionTop !== $(this).offset().top){
            $(this).before(data);
            renderGraph();
            moveArrow(product);
            return false;
          }
        });
      }
    })
    e.preventDefault();
  });
  
  function moveArrow(el){
    var positionLeft = el.position().left + (el.width()/2);
    $('#arrow').css('left', positionLeft+'px');
  }
  
  function closeShutter(){
    $('#shutter').remove();
    $('.current').removeClass('current');
    $('.shuttered').removeClass('shuttered');
  }
  
  
  $('.tv').live('click',function(e){
    $(this).closest('.p').toggleClass('active').siblings().removeClass('active');
    clicky.log('#dropdown','Product Dropdown Clicked');
    e.stopPropagation();
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
    if (loading) {
      return;
    }
    if(nearBottomOfPage() && $('#load_more').length > 0) {
      var toLoad = $('#load_more').attr('href');
      $('#load_more').remove();

      $('#pl').after('<div id="loading"></div>');
      spinner.spin(document.getElementById('loading'));

      loading = true;
      page++;
      $.ajax({
        url: toLoad + ".js",
        type: 'get',
        cache: 'false',
        dataType: 'script',
        success: function(data) {
          $('#loading').remove();
          spinner.stop();
          //$('#pl').append(data.responseText);
          loading = false;
        },
        error: function(data, status, error){
          //console.log(data, status, error);
          $('#loading').remove();
          spinner.stop();
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
            left: x,
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
