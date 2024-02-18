
// импортируем axios
import axios from 'axios'
import { AuthResponce } from "../models/responce/AuthResponce"





export const API_URL = `http://localhost:5000/api`



// создаем instance(экзепляр) axios

const $api = axios.create({
    // для того, чтобы куки цеплялись автоматически
    withCredentials: true,
    // базовый url
    baseURL: API_URL,
 
})


// интерцептор - вешаем как на оправку запроса, так и на получение ответа, то есть эта фуекция будет отрабатывать на каждый запрос и на каждый ответ
// данный интерцептор устанавливает хедр авторизейшен и помещает туда токен
$api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})



$api.interceptors.response.use(config => {
    return config;
}, async (error) => {
    const originalRequest = error.config
    // console.log(response)
    if(error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true
        try {
            const responce = await axios.get<AuthResponce>(`${API_URL}/refresh`, {withCredentials: true})
            console.log(responce)
            localStorage.setItem('token', responce.data.accessToken)
            return $api.request(originalRequest)
        } catch (e) {
            console.log("Не авторизован")
        }
        
    }
    throw error
})

export default $api 




