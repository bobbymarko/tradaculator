$(function(){
  $('form', '.modal_content').live('submit', function(e){
    var button = $('input[name=commit]',this);
    $(this).ajaxSubmit({
      dataType: 'json',
      beforeSubmit: function(){
        button.addClass('loading').prop('disabled','true');
      },
      success: function(data, status){
        //console.log(data, status);
        var username = data.username;
        //console.log('Welcome, ' + username);
        enableElement(button);
        removeModal();
        $('#mh .hmenu').load('/ #mh .hmenu li');
        $('.sign-in-required').removeClass('sign-in-required');
        $('.library-item').addClass('library-toggle');
        $('.library-item a', '#shutter').trigger('click'); //this is all wrong. should pass this through instead of assuming
      },
      error: function(data, status, error){
        alert(error);
        enableElement(button);
      }
    });
    e.preventDefault();
  });
  
  function enableElement(element){
    $(element).removeClass('loading').prop('disabled',null);
  }
  
  function removeModal(){ // this should really be a function on the modal window.
    $('.modal_content').remove();
    $('.modal_overlay').remove();
  }
});