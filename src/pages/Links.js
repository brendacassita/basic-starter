// renaming react router Link component to ReactRouterLink
// to not get confused with our Link component
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
      {JSON.stringify(links)}
    </div>
  );
};

export default Links;
