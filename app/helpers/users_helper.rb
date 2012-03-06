module UsersHelper
  # platform - xbox or playstation
  # type - body or pic
  # size - small or large (pic type only)
  def avatar_image_tag(options = {})
    defaults = {:size => 'small', :type => 'pic', :platform => 'xbox'}
    options = defaults.merge(options)
    
    username = current_user.xbox_live_name
    if options[:platform] == 'xbox'
      if options[:type] == 'pic'
        if options[:size] == 'small'
          image_tag "http://avatar.xboxlive.com/avatar/#{username}/avatarpic-s.png"
        elsif options[:size] == 'large'
          image_tag "http://avatar.xboxlive.com/avatar/#{username}/avatarpic-l.png"
        end
      elsif options[:type] == 'body'
        image_tag "http://avatar.xboxlive.com/avatar/#{username}/avatar-body.png"
      end
    elsif options[:platform] == 'playstation'
    end
    
  end
end