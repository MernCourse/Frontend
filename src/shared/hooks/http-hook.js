import { useCallback, useEffect, useRef, useState } from "react"


export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState()
    const [error, setError] = useState()

    const activeHttpRequests = useRef([])

    const sendRequest = useCallback( async (url, method = 'GET', body = null, headers = {}) => {
        setIsLoading(true)
        // If call is change from state midfly
        const httpAbortController = new AbortController()
        activeHttpRequests.current.push(httpAbortController)
        let response = false
        try {
            const call = await fetch(url, {
                method, 
                body,
                headers,
                signal: httpAbortController.signal
            })
            response = await call.json()
            
            activeHttpRequests.current = activeHttpRequests.current.filter(
                (reqCtrl) => reqCtrl !== httpAbortController
            )

            if (!call.ok){
                throw new Error(response.message)
            }
            setIsLoading(false)
            return response
        } catch (error) {
            setIsLoading(false)
            setError(error.message)
            throw error
        }
    }, [])

    const clearError = () => {
        setError(null)
    }

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach( abortCtrl => 
                abortCtrl.abort()
            );
        }
    }, [])
    return {isLoading, error, sendRequest, clearError}
}