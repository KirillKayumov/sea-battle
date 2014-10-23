class Users::SessionsController < Devise::SessionsController
# before_filter :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  def new
    super
  end

  # POST /resource/sign_in
  def create
    user = User.find_by(user_params[:email])
    if user && user.authenticate(user_params[:password])
      respond_to do |format|
        format.json { render json: user }
      end
    else
      super
    end
  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # You can put the params you want to permit in the empty array.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.for(:sign_in) << :attribute
  # end

  private

  def user_params
    params.require(:user).permit(:email, :password)
  end
end
