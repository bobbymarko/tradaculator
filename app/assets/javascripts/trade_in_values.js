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
  
  $('.tv').live('click',function(e){
		$(this).closest('.p').toggleClass('active').siblings().removeClass('active');
		e.preventDefault();
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
        url: toLoad,
        type: 'get',
        cache: 'true',
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

}());