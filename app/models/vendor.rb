class Vendor
  def self.all
    {
      :amazon => {
        :name => "Amazon",
        :permalink => "amazon",
        :conditions => "<strong>Price payed in Amazon Gift Cards.</strong> Must include the video game (plays perfectly), original manufacturer packaging and all original elements. Can show wear from normal use. Disc may have light scratches. May have personal markings.".html_safe,
        :url => "http://www.amazon.com/s/?rh=i%3Avideogames-tradein%2Ck%3AB00503E8S2&keywords={{id}}&tag=wefouadv-20"
      },
      :best_buy => {
        :name => "Best Buy",
        :permalink => "best_buy",
        :conditions => "<strong>Price payed in Best Buy Gift Cards.</strong> Discs have no chips/cracks and do not have any writing or other personalization on them.".html_safe,
        :url => "http://www.bestbuy.com/site/olspage.jsp?_dyncharset=ISO-8859-1&_dynSessConf=-7830272557940360544&id=pcat17097&searchCatId=pcat17097&type=page&st={{id}}&cp=1&nrp=20&sp=buyprice%3Adesc&sc=gameToySP&newsearch=newsearch&platform="
      },
      :glyde => {
        :name => "Glyde",
        :permalink => "glyde",
        :conditions => "<strong>Price payed in Cash.</strong> Disc plays perfectly. May have minor scratches. Case has no more than a few minor scratches. No damage to game instructions. No personal markings. Not a previous rental.".html_safe,
        :url => "http://glyde.com/sell?hash=%21by%2Fproduct%2Flineup%2Fgames%2F{{id}}#!show/product/{{id}}"
      }
    }
  end
end