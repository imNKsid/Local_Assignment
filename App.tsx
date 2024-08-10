import { View, Text } from "react-native";
import React from "react";
import { Home } from "./src/screens";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
};

export default App;
