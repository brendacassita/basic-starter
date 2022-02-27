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
    console.log('linkData:', linkData)
    beforeApiCallSetup();
    try {
      // try to create link to db... post 'api/links'
      let res = await axios.post(
        "https://link-app-sp22.herokuapp.com/api/links",
        linkData
      );
      console.log(res.data);
      // add res.data (the created link from db) to links as this has the id
      setLinks([res.data, ...links]);
    } catch (err) {
      // there is backend validation checking for specific usernames, this 
      // is where you would handle that and other cases where link
      // was not saved to db
      console.log(err);
      debugger
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
