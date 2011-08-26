$(function(){
	$.ajax({
	  url: "http://api.remix.bestbuy.com/v1/products(search=mario&type=game)?format=json&apiKey=amfnpjxnz6c9wzfu4h663z6w",
	  dataType: "jsonp",
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
				html += '<div id="price_block">$'+v.tradeInValue+'.00</div>';
				html += '</article>';
			}
	    });
	    $('#product_list').append(html);

	  }
	});
});