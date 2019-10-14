import { actions } from '../actions';
import initialState from '../initialState';

export default function featureReducer(state = initialState.features, action) {
  console.log('in store: ' + action.type);
  switch (action.type) {
    case actions.GET_FEATURES:
      return action.features;
    case actions.ADD_FEATURE:
      return [...state, Object.assign({}, action.createdFeature)];
    case actions.REMOVE_ALL_FEATURES:
      return [];
    default:
      return state;
  }
}
