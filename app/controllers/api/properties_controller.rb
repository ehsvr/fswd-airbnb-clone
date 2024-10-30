module Api
  class PropertiesController < ApplicationController
    before_action :set_property, only: [:show, :edit, :update, :destroy]

    def new
      @property = Property.new
    end

    def create
      user = User.find(current_user)
      @property = user.properties.new(property_params)
      if @property.save
        @property.images.attach(params[:property][:images]) if params[:property][:images].present?
        render json: @property, status: :created
      else
        render json: { errors: @property.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def edit
    end

    def update
      if @property.update(property_params)
        render json: @property, status: :ok
      else
        render json: { errors: @property.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      if @property.destroy
        render json: { message: 'Property successfully deleted' }, status: :ok
      else
        render json: { error: 'Failed to delete property' }, status: :unprocessable_entity
      end
    end

    def index
      @properties = Property.order(created_at: :desc).page(params[:page]).per(6)
      return render json: { error: 'not_found' }, status: :not_found if @properties.empty?

      render 'api/properties/index', status: :ok
    end

    def show
      return render json: { error: 'not_found' }, status: :not_found unless @property

      render 'api/properties/show', status: :ok
    end

    private

    def set_property
  @property = Property.find_by(id: params[:id])
  if @property.nil?
    redirect_to properties_path, alert: "Property not found"
  end
end

    def property_params
      params.require(:property).permit(
        :title,
        :description,
        :city,
        :country,
        :property_type,
        :price_per_night,
        :max_guests,
        :bedrooms,
        :beds,
        :baths,
        images: []
      )
    end
  end
end
