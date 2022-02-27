import { useContext, useState } from "react"
import { Link as ReactRouterLink, useLocation, useNavigate, useParams } from "react-router-dom"
import { DataContext } from "../providers/DataProvider"
const LinkForm = (props)=>{
    // grab our global data and setters.
    const {updateLink, addLink, error} =  useContext(DataContext)
    // used to navigate to different links
    const navigate = useNavigate()
    // used to location.state to grab data sent by link
    const {state} = useLocation()
    // used to grab id from url
    const params = useParams()
    // check to see if we get a title from props, if not check to see if we get it from router
    // if not just set to empty
    const [title, setTitle] = useState(props.title || state && state.title || '')
    const [description, setDescription] = useState(props.description || state && state.description || '')
    const [username, setUsername] = useState(props.username || state && state.username || '')
    const [url, setUrl] = useState(props.url || state && state.url || '')
    // console.log('location', location)
    const handleSubmit = (e)=>{
        e.preventDefault()
        // if we have an id it is an edit
        let linkData = {title, description, username, url }
        if(params.id){
            updateLink({id:params.id, ...linkData })
            // HMM.. it updates to DB but not to UI we have to refresh to
            // see the changes
            navigateBack()
        } else {
            addLink(linkData)
            // go back to links page
            navigate('/')
        }
    }
    const navigateBack = ()=>{
        // confusing here
        if(props.id){
          props.setEditing(false)
        } else{
           navigate('/')
        }
    }
    return (
        <div>
            <h1>LinkForm Page</h1>
            {error && <p>ERROR OCCURED</p>}
            <ReactRouterLink to='/'>back</ReactRouterLink>

            <form onSubmit={handleSubmit} style={{border:'1px dashed red'}}>
                <p>title</p>
                <input value={title} onChange={(e)=>setTitle(e.target.value)} />
                <p>description</p>
                <input value={description} onChange={(e)=>setDescription(e.target.value)} />
                <p>username</p>
                <input required value={username} onChange={(e)=>setUsername(e.target.value)} />
                <p>url</p>
                <input required value={url} onChange={(e)=>setUrl(e.target.value)} />
                <br />
                <button type='submit'>{params.id  ? 'update':'add'}</button>
                <button onClick={navigateBack}>cancel</button>
            </form>
        </div>
    )
}

export default LinkForm