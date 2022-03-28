const request = require('supertest');
const express = require('express');
const db = require('../../data/db-config');
const authRequired = require('../../api/middleware/authRequired');
const handleError = require('../../api/middleware/handleError');
const notesRouter = require('../../api/notes/noteRouter');

// Reset Test Database Before/After Tests

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => await db.seed.run());

afterAll(async () => await db.destroy());

afterEach(() => jest.clearAllMocks());

jest.mock('../../api/middleware/authRequired', () =>
  jest.fn((req, res, next) => next())
);

jest.mock('../../api/middleware/permissionsRequired', () => ({
  adminRequired: jest.fn((req, res, next) => next()),
  superAdminRequired: jest.fn((req, res, next) => next()),
}));

// Instantiate Test API

const app = express();
app.use(express.json());
app.use('/notes', notesRouter);
app.use(handleError);

/**
tets cases

admin can retrieve all note
admin can retrieve note per id

mentor can retrieve notes
mentor can retrieve notes per assigned mentee
mentor can 

*/

describe('Sanity Checks', () => {
  test('matchers are working', () => {
    expect(true).toBe(true);
    expect(20 - 5).toBe(15);
    expect(9 + 10).not.toEqual(21);
  });

  test('test environment is being used', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});

describe('Notes Router', () => {
  describe('[GET] /notes', () => {
    let res;
    beforeAll(async () => {
      res = await request(app).get('/notes');
    });

    it('requires authentication', () => {
      expect(authRequired).toBeCalled();
    });

    it('responds with status 200', async () => {
      const expected = 200;
      const actual = res.status;

      expect(actual).toBe(expected);
    });
  });

  describe('[GET] /notes/note_id', () => {
    let res;
    beforeAll(async () => {
      res = await request(app).get('/notes/1');
    });

    it('requires authentication', () => {
      expect(authRequired).toBeCalled();
    });

    it('responds with status 200', async () => {
      const expected = 200;
      const actual = res.status;
      expect(actual).toBe(expected);
    });

    it('responds with non empty object', async () => {
      const expected = /some text here/;
      const actual = res.text;
      console.log(res.text);
      expect(actual).toMatch(expected);
    });
  });

  describe('[GET] /notes/note_id with 404 error', () => {
    let res;
    beforeAll(async () => {
      res = await request(app).get('/notes/100');
    });

    it('requires authentication', () => {
      expect(authRequired).toBeCalled();
    });

    it('responds with status 200', async () => {
      const expected = 404;
      const actual = res.status;
      expect(actual).toBe(expected);
    });
  });

  describe('[POST] /notes', () => {
    let res;
    beforeAll(async () => {
      res = await request(app).post('/notes').send({
        content_type: 'type a',
        content: 'expect some text here',
        level: 'low',
        visible_to_admin: true,
        visible_to_moderator: true,
        visible_to_mentor: true,
        mentor_id: '00u13omswyZM1xVya4x7',
        mentee_id: '00u13oned0U8XP8Mb4x7',
      });
    });

    it('requires authentication', () => {
      expect(authRequired).toBeCalled();
    });

    it('responds with status 201', async () => {
      const expected = 201;
      const actual = res.status;
      expect(actual).toBe(expected);
    });
  });
});
