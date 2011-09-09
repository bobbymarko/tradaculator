var loading = true;
$(function(){
	var query = '',
		page = 1,
		w = $(window),
		p = $('#pl');
	
	get_games(query,1);
	
	$('form').submit(function(e){
		input = $('input',this);
		query = input.val();
		input.blur();
		page = 1;
		$('#pl').html('');
		get_games(query,page);
		e.preventDefault();
	});
	
	w.scroll(function(){
		if ((w.scrollTop() + w.height()) > (p.height() + p.offset().top) && !loading){
			page++;
			get_games(query,page);
			loading = true;
		}
	});
	
	$('.tv').live('click',function(e){
		$(this).closest('.p').toggleClass('active').siblings().removeClass('active');
		e.preventDefault();
	});
	
});

function get_games(query,page){
	$('h3').remove();
	$('#pl').after('<h3 id="loading">&#x203B;</h3>');
	$.ajax({
	  //url: 'http://0.0.0.0:9292/values/'+query+'/'+page,
	  url: 'http://tradaculator.com/values/'+query+'/'+page,
	  dataType: "jsonp",
	  cache:true,
	  success: function(data){
	  	$('#loading').remove();
	    var html = '';
	    $.each(data, function(k,v){
	    	var sortable = [];
	    	$.each(v.tradeInValue, function(k,v){
	    		if (v.value) {
 		    		v.vendor = k;
	    			sortable.push(v);
	    		}
	    	});
	    	sortable.sort(function(a, b) { return parseInt(b.value.replace(/[\$\.]/g,''),10) - parseInt(a.value.replace(/[\$\.]/g,''),10) });

	    	if (v.tradeInValue){
	    		var n = v.name.split(' - ');
	   		    html += '<article class="p">';
	   		    html += '<div class="prod_wrap">';
				html += '<figure>';
				html += 	'<img src="'+v.image+'" alt="" />';
				html += '</figure>';
				html += '<header>';
				html += 	'<h1>'+n[0]+'</h1>';
				html += 	'<p>'+n[n.length - 1]+'</p>';
				html += '</header>';
				html += '<div class="pbw"><div class="b"><a class="vn" target="_blank" href="'+sortable[0].url+'">Trade It In</a><a href="#" class="tv">'+sortable[0].value+'</a></div>';
				html += '<ul class="dd">';
				$.each(sortable, function(k,v){
					html += '<li><a target="_blank" href="'+v.url+'">'+v.vendor.replace('_',' ') +' <span>'+v.value+'</span></a></li>';
				});
				html += '</ul>';
				html += '</div></div>';
				html += '</article>';
			}
	    });
	    if (html !== ''){
		    $('#pl').append(html);
		    loading = false;
	    }else{
	    	$('#pl').after("<h3>That's all there is.</h3>");
	    	loading = true;
	    }

	  }
	});
}