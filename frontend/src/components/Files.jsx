import React, { useState, useEffect } from 'react'
import Topbar from './Topbar'
import SideNavigation from './SideNavigation'
import { Button, Center, Container, CopyButton, Divider, FileInput, Flex, Loader, Menu, Modal, Select, SimpleGrid, Skeleton, Table, Text, Title, Tooltip } from '@mantine/core'
import { IconArrowBadgeLeft, IconCheck, IconCopy, IconDotsVertical, IconEyeCheck, IconFile, IconPlus, IconTrash, IconUpload, IconX } from '@tabler/icons-react'
import { useNavigate, useParams } from 'react-router-dom'
import UploadService from '../service/UploadService';
import Toast from '../toast/Toast'
import FilesService from '../service/FilesService'

const Files = () => {

    const navigate = useNavigate()
    const { folderName } = useParams()

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [isDeleteFileModalOpen, setIsDeleteFileModalOpen] = useState(false)
    const [isUploadMultipleModalOpen, setIsUploadMultipleModalOpen] = useState(false)
    const [uploadFile, setUploadFile] = useState(null)
    const [accept, setAccept] = useState("")
    const [fileType, setFileType] = useState("")
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [fileNameToDelete, setFileNameToDelete] = useState("")
    const [linkToCopy, setLinkToCopy] = useState("")
    const [multipleFilesToupload, setMultipleFilesToUpload] = useState([])
    const [searchValue, setSearchValue] = useState("")


    const getFileICon = (fileType, file) => {
        let type;
        if (file) {
            type = file.split('.')[file.split('.').length - 1]
            if (type === "png" || type === "jpg" || type === "jpeg" || type === "gif") {
                type = "photo"
            }
        }

        return <img style={{ height: 20, marginRight: 5 }} mr={3} src={`https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/item-types/16/${file ? type : fileType}.svg`} />
    }

    const fetchFiles = async () => {
        try {
            setIsLoading(true)
            const response = await FilesService.getFiles(folderName);
            setFiles(response.data.files);
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleUpload = async () => {

        if (!uploadFile) {
            Toast.errorMsg("Please upload your file");
            return
        }

        const formData = new FormData();
        formData.append('file', uploadFile);

        formData.append('folderName', folderName)

        try {
            setIsLoading(true)
            const { data } = await UploadService.uploadFile(formData, folderName)
            await fetchFiles();
            Toast.successMsg(data.message)
            setIsUploadModalOpen(false)
            setUploadFile(null)
        } catch (error) {
            console.error("error", error);
            // Toast.errorMsg(error.response.data.message)
        } finally {
            setIsLoading(false)
        }
    };

    const handleMultipleUpload = async () => {
        const formData = new FormData();
        for (let i = 0; i < multipleFilesToupload.length; i++) {
            formData.append('file', multipleFilesToupload[i]);
        }

        formData.append('folderName', folderName)

        try {
            setIsLoading(true)
            await UploadService.uploadFile(formData, folderName)
            await fetchFiles();
            Toast.successMsg("File/s uploaded successfully.")
            setIsUploadMultipleModalOpen(false);
        } catch (error) {
            Toast.errorMsg(error)
        } finally {
            setIsLoading(false)
        }
    }

    const openModal = (fileType) => {
        setIsUploadModalOpen(true)
        setFileType(fileType.toLowerCase())
        setAccept(
            fileType === "pdf"
                ? "application/pdf"
                : fileType === "docx"
                    ? "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    : fileType === "xlsx"
                        ? "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        : fileType === "photo"
                            ? "image/png,image/jpeg,image/gif,image/jpg"
                            : ""
        )
    }

    const removeTimeStamp = (file) => {
        if (!file) return;
        let fileNameParts = file.split('-');

        if (fileNameParts.length > 1) {
            fileNameParts.shift();
        }

        return fileNameParts.join('-');
    }

    const formatDate = (fileName) => {
        const timeStamp = fileName.split('-')[0]
        let date = new Date(timeStamp * 1);

        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        let year = date.getFullYear();

        return `${month}.${day}.${year}`;
    };

    const handleFileDelete = async () => {
        try {
            setIsLoading(true)
            const { data } = await UploadService.deleteFile(folderName, fileNameToDelete)
            await fetchFiles()
            Toast.successMsg(data.message)
            setIsDeleteFileModalOpen(false)
        } catch (error) {
            Toast.errorMsg(error.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleViewFile = (filename) => {
        const encodedFilename = encodeURIComponent(filename);
        const link = `${import.meta.env.VITE_API_KEY}/api/v1/files/${folderName}/${encodedFilename}`
        window.open(link, '_blank');
    };

    const getLinkToCopy = (filename) => {
        const encodedFilename = encodeURIComponent(filename);
        const link = `${import.meta.env.VITE_API_KEY}/api/v1/files/${folderName}/${encodedFilename}`
        setLinkToCopy(link)
    }

    const searchOptions = () => {
        return files?.map(file => file);
    }

    const filteredData = searchValue ? searchOptions().filter(option => removeTimeStamp(option) === searchValue) : searchOptions();

    return (
        <>
            <Topbar />
            <SideNavigation />

            <Modal centered opened={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Document(s)">
                <Divider pb={5} />
                <FileInput
                    leftSection={getFileICon(fileType)}
                    placeholder={`Upload ${fileType.toUpperCase()}`}
                    accept={accept}
                    label="Upload file"
                    onChange={setUploadFile}
                />
                <SimpleGrid cols={2} mt={20}>
                    <Button
                        variant='light'
                        onClick={handleUpload}
                    >
                        {
                            isLoading
                                ?
                                <Loader size="xs" />
                                :
                                <><IconUpload /> Upload</>
                        }
                    </Button>
                    <Button
                        variant='light'
                        color='red'
                        onClick={() => setIsUploadModalOpen(false)}
                    >
                        <IconX /> Cancel
                    </Button>
                </SimpleGrid>
            </Modal>

            <Modal centered opened={isUploadMultipleModalOpen} onClose={() => setIsUploadMultipleModalOpen(false)} title="Upload Document(s)">
                <Divider pb={5} />
                <FileInput
                    placeholder="Upload Files"
                    label="Upload files"
                    onChange={setMultipleFilesToUpload}
                    multiple
                />
                <SimpleGrid cols={2} mt={20}>
                    <Button
                        variant='light'
                        onClick={handleMultipleUpload}
                    >
                        {
                            isLoading
                                ?
                                <Loader size="xs" />
                                :
                                <><IconUpload /> Upload</>
                        }
                    </Button>
                    <Button
                        variant='light'
                        color='red'
                        onClick={() => setIsUploadMultipleModalOpen(false)}
                    >
                        <IconX /> Cancel
                    </Button>
                </SimpleGrid>
            </Modal>

            <Modal
                centered
                title="Delete File"
                opened={isDeleteFileModalOpen}
                onClose={() => setIsDeleteFileModalOpen(false)}
            >
                <Divider pb={20} />
                <Text>Are you sure you want to delete <span style={{ fontWeight: "bold", fontStyle: "italic" }}>{removeTimeStamp(fileNameToDelete)}</span> file?</Text>
                <br />
                This action cannot be undone.
                <SimpleGrid cols={2} mt={20}>
                    <Button
                        variant='light'
                        onClick={handleFileDelete}
                    >
                        {
                            isLoading
                                ?
                                <Loader size={'xs'} />
                                :
                                <><IconCheck size={20} style={{ marginRight: 5 }} /> Yes</>
                        }
                    </Button>
                    <Button
                        variant='light'
                        color='red'
                        onClick={() => setIsDeleteFileModalOpen(false)}
                    >
                        <IconX size={20} style={{ marginRight: 5 }} /> No
                    </Button>
                </SimpleGrid>
            </Modal>

            <Container mt={30}>
                <Flex justify={'space-between'}>
                    <Button variant='light' color='red' onClick={() => navigate("/documents")}>
                        <IconArrowBadgeLeft /> Back
                    </Button>
                    <Select
                        w={'50%'}
                        data={searchOptions().map((file) => removeTimeStamp(file))}
                        placeholder='Search files here.'
                        onChange={setSearchValue}
                        clearable
                        searchable
                    />
                    <Menu shadow='xl' position='bottom-start'>
                        <Menu.Target>
                            <Button variant='light' leftSection={<IconPlus />}>
                                New
                            </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Documents</Menu.Label>
                            <Menu.Item py={5} color='red' onClick={() => openModal('pdf')}>
                                <Flex align={'center'}>
                                    {getFileICon("pdf")} Upload PDF
                                </Flex>
                            </Menu.Item>
                            <Menu.Item py={5} color='blue' onClick={() => openModal('docx')}>
                                <Flex align={'center'}>
                                    {getFileICon("docx")} Upload DOCX
                                </Flex>
                            </Menu.Item>
                            <Menu.Item py={5} color='green' onClick={() => openModal('xlsx')}>
                                <Flex align={'center'}>
                                    {getFileICon("xlsx")} Upload XLSX
                                </Flex>

                            </Menu.Item>
                            <Menu.Label>Image</Menu.Label>
                            <Menu.Item py={5} color='pink' onClick={() => openModal('photo')}>
                                <Flex align={'center'}>
                                    {getFileICon("photo")} Upload Photo
                                </Flex>
                            </Menu.Item>
                            <Menu.Label>Multipe</Menu.Label>
                            <Menu.Item py={5} color='violet' onClick={() => setIsUploadMultipleModalOpen(true)}>
                                <Flex align={'center'}>
                                    <IconUpload size={25} />  Upload Multiple
                                </Flex>

                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Flex>
            </Container>

            <Container mt={30}>
                {
                    !filteredData || !filteredData.length
                        ?
                        <Title mt={50}><Center>No files found.</Center></Title>
                        :
                        <>
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th><IconFile /></Table.Th>
                                        <Table.Th>Name</Table.Th>
                                        <Table.Th>Date Created</Table.Th>
                                        <Table.Th></Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {
                                        filteredData.map((file, index) => (
                                            <Table.Tr key={index}>
                                                <Table.Td>
                                                    <Skeleton height={20} visible={isLoading}>
                                                        {getFileICon("", file)}
                                                    </Skeleton>
                                                </Table.Td>

                                                <Table.Td>
                                                    <Skeleton height={20} visible={isLoading}>
                                                        {removeTimeStamp(file)}
                                                    </Skeleton>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Skeleton height={20} visible={isLoading}>
                                                        {formatDate(file)}
                                                    </Skeleton>

                                                </Table.Td>
                                                <Table.Td>
                                                    <Skeleton height={20} visible={isLoading}>
                                                        <Menu
                                                            shadow='xl'
                                                            position='right'
                                                        >
                                                            <Menu.Target>
                                                                <IconDotsVertical
                                                                    onClick={() => {
                                                                        getLinkToCopy(file)
                                                                    }}
                                                                    size={15}
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </Menu.Target>
                                                            <Menu.Dropdown>
                                                                <Menu.Label>Actions</Menu.Label>
                                                                <Menu.Item
                                                                    leftSection={<IconEyeCheck size={20} />}
                                                                    color='blue'
                                                                    onClick={() => handleViewFile(file)}
                                                                >
                                                                    View
                                                                </Menu.Item>
                                                                <CopyButton value={linkToCopy} timeout={2000}>
                                                                    {({ copied, copy }) => (
                                                                        <Menu.Item
                                                                            color='green'
                                                                            leftSection={copied ? <IconCheck size={20} /> : <IconCopy size={20} />}
                                                                            onClick={() => {
                                                                                copy()
                                                                                Toast.successMsg("Copied")
                                                                            }}>
                                                                            {copied ? 'Copied' : 'Copy Link'}
                                                                        </Menu.Item>
                                                                    )}
                                                                </CopyButton>
                                                                <Menu.Item
                                                                    leftSection={<IconTrash size={20} />}
                                                                    color='red'
                                                                    onClick={() => {
                                                                        setIsDeleteFileModalOpen(true)
                                                                        setFileNameToDelete(file)
                                                                    }}
                                                                >
                                                                    Delete
                                                                </Menu.Item>
                                                            </Menu.Dropdown>
                                                        </Menu>
                                                    </Skeleton>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))
                                    }
                                </Table.Tbody>
                            </Table>
                        </>
                }
            </Container >
        </>
    )
}

export default Files