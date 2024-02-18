// ипортируем $api ранее созданный
import $api from "../http";
import {AxiosResponse} from 'axios'
import { AuthResponce } from "../models/responce/AuthResponce";

// создаем класс по умолчанию
export default class AuthService {
    // эту суеты мы вызываем в store
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponce>> {
        return $api.post<AuthResponce>('/login', {email, password})
    }

    static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponce>> {
        return $api.post<AuthResponce>('/registration', {email, password})
    }

    static async logout(): Promise<void> {
        return $api.post('/logout')
    }
}

