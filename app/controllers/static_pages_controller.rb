class StaticPagesController < ApplicationController
  def home
    render 'home'
  end
  def property
    @data = { property_id: params[:id] }.to_json
    render 'property'
  end
  def login
    render 'login'
  end
  def signup
    render 'signup'
  end
  def edit
    render 'edit'
  end
end