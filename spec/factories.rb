# En utilisant le symbole ':user', nous faisons que
# Factory Girl simule un modèle User.
Factory.define :user do |user|
  user.nom		             "Felix Lambert"
  user.email                 "lambertfelix8@gmail.com"
  user.password              "foobar"
  user.password_confirmation "foobar"
end

Factory.sequence :email do |n|
  "person-#{n}@gmail.com"
end

Factory.define :micropost do |micropost|
  micropost.content "Foo bar"
  micropost.association :user
end