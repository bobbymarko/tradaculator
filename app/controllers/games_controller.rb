class GamesController < ApplicationController
  respond_to :html, :json, :js
  caches_action :show, :expires_in => 30.minutes, :cache_path => Proc.new { |c|
      "#{Rails.env} #{c.params} #{c.request.xml_http_request?}"
  }, :unless => Proc.new { |c|
    c.send(:current_user)
  }
  
  def show
    # expires_in 30.minutes, :public => true
    @game = Game.find_by_upc(params[:upc])
    @vendors = Vendor.all
    @top_value = @game.values.top_current_value

    # set up variables to track most recent value
    current_amazon_value = false
    current_best_buy_value = false
    current_glyde_value = false
    
    dataset_length = 150

    @amazon_values = []
    @game.values.where(:vendor=>'amazon').limit(dataset_length).each_with_index do |v,i|
      @amazon_values << "[#{v.created_at.to_f.to_i * 1000},#{v.value_as_decimal}]"
      current_amazon_value = v.value if i == 0 # first value is highest
    end

    @best_buy_values = []
    @game.values.where(:vendor=>'best_buy').limit(dataset_length).each_with_index do |v,i|
      @best_buy_values << "[#{v.created_at.to_f.to_i * 1000},#{v.value_as_decimal}]"
      current_best_buy_value = v.value if i == 0 # first value is highest
    end

    @glyde_values = []
    @game.values.where(:vendor=>'glyde').limit(dataset_length).each_with_index do |v,i|
      @glyde_values << "[#{v.created_at.to_f.to_i * 1000},#{v.value_as_decimal}]"
      current_glyde_value = v.value if i == 0 # first value is highest
    end
    
    #collect and sort values
    @top_values = {
      :amazon => current_amazon_value,
      :best_buy => current_best_buy_value,
      :glyde => current_glyde_value
    }.reject{ |vendor, value| value == false }.sort_by { |vendor, value| -value }
    
    if request.xhr?
      render "_shutter", :layout => false
      return
    else
      respond_with(@game)
    end
  end
end
