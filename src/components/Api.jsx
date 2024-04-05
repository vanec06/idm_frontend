import axios from "axios";
export const ruta = 'localhost';

export default axios.create({
    baseURL: 'http://'+ruta+':4000',
    withCredentials: true
});