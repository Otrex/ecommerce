const { connect } = require("../../src/database");
const supertest = require("supertest");
const app = require("../../src/app");
const faker = require("faker");
const server = supertest(app);
const { getToken } = require("../utils");
const { seed } = require("../../src/scripts/seeds")

const userClient = {
  "email": faker.internet.email(),
  "password": faker.internet.password(),
}
beforeAll(async () => {
  await connect()
})

describe("Registration", () => {
  it ("register client", async () => {
    const res = await server.post("/v1/auth/register").send({
      ...userClient,
      "firstName": faker.name.firstName(),
      "lastName": faker.name.lastName(),
      "phoneNumber": faker.phone.phoneNumber(),
      "type": "client"
    })

    expect(res.status).toEqual(200)
    userClient.accountId = res.body.data._id;
  })
})

describe("Email verification", () => {
  it ("email verify client", async () => {
    const { token, accountId } = await getToken(userClient);
    const res = await server.post("/v1/auth/verify-email").send({
      token,
      accountId
    });
    expect(res.status).toEqual(200)
  })
})


describe("Login", () => {
  it ("login client", async () => {
    const res = await server.post("/v1/auth/login").send({
      ...userClient,
      "type": "client"
    })

    expect(res.status).toEqual(200);
    console.log(res.body);
    // userClient.accountId = res.body.data._id;
  })
})

describe("Forgot Password", () => {
  it ("forgot password client", async () => {
    const res = await server.post("/v1/auth/forgot-password").send({
      ...userClient,
      "type": "client"
    })

    expect(res.status).toEqual(200);
    console.log(res.body);
    userClient.resetToken = res.body.token;
  })
})

describe("Reset Password", () => {
  it ("reset password client", async () => {
    const password = "12345rrr"
    const res = await server.post("/v1/auth/reset-password").send({
      token: userClient.resetToken,
      confirmPassword: password,
      password,
    })

    expect(res.status).toEqual(200);
    console.log(res.body);
    // userClient.accountId = res.body.data._id;
  })
})