import { authReducer } from '../../reducers/authReducer';
import { types } from '../../types/types';

const initState = {
  checking: true,
};

describe('Testing authReducer', () => {
  it('should return the default state', () => {
    const action = {};
    const state = authReducer(initState, action);
    expect(state).toEqual(initState);
  });

  it('should  athenticate user', () => {
    const action = {
      type: types.authLogin,
      payload: {
        uid: '123',
        name: 'Julio',
      },
    };
    const state = authReducer(initState, action);
    expect(state).toEqual({
      checking: false,
      uid: '123',
      name: 'Julio',
    });
  });
});
