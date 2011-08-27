$(function(){
	$.ajax({
	  url: 'assets/js/sample_response.js',
	  //url: "http://api.remix.bestbuy.com/v1/products(search=call&type=game)?page=2&format=json&apiKey=amfnpjxnz6c9wzfu4h663z6w",
	  dataType: "json",
	  cache:true,
	  success: function(data){
	    console.log(data);
	    var html = '';
	    $.each(data.products, function(k,v){
	    	if (v.tradeInValue){
	   		    html += '<article class="hproduct">';
				html += '<figure><div>';
				html += 	'<img src="'+v.image+'" alt="" />';
				html += '</div></figure>';
				html += '<header>';
				html += 	'<h1>'+v.name.split(' - ')[0]+'</h1>';
				html += 	'<p>'+v.name.split(' - ')[1]+'</p>';
				html += '</header>';
				html += '<div class="price_block_wrapper"><div class="price_block"><span class="vendor_name">Best Buy</span> <span class="trade_in_value">$'+v.tradeInValue+'.00<span></div></div>';
				html += '</article>';
			}
	    });
	    $('#product_list').append(html);

	  }
	});
});