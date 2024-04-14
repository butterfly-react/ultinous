'use client'

import { useEffect } from 'react'
import { Crisp } from 'crisp-sdk-web'

export const CrispChat = () => {

    useEffect(() => {
        Crisp.configure('a06d27b4-1a7c-4d6a-bae7-fb93057aae5e')

    }, [])

    return null

}