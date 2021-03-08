import { uiCloseModal, uiOpenModal } from '../../actions/ui';
import { uiReducer } from '../../reducers/uiReducer';

const initialState = {
  modalOpen: false,
};

describe('Testing uiReducer', () => {
  it('should return the default state', () => {
    const state = uiReducer(initialState, {});
    expect(state).toEqual(initialState);
  });

  it('should open and close modal', () => {
    const modalOpen = uiOpenModal();
    const state = uiReducer(initialState, modalOpen);
    expect(state).toEqual({ modalOpen: true });

    const modalClose = uiCloseModal();
    const stateClose = uiReducer(state, modalClose);
    expect(stateClose).toEqual({ modalOpen: false });
  });
});
