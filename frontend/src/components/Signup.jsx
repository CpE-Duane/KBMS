import React, { useState } from 'react'
import { Container, Flex, Image, Button, Paper, TextInput, Center, Text, PasswordInput, SimpleGrid } from '@mantine/core';
import mqcImg from '../assets/mqc.jpeg'
import kbms from '../assets/kbms.png'
import { useNavigate } from 'react-router-dom';
import { isEmail, isNotEmpty, useForm } from '@mantine/form'
import { Loader } from '@mantine/core';
import AuthService from '../service/AuthService';
import Toast from '../toast/Toast'

const SignUp = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validate: {
            firstName: isNotEmpty('First name is required.'),
            lastName: isNotEmpty('Last name is required'),
            email: isEmail('Invalid email'),
            password: (value) => (
                value.length < 1
                    ? 'First name is required.'
                    : (value.length > 1 && value.length < 6)
                        ? 'Password must have at least 6 characters.'
                        : null
            ),
            confirmPassword: (value, values) =>
                value !== values.password ? 'Passwords did not match.' : null,
        }
    })

    const handleSignUp = async (values) => {
        try {
            setIsLoading(true);
            const res = await AuthService.signUpUser(values)
            Toast.successMsg(res.data.message)
            navigate("/")
        } catch (error) {
            Toast.errorMsg(error)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <>
            <Container
                bg="aliceblue"
                fluid
                style={{ height: "100vh" }}
            >
                <form style={{ height: "100%" }}>
                    <Container size={'xl'} h={'100%'}>
                        <Flex justify={'center'} align={'center'} h={'100%'}>
                            <Paper w={'50%'} h={700} shadow='xl'>
                                <Image src={mqcImg} h={'100%'} />
                            </Paper>
                            <Paper w={'50%'} h={700} shadow='xl' p={30}>
                                <Center>
                                    <img src={kbms} alt="" style={{ height: "100px" }} />
                                </Center>
                                <br />
                                <Text fw={'normal'} size={'50px'} color={'blue'}>Hello,</Text>
                                <Text fw={'bold'} size={'60px'} color="blue">Welcome!</Text>
                                <br />

                                <SimpleGrid cols={2}>
                                    <TextInput
                                        placeholder="Enter first name"
                                        label="First Name"
                                        key={form.key('firstName')}
                                        {...form.getInputProps('firstName')}
                                        disabled={isLoading}
                                        required
                                    />
                                    <TextInput
                                        placeholder="Enter last name"
                                        label="Last Name"
                                        key={form.key('lastName')}
                                        {...form.getInputProps('lastName')}
                                        disabled={isLoading}
                                        required
                                    />
                                </SimpleGrid>

                                <TextInput
                                    placeholder="Enter your email"
                                    label="Email"
                                    key={form.key('email')}
                                    {...form.getInputProps('email')}
                                    disabled={isLoading}
                                    required
                                />
                                <PasswordInput
                                    placeholder="**********"
                                    label="Password"
                                    key={form.key('password')}
                                    {...form.getInputProps('password')}
                                    disabled={isLoading}
                                    required
                                />
                                <PasswordInput
                                    placeholder="**********"
                                    label="Confirm Password"
                                    key={form.key('confirmPassword')}
                                    {...form.getInputProps('confirmPassword')}
                                    disabled={isLoading}
                                    required
                                />
                                <SimpleGrid cols={2} mt={20}>
                                    {
                                        isLoading
                                            ?
                                            <Button variant="light" color="violet">
                                                <Loader size={'xs'} color='violet' />
                                            </Button>
                                            :
                                            <Button disabled={isLoading} variant="light" color="violet" onClick={form.onSubmit((values) => handleSignUp(values))}>
                                                SignUp
                                            </Button>
                                    }
                                    <Button disabled={isLoading} variant="light" color="blue" onClick={() => navigate("/")}>Login</Button>
                                </SimpleGrid>
                            </Paper>
                        </Flex>
                    </Container>
                </form>
            </Container>
        </>
    )
}

export default SignUp