import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-2b3ec.firebaseio.com/'
});

export default instance;