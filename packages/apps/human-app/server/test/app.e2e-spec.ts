import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { generateWorkerSignupRequestBody } from './fixtures/user-worker.fixture';
import { SignupWorkerData } from '../src/modules/user-worker/interfaces/worker-registration.interface';

describe('Human APP (e2e) tests', () => {
  let app: INestApplication;
  let requestBodyForWorkerSignup: SignupWorkerData;

  beforeAll(async () => {
    requestBodyForWorkerSignup = generateWorkerSignupRequestBody();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should successfully process the signup request for a worker', async () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(requestBodyForWorkerSignup)
      .expect(201);
  });

  it('should return a 409 Conflict status when processing a duplicate signup request for a worker', async () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(requestBodyForWorkerSignup)
      .expect(409);
  });

  afterAll(async () => {
    await app.close();
  });
});
