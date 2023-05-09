import React from 'react'
import { Provider } from 'react-redux';
// @ts-ignore
import {store} from "src/app/store";
// import { store } from './store';

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={store}>{storyFn()}</Provider>
}