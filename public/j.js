var loading = false;
$(function(){
	var page = 1,
		w = $(window),
		query = '',
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
	
		//get_best_buy(query, page);
		search_amazon(query,page);
		
			
	
			
		
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
	/*
	function get_best_buy(upc){
		get_json('http://api.remix.bestbuy.com/v1/products(upc='+upc+')?format=json&apiKey=amfnpjxnz6c9wzfu4h663z6w', 
			function(data){
				console.log(data);
				
				if (data.products){
					$.each(data.products, function(k,v){
						if (v.tradeInValue){

							sortable.push({});
							$('body').trigger({type:'custom_loaded_'+upc, value:'$'+v.tradeInValue+'.00',vendor:"Best Buy",url:"http://www.bestbuytradein.com/bb/QuoteCalculatorVideoGames.cfm?kw="+v.upc+"&pf=all&af=9a029aae-d650-44f8-a1c7-c33aa7fd0e27" });
						}else{
							$('body').trigger({type:'custom_loaded_'+upc});
						}
					});
				}
			}, false);
	}*/
	
	/*function get_best_buy(upcs){
		get_json('http://api.remix.bestbuy.com/v1/products(upc in('+upcs+'))?format=json&apiKey=amfnpjxnz6c9wzfu4h663z6w', 
			function(data){
				console.log(data);
				
				if (data.products){
					$.each(data.products, function(k,v){
						if (v.tradeInValue){

							sortable.push({});
							$('body').trigger({type:'custom_loaded_'+upc, value:'$'+v.tradeInValue+'.00',vendor:"Best Buy",url:"http://www.bestbuytradein.com/bb/QuoteCalculatorVideoGames.cfm?kw="+v.upc+"&pf=all&af=9a029aae-d650-44f8-a1c7-c33aa7fd0e27" });
						}else{
							$('body').trigger({type:'custom_loaded_'+upc});
						}
					});
				}
			}, false);
	}*/
	
	function get_glyde(upc){
		get_json('http://api.glyde.com/price/upc/'+upc+'?api_key=tradaculat_u8mBCp87&v=1&responseType=application/json',function(data){
				//console.log(data);
				if (data.suggested_price.cents > 0){
					var value = data.suggested_price.cents * .88 / 100 - 1.25;
					$('body').trigger({type:'custom_loaded_'+upc, value:'$'+value.toFixed(2), vendor:"Glyde", url:"http://glyde.com/sell?hash=%21by%2Fproduct%2Flineup%2Fgames%2F"+data.glu_id+"#!show/product/"+data.glu_id+"" });
				} else {
					$('body').trigger({type:'custom_loaded_'+upc});
				}
			});
	}
	
	function search_amazon(query,page){
		//console.log(page);
		if (query) query = '&Title=' + query;
		get_json('http://xmltojsonp.appspot.com/onca/json?Operation=ItemSearch'+query+'&ItemPage='+page+'&BrowseNode=979418011&SearchIndex=VideoGames&ResponseGroup=ItemAttributes,Images', function(data){
				//console.log("page",data);
				if (data = data.ItemSearchResponse.Items.Item){	
					//console.log(data);
					var upcs = '';
					$.each(data, function(index, item){
						var image = item.MediumImage.URL;
						var asin = item.ASIN;
						item = item.ItemAttributes;
						//console.log(item);
						if (item.TradeInValue){
							var sortable = [];
							upcs += item.UPC + ',';
							sortable.push({value:item.TradeInValue.FormattedPrice, vendor:"Amazon", url:"https://www.amazon.com/gp/tradein/add-to-cart.html/ref=trade_new_dp_trade_btn?ie=UTF8&asin="+asin});
							//console.log(sortable);
							get_glyde(item.UPC);
							
							var count = 0;
							$('body').bind('custom_loaded_'+item.UPC, function(data){
								if (data.value) sortable.push(data);
								count++;
								if (count >= 1){
									sortable.sort(function(a, b) { return parseInt(b.value.replace(/[\$\.]/g,''),10) - parseInt(a.value.replace(/[\$\.]/g,''),10) });
									$('#l').remove()
									render(item.Title,item.Platform,image, sortable);
									$('body').unbind('custom_loaded_'+item.UPC);
								}
							});
							
						}
					});
				}else{
					$('#l').remove()
					$('#pl').after("<h3>That's all</h3>");
					loading=true;
				};
				//get_best_buy(upcs);
				
			});
	}
	
	function get_json(url, cbfunc, proxy){
		url = 'http://jsonpify.heroku.com/?resource=' + url;
		$.ajax({
			url:url,
			dataType:'jsonp',
			cache:true,
			success:function(data) {
				cbfunc(data);
			}
		});
	}
	
	function render(name, platform, image, sortable){
		//console.log(data);
			var html = '';
			html += '<div class="p">';
			html += '<div class="pw">';
			html += '<div class="f">';
			html += 	'<img src="'+image+'" alt="" />';
			html += '</div>';
			html += '<header>';
			html += 	'<h1>'+name+'</h1>';
			html += 	'<p>'+platform+'</p>';
			html += '</header>';
			html += '<div class="pbw"><div class="b"><a class="vn" target="_blank" href="'+sortable[0].url+'">Trade It In</a><a href="#" class="tv">'+sortable[0].value+'</a></div>';
			html += '<ul class="dd">';
			$.each(sortable, function(k,v){
				html += '<li><a target="_blank" href="'+v.url+'">'+v.vendor +' <span>'+v.value+'</span></a></li>';
			});
			html += '</ul>';
			html += '</div></div>';
			html += '</div>';
	
		    $('#pl').append(html);
		    loading = false;
	}

});