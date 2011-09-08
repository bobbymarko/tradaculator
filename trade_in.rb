require 'sinatra'
require 'remixr'
require "amazon_product"
require 'json'
require 'nokogiri'
require 'rack/cache'
require './helpers.rb'

class TradeIn < Sinatra::Base
  set :root, File.expand_path("#{File.dirname(__FILE__)}/")
  enable :static
  
  #use Rack::Cache,
#	:verbose => true,
#	:metastore => 'file:/var/cache/rack/meta',
#	:entitystore => 'file:/var/cache/rack/body'
  
#    set :sessions, true
#    set :foo, 'bar'
  get '/' do
  	 File.read(File.join('public', 'index.html'))  
  end
  
  get '/values/?:search?/?:page?' do
  	query = params[:search]
  	page = params[:page] || 1
  	
  	cache_control :public, :max_age => 8 * 60 * 60 #8 hours
  	
    callback = params[:callback] # jsonp
    
    Remixr.api_key = ENV['BBY_KEY']
    bby = Remixr::Client.new
    
    search_parameters = {:type => 'game', :tradeInValue => {'$gt' => 0}, :active => *}
    search_parameters['search'] = query if query
    
    products = bby.products(search_parameters).fetch(:page => page, :show => 'tradeInValue,image,name,upc', :sort => {'releaseDate'=>'desc'})
.products
    
    upcs = []
    products.each_with_index do |product,index|
    	upcs << product.upc
    	#reorganize trade in values
    	best_buy_trade_in_value = product.tradeInValue rescue ''
    	products[index]['tradeInValue'] = {
    	  :best_buy => {
    	    :value => currency(best_buy_trade_in_value),
    	    :url => "http://www.bestbuytradein.com/bb/QuoteCalculatorVideoGames.cfm?kw=#{product.upc}&pf=all"
    	   },
    	  :amazon => {
    	    :value => '',
    	    :url => ''
    	   },
    	   :glyde => {
    	   	:value => '',
    	   	:url => ''
    	   }
    	}
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
    	glyde = JSON.parse(Nokogiri::HTML(open("http://api.glyde.com/price/upc/#{upc}?api_key=ENV['GLYDE_KEY']&v=1&responseType=application/json")))
    	if glyde['is_sellable'] 
    		products[index]['tradeInValue']['glyde'] = {:value => "#{currency(glyde['suggested_price']['cents']/100.0)}", :url => "http://glyde.com/sell?hash=%21by%2Fproduct%2Flineup%2Fgames%2F#{glyde['glu_id']}#!by/product/lineup/games/#{glyde['glu_id']}"}
    	end
    	
	    amazon.each('Item') do |item|
	    	if upc == item["ItemAttributes"]["UPC"]
	    		if item["ItemAttributes"]["IsEligibleForTradeIn"] == "1"
	    			amazon_trade_in_value = item["ItemAttributes"]["TradeInValue"]["Amount"].to_i
	    			products[index]['tradeInValue']['amazon'] = {:value => currency(amazon_trade_in_value / 100.0), :url => "https://www.amazon.com/gp/tradein/add-to-cart.html/ref=trade_new_dp_trade_btn?ie=UTF8&asin=#{item['ASIN']}"}
	    		end
	    		
	    		#puts amazon_trade_in_value
	    		
	    		
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