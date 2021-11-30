import { useServices } from "@core/services"
import React from "react"

export function IfAdmin({children}: React.PropsWithChildren<Record<string, unknown>>) {
    const { cognitoAuthService: { payload }} = useServices()
    return <>{payload.get()?.["cognito:groups"]?.some(groupName => groupName === "admin") && children}</>
}