$(function(){
	$('form').submit(function(e){
		get_games($('input',this).val());
		e.preventDefault();
	});
	
});

function get_games(query){
	$.ajax({
	  //url: 'http://0.0.0.0:9292/values/'+query+'/1',
	  url: 'http://strong-ice-535.heroku.com/values/'+query+'/1',
	  dataType: "jsonp",
	  cache:true,
	  success: function(data){
	    console.log(data);
	    var html = '';
	    $.each(data, function(k,v){
	    	if (v.tradeInValue){
	   		    html += '<article class="hproduct">';
				html += '<figure><div>';
				html += 	'<img src="'+v.image+'" alt="" />';
				html += '</div></figure>';
				html += '<header>';
				html += 	'<h1>'+v.name.split(' - ')[0]+'</h1>';
				html += 	'<p>'+v.name.split(' - ')[1]+'</p>';
				html += '</header>';
				html += '<div class="price_block_wrapper"><div class="price_block"><span class="vendor_name">Best Buy</span> <a class="trade_in_value" href="'+v.tradeInValue.best_buy.url+'">'+v.tradeInValue.best_buy.value+'<a></div></div>';
				html += '<a href="'+v.tradeInValue.amazon.url+'">' + v.tradeInValue.amazon.value + '</a>';
				html += '</article>';
			}
	    });
	    if (html !== ''){
		    $('#product_list').html(html);
	    }else{
	    	alert('no results');
	    }
	    

	  }
	});
}