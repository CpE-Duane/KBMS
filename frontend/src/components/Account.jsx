import React, { useEffect, useState } from 'react'
import Topbar from './Topbar'
import SideNavigation from './SideNavigation'
import { Accordion, Avatar, Button, Center, Container, Flex, Title } from '@mantine/core'
import { IconSettings, IconArrowBadgeRightFilled, IconLogout2, IconLock, IconPasswordUser } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks';
import AccountModal from './AccountModal'
import ChangeProfileModal from './ChangeProfileModal'
import { useNavigate } from 'react-router-dom'

const Account = () => {

    const [opened, { open, close }] = useDisclosure(false);
    const [modalType, setModalType] = useState("")
    const navigate = useNavigate();

    const [openChangeProfileModal, setOpenChangeProfileModal] = useState(false)

    const account = JSON.parse(localStorage.getItem("auth"))

    useEffect(() => {
        if (account) return;

        navigate("/")
    }, [account])



    const handleLogout = () => {
        setModalType("Settings")
        open();
    }

    const handleSecurity = () => {
        setModalType("Security")
        open();
    }


    return (
        <>
            <Topbar />
            <SideNavigation />

            <AccountModal opened={opened} close={close} type={modalType} />
            {
                openChangeProfileModal && account &&
                <ChangeProfileModal
                    open={openChangeProfileModal}
                    setOpenChangeProfileModal={setOpenChangeProfileModal}
                    auth={account}
                />}

            <Container fluid mt={60}>
                <Center>
                    <Accordion w={'50%'} variant='contained'>
                        <Accordion.Item value='account'>
                            <Accordion.Control>
                                <Flex align={'center'}>
                                    <Avatar color='blue'>{account?.user?.firstName[0]}{account?.user?.lastName[0]}</Avatar>
                                    <Title size={'h3'} ml={15}>{account?.user?.firstName} {account?.user?.lastName}</Title>
                                </Flex>
                            </Accordion.Control>
                            <Accordion.Panel bg={'white'}>
                                <Flex align={'center'}>
                                    <Button
                                        variant='light'
                                        rightSection={<IconArrowBadgeRightFilled />}
                                        color='green'
                                        onClick={() => setOpenChangeProfileModal(true)}
                                    >
                                        Update Profile
                                    </Button>
                                </Flex>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value='security'>
                            <Accordion.Control>
                                <Flex align={'center'}>
                                    <Avatar color='blue'> <IconLock /></Avatar>
                                    <Title size={'h3'} ml={15}>Security</Title>
                                </Flex>
                            </Accordion.Control>
                            <Accordion.Panel bg={'white'}>
                                <Button onClick={handleSecurity} variant='light' color='blue' leftSection={<IconPasswordUser />}>Change Password</Button>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value='settings'>
                            <Accordion.Control>
                                <Flex align={'center'}>
                                    <Avatar color='blue'> <IconSettings /></Avatar>
                                    <Title size={'h3'} ml={15}>Settings</Title>
                                </Flex>
                            </Accordion.Control>
                            <Accordion.Panel bg={'white'}>
                                <Button onClick={handleLogout} variant='light' color='red' leftSection={<IconLogout2 />}>Logout</Button>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Center>
            </Container>
        </>
    )
}

export default Account