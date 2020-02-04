const request = require("supertest");
const expect = require("chai").expect;
// const test = require("ava");
// const { MongoMemoryServer } = require("mongodb-memory-server");
// const mongoose = require("mongoose");
// const User = require("../models/User");
// const mongodb = new MongoMemoryServer();

//User id with regex /^\/user\/[0-9a-fA-F]{24}$/
// test.beforeEach(async () => {
//   const uri = await mongodb.getConnectionString();
//   await mongoose.connect(uri, { useMongoClient: true });
// });
describe("Login test", () => {
  it("should redirect to /catalog", done => {
    request("http://localhost:3000")
      .post("/catalog/login")
      .send({ username: "username", password: "123456" })
      .expect("Location", "/catalog")
      .end(done);
  });

  it("Login page ping", () => {
    request("http://localhost:3000/catalog/login", done => {
      expect(200, done);
    });
  });
  it("logout", done => {
    request("http://localhost:3000")
      .get("/catalog/logout")
      .expect("Location", "/")
      .expect(302, done);
  });
});

///////////////////////////////////////////////////////////////////

describe("Profile test + Message test + like test", () => {
  it("login redirect to /catalog", done => {
    request("http://localhost:3000")
      .post("/catalog/login")
      .send({ username: "username", password: "123456" })
      .expect("Location", "/catalog")
      .end(done);
  });
  it("get the profile", () => {
    request(
      "http://localhost:3000/catalog/profile/5e1f3837ecac70095fd6ba0c",
      done => {
        expect(200, done);
      }
    );
    // .get("/catalog/profile/5e1f3837ecac70095fd6ba0c")
    // .expect(200)
    // .end(done);
  });
  it("should send message", done => {
    request("http://localhost:3000")
      .post("/catalog/5e1f3837ecac70095fd6ba0c/newmsg")
      .send({ title: "test", content: "test" })
      .expect("Location", "/catalog/profile/5e1f3837ecac70095fd6ba0c")
      .expect(302)
      .end(done);
  });
  // it("should like a message", done => {
  //   request("http://localhost:3000")
  //     .post("/catalog/post/5e21aeb015862438540553c6/upvote")
  //     .expect(302)
  //     .end(done);
  // });
  it("logout", done => {
    request("http://localhost:3000")
      .get("/catalog/logout")
      .expect("Location", "/")
      .expect(302, done);
  });
});

///////////////////////////////////////////////////////////////////

describe("Signup test", () => {
  it("should create a new user an redirect to login", done => {
    request("http://localhost:3000")
      .post("/catalog/signup")
      .send({
        username: "Meier",
        firstname: "Meier",
        lastname: "test",
        password: "123456",
        passwordConfirm: "123456"
      })
      .expect("Location", "/") //User id with regex /^\/user\/[0-9a-fA-F]{24}$/
      .expect(302)
      .end(done);
  });
});
