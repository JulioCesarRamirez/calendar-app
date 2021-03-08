import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';

import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { CalendarScreen } from '../../../components/calendar/CalendarScreen';
import { types } from '../../../types/types';
import {
  eventSetActive,
  eventStartLoading,
  setLastView,
} from '../../../actions/events';
import { act } from '@testing-library/react';

jest.mock('../../../actions/events', () => ({
  eventSetActive: jest.fn(),
  eventStartLoading: jest.fn(),
  setLastView: jest.fn(),
}));
Storage.prototype.setItem = jest.fn();

configure({ adapter: new Adapter() });

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {
  calendar: {
    events: [],
  },
  auth: {
    uid: '123',
    name: 'Juan',
  },
  ui: {
    openModal: false,
  },
};
const store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={store}>
    <CalendarScreen />
  </Provider>
);

describe('Testing CalendarScreem', () => {
  it('should rendered correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should interact correctly with calendar', () => {
    const calendar = wrapper.find('Calendar');

    calendar.prop('onDoubleClickEvent')();
    expect(store.dispatch).toHaveBeenCalledWith({ type: types.uiOpenModal });

    calendar.prop('onSelectEvent')({ start: 'Hola' });
    expect(eventSetActive).toHaveBeenCalledWith({ start: 'Hola' });

    act(() => {
      calendar.prop('onView')('week');
      expect(localStorage.setItem).toHaveBeenCalledWith('lastView', 'week');
    });
  });
});
