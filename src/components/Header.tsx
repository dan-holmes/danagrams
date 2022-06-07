import { AppBar } from '@mui/material';
import React from 'react';
import './Header.css';

const Header: React.FC = () => {
    return (
        <AppBar position='static' className="Header">
            <h2 className='title'>Danagrams</h2>
        </AppBar>
    );
};

export default Header;