import React, { useState, useEffect } from 'react'
import Topbar from './Topbar'
import SideNavigation from './SideNavigation'
import { Button, Center, Container, Divider, Flex, Grid, Loader, Menu, Modal, Select, SimpleGrid, Skeleton, Table, Text, TextInput, Title } from '@mantine/core'
import { IconCheck, IconDotsVertical, IconEdit, IconEyeCheck, IconFolder, IconPlus, IconTrash, IconX } from '@tabler/icons-react'
import Toast from '../toast/Toast'
import FolderService from '../service/FolderService'
import { useNavigate } from 'react-router-dom'
import folderImg from '../assets/folder.png'

const MyDocuments = () => {

    const navigate = useNavigate()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [folderName, setIsFolderName] = useState(false);
    const [folders, setFolders] = useState([])
    const [isDeleteFolderModalOpen, setIsDeleteFolderModalOpen] = useState(false)
    const [folderDetailsToDelete, setFolderDetailsToDelete] = useState({
        id: 0,
        name: ""
    })
    const [updatedFolder, setUpdatedFolder] = useState({
        id: 0,
        name: ""
    })
    const [updatedFolderNameModal, setUpdatedFolderNameModal] = useState(false)
    const [searchValue, setSearchValue] = useState("")

    const handleCreateFolder = async () => {
        if (!folderName) {
            Toast.errorMsg("Please enter folder name.")
            return;
        }
        try {
            setIsLoading(true)
            const { data } = await FolderService.createFolder({ folderName })
            setFolders(data.folders)
            Toast.successMsg(data.message)
            await getFolders()
            setIsModalOpen(false)
        } catch (error) {
            Toast.errorMsg(error.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    const getFolders = async () => {
        try {
            setIsLoading(true)
            const { data } = await FolderService.getAllFolders()
            setFolders(data.folders)
        } catch (error) {
            Toast.errorMsg(error.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getFolders();
    }, [])

    const openDeleteFolderModal = async (id, name) => {
        setIsDeleteFolderModalOpen(true)
        setFolderDetailsToDelete({ id, name })
    }

    const handleDeleteFolder = async () => {
        try {
            setIsLoading(true)
            const { data } =
                await FolderService.deleteFolder(folderDetailsToDelete.id, folderDetailsToDelete.name)
            await getFolders()
            Toast.successMsg(data.message)
            setIsDeleteFolderModalOpen(false)
        } catch (error) {
            Toast.errorMsg(error.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateFolderName = async () => {
        console.log("up", updatedFolder);

        try {
            setIsLoading(true)
            const { data } = await FolderService.updateFolderName(updatedFolder.id, updatedFolder.name)
            await getFolders()
            Toast.successMsg(data.message)
            setUpdatedFolderNameModal(false)
        } catch (error) {
            Toast.errorMsg(error.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateStr) => {
        const dateObj = new Date(dateStr);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '.'); // Replace slashes with periods
        return formattedDate;
    }

    const searchOptions = () => {
        return folders?.map(folder => ({
            value: folder._id,
            label: folder.folderName,
            createdAt: folder.createdAt
        }));
    }

    const filteredData = searchValue ? searchOptions().filter(option => option.value === searchValue) : searchOptions();


    return (
        <>
            <Topbar />
            <SideNavigation />

            <Modal
                centered
                title="Update Folder Name"
                opened={updatedFolderNameModal}
                onClose={() => setUpdatedFolderNameModal(false)}
            >
                <Divider pb={5} />

                <TextInput
                    label="Folder name"
                    required
                    placeholder='Enter folder name'
                    value={updatedFolder.name}
                    onChange={(e) => setUpdatedFolder({
                        ...updatedFolder,
                        name: e.target.value
                    })}
                />

                <SimpleGrid cols={2} mt={20}>
                    <Button
                        variant='light'
                        onClick={handleUpdateFolderName}
                    >
                        {
                            isLoading
                                ?
                                <Loader size={'xs'} />
                                :
                                <><IconCheck size={20} /> Update</>
                        }

                    </Button>
                    <Button
                        variant='light'
                        color='red'
                        onClick={() => setUpdatedFolderNameModal(false)}
                    >
                        <IconX size={20} /> Cancel
                    </Button>
                </SimpleGrid>

            </Modal>

            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                centered
                title="Create Folder?"
            >
                <Divider pb={5} />

                <Grid align='end'>
                    <Grid.Col span={8}>
                        <TextInput
                            label="Folder name"
                            placeholder='Enter folder name'
                            required
                            onChange={(e) => setIsFolderName(e.target.value)}
                        />
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Button
                            variant='light'
                            onClick={handleCreateFolder}
                        >
                            {
                                isLoading
                                    ?
                                    <Loader size={'xs'} />
                                    :
                                    <IconCheck size={20} />
                            }
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Button variant='light' color='red' onClick={() => setIsModalOpen(false)}><IconX /></Button>
                    </Grid.Col>
                </Grid>
            </Modal>

            <Modal centered title="Delete Folder?" opened={isDeleteFolderModalOpen} onClose={() => setIsDeleteFolderModalOpen(false)}>
                <Divider pb={20} />
                <Text>Are you sure you want to delete <span style={{ fontWeight: "bold", fontStyle: "italic" }}>{folderDetailsToDelete.name}</span> folder?</Text>
                <br />
                This action cannot be undone.

                <SimpleGrid cols={2} mt={20}>
                    <Button
                        variant='light'
                        onClick={handleDeleteFolder}
                    >
                        <IconCheck size={20} /> Yes
                    </Button>
                    <Button
                        variant='light'
                        color='red'
                        onClick={() => setIsDeleteFolderModalOpen(false)}
                    >
                        <IconX size={20} /> No
                    </Button>
                </SimpleGrid>
            </Modal>

            <Container mt={30}>
                <Flex justify={'space-between'} align={'center'}>
                    <Menu shadow='xl' position='bottom-start'>
                        <Menu.Target>
                            <Button variant='light' leftSection={<IconPlus />}>
                                New
                            </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Folders</Menu.Label>
                            <Menu.Item leftSection={<IconFolder size={20} />} onClick={() => setIsModalOpen(true)}>
                                Create Folder
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                    <Select
                        placeholder='Search folder here'
                        searchable
                        data={searchOptions()}
                        nothingFoundMessage="Nothing found."
                        w={'30%'}
                        clearable
                        onChange={setSearchValue}
                    />
                </Flex>
            </Container>

            <Container mt={30}>
                {
                    !filteredData || !filteredData.length
                        ?
                        <Title mt={50}><Center>No folders found.</Center></Title>
                        :
                        <>
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th><IconFolder /></Table.Th>
                                        <Table.Th>Name</Table.Th>
                                        <Table.Th>Date Created</Table.Th>
                                        <Table.Th></Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {
                                        filteredData && filteredData.length > 0
                                            ?
                                            filteredData.map((folder, index) => (
                                                <Table.Tr key={index}>
                                                    <Table.Td>
                                                        <Skeleton height={20} visible={isLoading}>
                                                            <img src={folderImg} height={20} />
                                                        </Skeleton>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Skeleton height={20} visible={isLoading}>
                                                            {folder.label}
                                                        </Skeleton>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Skeleton height={20} visible={isLoading}>
                                                            {formatDate(folder.createdAt)}
                                                        </Skeleton>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Skeleton height={20} visible={isLoading}>
                                                            <Menu shadow='xl' position='right'>
                                                                <Menu.Target>
                                                                    <IconDotsVertical size={15} style={{ cursor: "pointer" }} />
                                                                </Menu.Target>
                                                                <Menu.Dropdown>
                                                                    <Menu.Label>Actions</Menu.Label>
                                                                    <Menu.Item
                                                                        leftSection={<IconEyeCheck size={20} />}
                                                                        onClick={() => navigate(`/documents/${folder.label}`)}
                                                                        color='blue'
                                                                    >
                                                                        Open
                                                                    </Menu.Item>
                                                                    <Menu.Item
                                                                        leftSection={<IconEdit size={20} />}
                                                                        color='green'
                                                                        onClick={() => {
                                                                            setUpdatedFolderNameModal(true)
                                                                            setUpdatedFolder({
                                                                                id: folder.value,
                                                                                name: folder.label
                                                                            })
                                                                        }}
                                                                    >
                                                                        Update
                                                                    </Menu.Item>
                                                                    <Menu.Item
                                                                        leftSection={<IconTrash size={20} color='red' />}
                                                                        onClick={() => openDeleteFolderModal(folder.value, folder.label)}
                                                                        color='red'
                                                                    >
                                                                        Delete
                                                                    </Menu.Item>
                                                                </Menu.Dropdown>

                                                            </Menu>
                                                        </Skeleton>
                                                    </Table.Td>
                                                </Table.Tr>
                                            ))
                                            :
                                            <></>
                                    }
                                </Table.Tbody>
                            </Table>
                        </>
                }
            </Container >
        </>
    )
}

export default MyDocuments