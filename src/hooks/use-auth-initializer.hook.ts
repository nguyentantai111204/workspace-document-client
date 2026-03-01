import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store.redux'
import { getProfile } from '../redux/account/account.action'


export const useAuthInitializer = () => {
    const dispatch = useAppDispatch()
    const { isAuthenticated, user } = useAppSelector((state) => state.account)

    useEffect(() => {
        if (isAuthenticated && !user) {
            dispatch(getProfile())
        }
    }, [dispatch, isAuthenticated, user])
}
