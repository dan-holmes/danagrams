import { AppBar } from '@mui/material';
import React from 'react';
import './Header.css';

const Header: React.FC = () => {
    return (
        <AppBar position='static'>
            <h1 className='title'>Speedograms</h1>
        </AppBar>
    );
};

export default Header;