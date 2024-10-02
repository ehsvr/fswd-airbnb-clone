module Api
    class PropertiesController < ApplicationController
      before_action :set_property, only: [:show, :edit, :update, :destroy]

      def new
        @property = Property.new
      end

      def create
        @property = current_user.properties.new(property_params)
        if @property.save
          @property.images.attach(params[:property][:images]) if params[:property][:images].present?
          render json: @property, status: :created
        else
          render json: { errors: @property.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def edit
        # Renders the form to edit an existing property
      end
  
      def update
        if @property.update(property_params)
          redirect_to @property, notice: 'Property was successfully updated.'
        else
          render :edit
        end
      end

      def index
        @properties = Property.order(created_at: :desc).page(params[:page]).per(6)
        return render json: { error: 'not_found' }, status: :not_found if !@properties
  
        render 'api/properties/index', status: :ok
      end
  
      def show
        @property = Property.find_by(id: params[:id])
        return render json: { error: 'not_found' }, status: :not_found if !@property

        render 'api/properties/show', status: :ok
      end

      private

      def set_property
        @property = Property.find(params[:id])
      end

      def property_params
        params.require(:property).permit(:title, :description, :price, images: [])
    end
  end
end
