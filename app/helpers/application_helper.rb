module ApplicationHelper
  def conditional_html( lang = "en", &block )
    haml_concat Haml::Util::html_safe <<-"HTML".gsub( /^\s+/, '' )
      <!--[if lt IE 7 ]>              <html lang="#{lang}" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
      <!--[if IE 7 ]>                 <html lang="#{lang}" class="no-js lt-ie9 lt-ie8"> <![endif]-->
      <!--[if IE 8 ]>                 <html lang="#{lang}" class="no-js lt-ie9"> <![endif]-->
      <!--[if IE 9 ]>                 <html lang="#{lang}" class="no-js ie9"> <![endif]-->
      <!--[if (gte IE 9)|!(IE)]><!--> <html lang="#{lang}" class="no-js"> <!--<![endif]-->      
    HTML
    haml_concat capture( &block ) << Haml::Util::html_safe( "\n</html>" ) if block_given?
  end
  
  # Allow variables in localized files
  def self.fill_in(template, data)
    template.gsub(/\{\{(\w+)\}\}/) { data[$1.to_sym] }
  end
  
  def fill_in(template, data)
    template.gsub(/\{\{(\w+)\}\}/) { data[$1.to_sym] }
  end
end
