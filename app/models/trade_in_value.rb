require 'open-uri'
class Hash
  def sorted_hash(&block)
    self.class[sort(&block)]   # Hash[ [[key1, value1], [key2, value2]] ]
  end
end
class TradeInValue < ActiveRecord::Base
  
  def self.retrieve(query,page)
    self.get_amazon(query,page)
  end
  
  private
  
  def self.get_amazon(query,page)
    req = AmazonProduct["us"]
  	req.configure do |c|
  	  c.key    = API_KEYS["amazon"]["key"]
  	  c.secret = API_KEYS["amazon"]["secret"]
  	  c.tag    = 'wefouadv-20'
  	end

  	req << {
  	  :operation       =>	'ItemSearch',
  	  :title           =>  query,
  	  :item_page       =>  page,
  	  :browse_node     =>  979418011,
  	  :search_index    =>  'VideoGames',
  	  :response_group  =>  ['ItemAttributes', 'Images']
  	}
  	
  	amazon = req.get
  	
  	if amazon.valid? && !amazon.has_errors? && amazon["TotalResults"][0].to_i > 0
    	next_page = amazon["TotalPages"][0].to_i > page.to_i ? page.to_i + 1 : false
      response = {:next_page => next_page, :products => []}
      upcs = []
    	amazon.each('Item') do |game|
        if game["ItemAttributes"]["IsEligibleForTradeIn"] == "1"
          upcs << game["ItemAttributes"]["UPC"]
          image = game['MediumImage'] ? game['MediumImage']['URL'] : "" #some products don't have images?
          response[:products] << {
            :upc            =>  game["ItemAttributes"]["UPC"],
            :image          =>  image,
            :title          =>  game['ItemAttributes']['Title'],
            :platform       =>  game['ItemAttributes']['Platform'],
            :trade_in_value =>  {
              :amazon       =>  {:value => currency(game["ItemAttributes"]["TradeInValue"]["Amount"].to_i / 100.0), :url => "https://www.amazon.com/gp/tradein/add-to-cart.html/ref=trade_new_dp_trade_btn?ie=UTF8&asin=#{game['ASIN']}"},
              :best_buy     =>  {:value => nil, :url => nil},
              :glyde        =>  {:value => nil, :url => nil}
          }}
          #raise response.inspect
        end
      end
      
      best_buy_skus = get_best_buy(upcs)
      best_buy_skus['products'].each do |game|
        response[:products].each do |r|
          if r[:upc] == game["upc"]
            r[:trade_in_value][:best_buy][:value] = currency(game["tradeInValue"])
            # we shouldn't return a url if the game isn't trade inable
            r[:trade_in_value][:best_buy][:url] = "http://www.bestbuytradein.com/bb/QuoteCalculatorVideoGames.cfm?kw=#{game["upc"]}&pf=all&af=9a029aae-d650-44f8-a1c7-c33aa7fd0e27"
            break
          end
        end 
      end
      
      response[:products].each do |game|
        game[:trade_in_value][:glyde] = get_glyde(game[:upc])
      end
    else
      response = false
    end
    
    response
    
  end

  def self.get_best_buy(upcs)
    bby = JSON.parse(Nokogiri::HTML(open("http://api.remix.bestbuy.com/v1/products(upc%20in(#{upcs.join(',')}))?format=json&apiKey=#{API_KEYS["best_buy"]["key"]}")))
  end
  
  def self.get_glyde(upc)
    glyde = JSON.parse(Nokogiri::HTML(open("http://api.glyde.com/price/upc/#{upc}?api_key=#{API_KEYS["glyde"]["key"]}&v=1&responseType=application/json")))
    	if glyde['is_sellable']
    		glyde_value = "#{currency(  (glyde['suggested_price']['cents'] * 0.88  - 125)  / 100.0 )}"
    		{:value => glyde_value, :url => "http://glyde.com/sell?hash=%21by%2Fproduct%2Flineup%2Fgames%2F#{glyde['glu_id']}#!show/product/#{glyde['glu_id']}"}
    	else
    	 {:value => nil, :url => nil}
    	end
  end
  

  def self.currency(number, opts = {})
    return if number.to_s.empty?
  
    unit      = opts[:unit]      || '$'
    precision = opts[:precision] || 2
    separator = opts[:separator] || ', '
  
    ret = "%s%.#{Integer(precision)}f" % [unit,number]
    parts = ret.split('.')
    parts[0].gsub!(/(\d)(?=(\d\d\d)+(?!\d))/, "\\1#{separator}")
    parts.join('.')
  end

  
end