import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import { startChecking, startLogin, startRegister } from '../../actions/auth';
import { types } from '../../types/types';
import Swal from 'sweetalert2';
import * as fetchModule from '../../helpers/fetch';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};
let store = mockStore(initState);

Storage.prototype.setItem = jest.fn();

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

describe('Testing auth actions', () => {
  beforeEach(() => {
    store = mockStore(initState);
    jest.clearAllMocks();
  });

  it('success startLogin', async () => {
    await store.dispatch(startLogin('doncan@test.com', '123456'));
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: types.authLogin,
      payload: {
        uid: expect.any(String),
        name: expect.any(String),
      },
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'token',
      expect.any(String)
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'token-init-date',
      expect.any(Number)
    );
  });

  it('unsuccess startLogin', async () => {
    await store.dispatch(startLogin('doncan@test.com', '12345676'));
    const actions = store.getActions();
    expect(actions).toEqual([]);
    expect(Swal.fire).toHaveBeenCalledWith('Error', 'Wrong password', 'error');
  });

  it('success startRegister', async () => {
    fetchModule.fetchWithoutToken = jest.fn(() => ({
      json() {
        return {
          ok: true,
          uid: '123',
          name: 'test1',
          token: 'abc123ABC123',
        };
      },
    }));
    await store.dispatch(startRegister('test@test.com', '123456', 'test'));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: types.authLogin,
      payload: {
        uid: '123',
        name: 'test1',
      },
    });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'token',
      expect.any(String)
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'token-init-date',
      expect.any(Number)
    );
  });
  it('success startChecking', async () => {
    fetchModule.fetchWithToken = jest.fn(() => ({
      json() {
        return {
          ok: true,
          uid: '123',
          name: 'test1',
          token: 'abc123ABC123',
        };
      },
    }));
    await store.dispatch(startChecking());
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: types.authLogin,
      payload: {
        uid: '123',
        name: 'test1',
      },
    });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'token',
      expect.any(String)
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'token-init-date',
      expect.any(Number)
    );
  });
});
