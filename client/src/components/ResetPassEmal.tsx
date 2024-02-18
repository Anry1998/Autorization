import React, {FC, useContext, useState} from "react";
import { Context } from "..";
// import { observer } from "mobx-react-lite";
// import {useNavigate } from "react-router-dom"

const ResetPassEmal: FC = () => {
    const [email, setEmail] = useState<string>('')
    const [newPpassword, setNewPassword] = useState<string>('')
    // const navigate = useNavigate()
    
    const {store} = useContext(Context)


    const resPassLink = localStorage.getItem('resetPassLink')
    // console.log(resPassLink)

    // const navigateRessPass = () => {
    //     navigate('/')
    //    }

    return(
        <div>
            <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email" 
                placeholder="Введите Email"
            />

            <input
                value={newPpassword}
                onChange={e => setNewPassword(e.target.value)}
                type="password" 
                placeholder="Введите новый пароль"
            />

            <button onClick={() => store.resetPassFinal(email, newPpassword)}>Восстановить пароль</button>
            
        </div>
        )
}

export default ResetPassEmal