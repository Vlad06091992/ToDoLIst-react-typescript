import React from 'react'
import { withRouter } from 'storybook-addon-react-router-v6';
import {action} from '@storybook/addon-actions'
import App from './App'
import {ReduxStoreProviderDecorator} from 'stories/decorators/ReduxStoreProviderDecorator'

export default {
    title: 'App Stories',
    component: App,
    decorators: [ReduxStoreProviderDecorator,withRouter],

};

export const AppBaseExample = (props: any) => {
    return (

        <App demo={true} />)
}
