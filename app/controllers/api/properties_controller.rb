class Api::PropertiesController < ApplicationController
  skip_before_action :authenticate_user!
  before_action :set_page

  def index
    properties = Property.page(@page).per(50).available
    render json: { 
      properties: properties, 
      total_pages: properties.total_pages
    }
  end

  def city
    properties = Property.page(@page).by_city(params[:city])
    total_pages = properties.total_pages
    render json: { properties: properties, total_pages: total_pages }
  end

  private
    def set_page
      @page = params[:page] || 1
    end

end
