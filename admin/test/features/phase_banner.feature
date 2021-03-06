@poltergeist
Feature:
  As a member of the development team
  I want users to be aware which phase the application is in and also offer feedback
  So they understand that the application is work in progess

  Scenario: Development phase and the feedback link are displayed at the top of the sign in page
    Given I am on the sign in page
    Then I should see that we are in the beta development phase on the sign_in page
    And I should see a new tab open when i want to provide feedback link from the sign_in page

  Scenario: Development phase and the feedback link are displayed at the top of the sign in failure page
    Given I am on the sign in failure page
    Then I should see that we are in the beta development phase on the sign_in_failure page
    And I should see a new tab open when i want to provide feedback link from the sign_in_failure page

  @sign_in
  Scenario: Development phase and the feedback link are displayed at the top of the school landing page
    Given I am on the school landing page
    Then I should see that we are in the beta development phase on the school_landing page
    And I should see a new tab open when i want to provide feedback link from the school_landing page

  Scenario: Development phase and the feedback link are displayed at the top of the manage pupil page
    Given I am on the manage pupil page
    Then I should see that we are in the beta development phase on the manage_pupil page
    And I should see a new tab open when i want to provide feedback link from the manage_pupil page

  Scenario: Development phase and the feedback link are displayed at the top of the add pupil page
    Given I am on the add pupil page
    Then I should see that we are in the beta development phase on the add_pupil page
    And I should see a new tab open when i want to provide feedback link from the add_pupil page

  Scenario: Development phase and the feedback link are displayed at the top of the edit pupil page
    Given I want to edit a previously added pupil
    Then I should see that we are in the beta development phase on the edit_pupil page
    And I should see a new tab open when i want to provide feedback link from the edit_pupil page

  Scenario: Development phase and the feedback link are displayed at the top of the manage check forms page
    Given I am on the manage check forms page
    Then I should see that we are in the beta development phase on the manage_check_forms page
    And I should see a new tab open when i want to provide feedback link from the manage_check_forms page

  Scenario: Development phase and the feedback link are displayed at the top of the view form page
    Given I have uploaded a check form
    When I choose to preview the check form questions
    Then I should see that we are in the beta development phase on the view_form page
    And I should see a new tab open when i want to provide feedback link from the view_form page

  Scenario: Development phase and the feedback link are displayed at the top of the choose check window page
    Given I am on the assign check window page
    Then I should see that we are in the beta development phase on the choose_check_window page
    And I should see a new tab open when i want to provide feedback link from the choose_check_window page

  Scenario: Development phase and the feedback link are displayed at the top of the profile page
    Given I am on the profile page
    Then I should see that we are in the beta development phase on the profile page
    And I should see a new tab open when i want to provide feedback link from the profile page