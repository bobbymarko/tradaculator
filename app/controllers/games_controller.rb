class GamesController < ApplicationController
  respond_to :html, :json, :js
  caches_action :show, :expires_in => 2.minutes, :cache_path => Proc.new { |c|
    if current_user
      # "#{Rails.env} #{c.params} #{c.request.xml_http_request?} #{current_user.id}"
    else
      "#{Rails.env} #{c.params} #{c.request.xml_http_request?}"
    end
  }
  
  def show
    expires_in 30.minutes, :public => true
    @game = Game.find_by_upc(params[:upc])
    @vendors = Vendor.all
    @top_value = @game.values.top_current_value
    
    @amazon_values = []
    @game.values.where(:vendor=>'amazon').group("date(created_at)").each do |v|
      @amazon_values << "[#{v.created_at.to_f.to_i * 1000},#{v.value_as_decimal}]"
    end

    @best_buy_values = []
    @game.values.where(:vendor=>'best_buy').group("date(created_at)").each do |v|
      @best_buy_values << "[#{v.created_at.to_f.to_i * 1000},#{v.value_as_decimal}]"
    end

    @glyde_values = []
    @game.values.where(:vendor=>'glyde').group("date(created_at)").each do |v|
      @glyde_values << "[#{v.created_at.to_f.to_i * 1000},#{v.value_as_decimal}]"
    end
    
    if request.xhr?
      render "_shutter", :layout => false
      return
    else
      respond_with(@game)
    end
  end
end
