var loading = false;
$(function(){
	var page = 1,
		w = $(window),
		query = get_hash() || '',
		p = $('#pl'),
		push_state_enabled = typeof history.pushState == 'function';
	
	if (push_state_enabled){
		var popped = ('state' in window.history), initial_url = location.href;
		w.bind("popstate", function(e){
			var initial_pop = !popped && location.href == initial_url;
			popped = true;
			if ( initial_pop ) return;
			
			query = get_hash(w) || '';
			$('#pl').html('');
			before_get_games(query,page = 1);
		});
	}
	
	if (!loading) before_get_games(query,page);
	
	$('form').submit(function(e){
		input = $('#s');
		query = input.val();
		input.blur();
		page = 1;
		$('#pl').html('');
		get_games(query,page);
		if (push_state_enabled) history.pushState({}, query, '#!/'+query);
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

function get_hash(){
	var hash = window.location.hash.split('#!/')[1];
	if (hash) return hash.replace(/%20/g,' ');
}

function before_get_games(query,page){
	$('#s').val(query);
	get_games(query,page);
}

function get_games(query,page){
	$('h3').remove();
	$('#pl').after('<h3 id="l">&#x203B;</h3>');
	loading = true;
	
	$.ajax({
		url:'http://api.remix.bestbuy.com/v1/products(tradeInValue%3E0&active=*&type=game)?format=json&page='+page+'&show=tradeInValue,image,name,upc&apiKey=amfnpjxnz6c9wzfu4h663z6w',
		dataType:'jsonp',
		cache:true,
		success:function(data) {
			$('#l').remove()
			html = '';
			if (data.products){
				$.each(data.products, function(k,v){
					if (v.tradeInValue){
			    		var n = v.name.split(' - ');
			   		    html += '<div class="p">';
			   		    html += '<div class="pw">';
						html += '<div class="f">';
						html += 	'<img src="'+v.image+'" alt="" />';
						html += '</div>';
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
						html += '</div>';
					}
				});
			}
			if (html !== ''){
			    $('#pl').append(html);
			    loading = false;
		    }else{
		    	$('#pl').after("<h3>That's all</h3>");
		    }
		}
	});
	
	
	/*$.ajax({
	  url: 'http://0.0.0.0:9292/values/'+query+'/'+page,
	  url: 'http://beta.tradaculator.com/values/'+query+'/'+page,
	  dataType: "jsonp",
	  cache:true,
	  timeout:10000,
	  error: function(data){
	  	$('#l').remove();
	  	$('#pl').after("<h3>Something exploded</h3>");
	  },
	  success: function(data){
	  	$('#l').remove();
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
	   		    html += '<div class="p">';
	   		    html += '<div class="pw">';
				html += '<div class="f">';
				html += 	'<img src="'+v.image+'" alt="" />';
				html += '</div>';
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
				html += '</div>';
			}
	    });
	    if (html !== ''){
		    $('#pl').append(html);
		    loading = false;
	    }else{
	    	$('#pl').after("<h3>That's all</h3>");
	    }

	  }
	});*/
}