import React, {FC, useContext, useState} from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import {useNavigate } from "react-router-dom"

import { IUser } from '../models/IUser';
import UserService from '../servises/UserService';

import '../../src/App.css'

const MainPage: FC = () => {
    const {store} = useContext(Context)
    const [users, setUsers] = useState<IUser[]>([])

    async function getUsers() {
        try {
          const response = await UserService.fetchUsers()
          setUsers(response.data)
        } catch (e) {
          console.log(e)
        }
      }
    return(
        <div>
            <h1>{store.isAuth ? 'Пользователь авторизован' : 'Пользователь не авторизован'}</h1>
            <h1>{store.user.isActivated ? 'Аккаунт подтвержден' : 'Подтвердите аккаунт'}</h1>
            <button onClick={() => store.logout()}>Выйти</button>
            <div>
                <button onClick={getUsers}>Получить список пользователей</button>
            </div>
            {users.map(user => 
                <div key={user.id}>{user.email}</div>
                )}
    </div>
    )
}

export default MainPage