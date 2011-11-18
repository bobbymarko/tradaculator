require 'open-uri'
class TradeInValue

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
  	  #Rails.logger.info("Total pages = #{amazon["TotalPages"][0].to_i}")
    	next_page = amazon["TotalPages"][0].to_i > page.to_i ? page.to_i + 1 : false
      response = {:next_page => next_page, :products => []}
      upcs = []
    	amazon.each('Item') do |game|
        if game["ItemAttributes"]["IsEligibleForTradeIn"] == "1"
          upcs << game["ItemAttributes"]["UPC"]
          vendor = "amazon"
          upc = game["ItemAttributes"]["UPC"]
          image = game['MediumImage'] ? game['MediumImage']['URL'] : nil #some products don't have images?
          large_image = game['LargeImage'] ? game['LargeImage']['URL'] : nil
          small_image = game['SmallImage'] ? game['SmallImage']['URL'] : nil
          title = game['ItemAttributes']['Title']
          platform = game['ItemAttributes']['Platform']
          value = game["ItemAttributes"]["TradeInValue"] ? game["ItemAttributes"]["TradeInValue"]["Amount"].to_i : nil

          url = value ? "https://www.amazon.com/gp/tradein/add-to-cart.html/ref=trade_new_dp_trade_btn?ie=UTF8&asin=#{game['ASIN']}" : nil
          response[:products] << {
            :upc            =>  upc,
            :image          =>  image,
            :title          =>  title,
            :platform       =>  platform,
            :trade_in_value =>  {
              :amazon       =>  {:value => value, :url => url},
              :best_buy     =>  {:value => nil, :url => nil},
              :glyde        =>  {:value => nil, :url => nil}
          }}
          
          game_record = Game.find_or_create_by_upc(upc)
          game_record.image = image
          game_record.large_image = large_image
          game_record.small_image = small_image
          game_record.title = title
          game_record.platform = platform
          game_record.amazon_id = game['ASIN']
          if value
            unless game_record.values.where(:vendor => vendor, :value => value).recent.exists?
              game_record.values.build(:vendor => vendor, :value => value )
            end
          end
          game_record.save
          #raise response.inspect
        end
      end
      
      best_buy_skus = get_best_buy(upcs)
      best_buy_skus['products'].each do |game|
        response[:products].each do |r|
          if game["tradeInValue"] && r[:upc] == game["upc"]
            value = game["tradeInValue"] * 100
            r[:trade_in_value][:best_buy][:value] = value
            #TODO we shouldn't return a url if the game isn't trade inable
            r[:trade_in_value][:best_buy][:url] = "http://www.bestbuytradein.com/bb/QuoteCalculatorVideoGames.cfm?kw=#{game["upc"]}&pf=all&af=9a029aae-d650-44f8-a1c7-c33aa7fd0e27"
            
            if value
              vendor = "best_buy"
              game_record = Game.where(:upc => game["upc"]).first
              game_record.best_buy_id = game["upc"]
              unless game_record.values.where(:vendor => vendor, :value => value).recent.exists?
                game_record.values.build(:vendor => vendor, :value => value)
              end
              game_record.save
            end
            
            break
          end
        end 
      end
      
      response[:products].each do |game|
        game[:trade_in_value][:glyde] = get_glyde(game[:upc])
        value = game[:trade_in_value][:glyde][:value]
        if value
          vendor = "glyde"
          game_record = Game.where(:upc => game[:upc]).first
          game_record.glyde_id = game[:trade_in_value][:glyde][:glyde_id]
          unless game_record.values.where(:vendor => vendor, :value => value).recent.exists?
            game_record.values.build(:vendor => vendor, :value => value)
          end
          game_record.save
        end
        
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
    glyde = JSON.parse(Nokogiri::HTML(open("http://api.glyde.com/price/upc/#{upc}?api_key=#{API_KEYS["glyde"]["key"]}&v=1&responseType=application/json"))) rescue false
    	if glyde && glyde['is_sellable']
    		glyde_value = (glyde['suggested_price']['cents'] * 0.88  - 125).to_i rescue nil
    		{:value => glyde_value, :url => "http://glyde.com/sell?hash=%21by%2Fproduct%2Flineup%2Fgames%2F#{glyde['glu_id']}#!show/product/#{glyde['glu_id']}", :glyde_id => glyde['glu_id']}
    	else
    	 {:value => nil, :url => nil, :glyde_id => nil}
    	end
  end
  
end