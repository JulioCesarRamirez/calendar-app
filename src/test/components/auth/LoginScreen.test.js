import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';

import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { LoginScreen } from '../../../components/auth/LoginScreen';

import { startLogin, startRegister } from '../../../actions/auth';
import Swal from 'sweetalert2';

configure({ adapter: new Adapter() });

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};
const store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={store}>
    <LoginScreen />
  </Provider>
);

jest.mock('../../../actions/auth', () => ({
  startLogin: jest.fn(),
  startRegister: jest.fn(),
}));

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

describe('Testing LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should rendered correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should call login dispatch', () => {
    wrapper.find('input[name="lEmail"]').simulate('change', {
      target: {
        name: 'lEmail',
        value: 'juan@gmail.com',
      },
    });
    wrapper.find('input[name="lPassword"]').simulate('change', {
      target: {
        name: 'lPassword',
        value: '123456',
      },
    });
    wrapper.find('form').at(0).prop('onSubmit')({
      preventDefault() {},
    });

    expect(startLogin).toHaveBeenCalledWith('juan@gmail.com', '123456');
  });
  it('should not register an user if password does not match', () => {
    wrapper.find('input[name="rPassword1"]').simulate('change', {
      target: {
        name: 'rPassword1',
        value: '123456',
      },
    });
    wrapper.find('input[name="rPassword1"]').simulate('change', {
      target: {
        name: 'rPassword2',
        value: '1234567',
      },
    });
    wrapper.find('form').at(1).prop('onSubmit')({
      preventDefault() {},
    });
    expect(startRegister).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(
      'Error',
      'Passwords must be the same',
      'error'
    );
  });
  it('should resgister an user with the same passwrods', () => {
    wrapper.find('input[name="rPassword1"]').simulate('change', {
      target: {
        name: 'rPassword1',
        value: '123456',
      },
    });
    wrapper.find('input[name="rPassword1"]').simulate('change', {
      target: {
        name: 'rPassword2',
        value: '123456',
      },
    });
    wrapper.find('form').at(1).prop('onSubmit')({
      preventDefault() {},
    });
    expect(startRegister).toHaveBeenCalledWith(
      'doncan@test.com',
      '123456',
      'Doncan'
    );
  });
});
