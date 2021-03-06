Given(/^I want to edit a previously added pupil$/) do
  pupil_name = (0...8).map {(65 + rand(26)).chr}.join
  step "I am on the add pupil page"
  step "I submit the form with the name fields set as #{pupil_name}"
  step "the pupil details should be stored"
  @page = edit_pupil_page
  manage_pupil_page.find_pupil_row(pupil_name).edit_pupil_link.click
end

When(/^I update with valid pupil data$/) do
  @updated_upn = rand(2342344234)
  @updated_details_hash = {first_name: "Jimmy", middle_name: "Jim", last_name: "Jarooo", upn: @updated_upn, male: true, day: '16', month: '01', year: '1981'}
  @page.enter_details(@updated_details_hash)
  @page.save_changes.click
end

Then(/^this should be saved$/) do
  gender = @updated_details_hash[:male] ? 'M' : 'F'
  wait_until{!(MongoDbHelper.pupil_details(@updated_upn.to_s)).nil?}
  @stored_pupil_details = MongoDbHelper.pupil_details @updated_upn.to_s
  expect(@updated_details_hash[:first_name]).to eql @stored_pupil_details['foreName']
  expect(@updated_details_hash[:middle_name]).to eql @stored_pupil_details['middleNames']
  expect(@updated_details_hash[:last_name]).to eql @stored_pupil_details['lastName']
  expect(gender).to eql @stored_pupil_details['gender']
  expect(@updated_details_hash[:upn].to_s).to eql @stored_pupil_details['upn']
  expect(Time.parse(@updated_details_hash[:day]+ "-"+ @updated_details_hash[:month]+"-"+ @updated_details_hash[:year])).to eql @stored_pupil_details['dob']
  expect(@time_stored).to eql Helpers.time_to_nearest_hour(@stored_pupil_details['createdAt'])
  expect(@time_stored).to eql Helpers.time_to_nearest_hour(@stored_pupil_details['updatedAt'])
end


Then(/^I should see validation errors when i submit with the following names$/) do |table|
  table.raw.flatten.each do |value|
    @upn = rand(2342344234)
    @details_hash = {first_name: value, middle_name: value, last_name: value, upn: @upn, female: true, day: '18', month: '02', year: '1987'}
    @page.enter_details(@details_hash)
    @page.add_pupil.click unless @page == edit_pupil_page
    @page.save_changes.click if @page == edit_pupil_page
    @time_stored = Time.now.utc.strftime("%Y-%m-%d %H")
    expect(@page.errors).to have_first_name_required
    expect(@page.errors).to have_middle_name_required
    expect(@page.errors).to have_last_name_required
  end
end