const faker = require('faker');

exports.businessAccountGenerator = (userBusiness) => ({
  sellerDetails: {
    ...(userBusiness
      ? userBusiness
      : {
          email: faker.internet.email(),
          password: faker.internet.password(),
        }),
    phoneNumber: '+2345678765456',
    fullName: [faker.name.firstName(), faker.name.lastName()].join(
      ' '
    ),
  },
  businessDetails: {
    type: faker.company.catchPhrase(),
    name: faker.company.catchPhrase(),
    cacNumber: faker.company.catchPhrase(),
    state: faker.address.state(),
    lga: faker.address.state(),
    address: {
      lat: 324.43,
      long: 2424.42,
      label: faker.address.country(),
    },
  },
  paymentDetails: {
    accountNumber: '456789000987',
    bank: faker.company.catchPhrase(),
    accountName: [faker.name.firstName(), faker.name.lastName()].join(
      ' '
    ),
    payoutFrequency: 5,
  },
});
