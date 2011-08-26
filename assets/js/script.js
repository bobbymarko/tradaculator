$(function(){
	$.ajax({
	  url: "http://api.remix.bestbuy.com/v1/products?page=1&format=json&apiKey=amfnpjxnz6c9wzfu4h663z6w",
	  dataType: "jsonp",
	  cache:true,
	  success: function(data){
	    console.log(data);
	    var html = '';
	    $.each(data.products, function(k,v){
   		    html += '<article class="hproduct">';
   		    html += '<div id="price_block">'+v.salePrice+'<a href="'+v.addToCartUrl+'">Add To Cart</a></div>';
			html += '<figure>';
			html += 	'<img src="'+v.image+'" alt="" />';
			html += '</figure>';
			html += '<header>';
			html += 	'<h1>'+v.name+'</h1>';
			html += '</header>';
			
			html += '</article>';
	    });
	    $('#product_list').append(html);

	  }
	});
});