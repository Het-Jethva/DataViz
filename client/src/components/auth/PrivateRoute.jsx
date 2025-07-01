import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../../redux/slices/authSlice'

const PrivateRoute = ({ children }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isAuthenticated } = useSelector((state) => state.auth)
    const [checkedSession, setCheckedSession] = useState(false)

    useEffect(() => {
        dispatch(getCurrentUser()).finally(() => setCheckedSession(true))
    }, [dispatch])

    useEffect(() => {
        if (checkedSession && !isAuthenticated) {
            navigate('/login')
        }
    }, [checkedSession, isAuthenticated, navigate])

    if (!checkedSession) {
        return <div>Loading...</div>
    }

    return children
}

export default PrivateRoute
