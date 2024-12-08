import CheckAuth from '@/components/constants/CheckAuth'
import VolunteerDashboard from '@/components/volunteer/VolunteerDashboard'
import React from 'react'

const VolunteerDashboardScreen = () => {
    return (
        <>
            <CheckAuth isPublic={false} />
            <VolunteerDashboard />
        </>
    )
}

export default VolunteerDashboardScreen