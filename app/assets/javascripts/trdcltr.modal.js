(function($){ 
        $.fn.trdcltrModal = function(options){
            var settings = {};  
            return this.each(function() {
                if ( options ) $.extend( settings, options );
                //preload loader image
                if (settings.url) $('<div class="modal_loading" style="display:none"></div>').appendTo('body'); 
                if (settings.handler){
                  $(settings.handler).live('click',function(e){
                    clickHandler(e);
                  });
                }else{
                   $(this).click(function(e){
                      clickHandler(e);
                  });
                }
            });
            
            function clickHandler(e){
              if (settings.content && settings.content.charAt(0) == '#'){ 
                  settings.content = $(settings.content).html(); // if we receive a jquery object to load then spit out its html.
                  renderModal();
              } else if (settings.url){
                  //if we have a url we need to load it remotely
                  $('<div class="modal_content modal_loading"></div><div class="modal_overlay"></div>').appendTo('body');
                  positionModal($('.modal_content.modal_loading'),$('.modal_overlay'));
                  $.ajax({
                      url: settings.url,
                      success: function(e){
                          //remove loading
                          $('.modal_loading, .modal_overlay').remove();
                          settings.content = e;
                          renderModal();
                      }
                  });
              } else {
                  renderModal();
              }
              e.preventDefault();
            }
            
            function renderModal(){
                
                $('<div class="modal_content"><a href="#" class="close_btn">&times;</a>'+settings.content+'</div><div class="modal_overlay"></div>').appendTo('body');
                var modal = $('.modal_content');
                var overlay = $('.modal_overlay');
                positionModal(modal,overlay);
                $(window).resize(function() {
                    positionModal(modal, overlay)
                });
                $('.close_btn, .modal_overlay').click(function(e){
                    modal.remove();
                    overlay.remove();
                    $(this).unbind('click');
                    $(window).unbind('resize');
                    e.preventDefault();
                });
            }
            
            function positionModal(modal, overlay){
                modal.css({top: $(window).scrollTop()});
                overlay.css({height: $(document).height()});
            }
        }
    })(jQuery);