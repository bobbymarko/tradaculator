class UsersController < ApplicationController
  respond_to :html, :json, :js
  
  def index
    @users = User.select('username, xbox_live_name').all
  end
  
  def show
    @user = User.find_by_username(params[:username])    
    @games = @user.games.order("library_items.created_at DESC")
    @library_value = 0
    @vendor = params['vendor'] || 'amazon'
    @games.each do |game|
      @library_value += game.values.top_current_value_from(@vendor).value rescue 0
    end

    respond_with(@games)
  end
end