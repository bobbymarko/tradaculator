class Vendor
  def self.all
    [
      {
        :name => "Amazon",
        :permalink => "amazon",
        :conditions => "<strong>Price payed in Amazon Gift Cards.</strong> Must include the video game (plays perfectly), original manufacturer packaging and all original elements. Can show wear from normal use. Disc may have light scratches. May have personal markings.".html_safe,
        :url => "http://www.amazon.com/s/?rh=i%3Avideogames-tradein%2Ck%3AB00503E8S2&keywords={{id}}&tag=wefouadv-20"
      },
      {
        :name => "Best Buy",
        :permalink => "best_buy",
        :conditions => "<strong>Price payed in Best Buy Gift Cards.</strong> Discs have no chips/cracks and do not have any writing or other personalization on them.".html_safe,
        :url => "http://www.bestbuytradein.com/bb/QuoteCalculatorVideoGames.cfm?kw={{id}}&pf=all&af=9a029aae-d650-44f8-a1c7-c33aa7fd0e27"
      },
      {
        :name => "Glyde",
        :permalink => "glyde",
        :conditions => "<strong>Price payed in Cash.</strong> Disc plays perfectly. May have minor scratches. Case has no more than a few minor scratches. No damage to game instructions. No personal markings. Not a previous rental.".html_safe,
        :url => "http://glyde.com/sell?hash=%21by%2Fproduct%2Flineup%2Fgames%2F{{id}}#!show/product/{{id}}"
      }
    ]
  end
end