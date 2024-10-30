module Api
  class BookingsController < ApplicationController
    before_action :find_user, only: [:per_user]

    def create
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { error: 'user not logged in' }, status: :unauthorized unless session
      property = Property.find_by(id: params[:booking][:property_id])
      return render json: { error: 'cannot find property' }, status: :not_found unless property
      
      @booking = Booking.new(
        user_id: session.user.id,
        property_id: property.id,
        start_date: params[:booking][:start_date],
        end_date: params[:booking][:end_date]
      )

      if @booking.save
        render 'api/bookings/create', status: :created
      else
        render json: { error: 'Booking creation failed' }, status: :unprocessable_entity
      end
    end

    def get_property_bookings
      property = Property.find_by(id: params[:id])
      return render json: { error: 'cannot find property' }, status: :not_found unless property
      
      @bookings = property.bookings.where("end_date > ?", Date.today)
      render 'api/bookings/index'
    end

    def success
      @booking = Booking.find_by(id: params[:id])
      render plain: 'Booking not found', status: :not_found unless @booking
    end      

    def per_user
      user = User.find(params[:user_id])
      if user
        bookings = user.bookings.includes(:property).map do |booking|
          {
            id: booking.id,
            property_id: booking.property_id,
            start_date: booking.start_date,
            end_date: booking.end_date,
            paid: booking.paid,
            property: {
              title: booking.property&.title,
              city: booking.property&.city,
              price_per_night: booking.property&.price_per_night
            }
          }
        end
        render json: { bookings: bookings }, status: :ok
      else
        render json: { error: 'User not found' }, status: :not_found
      end
    end
    

    private

    def find_user
      @user = User.find(params[:user_id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'User not found' }, status: :not_found
    end

    def booking_params
      params.require(:booking).permit(:property_id, :start_date, :end_date)
    end
  end
end
