import React, { useState, useEffect } from 'react'
import Topbar from './Topbar'
import SideNavigation from './SideNavigation'
import { Group, Button, Center, Container, Divider, Flex, Grid, Loader, Menu, Modal, Select, SimpleGrid, Skeleton, Stack, Table, Text, TextInput, Title, Image, List } from '@mantine/core'
import { IconArrowsMaximize, IconArticle, IconCheck, IconCircle, IconCircle0, IconDotsVertical, IconEdit, IconEyeCheck, IconFolder, IconLayoutGrid, IconLayoutSidebarRightExpand, IconList, IconListDetails, IconMinus, IconPlus, IconTrash, IconX } from '@tabler/icons-react'
import Toast from '../toast/Toast'
import FolderService from '../service/FolderService'
import { useNavigate } from 'react-router-dom'
import folderImg from '../assets/folder.png'

const MyDocuments = () => {

    const navigate = useNavigate()
    const account = JSON.parse(localStorage.getItem("auth"))

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

    const [view, setView] = useState(localStorage.getItem("view"))

    const handleCreateFolder = async () => {
        console.log("account", account);
        if (!folderName) {
            Toast.errorMsg("Please enter folder name.")
            return;
        }
        try {
            setIsLoading(true)
            const { data } = await FolderService.createFolder({
                folderName,
                email: account?.user?.email
            })
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
            const { data } = await FolderService.getAllFolders(account?.user?.email)
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

    const iconProps = {
        stroke: 1.5,
        color: 'currentColor',
        opacity: 0.6,
        size: 18,
    };

    const icons = {
        extraLargeIcons: <IconArrowsMaximize  {...iconProps} />,
        largeIcons: <IconLayoutSidebarRightExpand  {...iconProps} />,
        mediumIcons: <IconCircle {...iconProps} />,
        smallIcons: <IconMinus  {...iconProps} />,
        list: <IconList  {...iconProps} />,
        details: <IconListDetails  {...iconProps} />,
        tiles: <IconLayoutGrid  {...iconProps} />,
        content: <IconArticle  {...iconProps} />,
    };

    const renderSelectOption = ({ option, checked }) => (
        <Group flex="1" gap="xs">
            {icons[option.value]}
            {option.label}
            {checked && <IconCheck style={{ marginInlineStart: 'auto' }} {...iconProps} />}
        </Group>
    );

    const renderFolders = () => {
        switch (view) {
            case "extraLargeIcons":
                return (
                    <SimpleGrid cols={3}>
                        {
                            filteredData && filteredData.length > 0
                                ?
                                filteredData.map((folder, index) => (
                                    <Flex direction={'column'} style={{ cursor: "pointer" }} onClick={() => navigate(`/documents/${folder.label}`)}>
                                        {folder.label}
                                        <Image src={folderImg} h={300} />
                                    </Flex>
                                ))
                                :
                                <></>
                        }
                    </SimpleGrid>
                )
            case "largeIcons":
                return (
                    <SimpleGrid cols={4}>
                        {
                            filteredData && filteredData.length > 0
                                ?
                                filteredData.map((folder, index) => (
                                    <Flex direction={'column'} style={{ cursor: "pointer" }} onClick={() => navigate(`/documents/${folder.label}`)}>
                                        {folder.label}
                                        <Image src={folderImg} h={300} />
                                    </Flex>
                                ))
                                :
                                <></>
                        }
                    </SimpleGrid>
                )
            case "mediumIcons":
                return (
                    <SimpleGrid cols={6}>
                        {
                            filteredData && filteredData.length > 0
                                ?
                                filteredData.map((folder, index) => (
                                    <Flex direction={'column'} style={{ cursor: "pointer" }} onClick={() => navigate(`/documents/${folder.label}`)}>
                                        {folder.label}
                                        <Image src={folderImg} h={300} />
                                    </Flex>
                                ))
                                :
                                <></>
                        }
                    </SimpleGrid>
                )
            case "smallIcons":
                return (
                    <SimpleGrid cols={8}>
                        {
                            filteredData && filteredData.length > 0
                                ?
                                filteredData.map((folder, index) => (
                                    <Flex direction={'column'} style={{ cursor: "pointer" }} onClick={() => navigate(`/documents/${folder.label}`)}>
                                        {folder.label}
                                        <Image src={folderImg} h={300} />
                                    </Flex>
                                ))
                                :
                                <></>
                        }
                    </SimpleGrid>
                )
            case "list":
                return (
                    <>
                        {
                            filteredData && filteredData.length > 0
                                ?
                                filteredData.map((folder, index) => (
                                    <List style={{ cursor: "pointer" }} onClick={() => navigate(`/documents/${folder.label}`)}>
                                        <List.Item mb={10}>{folder.label}</List.Item>
                                    </List>
                                ))
                                :
                                <></>
                        }
                    </>
                )
            case "details":
                return (
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
                )
            case "tiles":
                return (
                    <SimpleGrid cols={5}>
                        {
                            filteredData && filteredData.length > 0
                                ?
                                filteredData.map((folder, index) => (
                                    <Flex style={{ cursor: "pointer" }} onClick={() => navigate(`/documents/${folder.label}`)}>
                                        <Image src={folderImg} h={30} />
                                        <Text ms={10}>{folder.label}</Text>
                                    </Flex>
                                ))
                                :
                                <></>
                        }
                    </SimpleGrid>
                )
        }
    }

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
                    <Flex gap={'md'}>
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
                            data={[
                                { value: "extraLargeIcons", label: "Extra Large Icons" },
                                { value: "largeIcons", label: "Large Icons" },
                                { value: "mediumIcons", label: "Medium Icons" },
                                { value: "smallIcons", label: "Small Icons" },
                                { value: "list", label: "List" },
                                { value: "details", label: "Details" },
                                { value: "tiles", label: "Tiles" },
                            ]}
                            value={view}
                            placeholder='View'
                            renderOption={renderSelectOption}
                            searchable
                            onChange={(_, option) => {
                                localStorage.setItem("view", option.value)
                                setView(option.value)
                            }}
                        />
                    </Flex>
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
                            {renderFolders()}
                        </>
                }
            </Container >
        </>
    )
}

export default MyDocuments