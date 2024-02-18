import React, {FC, useContext, useState} from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import {useNavigate } from "react-router-dom"


import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Card} from 'react-bootstrap';

import '../../src/App.css'

const Time: FC = () => {
    
    return(
        <div >  
                 Time
        </div>
    )
}

export default Time