const request = require('supertest');
const app = require('../server');

describe('POST /api/bookings', () => {
  it('should return 400 if fields are missing', async () => {
    const res = await request(app).post('/api/bookings').send({});
    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/valid name, email, date, and time/i);
  });

  it('should return 400 if email is invalid', async () => {
    const res = await request(app).post('/api/bookings').send({
      name: 'Jon',
      email: 'notanemail',
      date: '2025-09-09',
      time: '12:00'
    });
    expect(res.statusCode).toBe(400);
  });

  // This test should succeed if slot is free or 409 if already booked
  it('should book if data is valid', async () => {
    const testDate = '2099-01-01';
    const testTime = '09:00';
    const res = await request(app).post('/api/bookings').send({
      name: 'Unit Tester',
      email: 'unittest@example.com',
      date: testDate,
      time: testTime
    });
    expect([201, 409]).toContain(res.statusCode);
  });
});
