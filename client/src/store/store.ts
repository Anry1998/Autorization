import { IUser } from "../models/IUser";
import {makeAutoObservable} from 'mobx'
import AuthService from "../servises/AuthService";
// импортирует 
import ResetPassService from "../servises/ResetPassService";
import axios from "axios";
import { AuthResponce } from "../models/responce/AuthResponce";
const API_URL = 'http://localhost:5000/api'

export default class Store {
    user = {} as IUser
    isAuth = false
    isLoading = false

    constructor() {
        makeAutoObservable(this)
    }

    setAuth(bool: boolean) {
        this.isAuth = bool
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool
    }

    async login(email: string, password: string) {
        try {
            const responce = await AuthService.login(email, password)
            localStorage.setItem('token', responce.data.accessToken)
            this.setAuth(true)
            this.setUser(responce.data.user)
        } catch (e: any) {
            const arr = e.response.data.message
            
            return arr
        }
    }

    

    async registration(email: string, password: string) {
        try {
            const responce = await AuthService.registration(email, password)
            console.log(responce)
            localStorage.setItem('token', responce.data.accessToken)
            this.setAuth(true)
            this.setUser(responce.data.user)
        } catch (e: any) {
            const arr = e.response.data.message
            // console.log(arr)
            return arr
        }
    }

    async logout() {
        try {
            const responce = await AuthService.logout()
            localStorage.removeItem('token')
            this.setAuth(false)
            this.setUser({} as IUser)
        } catch (error) {
            let errorMessage = "Ошибка при логауте";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.log(errorMessage);
        }
    }

    async checkAuth() {
        this.setLoading(true)
        try {
            // Тело ответа ожидаем AuthResponce
            const responce = await axios.get<AuthResponce>(`${API_URL}/refresh`, {withCredentials: true})
            localStorage.setItem('token', responce.data.accessToken)
            this.setAuth(true)
            this.setUser(responce.data.user)
        } catch (e) {
            console.log(e)
        } finally {
            this.setLoading(false)
        }
    }




    async resetPass(email: string) {
        try {
            const responce = await ResetPassService.reset(email)
 
        } catch (error) {
            let errorMessage = "Ошибка при сбросе пароля";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.log(errorMessage);
        }
    }

    async resetPassFinal(email: string, newPassword: string) {
        try {
            console.log(email, newPassword)
            const link = window.location.href
            
            const linkResetPass = link.replace("http://localhost:3000/reset/", '')
            console.log(link)
            console.log(linkResetPass)
            const responce = await ResetPassService.resetEmail(email, newPassword, linkResetPass)
            console.log(responce)
            
        } catch (error) {
            let errorMessage = "Оштбка при сбросе пароля";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.log(errorMessage);
        }
    }
    
}