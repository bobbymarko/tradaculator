class TradeInValuesController < ApplicationController
  respond_to :html, :json, :js
  
  def index
    expires_in 30.minutes, :public => true
    if params[:query]
      redirect_to trade_in_values_path( params[:query]) #make pretty urls
    else
    	@query = ''
    	@page = 1
      @results = TradeInValue.retrieve(@query,@page)
      respond_with(@results)
    end
  end
  
  def show
    expires_in 30.minutes, :public => true
    @query = params[:query] || ''
  	@page = params[:page] || 1
    @results = TradeInValue.retrieve(@query,@page)
    # logger.info("NEXT PAGE = #{@results[:next_page]}");
    respond_with(@results) do |format|
        format.html{
          render "index"
        }
    end
  end
end
