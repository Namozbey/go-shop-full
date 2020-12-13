import React from 'react'
import { Route } from 'react-router-dom'
import { Navbar } from './components/navbar/navbar'
// import { GlobalState } from "./GlobalState"

export const AppRoute = ({type = "", children, ...props}) => {
    return(
        <>
            {type === "auth"
                ? <Route {...props}>{children}</Route>
                : (
                    <>
                        <Route {...props}>
                            <Navbar />
                            {children}
                        </Route>
                    </>
                )
            }
        </>
    )
}