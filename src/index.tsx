import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createTheme, CssBaseline, ThemeProvider} from "@material-ui/core";
import {amber, green} from "@material-ui/core/colors";


const theme = createTheme({
    palette: {
        primary: {
            main: '#ed3f00'
        },
        secondary: {
            main: '#0044ff'
        },
       type:"dark"
}});


// const theme = createTheme({
//     palette: {
//         primary: green,
//         secondary: amber,
//         type:"dark"
//     },
// });


ReactDOM.render(
  <ThemeProvider theme={theme}>
      <CssBaseline>
          <App/>

      </CssBaseline>

  </ThemeProvider>

    ,  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
