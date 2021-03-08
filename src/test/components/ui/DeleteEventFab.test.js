import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import { eventStartDelete } from '../../../actions/events';

configure({ adapter: new Adapter() });

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};
const store = mockStore(initState);

store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={store}>
    <DeleteEventFab />
  </Provider>
);

jest.mock('../../../actions/events', () => ({
  eventStartDelete: jest.fn(),
}));

describe('Testing DeleteEventFab', () => {
  it('should rendered correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should call eventStartDelete onClick', () => {
    wrapper.find('button').prop('onClick')();
    expect(eventStartDelete).toHaveBeenCalled();
  });
});
