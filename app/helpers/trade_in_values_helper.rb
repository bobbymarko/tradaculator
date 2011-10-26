module TradeInValuesHelper
  def next_page(query,page)
    if page
      if query.blank?
        logger.info('no query')
        link_to "Load More", trade_in_values_no_query_path(page), {:id=>"load_more"}
      else
        link_to "Load More", trade_in_values_path(query,page), {:id=>"load_more"}
      end
    end
  end
  
  def sort_values(values)
    sorted = values.sorted_hash { |a, b|
      game_a = a[1][:value].to_i rescue 0
      game_b = b[1][:value].to_i rescue 0
      game_b <=> game_a
    }
  end
end
