class GamesController < ApplicationController
  respond_to :html, :json, :js
  caches_action :show, :expires_in => 2.minutes, :cache_path => Proc.new { |c|
    "#{Rails.env} #{c.params} #{c.request.xml_http_request?}"
  }
  
  def show
    expires_in 30.minutes, :public => true
    @game = Game.find_by_upc(params[:upc])
    @vendors = Vendor.all
    
    respond_with @game
  end
end
