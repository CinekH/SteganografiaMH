import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { activateAccount } from '../../actions/auth';


import './styles.css';

const Activate = () => {
    const { hash } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    dispatch(activateAccount(hash, history));

    return (
        <div>

        </div>
    )
}

export default Activate;
