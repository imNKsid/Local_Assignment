import slice from "./jobs-slice";
import selectors from "./jobs-selector";
import thunks from "./jobs-thunk";

export default {
  reducer: slice.reducer,
  ...selectors,
  ...slice.actions,
  ...thunks,
};
