require 'spec_helper'

describe "Users" do
  describe "une inscription" do

    describe "ratée" do

      it "ne devrait pas créer un nouvel utilisateur" do
        lambda do
          visit signup_path
          fill_in "Name", :with => ""
          fill_in "eMail", :with => ""
          fill_in "Mot de passe", :with => ""
          fill_in "Confirmation mot de passe", :with => ""
          click_button
          response.should render_template('users/new')
          response.should have_selector("div#error_explanation")
        end.should_not change(User, :count)
      end
    end
    describe "réussie" do

      it "devrait créer un nouvel utilisateurr" do
        lambda do
          visit signup_path
          fill_in "Name", :with => "Example User"
          fill_in "eMail", :with => "user@example.com"
          fill_in "Mot de passe", :with => "foobar"
          fill_in "Confirmation mot de passe", :with => "foobar"
          click_button
          response.should have_selector("div.flash.success",
                                        :content => "Bienvenue")
          response.should render_template('users/show')
      end.should change(User, :count).by(1)
    end
  end

  describe "identification/déconnexion" do

    describe "l'échec" do
      it "ne devrait pas identifier l'utilisateur" do
        visit signin_path
        fill_in "eMail",    :with => ""
        fill_in "Mot de passe", :with => ""
        click_button
        response.should have_selector("div.flash.error", :content => "Invalid")
      end
    end

    describe "le succès" do
      it "devrait identifier un utilisateur puis le déconnecter" do
        user = Factory(:user)
        visit signin_path
        fill_in "eMail",    :with => user.email
        fill_in "Mot de passe", :with => user.password
        click_button
        controller.should be_signed_in
        click_link "Déconnexion"
        controller.should_not be_signed_in
      end
    end
  end
end
end
