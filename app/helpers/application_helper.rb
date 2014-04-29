module ApplicationHelper


	def logo
    	image_tag("logo.png", :alt => "Application Exemple", :class => "round")
  	end

  # Retourner un titre basé sur la page.
  def titre
    base_titre = "Indigo - Le Blog"
    if @titre.nil?
      base_titre
    else
      "#{base_titre} | #{@titre}"
    end
  end
end
