import React from 'react'
import { Drawer, Button } from '@mantine/core';
import NavigationLinks from './NavigationLinks';

const SideNavigation = ({
    opened,
    close
}) => {

    return (
        <>
            <Drawer opened={opened} onClose={close} title="KBMS" size={'xs'}>
                <NavigationLinks />
            </Drawer>
        </>
    )
}

export default SideNavigation