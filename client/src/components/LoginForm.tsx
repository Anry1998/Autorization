import React, {FC, useContext, useState} from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import {useNavigate, NavLink, useLocation } from "react-router-dom"


import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Card, Row} from 'react-bootstrap';

import { useForm, SubmitHandler } from "react-hook-form"

import '../../src/App.css'


// type Inputs = {
//     example: string
//     exampleRequired: string
// }
const LoginForm: FC = () => {

    const location = useLocation()
    const isLogin = location.pathname === '/login'


    const {
        register,
        handleSubmit,
        watch,
        formState: { errors,  isValid },
        reset
      } = useForm({
        mode: 'onBlur'
      })

      const onSubmit = (data: any) => {
        // alert(JSON.stringify(data))
        // reset()
      }
    //   console.log({errors, isValid })

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [checkPassword, setCheckPassword] = useState<string>('')



    const [ errMessage, setErrMessage] = useState<any>('')
    const [ errPassMessage, seterrPassMessage] = useState<string>('')
    // const [resetPassword, setResetPassword] = useState<string>('')
    // const [newPassword, setNewPassword] = useState<string>('')

    const {store} = useContext(Context)

    const navigate = useNavigate()

    const navigateRessPass = () => {
        
        navigate('/reset')
       }
    

    const storeLogin = async () => {
        
        store.login(email, password)
        
        setErrMessage(await store.login(email, password)) 
        console.log(errMessage)
        setEmail('')
        setPassword('')
       
        }

       


    const storeRegistration = async () => {
            store.registration(email, password)
            seterrPassMessage( await store.registration(email, password))    
            console.log(errPassMessage)    
            setEmail('')
            setPassword('')
            
        
        }

    return(
        <div className="App">
            <Container className='card__flex '>
                <Card className="card__margin color_grey max__card_width ">
                    <h1 style={{textAlign: "center"}}>{isLogin ? 'Авторизация' : 'Регистрация'}</h1>
                    {/* <div>{errMessage}</div> */}
                      {/* Вызываем хук handleSubmit */}
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{height: '90px'}}>
                            <Form.Label>Введите Email</Form.Label>
                            <Form.Control 
                                {...register('email', {
                                    // Поле обязательно для заполнения
                                    required: 'Поле обязательно к заполнению',
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: "Введенное значение не соответствует формату электронной почты",
                                      },  
                                })}
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                type="text" 
                                placeholder="Введите Email" />

                                <div  style={{color: 'red'}}>
                                    {errors?.email ? 
                                        <p>{errors?.email?.message?.toString()}</p> 
                                        :
                                         ((errMessage !== 'Неверный пароль') && (errMessage ? errMessage :errPassMessage )) }
                                </div>
                        </Form.Group>
                        
                        
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{height: '90px'}}>
                        <Form.Label>Введите пароль</Form.Label>
                        <Form.Control 
                            {...register('password', {
                                // Поле обязательно для заполнения
                                required: 'Поле обязательно к заполнению',
                                pattern: {
                                    value:  /((?=.*\d)(?=.*[a-z] || ?=.*[а-я])(?=.*[A-Z] || ?=.*[А-Я])(?=.*[\W]).{5,15})/,
                                    message: "Пароль должен содержать: одну цифру, один символ нижнего регистра, один специальный символ",
                                  },
                                  
                                minLength: {
                                    value: 5,
                                    message: 'Пароль должен быть не менее 5 символов'
                                },
                                maxLength: {
                                    value: 15,
                                    message: 'Пароль должен быть не более 15 символов'
                                }   
                            })}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            type="password" 
                            placeholder="Введите пароль" />

                            <div style={{color: 'red'}}>
                                {errors?.password ? 
                                    <p>{errors?.password?.message?.toString() || 'Error!'}</p> 
                                    : 
                                    ( (errMessage === 'Неверный пароль') ? errMessage : '')}
                            </div>
                        </Form.Group>

                        
                        
                        
                        <Row>
                            {isLogin ?
                                <div>
                                    <Button disabled={ !isValid} type="submit" onClick={storeLogin} variant="outline-primary">Войти</Button>{' '}
                                    <div> Нет аккаунта?<NavLink to={'/registration'}>Зарегистрируйся</NavLink></div> 
                                </div>
                                :
                                <div>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{height: '90px'}}>
                                        <Form.Label>Повторите пароль</Form.Label>
                                        <Form.Control 
                                            {...register('checkPassword', {
                                                // Поле обязательно для заполнения
                                                required: 'Поле обязательно к заполнению',
                                                validate: (val: string) => {
                                                    if (watch('password') != val) {
                                                        return 'Пароли не совпадают'
                                                    }
                                                }
    
                                            })}
                                            value={checkPassword}
                                            onChange={e => setCheckPassword(e.target.value)}
                                            type="password" 
                                            placeholder="Повторите пароль" />

                                             <div style={{color: 'red'}}>
                                                {errors?.checkPassword ? 
                                                    <p>{errors?.checkPassword?.message?.toString() || 'Error!'}</p> 
                                                    : 
                                                    <p></p> 
                                                }
                                            </div>

                                    </Form.Group>

                                    

                
                                    <Button disabled={ !isValid }  onClick={storeRegistration} variant="primary">Зарегистрироваться</Button>{' '}
                                    <div> Есть аккаунт?<NavLink to={'/login'}>Войти</NavLink></div>
                                    
                                </div>
                            }
                            
                        </Row>

                        
                        <br></br>

                        <a style={{color: 'blue'}} onClick={navigateRessPass} >Восстановить пароль?</a>{' '}
                    
                    </Form>
                </Card>
                
            </Container>
        </div>
    )
}

export default observer(LoginForm) 




