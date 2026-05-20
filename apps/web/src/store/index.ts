import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './slices/ui-slice'
import studioReducer from './slices/studio-slice'

export const makeStore = () =>
  configureStore({
    reducer: {
      ui: uiReducer,
      studio: studioReducer,
    },
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
