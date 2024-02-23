const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;

const stripe = require('stripe')(STRIPE_SECRET_KEY)

const loadPaymentPage = async (req, res) => {
    try {

        res.render('payment_page', {
            key: STRIPE_PUBLISHABLE_KEY,
            amount: 25
        })
    } catch (error) {
        console.log(error.message);
    }
}

const payment = async (req, res) => {
    try {
        stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: 'Saleheen',
            address: {
                line1: '115, somehing something',
                postal_code: '281001',
                city: 'Boo',
                state: 'Pew pew',
                country: 'Bangladesh',
            }
        })
            .then((customer) => {
                return stripe.charges.create({
                    amount: req.body.amount,     // amount will be amount*100
                    description: req.body.productName,
                    currency: 'USD',
                    customer: customer.id
                });
            })
            .then((charge) => {
                res.send("Payment successfull");
            })
            .catch((err) => {
                res.send("Something went wrong");
                console.log(err);
            });


    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    loadPaymentPage,
    payment,
}