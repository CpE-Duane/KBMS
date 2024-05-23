import { Modal, SimpleGrid, Text, Button, Divider, TextInput, PasswordInput, Loader } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../toast/Toast'
import { useForm } from '@mantine/form'
import { useAuth } from '../context/auth'
import AuthService from '../service/AuthService'

const AccountModal = ({
    opened,
    close,
    type,
    email
}) => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)

    const [auth] = useAuth()

    const securityForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validate: {
            password: (value) => (
                value.length < 1
                    ? 'Password is required.'
                    : (value.length > 1 && value.length < 6)
                        ? 'Password must have at least 6 characters.'
                        : null
            ),
            confirmPassword: (value, values) =>
                value !== values.password ? 'Passwords did not match.' : null,
        }
    })

    const handleLogout = () => {
        localStorage.removeItem("auth")
        Toast.successMsg("Logout successfully.")
        close()

        const localStorageAuth = localStorage.getItem("auth")
        if (!localStorageAuth) {
            navigate("/")
        }
    }

    const handleUpdatePassword = async (values) => {
        const payload = {
            email: email ? email : auth.user?.email,
            newPassword: values.password
        }

        try {
            setIsLoading(true)
            const { data } = await AuthService.updatePassword(payload);
            Toast.successMsg(data.message);
            close();
            localStorage.removeItem("auth")
            navigate("/")

        } catch (error) {
            Toast.errorMsg(error)
        } finally {
            setIsLoading(false)
        }
    }

    const renderModal = () => {
        switch (type) {
            case "Profile":
                return (
                    <Modal opened={opened} onClose={close} title={type} centered>
                        <Divider py={5} />
                    </Modal>
                )
            case "Security":
                return (
                    <Modal opened={opened} onClose={close} title={type} centered>
                        <Divider py={5} />
                        <TextInput disabled label="Email" value={auth.user?.email} />
                        <PasswordInput
                            label="New Password"
                            required
                            placeholder='Enter new password'
                            key={securityForm.key('password')}
                            {...securityForm.getInputProps('password')}
                        />
                        <PasswordInput
                            label="Confirm Password"
                            required
                            placeholder='Enter new password'
                            key={securityForm.key('confirmPassword')}
                            {...securityForm.getInputProps('confirmPassword')}
                        />
                        <SimpleGrid cols={2} mt={15}>
                            <Button
                                variant='light'
                                leftSection={<IconCheck />}
                                onClick={securityForm.onSubmit((values) => handleUpdatePassword(values))}
                            >
                                {
                                    isLoading
                                        ?
                                        <Loader size={'xs'} />
                                        :
                                        <>Update</>
                                }
                            </Button>
                            <Button
                                variant='light'
                                color='red'
                                leftSection={<IconX />}
                                onClick={close}
                            >
                                Cancel
                            </Button>
                        </SimpleGrid>
                    </Modal >
                )
            case 'Settings':
                return (
                    <Modal opened={opened} onClose={close} title={type} centered>
                        <Divider py={5} />
                        <Text>Are you sure you want to logout ?</Text>
                        <SimpleGrid cols={2} mt={15}>
                            <Button variant='light' leftSection={<IconCheck />} onClick={handleLogout}> Yes</Button>
                            <Button variant='light' color='red' leftSection={<IconX />} onClick={close}> No</Button>
                        </SimpleGrid>
                    </Modal>
                )
        }
    }

    return renderModal()
}

export default AccountModal