class RelatedItem
  def self.find_by_amazon_id(amazon_id)
    req = AmazonProduct["us"]
  	req.configure do |c|
  	  c.key    = API_KEYS["amazon"]["key"]
  	  c.secret = API_KEYS["amazon"]["secret"]
  	  c.tag    = 'wefouadv-20'
  	end

  	req << {
  	  :operation       =>	'SimilarityLookup',
      :item_id         => amazon_id,
  	  :response_group  =>  ['Medium', 'Images']
  	}
  	
  	amazon = req.get
  	
  	if amazon.valid? && !amazon.has_errors?
  	  amazon["Item"]
    else
      false
  	end
  end
end