var loading = false;
$(function(){
	var query = window.location.hash.split('#!/')[1] || '',
		page = 1,
		w = $(window),
		p = $('#pl'),
		pse = typeof history.pushState == 'function';
	
	
	if ( pse ){
		var popped = ('state' in window.history), initialURL = location.href;
		$(window).bind("popstate", function(e){
			var initialPop = !popped && location.href == initialURL;
			popped = true;
			if ( initialPop ) return;
			
			query = window.location.hash.split('#!/')[1] || '';
			$('#s').val(query);
			page = 1;
			$('#pl').html('');
			get_games(query,page);
		});
	}
	
	if (!loading){
		$('#s').val(query);
		get_games(query,page);
	} 
	
	$('form').submit(function(e){
		input = $('#s');
		query = input.val();
		input.blur();
		page = 1;
		$('#pl').html('');
		get_games(query,page);
		if (pse) history.pushState({}, query, '#!/'+query);
		e.preventDefault();
	});
	
	w.scroll(function(){
		if ((w.scrollTop() + w.height()) > (p.height() + p.offset().top - 200) && !loading){
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
	loading = true;
	$.ajax({
	  url: 'http://0.0.0.0:9292/values/'+query+'/'+page,
	  //url: 'http://tradaculator.com/values/'+query+'/'+page,
	  dataType: "jsonp",
	  cache:true,
	  timeout:10000,
	  error: function(data){
	  	$('#loading').remove();
	  	$('#pl').after("<h3>Something exploded.</h3>");
	  },
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
	   		    html += '<div class="pw">';
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
	    }

	  }
	});
}