import React from 'react';
import './style.less';
import {getSum, square} from '../utils/common';
import {callApi} from '../utils/fetchApi';
import {prefix} from '../utils/config';
import Form from './Form';
import './style.less';

export default class Root extends React.Component {
    constructor(props) {
        super(props);
        debugger
        console.log(getSum(2, 5));
        sessionStorage.setItem('s1', 'v1')
    }

    componentDidMount() {
        callApi('get', `${prefix}`).then(res => {
            console.log(res);
        }).catch(e => {
            console.log(e);
        })
    }

    render() {
        return (
            <div style={{marginTop: '30px'}}>
                <Form />
            </div>
        );
    }
}