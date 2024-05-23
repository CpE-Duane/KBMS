import React, { useState, useEffect } from 'react'
import SideNavigation from './SideNavigation'
import Topbar from './Topbar'
import { Button, Center, Container, Image, Text } from '@mantine/core'
import fishingImg from '../assets/fishing.png';
import { IconDownload } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';



const Dashboard = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const auth = localStorage.getItem('auth')
        if (!auth) {
            navigate("/")
        }
    }, [])

    return (
        <>
            <Topbar />
            <SideNavigation />

            <Container fluid mt={80}>
                <Center w={'100%'} >
                    <Image src={fishingImg} sizez={'sm'} />
                </Center>
            </Container>

            <Container fluid>
                <Center>
                    <Text fw={600} size='xl'>Welcome to KBMS</Text>
                    <Text size='xl'>, the home for all your files.</Text>
                </Center>
                <Center>
                    <Text>Upload your document by clicking the Upload button.</Text>
                </Center>
                <Center mt={10}>
                    <Button onClick={() => navigate("/documents")} variant='light' color='indigo' leftSection={<IconDownload size={14} />}>
                        Upload
                    </Button>
                </Center>
            </Container>
        </>
    )
}

export default Dashboard