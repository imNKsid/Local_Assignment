import { combineReducers, configureStore } from "@reduxjs/toolkit";
import reducer from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";

const rootReducer = combineReducers({ ...reducer });

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["jobs"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(),
});

export type RootState = ReturnType<typeof store.getState>;
