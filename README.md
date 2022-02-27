#  link-crud-with-api
This is a CRUD tutorial with in API (database)

github repos used here\
[finished react app](https://github.com/jimibue/link-crud-with-api-sp22)\
[staterProject](https://github.com/jimibue/router-context-starter-sp22)\
[rails api](https://github.com/jimibue/links-api-sp22)
###  Getting Started: Setup Instructions

```
$ git clone git@github.com:jimibue/router-context-starter-sp22.git link-crud-with-api
$ cd  link-crud-with-api
$ yarn
$ yarn start

//  git/github: if you want to use github remove origin and
// create your own repo and added that origin
$ git remote rm origin
$ git remote add origin ssh-link
$ git add .
$ git commit -m 'init'
$ git push origin master

``` 

## Where to start?
I prefer to start with setting up basic routes and pages in react router.  let's stub out all the pages and add  in the navbar to get them setup

```
$ touch src/pages/Links.js && touch src/pages/Link.js &&  touch src/pages/LinkForm.js
```

```javascript
// Links.js
// renaming react router Link component to ReactRouterLink
// to not get confused with our Link component
import { Link as ReactRouterLink } from "react-router-dom"

const Links = ()=>{
    return (
        <div>
            <h1>Links Page</h1>
            <ReactRouterLink to='links/1'>Show</ReactRouterLink>
            <ReactRouterLink to='links/new'>New</ReactRouterLink>
        </div>
    )
}

export default Links

// Link.js
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

// LinkForm.js
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


// App.js
import { Link as ReactRouterLink, Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      <h1>Starter App</h1>
      <nav
        style={{
          borderBottom:'1px solid'
        }}
        >
          <ReactRouterLink to='/'>Links</ReactRouterLink> 
        </nav>
        <Outlet />
    </div>
  );
}

export default App;
```

index.js
```javascript
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import DataProvider from "./providers/DataProvider";
import Links from "./pages/Links";
import LinkForm from "./pages/LinkForm";
import LinkShow from "./pages/LinkShow";


const NotFound = ()=>{
  return <p>path not found</p>
}

ReactDOM.render(
  <DataProvider>
    <BrowserRouter>
      <Routes>
        <Route  path="/" element={<App />}>
          <Route index  element={<Links />} />
          <Route path="/links/new" element={<LinkForm />} />
          <Route path="/links/:id" element={<LinkShow />} />
          <Route path="/links/:id/edit" element={<LinkForm />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </DataProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

## What to next?
From here we could start building out our UI or we could start building out the CRUD
actions in our data provider or we could do complete CRUD actions completely one at time. What ever you choose is fine, try doing it in different ways and find your style. for now though lets fill out all of CRUD actions in the data provider since the new thing here is adding a DB to our crud actions and this will happen here

## API 
These our the routes for our api calls, note with some we need to pass the id of the link and others (create and update) we will need to pass the actual data from the form to the db

  - GET	/api/links	
    =>  return all links
  - POST	/api/links  {description,username(required), title, url} 
    => create link
  - GET	/api/links/:id =>	gets one link
  - PATCH	/api/links/:id  {description,username(required), title, url}
  - PUT	/api/links/:id => goes to api/links_controller#update
     =>  update link 
  - DELETE	/api/links/:id 
     =>  delete link 

     live api [https://link-app-sp22.herokuapp.com](https://link-app-sp22.herokuapp.com/api/links)


DataProvider.js
```javascript
import axios from "axios";
import React, { useState } from "react";

// createContext HERE this doing a lot for
// create Context/Provider, get and set out data
export const DataContext = React.createContext();

const DataProvider = (props) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // helper method just to reset loading/error statr
  const beforeApiCallSetup = () => {
    setLoading(true);
    setError(false);
  };
  // Notice that there is a lot of duplicate code in getLinks, updateLinks, and
  // deleteLinks; we could refactor this into one method but we will leave like this for now
  const getLinks = async () => {
    beforeApiCallSetup();
    try {
      // get data from DB get 'api/links'
      let res = await axios.get(
        "https://link-app-sp22.herokuapp.com/api/links"
      );
      setLinks(res.data);
    } catch (err) {
      alert("err occurred getting links");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const addLink = async (linkData) => {
    beforeApiCallSetup();
    try {
      // try to create link to db... post 'api/links'
      let res = await axios.post(
        "https://link-app-sp22.herokuapp.com/api/links",
        linkData
      );
      console.log(res.data);
      // add res.data (the created link from db) to links as this has the id
      setLinks([...links, res.data]);
    } catch (err) {
      // there is backend validation checking for specific usernames, this 
      // is where you would handle that and other cases where link
      // was not saved to db
      console.log(err);
      alert("err occured getting links");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const updateLink = async (linkData) => {
    beforeApiCallSetup();
    try {
      // try to update link to db
      let res = await axios.put(
        `https://link-app-sp22.herokuapp.com/api/links/${linkData.id}`,
        linkData
      );
      // you could use res.data here or linkData
      setLinks(links.map((l) => (l.id === res.data.id ? res.data : l)));
    } catch (err) {
      alert("err occured getting links");
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  const deleteLink = async (id) => {
    beforeApiCallSetup();
    try {
      // try to delete link to db
      let res = await axios.delete(
        `https://link-app-sp22.herokuapp.com/api/links/${id}`
      );
      // you could use res.data here or linkData
      setLinks(links.filter((l) => l.id !== id));
    } catch (err) {
      alert("err occured getting links");
    } finally {
      setLoading(false);
    }
  };

  // create an object that will be 'global state'
  const dataProviderThing = {
    links,
    getLinks,
    addLink,
    updateLink,
    deleteLink,
    loading,
    error,
  };
  // return the provider which will wrap my all app
  return (
    <DataContext.Provider value={dataProviderThing}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataProvider;
```

### Test
We just did a lot of work on the data provider, before we start building out
out UI we should test to see that it is working, we can build out a simple UI
to test all of these methods/state

Links.js
```javascript
import { useContext } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { DataContext } from "../providers/DataProvider";

const Links = () => {
  let { links, getLinks, addLink, updateLink, deleteLink,loading,error } =
    useContext(DataContext);
  return (
    <div>
      <h1>Links Page</h1>
     
      <p>CRUD TEST</p>
      <button onClick={getLinks}>get links</button>
      <button
        onClick={() => addLink({ username: "jamesy", title: "from react" })}
      >
        add links
      </button>
      <button onClick={() => updateLink({ ...links, title: "ChAnGED" })}>
        update links
      </button>
      <button onClick={() => deleteLink(links[0]? links[0].id:1)}>delete links</button>
      <p>loading state: {loading ? 'true':'false'}</p>
      <p>error state: {error ? 'true':'false'}</p>
      <ReactRouterLink to='links/new'>new link</ReactRouterLink>
      <code>
      {JSON.stringify(links)}
      </code>
    </div>
  );
};

export default Links;
```

### UI

Ok now we have tested our provider and it seems to be working along side with our api
from here we can start building out our components. let's first start with displaying our links

Links.js
```javascript
   ....
  const renderLinks = () => {
    return links.map((link) => {
      return (
        <div
          key={link.id}
          style={{ margin: "20px", padding: "20px", border: "1px dashed red" }}
        >
          <h1>{link.title}</h1>
          <a href={link.url} target="_blank">
            {link.title}
          </a>
          <p>{link.description}</p>
          <p>{link.username}</p>
          {/* Not here that this will disable all  buttons, even when just one is clicked */}
          <button disabled={loading} onClick={() => deleteLink(link.id)}>
            delete
          </button>
          <ReactRouterLink to={`links/${link.id}`}>show</ReactRouterLink>
          <ReactRouterLink to={`links/${link.id}/edit`}>edit</ReactRouterLink>
        </div>
      );
    });
  };
    ...
```

## LinkShow UI
there are two ways we could grab the data when we go to LinkShow page, we could pass it through with react router or we could do an api call when the page loads... let's do the later. but to do that we will need the useEffect hook.  The useEffect hook allows to run code when our components 'mounts' to the dom (ie when it load to the browser)

```javascript
    useEffect(()=>{
        // cb runs when component mounts
    },[])
```

LinkShow.js
```javascript
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
```


## LinkForm.js
```javascript
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
```

