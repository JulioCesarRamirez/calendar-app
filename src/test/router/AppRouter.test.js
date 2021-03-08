import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { AppRouter } from '../../router/AppRouter';

configure({ adapter: new Adapter() });

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Testing AppRouter', () => {
  it('should show wait', () => {
    const initState = {
      auth: {
        checking: true,
      },
    };
    const store = mockStore(initState);

    const wrapper = mount(
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('should show public route', () => {
    const initState = {
      auth: {
        checking: false,
        uid: null,
      },
    };
    const store = mockStore(initState);

    const wrapper = mount(
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.login-container').exists()).toBe(true);
  });

  it('should show private route', () => {
    const initState = {
      calendar: {
        events: [],
      },
      ui: {
        modalOpen: false,
      },
      auth: {
        checking: false,
        uid: '123',
        name: 'Juan',
      },
    };
    const store = mockStore(initState);

    const wrapper = mount(
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.calendar-screen').exists()).toBe(true);
  });
});
