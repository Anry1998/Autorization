import React, {FC, useContext, useState} from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import {useNavigate } from "react-router-dom"

const ResetPass: FC = () => {
    const [email, setEmail] = useState<string>('')
    const navigate = useNavigate()
    
    const {store} = useContext(Context)

    const navigateLogin = () => {
        navigate('/login')
       }

    return(
        <div>
            <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email" 
                placeholder="Введите Email"
            />
            <button onClick={() => store.resetPass(email)}>Восстановить пароль</button>
            <button onClick={navigateLogin}>Войти</button>
        </div>
        )
}

export default ResetPass