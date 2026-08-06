const paypal = require('paypal-rest-sdk');

paypal.configure({
    mode : 'sandbox',
    client_id  : 'BAAqAtGUzEM8zXL5Zs2QLjKY_OppVCb2ldO561pSANMsJifxXgKf2V0RYlN_ajdlDFkl_wCtKs7Nkt2jHI',
    client_secret : 'EAknwK6ppHMOjX3wH-7iOsi_V8s-izynZ4OIx9Zwnuv1FHx47qo6SUTCteehPmBn9ayA0614ZOGSHR7p'
});

module.exports = paypal;