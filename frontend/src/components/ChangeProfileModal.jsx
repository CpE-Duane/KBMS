import { Button, Divider, Loader, Modal, SimpleGrid, TextInput } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'
import React, { useState } from 'react'
import { isNotEmpty, useForm } from '@mantine/form'
import Toast from '../toast/Toast'
import AuthService from '../service/AuthService'
import { useNavigate } from 'react-router-dom'


const ChangeProfileModal = ({
    open,
    setOpenChangeProfileModal,
    auth
}) => {

    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const form = useForm({
        mode: 'controlled',
        initialValues: {
            firstName: auth?.user?.firstName,
            lastName: auth?.user?.lastName
        },
        validate: {
            firstName: isNotEmpty("First name is required"),
            lastName: isNotEmpty("Last name is required.")
        }
    })

    const handleUpdateProfile = async (values) => {
        try {
            const payload = {
                ...values,
                email: auth.user?.email
            }
            setIsLoading(true)
            const { data } = await AuthService.updateProfile(payload)
            Toast.successMsg(data.message)
            localStorage.removeItem("auth")
            navigate("/")

        } catch (error) {
            Toast.errorMsg(error.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Modal opened={open} onClose={() => setOpenChangeProfileModal(false)} centered title="Update Profile">
                <Divider pb={5} />

                <TextInput
                    label="Email"
                    value={auth.user?.email}
                    required
                    disabled
                />

                <TextInput
                    label="First name"
                    placeholder='Enter your first name'
                    required
                    key={form.key('firstName')}
                    {...form.getInputProps('firstName')}
                />
                <TextInput
                    label="Last name"
                    placeholder='Enter your last name'
                    required
                    key={form.key('lastName')}
                    {...form.getInputProps('lastName')}
                />

                <SimpleGrid cols={2} mt={20}>
                    <Button
                        variant='light'
                        disabled={isLoading}
                        onClick={form.onSubmit((values) => handleUpdateProfile(values))}
                    >
                        {
                            isLoading
                                ?
                                <Loader size={'xs'} />
                                :
                                <><IconCheck size={20} />  Update</>
                        }
                    </Button>
                    <Button
                        variant='light'
                        color='red'
                        disabled={isLoading}
                        onClick={() => setOpenChangeProfileModal(false)}
                    >
                        <IconX size={20} /> Cancel
                    </Button>
                </SimpleGrid>
            </Modal>
        </>
    )
}

export default ChangeProfileModal