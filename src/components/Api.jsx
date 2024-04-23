import axios from "axios";
export const ruta = '10.193.129.44';

export default axios.create({
    baseURL: 'http://'+ruta+':4000',
    withCredentials: true
});