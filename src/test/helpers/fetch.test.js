import { fetchWithoutToken, fetchWithToken } from '../../helpers/fetch';

describe('Testing Fetch', () => {
  let token = '';
  it('fetchWithoutToken should work', async () => {
    const resp = await fetchWithoutToken(
      'auth',
      {
        email: 'doncan@test.com',
        password: '123456',
      },
      'POST'
    );
    expect(resp instanceof Response).toBe(true);
    const body = await resp.json();
    expect(body.ok).toBe(true);
    token = body.token;
  });
  it('fetchWithToken should work', async () => {
    localStorage.setItem('token', token);
    const resp = await fetchWithToken('events');
    const body = await resp.json();
    expect(body.ok).toBe(false);
  });
});
