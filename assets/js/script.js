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
	
	/*$('#load_more').click(function(e){
		page++;
		get_games(query,page);
		e.preventDefault();
	});*/

	w.scroll(function(){
		if ((w.scrollTop() + w.height()) > (p.height() + p.offset().top) && !loading){
			console.log('infinite scroll');
			page++;
			get_games(query,page);
			loading = true;
		}
	});
	
});

function get_games(query,page){
	$('h3').remove();
	$('#product_list').after('<h3 id="loading">&#x203B;</h3>');
	$.ajax({
	  //url: 'http://0.0.0.0:9292/values/'+query+'/'+page,
	  url: 'http://tradaculator.heroku.com/values/'+query+'/'+page,
	  dataType: "jsonp",
	  cache:true,
	  success: function(data){
	  	$('#loading').remove();
	    //console.log(data);
	    var html = '';
	    $.each(data, function(k,v){
	    	var top_value,top_value_url,top_value_vendor;
	    	if (parseInt(v.tradeInValue.best_buy.value.replace(/[\$\.]/g,''),10) > parseInt(v.tradeInValue.amazon.value.replace(/[\$\.]/g,''),10) || v.tradeInValue.amazon.value == ''){
	    		top_value = v.tradeInValue.best_buy.value;
	    		top_value_url = v.tradeInValue.best_buy.url;
	    		top_value_vendor = "Best Buy"; 
	    	} else {
	    		top_value = v.tradeInValue.amazon.value;
	    		top_value_url = v.tradeInValue.amazon.url;
	    		top_value_vendor = "Amazon"; 
	    	}
	    	
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
				html += '<div class="price_block_wrapper"><div class="price_block button"><span class="vendor_name">'+top_value_vendor+'</span> <a class="trade_in_value" href="'+top_value_url+'">'+top_value+'<a></div>';
				html += '<ul class="drop_down"><li><a href="'+v.tradeInValue.best_buy.url+'">Best Buy <span>'+v.tradeInValue.best_buy.value+'</span></a></li>';
				if (v.tradeInValue.amazon.value !== ''){
					html += '<li><a href="'+v.tradeInValue.amazon.url+'">Amazon <span>'+v.tradeInValue.amazon.value+'</span></a></li>';
				}
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