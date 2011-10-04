(function() {
  $('html').removeClass('no-js');
  var page = 1,
      loading = false;

  function nearBottomOfPage() {
    return $(window).scrollTop() > $(document).height() - $(window).height() - 200;
  }

  $(window).scroll(function(){
    if (loading) {
      return;
    }

    if(nearBottomOfPage() && $('#load_more').length > 0) {
      var toLoad = $('#load_more').attr('href');
      $('#load_more').closest('.p').remove();
      $('#pl').after('<h3 id="l">&#x203B;</h3>');
      loading=true;
      page++;
      $.ajax({
        url: toLoad,
        type: 'get',
        cache: 'true',
        dataType: 'script',
        success: function(data) {
          $('#l').remove();
          //$('#pl').append(data.responseText);
          loading = false;
        },
        error: function(data, status, error){
          console.log(data, status, error);
          $('#l').remove();
          $('#pl').after('<h3>Something Exploded!');
        }
      });
    }
  });

}());