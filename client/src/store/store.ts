import { configureStore } from '@reduxjs/toolkit'
import auth from './slices/auth.slice'
import { setAuthTokenGetter, setUpdateTokenCallback } from '@/api'
import { setUser } from './slices/auth.slice'

export const store = configureStore({
  reducer: { auth },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

setAuthTokenGetter(() => store.getState().auth.token)
setUpdateTokenCallback((data, token) => {
  store.dispatch(setUser({ data: data as unknown as import('@/interfaces/auth').AuthResponseData, token }))
})