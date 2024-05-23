import React, { useState } from 'react'
import { NavLink, Box } from '@mantine/core';
import { IconHome, IconFiles, IconUser } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';

const NavigationLinks = () => {

    const { index } = useParams()


    const data = [
        { icon: IconHome, label: 'Home', href: '/home' },
        {
            icon: IconFiles,
            label: 'My Documents',
            href: '/documents'
        },
        { icon: IconUser, label: 'Account', href: '/account' },
    ];

    const items = data.map((item, i) => {
        console.log("i", i);
        return (
            <NavLink
                href={item.href}
                key={item.label}
                active={index === i}
                label={item.label}
                leftSection={<item.icon size="1rem" stroke={2} />}
            />
        )
    })


    return <Box w={'100%'}>{items}</Box>
}

export default NavigationLinks