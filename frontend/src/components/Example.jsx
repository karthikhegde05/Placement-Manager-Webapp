import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useParams
  } from "react-router-dom";

  const Home = () =>{
    return (
      <h1>Home</h1>
    );
  };

  const About = () =>{
    return (
      <h1>About</h1>
    );
  };

  const Example = () => {
    return (
      <div>
        <h2>Accounts</h2>

        <ul>
          <li>
            <Link to="/netflix">Netflix</Link>
          </li>
          <li>
            <Link to="/zillow-group">Zillow Group</Link>
          </li>
          <li>
            <Link to="/yahoo">Yahoo</Link>
          </li>
          <li>
            <Link to="/modus-create">Modus Create</Link>
          </li>
        </ul>

        <Routes>
          <Route path="/:id" element={<Child />} />
        </Routes>
      </div>
    );
  };

  function Child() {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { id } = useParams();
  
    return (
      <div>
        <h3>ID: {id}</h3>
      </div>
    );
  }

  export default Example;