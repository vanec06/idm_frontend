import axios from "axios";
//export const ruta = 'localhost';
export const ruta = '10.193.130.13'
export default axios.create({
    baseURL: 'http://'+ruta+':4000',
    withCredentials: true
});
