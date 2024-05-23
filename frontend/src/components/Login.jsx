import React, { useState, useEffect } from 'react'
import { Container, Flex, Image, Button, Paper, TextInput, Center, Text, PasswordInput, SimpleGrid, Loader, Modal, Divider, PinInput } from '@mantine/core';
import mqcImg from '../assets/mqc.jpeg'
import kbms from '../assets/kbms.png'
import { useNavigate } from 'react-router-dom'
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import AuthService from '../service/AuthService';
import Toast from '../toast/Toast';
import { useAuth } from '../context/auth'
import { useDisclosure } from '@mantine/hooks';
import OtpService from '../service/OtpService';
import AccountModal from './AccountModal';
import { IconCheck, IconX } from '@tabler/icons-react';

const Login = () => {

    const navigate = useNavigate()
    const [opened, { open, close }] = useDisclosure(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailToChangePassword, setEmailToChangePassword] = useState("")
    const [auth, setAuth] = useAuth();
    const [isVerifying, setIsVerifying] = useState(false)
    const [pin, setPin] = useState(null)
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [seconds, setSeconds] = useState(100);
    const [started, setStarted] = useState(false);
    const [isUpdatingPassword, setIsupdatingPassword] = useState(false)


    const forgotPasswordForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: "",
            newPassword: "",
            confirmPassword: ""
        },
        validate: {
            newPassword: (value) => (
                value.length < 1
                    ? 'First name is required.'
                    : (value.length > 1 && value.length < 6)
                        ? 'Password must have at least 6 characters.'
                        : null
            ),
            confirmPassword: (value, values) =>
                value !== values.newPassword ? 'Passwords did not match' : null,
        }
    })

    useEffect(() => {
        let interval;
        if (started && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [started, seconds]);

    const startTimer = () => {
        setStarted(true);
    };


    useEffect(() => {
        if (!localStorage.getItem("auth")) return;

        if (auth.token !== "" && auth.user !== null) {
            navigate("/home")
        }
    }, [])

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: ''
        },
        validate: {
            email: isEmail("Invalid email."),
            password: isNotEmpty("Password is required.")
        }
    })

    const handleLogin = async (values) => {
        try {
            setIsLoading(true)
            const { data } = await AuthService.loginUser(values)
            Toast.successMsg(data.message)
            localStorage.setItem("auth", JSON.stringify(data))
            navigate("/home")
        } catch (error) {
            Toast.errorMsg(error.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    const verfiyEmail = async () => {
        if (!emailToChangePassword) {
            Toast.errorMsg("Please enter your email.")
            return;
        }

        try {
            setIsLoading(true)
            const { data } = await AuthService.checkIfEmailIsAlreadyRegistered({ email: emailToChangePassword })
            await generateOtp()
        } catch (error) {
            console.error("error", error)
            Toast.errorMsg(error.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    const generateOtp = async () => {
        try {
            setIsLoading(true)
            const { data } = await OtpService.generateOtp({ email: emailToChangePassword })
            Toast.successMsg(data.message)
            setIsEmailValid(true)
            startTimer()
        } catch (error) {
            console.error("error", error)
            Toast.errorMsg(error.resposne.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerify = async () => {
        try {
            const payload = {
                email: emailToChangePassword,
                otp: Number(pin)
            }

            setIsVerifying(true)
            const { data } = await OtpService.verifyOtp(payload)
            Toast.successMsg(data.message)
            setIsupdatingPassword(true)
        } catch (error) {
            console.log("error", error);
            Toast.errorMsg(error.response.data.message)
        } finally {
            setIsVerifying(false)
        }
    }

    const handleCloseModal = () => {
        setIsLoading(false)
        setEmailToChangePassword("")
        setIsVerifying(false)
        setPin(null)
        setIsEmailValid(false)
        setSeconds(100)
        setStarted(false)
        setIsupdatingPassword(false)
        close()
    }

    const handleUpdatePassword = async (values) => {
        const payload = {
            email: emailToChangePassword,
            newPassword: values.newPassword
        }

        try {
            setIsLoading(true)
            const { data } = await AuthService.updatePassword(payload);
            Toast.successMsg(data.message);
            handleCloseModal();
            localStorage.removeItem("auth")

        } catch (error) {
            Toast.errorMsg(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Modal size={'xs'} opened={opened} onClose={handleCloseModal} centered title="Forgot Password">
                <Divider py={5} />
                {
                    isUpdatingPassword
                        ?
                        <>
                            <TextInput disabled value={emailToChangePassword} label="Email" required />
                            <PasswordInput
                                placeholder='Enter new password.'
                                label="New Password"
                                required
                                key={forgotPasswordForm.key('newPassword')}
                                {...forgotPasswordForm.getInputProps('newPassword')}
                            />
                            <PasswordInput
                                placeholder='Enter confirm password.'
                                label="Confirm password"
                                required
                                key={forgotPasswordForm.key('confirmPassword')}
                                {...forgotPasswordForm.getInputProps('confirmPassword')}
                            />
                            <SimpleGrid cols={2} mt={10}>
                                <Button
                                    variant='light'
                                    leftSection={<IconCheck />}
                                    onClick={forgotPasswordForm.onSubmit((values) => handleUpdatePassword(values))}
                                >
                                    {
                                        isLoading
                                            ?
                                            <>Updating ... <Loader size={'xs'} /></>
                                            :
                                            <>Update</>
                                    }
                                </Button>
                                <Button variant='light' leftSection={<IconX />} color='red' onClick={handleCloseModal}>Cancel</Button>
                            </SimpleGrid>
                        </>
                        :
                        <>
                            <TextInput
                                placeholder='Enter your email'
                                label="Email"
                                required
                                onChange={(event) => setEmailToChangePassword(event.currentTarget.value)}
                            />
                            <Flex justify={'center'} mt={5}>
                                <Button
                                    onClick={verfiyEmail}
                                    variant='light'
                                    color='red'
                                    disabled={started && seconds > 1}
                                >
                                    {
                                        isLoading
                                            ?
                                            <>Sending code ... <Loader size={'xs'} color='red' /></>
                                            :
                                            <>Send Code {started && seconds > 0 ? seconds : ""}</>
                                    }
                                </Button>
                            </Flex>
                            <Center>
                                <PinInput
                                    onChange={(value) => setPin(value)}
                                    my={10}
                                    inputType="tel"
                                    inputMode="numeric"
                                    disabled={!isEmailValid}
                                />
                            </Center>
                            <Flex justify={'center'}>
                                <Button
                                    variant='light'
                                    color='green'
                                    onClick={handleVerify}
                                    disabled={!pin}
                                >
                                    {
                                        isVerifying
                                            ?
                                            <>Verfiying ... <Loader size={'xs'} color='green' /></>
                                            :
                                            <>Verify</>
                                    }
                                </Button>
                            </Flex>
                        </>
                }
            </Modal>

            <Container
                bg="aliceblue"
                fluid
                style={{ height: "100vh" }}
            >
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

                            <TextInput
                                placeholder="Enter your email."
                                label="Email"
                                key={form.key('email')}
                                {...form.getInputProps('email')}
                                disabled={isLoading}
                                required
                            />
                            <PasswordInput
                                placeholder="Enter your password."
                                label="Password"
                                mt={10}
                                key={form.key('password')}
                                {...form.getInputProps('password')}
                                disabled={isLoading}
                                required
                            />
                            <Text onClick={open} size='xs' ta="right" mt={5}>Forgot Password?</Text>
                            <SimpleGrid cols={2} mt={20}>
                                <Button variant="light" color="blue" onClick={form.onSubmit((values) => handleLogin(values))}>
                                    {
                                        isLoading
                                            ?
                                            <Loader size={'xs'} />
                                            :
                                            <>Login</>
                                    }
                                </Button>
                                <Button disabled={isLoading} variant="light" color="violet" onClick={() => navigate("/signup")}>Sign up</Button>
                            </SimpleGrid>
                        </Paper>

                    </Flex>
                </Container>
            </Container>
        </>
    )
}

export default Login