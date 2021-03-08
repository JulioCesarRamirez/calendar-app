import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import moment from 'moment';

import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { CalendarModal } from '../../../components/calendar/CalendarModal';
import {
  eventStartUpdate,
  eventClearActiveEvent,
  eventStartAddNew,
} from '../../../actions/events';
import { act } from '@testing-library/react';
import Swal from 'sweetalert2';

Storage.prototype.setItem = jest.fn();

configure({ adapter: new Adapter() });

jest.mock('../../../actions/events', () => ({
  eventStartUpdate: jest.fn(),
  eventClearActiveEvent: jest.fn(),
  eventStartAddNew: jest.fn(),
}));

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPlus1 = now.clone().add(1, 'hours');

const initState = {
  calendar: {
    events: [],
    activeEvent: {
      title: 'Hello world',
      notes: 'Some notes',
      start: now.toDate(),
      end: nowPlus1.toDate(),
    },
  },
  auth: {
    uid: '123',
    name: 'Juan',
  },
  ui: {
    modalOpen: true,
  },
};
const store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={store}>
    <CalendarModal />
  </Provider>
);

describe('Testing CalendarModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should rendered correctly', () => {
    expect(wrapper.find('Modal').prop('isOpen')).toBe(true);
  });
  it('should  call update and close modal', () => {
    wrapper.find('form').simulate('submit', { preventDefault() {} });
    expect(eventStartUpdate).toBeCalledWith({
      end: nowPlus1.toDate(),
      notes: 'Some notes',
      start: now.toDate(),
      title: 'Hello world',
    });
    expect(eventClearActiveEvent).toBeCalled();
  });
  it('should show error when title is not provided', () => {
    wrapper.find('form').simulate('submit', { preventDefault() {} });
    expect(wrapper.find('input[name="title"]').hasClass('is-invalid')).toBe(
      true
    );
  });
  it('should create a new event', () => {
    const initState = {
      calendar: {
        events: [],
        activeEvent: null,
      },
      auth: {
        uid: '123',
        name: 'Juan',
      },
      ui: {
        modalOpen: true,
      },
    };
    const store = mockStore(initState);
    store.dispatch = jest.fn();

    const wrapper = mount(
      <Provider store={store}>
        <CalendarModal />
      </Provider>
    );
    wrapper.find('input[name="title"]').simulate('change', {
      target: {
        name: 'title',
        value: 'Hola test',
      },
    });
    wrapper.find('form').simulate('submit', { preventDefault() {} });

    expect(eventStartAddNew).toHaveBeenCalledWith({
      end: expect.anything(),
      start: expect.anything(),
      title: 'Hola test',
      notes: '',
    });

    expect(eventClearActiveEvent).toHaveBeenCalled();
  });
  it('should valdiate dates', () => {
    wrapper.find('input[name="title"]').simulate('change', {
      target: {
        name: 'title',
        value: 'Hola test',
      },
    });
    const today = new Date();

    act(() => {
      wrapper.find('DateTimePicker').at(1).prop('onChange')(today);
    });
    wrapper.find('form').simulate('submit', { preventDefault() {} });
    expect(Swal.fire).toHaveBeenCalledWith(
      'Error',
      'End date must be greater than the start date',
      'error'
    );
  });
});
