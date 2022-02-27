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
