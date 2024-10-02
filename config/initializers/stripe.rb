Rails.configuration.stripe = {
    :publishable_key => 'pk_test_51Q2HjKEHkn2ZS6oNGm8H0xNkSp5cULxZCGIQxkjM2cmJf4yMiXZz8dMrlQg9Pa166Cde3z6ad9xD19Eg7gMN3OWW00DVad7zLF',
    :secret_key => 'sk_test_51Q2HjKEHkn2ZS6oNbFaeNiKI7itxHEDKPnlsFpdOE2nLaevtQnaUv3vvPatmYfCk3SFwoyVip7NkJGHsNYHRw6LJ00Ze6uIWY4'
}
Stripe.api_key = Rails.configuration.stripe[:secret_key]