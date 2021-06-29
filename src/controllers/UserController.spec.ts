import { expect } from 'chai';
import * as request from 'supertest';
import { app } from '../app';
import { ResponseUserDTO } from '../dtos/UserDTO';

const agent = request.agent(app);

/**
 * when APP runs, start testing
 */
before(done => {
    app.on('started', () => {
        done();
    });
});

describe('GET /users', () => {
    it('should respond with Users', done => {
        agent
            .get('/users')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;

                expect(res.body).instanceof(Array);
                res.body.map((user: ResponseUserDTO) => {
                    expect(user).has.all.keys(['id', 'name']);
                });
                done();
            });
    });
});

describe('POST /users', () => {
    it.skip('should respond with User', done => {
        agent
            .post('/users')
            .send({
                id: 'mocha',
                name: 'mocha',
                password: 'password',
            })
            .expect(201)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).has.all.keys(['id', 'name', 'createAt']);
                done();
            });
    });
});

describe('GET /users/:id', () => {
    it('should return 404 status code', done => {
        agent
            .get('/users/unknown')
            .expect(404)
            .end((err, res) => {
                if (err) done(err);
                else done();
            });
    });

    it('should respond with User of ID', done => {
        agent
            .get('/users/mocha')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;

                expect(res.body).has.all.keys(['id', 'name']);
                done();
            });
    });

    it('should respond with User of AccessToken', done => {
        agent
            .get('/users/mocha')
            .set(
                'Authorization',
                `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1vY2hhIiwibmFtZSI6Im1vY2hhIiwiYXV0aCI6Ik05OkMxIiwibG9naW5BdCI6IjIwMjEtMDYtMjlUMDg6MDI6NTYuMzk1WiIsImlhdCI6MTYyNDk1Mzc3NiwiZXhwIjoxNjI0OTU1NTc2LCJpc3MiOiJzZWNvIn0.658U4Y8y753wnQY7Nz35rXB_8LHZ9aLevTxHvXMehTU`,
            )
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).has.all.keys([
                    'id',
                    'name',
                    'accessableIp',
                    'createAt',
                    'phone',
                    'updateAt',
                ]);
                done();
            });
    });
});
