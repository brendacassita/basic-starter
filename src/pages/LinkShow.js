// renaming react router Link component to ReactRouterLink
// to not get confused with our Link component
import { Link as ReactRouterLink } from "react-router-dom"


const LinkShow = ()=>{
    return (
        <div>
            <h1>LinkShow Page</h1>
            <ReactRouterLink to='/'>back</ReactRouterLink>
        </div>
    )
}

export default LinkShow