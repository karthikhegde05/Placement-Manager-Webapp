import axios from 'axios';

// export default axios.create({
//     // baseURL: process.env.API_URL
//     baseURL: "http://34.127.110.3:8082/"
// });

export default axios.create({
    baseURL: "http://34.127.110.3:8082/api/"
});