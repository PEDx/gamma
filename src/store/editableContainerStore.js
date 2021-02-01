import { createContext } from 'react';

export const initState = { adsorb_x_arr: [], adsorb_y_arr: [] };

export const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case 'set_adsorb_x_arr':
      return set_adsorb_x_arr(state, data);
    case 'set_adsorb_y_arr':
      return Object.assign({}, state, { adsorb_y: data.adsorb_y_arr });
    case 'set_edge_x_arr':
      return Object.assign({}, state, { adsorb_y: data.edge_x_arr });
    case 'set_edge_y_arr':
      return Object.assign({}, state, { adsorb_y: data.edge_y_arr });
    default:
      return state;
  }
};

function set_adsorb_x_arr(state, data) {
  return Object.assign({}, state, { adsorb_x: data.adsorb_x_arr });
}

export const EditableContainerStore = createContext('EditableContainerStore');
