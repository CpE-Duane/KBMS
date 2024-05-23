import { Avatar, Burger, Center, Container, Flex, Grid, Image, Text, TextInput } from '@mantine/core'
import React, { useEffect } from 'react'
import { useDisclosure } from '@mantine/hooks';
import SideNavigation from './SideNavigation';
import kbmsImg from '../assets/kbms.png'
import { useNavigate } from 'react-router-dom';

const Topbar = () => {

    const [opened, { open, close }] = useDisclosure(false);
    const navigate = useNavigate()


    const account = JSON.parse(localStorage.getItem("auth"))

    useEffect(() => {
        if (account) return;

        navigate("/")
    }, [account])

    return (
        <>
            <Container bg={'aliceblue'} fluid p={10} >
                <Flex justify={'space-between'} align={'center'}>
                    <Burger onClick={open} />
                    <Image src={kbmsImg} h={50} style={{ background: "transparent", borderRadius: "100%" }} />
                    <Flex align={'center'}>
                        <Avatar color='blue' mr={5}>{account?.user.firstName[0]}{account?.user.lastName[0]}</Avatar>
                        <Text color='blue' fw={'bold'}>{account?.user.firstName} {account?.user.lastName}</Text>
                    </Flex>
                </Flex>
            </Container>
            <SideNavigation opened={opened} close={close} />
        </>
    )
}

export default Topbar