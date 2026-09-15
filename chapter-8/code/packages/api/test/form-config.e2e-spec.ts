import { Test }              from "@nestjs/testing";
import { INestApplication }  from "@nestjs/common";
import request                from "supertest";
import { AppModule }          from "../src/app.module";

let app: INestApplication;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  app = moduleRef.createNestApplication();
  app.setGlobalPrefix("api");
  await app.init();
});

afterAll(async () => { await app.close(); });

it("returns valid config for existing ID", async () => {
  const { body } = await request(app.getHttpServer())
    .get("/api/forms/registration").expect(200);
  expect(body).toHaveProperty("formId", "registration");
  expect(Array.isArray(body.sections)).toBe(true);
});

it("returns 404 for unknown form ID", async () => {
  await request(app.getHttpServer()).get("/api/forms/nope").expect(404);
});

it("accepts a valid submission", async () => {
  const { body } = await request(app.getHttpServer())
    .post("/api/forms/registration/submit")
    .send({
      data: {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        gender: "female",
        username: "janedoe23",
        password: "Password1",
        role: "user",
      },
    })
    .expect(201);
  expect(body.success).toBe(true);
});
