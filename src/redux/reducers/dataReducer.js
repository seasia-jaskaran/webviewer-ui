const initialState = {
    dataArrayPdftron: [],
  };
  
  function dataReducer(state = initialState, action) {
    switch(action.type) {
      case 'DATA_TRUE':
        return { ...state, dataArrayPdftron: action.payload };
      case 'DATA_FALSE':
        return { ...state, dataArrayPdftron:[] };
      default:
        return state;
    }
  }
  
  export default dataReducer;
  