import $api from "../http";

// import $api2 from '../http/axios'
import {AxiosResponse} from 'axios'
import { IUser } from "../models/IUser";

export default class UserService {

    static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/users')
    }

    
}

// export default class UserService {

//     static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
//         return $api2.get<IUser[]>('/users')
//     }

    
// }

