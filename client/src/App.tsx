import React, {FC, useContext, useState} from 'react';
import AppRouter from './components/AppRouter';

import './App.css';



import { Context } from '.';
import { observer } from 'mobx-react-lite';
import { IUser } from './models/IUser';

import MainPage from './components/MainPage';

const App: FC = () => {

  const {store} = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])
 
  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])


  if(store.isLoading) {
    return <div>Загрузка...</div>
  }


  if (!store.isAuth) {
    return (
      <div>
        <AppRouter/>
        {/* <Router>
        <Routes>
          <Route path='/' element={<LoginForm/>}></Route>
          <Route path='/reset' element={<ResetPass/>}></Route>
          <Route path='/reset/:link' element={<ResetPassEmal/>}></Route>
        </Routes>
        </Router> */}
      </div>
    )
  }

  return (
    <MainPage/>
  );
}
// Оборачиваем компонет, чтобы MOBX отслеживал изменение данных
export default observer (App);
