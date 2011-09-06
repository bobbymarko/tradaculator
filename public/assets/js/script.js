var loading = true;
$(function(){
	var query = 'Call of Duty',
		page = 1,
		w = $(window),
		p = $('#product_list');
	
	get_games(query,1);
	
	$('form').submit(function(e){
		query = $('input',this).val();
		page = 1;
		$('#product_list').html('');
		//$('#load_more').hide();
		get_games(query,page);
		e.preventDefault();
	});
	
	w.scroll(function(){
		if ((w.scrollTop() + w.height()) > (p.height() + p.offset().top) && !loading){
			//console.log('infinite scroll');
			page++;
			get_games(query,page);
			loading = true;
		}
	});
	
	$('.hproduct').live('click',function(){
		$(this).toggleClass('active').siblings().removeClass('active');
	});
	
});

function get_games(query,page){
	$('h3').remove();
	$('#product_list').after('<h3 id="loading">&#x203B;</h3>');
	$.ajax({
	  //url: 'http://0.0.0.0:9292/values/'+query+'/'+page,
	  url: 'http://tradaculator.com/values/'+query+'/'+page,
	  dataType: "jsonp",
	  cache:true,
	  success: function(data){
	  	$('#loading').remove();
	    //console.log(data);
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
	   		    html += '<article class="hproduct">';
	   		    html += '<div class="prod_wrap">';
				html += '<figure>';
				html += 	'<img src="'+v.image+'" alt="" />';
				html += '</figure>';
				html += '<header>';
				html += 	'<h1>'+v.name.split(' - ')[0]+'</h1>';
				html += 	'<p>'+v.name.split(' - ')[1]+'</p>';
				html += '</header>';
				html += '<div class="price_block_wrapper"><div class="price_block button"><span class="vendor_name">Trade It In <span class="up"></span><span class="down"></span></span> <a class="trade_in_value" target="_blank" href="'+sortable[0].url+'">'+sortable[0].value+'</a></div>';
				html += '<ul class="drop_down">';
				$.each(sortable, function(k,v){
					html += '<li><a target="_blank" href="'+v.url+'">'+v.vendor.replace('_',' ') +' <span>'+v.value+'</span></a></li>';
				});
				html += '</ul>';
				html += '</div></div>';
				html += '</article>';
			}
	    });
	    if (html !== ''){
		    $('#product_list').append(html);
		    //$('#load_more').show();
		    loading = false;
	    }else{
	    	$('#product_list').after("<h3>That's all there is.</h3>");
	    	loading = true;
	    }

	  }
	});
}