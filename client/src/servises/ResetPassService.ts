import $api from "../http";
// указываем, какие данные будет возвращать функция
// axios всегда возвращает объект, а данные в теле ответа хранятся в полу data
// Для того, чтобы указать тип этих данных мы импортируем его из axios - AxiosResponse
import {AxiosResponse} from 'axios'
// импортируем тип данных, который нам будет возвращать запрос
// import { ResetPassResponce} from "../models/responce/ResetPassResponce";
const resPassLink = localStorage.getItem('resetPassLink')
// console.log(resPassLink)

export default class ResetPassService {

    static async reset(email: string): Promise<AxiosResponse> {

        // const resPassLink = localStorage.getItem('resetPassLink')
        // console.log(resPassLink)
        // console.log(window.location.href)
        return $api.post('/reset', {email})
    }

    static async resetEmail(email: string, newPassword: string, linkResetPass: string): Promise<AxiosResponse> {
        console.log(linkResetPass)
        return $api.post(`/reset/${linkResetPass}`, {email, newPassword})
    }
}
