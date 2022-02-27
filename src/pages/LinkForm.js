import { Link as ReactRouterLink } from "react-router-dom"
const LinkForm = ()=>{
    return (
        <div>
            <h1>LinkForm Page</h1>
            <ReactRouterLink to='/'>back</ReactRouterLink>
        </div>
    )
}

export default LinkForm