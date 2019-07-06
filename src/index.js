import { AppRegistry } from 'react-native';
import { App } from './components/App';
import * as serviceWorker from './serviceWorker';
import './index.css';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

const rootElement = document.getElementById('root');
AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', { rootTag: rootElement });
