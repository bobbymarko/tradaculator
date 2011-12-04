var Game = {
	AddToLibrary: {
		// Add or remove a Game from Library
		toggle: function(e) {
		  e.preventDefault();
			if ($('.tool-list .library-toggle.processing').length == 0) {
				var $link = $(this);
				var url = $link.attr('href');
				var data = $link.hasClass('current-user-library') ? {_method: 'delete'} : {}
				
				$.ajax({
					type: 'POST',
					url: url,
					cache: false,
					data: data,
					beforeSend: function() {
						$('.library-toggle').addClass('processing');
						$link.text('Wait...');
					},
					success: function(responseHtml) {
					  $('.tool-list .library-toggle.processing').removeClass('processing');
					  if ($link.hasClass('current-user-library')){
					   $link.removeClass('current-user-library').text('Removed!');
					  } else {
					   $link.addClass('current-user-library').text('Added!');
					  }
						
						//$('#like-section').replaceWith(responseHtml);
					},
					error: function(){
					 $link.text('Sorry, Try again!');
					}
				});
			}
		}
  }
}


// Add or remove a Game from Library
$(function(){
  $(".tool-list .library-toggle a").live('click', Game.AddToLibrary.toggle);
});