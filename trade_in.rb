require 'sinatra'
require 'remixr'
require "amazon_product"
require 'json'

class TradeIn < Sinatra::Base
#    set :sessions, true
#    set :foo, 'bar'

  get '/values/:search/:page' do
    callback = params[:callback] # jsonp
    
    Remixr.api_key = ENV['BBY_KEY']
    bby = Remixr::Client.new
    products = bby.products({:search => params[:search], :type => 'game', :tradeInValue => {'$gt' => 0}, :active => false}).fetch(:page => params[:page], :show => 'url,tradeInValue,image,name,upc', :sort => {'releaseDate'=>'desc'}).products
    
    upcs = []
    products.each_with_index do |product,index|
    	upcs << product.upc
    	#reorganize trade in values
    	best_buy_trade_in_value = product['tradeInValue'] rescue ''
    	products[index]['tradeInValue'] = {:best_buy => {:value => "$#{best_buy_trade_in_value}0", :url => product['url']}, :amazon => {:value => '', :url => ''}}
    end
    #puts upcs.join(',').inspect
    
    req = AmazonProduct["us"]
	req.configure do |c|
	  c.key    = ENV['AMAZON_KEY'] 
	  c.secret = ENV['AMAZON_SECRET']
	  c.tag    = ENV['AMAZON_TAG']
	end
	
	req << {
	  :operation    =>	'ItemLookup',
	  :item_id		=>	upcs.join(','),
	  :id_type       =>	'UPC',
	  :search_index	=>	'VideoGames',
	  :response_group => 'ItemAttributes'
	}
	
	amazon = req.get
	
    #puts amazon['Item'].length
    #puts amazon.to_hash.to_json
    upcs.each_with_index do |upc, index|
	    amazon.each('Item') do |item|
	    	if upc == item["ItemAttributes"]["UPC"]
	    		if item["ItemAttributes"]["IsEligibleForTradeIn"] == "1"
	    			amazon_trade_in_value = item["ItemAttributes"]["TradeInValue"]["FormattedPrice"]
	    		else
	    			amazon_trade_in_value = ''
	    		end
	    		
	    		#puts amazon_trade_in_value
	    		
	    		
	    		products[index]['tradeInValue']['amazon'] = {:value => amazon_trade_in_value, :url => item["DetailPageURL"]}
				break #if we found it then stop
	    	end
	    end
	    
    end
    
    bby_json = products.to_json
    
    if callback
      content_type :js
      response = "#{callback}(#{bby_json})" 
    else
      content_type :json
      response = bby_json
    end
    response
  end
  
end