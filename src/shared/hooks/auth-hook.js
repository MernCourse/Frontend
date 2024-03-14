import { useCallback, useEffect, useState } from "react";
import { USER_DATA_LOCAL_STORAGE } from "../util/Constans";

let logOutTimer = ''

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpDate, setTokenExpDate] = useState();
    const [userId, setUserId] = useState(false);

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token)
        setUserId(uid)
        const tokenExpData = expirationDate || new Date(new Date().getTime() + 1000*60*60)
        setTokenExpDate(tokenExpData)
        localStorage.setItem(
            USER_DATA_LOCAL_STORAGE, 
            JSON.stringify({
                userId: uid, 
                token: token, 
                expDate: tokenExpData.toISOString()
            }))
    }, []);

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        setTokenExpDate(null)
        localStorage.removeItem(USER_DATA_LOCAL_STORAGE)
    }, []);
     
    // Let's check if there is already a user logged in
    useEffect( () => {
        const userData = JSON.parse(localStorage.getItem(USER_DATA_LOCAL_STORAGE))
        if (userData && userData.token && (new Date(userData.expDate) > new Date())){
        login(userData.userId, userData.token, new Date(userData.expDate))
        }
    }, [login])

    useEffect( () => {
        if (token && tokenExpDate){
        const remainTime = tokenExpDate.getTime() - new Date().getTime()
        logOutTimer = setTimeout(logout, remainTime)
        } else {
        clearTimeout(logOutTimer)
        }
    }, [token, logout, tokenExpDate])

    return { token, login, logout, userId }
}