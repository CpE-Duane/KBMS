import React from 'react'
import { Center, Container, Paper, Text } from '@mantine/core';
import Login from './components/Login';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MyDocuments from './components/MyDocuments';
import Account from './components/Account';
import SignUp from './components/Signup';
import { ToastContainer } from 'react-toastify';
import Files from './components/Files';

const App = () => {
  return (
    <>
      <ToastContainer limit={2} />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/home/' element={<Dashboard />} />
        <Route path='/documents' element={<MyDocuments />} />
        <Route path='/documents/:folderName' element={<Files />} />
        <Route path='/account/' element={<Account />} />
      </Routes>
    </>
  )
}

export default App