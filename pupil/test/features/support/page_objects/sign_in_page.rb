class SignInPage < SitePrism::Page
  set_url '/sign-in'

  element :heading, '.heading-xlarge', text: "Multiplication tables check"
  section :phase_banner, PhaseBanner, '.js-content .phase-banner'

  element :welcome_message, '.lede', text: "To start your multiplication tables check, enter the school password and pupil PIN provided by your teacher, then click ‘Sign in’."

  element :logo, '.organisation-logo'
  element :first_letter, '#last-name'
  element :day, '#dob-day'
  element :month, '#dob-month'
  element :pin, '.pin-entry'
  element :school_pin, '#school-pin'
  element :pupil_pin, '#pupil-pin'
  element :sign_in_button, '.button-start'
  element :auto_complete_off, "form[autocomplete='off']"

  def login(pin_school, pin_pupil=nil)
    school_pin.set pin_school
    pupil_pin.set pin_pupil
  end

end
