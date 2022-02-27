// renaming react router Link component to ReactRouterLink
// to not get confused with our Link component
import axios from "axios"
import { useEffect, useState } from "react"
import { Link as ReactRouterLink, useParams } from "react-router-dom"
import LinkForm from "./LinkForm"


const LinkShow = ()=>{
    // just grabbing on link expect it to be an object

    const [link, setLink] = useState({})
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    // need to grab id form url
    const {id} = useParams()
    useEffect(()=>{
        getLink()
    },[])

    // we can do axios calls and have state outside of out provider
    const getLink = async ()=>{
        // get => 'api/links/:id
       let res = await axios.get(`https://link-app-sp22.herokuapp.com/api/links/${id}`)
       setLink(res.data)
       setLoading(false)
    }
    if(loading) return <p>loading</p>
    // need to pass setEditing so that we can change editing state there...
    // This does not go to /links/:id/edit page, it just shows it here
    // in the links/:id page (LinkShow)
    if( editing) return <LinkForm setEditing={setEditing} {...link}/>
    return (
        <div>
            <h1>LinkShow Page</h1>
            {JSON.stringify(link)}
            <button onClick={()=> setEditing(true)}>edit</button>
            <ReactRouterLink to='/'>back</ReactRouterLink>
        </div>
    )
}

export default LinkShow