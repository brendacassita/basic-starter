#  link-crud-with-api
This is a CRUD tutorial with in API (database)

github repos used here\
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
      <ReactRouterLink to="links/1">Show</ReactRouterLink>
      <ReactRouterLink to="links/new">New</ReactRouterLink>
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
      <code>
      {JSON.stringify(links)}
      </code>
    </div>
  );
};

export default Links;
```

