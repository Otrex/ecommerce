const nock = require('nock');

exports.nockFlutterWaveAccountResolveEndpoint = (name) => {
  nock('https://api.flutterwave.com')
    .defaultReplyHeaders({
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
    })
    .post(/accounts\/resolve/)
    .reply(200, {
      status: 'success',
      message: 'Account details fetched',
      data: {
        account_number: '3089273822',
        account_name: name,
      },
    });
};

exports.nockPayStackBvnResolveEndpoint = () => {
  nock('https://api.paystack.co')
    .defaultReplyHeaders({
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
    })
    .post(/bvn/, (body) => !!body)
    .reply(200, {
      status: true,
      message: 'BVN lookup successful',
      data: {
        bvn: '22345543174',
        is_blacklisted: false,
        account_number: true,
        first_name: true,
        last_name: true,
      },
      meta: { calls_this_month: 2, free_calls_left: 8 },
    });
};

exports.nockPayStacInitiateResolveEndpoint = () => {
  nock('https://api.paystack.co')
    .defaultReplyHeaders({
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
    })
    .post(/initialize/, (body) => !!body)
    .reply(200, {
      status: true,
      message: 'Transaction initiated successful',
      data: {
        bvn: '22345543174',
        is_blacklisted: false,
        authorization_code: 'erfvyeriberivbreibverv',
        access_code: 'cevrevrevev',
        last_name: true,
      },
      meta: { transactionId: 0 },
    });
};

exports.nockPaystackInitiateTransactionEndpoint = async (
  server,
  trx,
) => {
  nock('https://api.paystack.co')
    .defaultReplyHeaders({
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
    })
    .post('/transaction/initialize', (body) => !!body)
    .reply(200, {
      status: true,
      message: 'Authorization URL created',
      data: {
        authorization_url: 'https://checkout.paystack.com/0peioxfhpn',
        access_code: '0peioxfhpn',
        reference: '7PVGX8MEk85tgeEpVDtD',
      },
    });

  if (server) {
    await server.post('/paystack/webhook').send({
      status: 'success',
      amount: 5000,
      metadata: {
        transactionId: trx?.id,
      },
    });
  }
};

exports.nockPayStackVerifyAccountNumberResolveEndpoint = () => {
  nock('https://api.paystack.co')
    .defaultReplyHeaders({
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
    })
    .get(/bank\/resolve/, (body) => !!body)
    .reply(200, {
      status: true,
      message: 'Bank Resolved!!',
      data: {
        account_number: '1111111122',
        account_name: 'Ben Ben',
      },
      meta: { transactionId: 0 },
    });
};

exports.nockPayStackAuthorizationChargeResolveEndpoint = () => {
  nock('https://api.paystack.co')
    .defaultReplyHeaders({
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
    })
    .post('/transaction/charge_authorization', (body) => !!body)
    .reply(200, {
      status: true,
      message: 'Transaction initiated successful',
      data: {
        amount: 20000,
        currency: 'NG',
        transaction_date: new Date(),
        status: 'success',
        reference: 'vrtvrvrtvrvrbvrbr',
        authorization: {
          authorization_code: 'vrevrevrevrwvw',
          bin: '1233',
        },
        customer: {},
      },
      meta: { transactionId: 0 },
    });
};