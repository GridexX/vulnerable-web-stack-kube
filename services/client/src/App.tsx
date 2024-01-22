import cowLogo from "/logo.png";
import "./App.css";
import { useQuery } from "react-query";
import { useState } from "react";

function App() {
  const API_URL = import.meta.env.VITE_API_URL??"http://localhost:3000";

  const [message, setMessage] = useState("");
  const [fetchMessage, setFetchMessage] = useState(false);
  const [isError, setIsError] = useState(false);
  
  document.onkeydown = function (e) {
    if (e.key === "Enter") {
      setFetchMessage(true);
    }
  };
 
  const { data: cowprint, isFetching } = useQuery(message, async (): Promise<{stdout: string}> => {
    // Do a post request to the API with the message in the body
    const res = await fetch(`${API_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    // If the response is not OK, throw an error
    if (!res.ok) {
      setIsError(true);
    }
    // Return the body of the response
    return res.json();
  },
  {
    enabled: fetchMessage,
    retry: false,
    onSettled: () => setFetchMessage(false),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
 
  return (
    <>
      <div className="center">
        <a href="https://github.com/GridexX/vulnerable-web-stack-kube" target="_blank">
          <img src={cowLogo} className="logo" alt="Vite logo" />
        </a>
      <h1>CowSay</h1>
      <p className="read-the-docs">Print saying with the Cow 🐮</p>
      </div>
      <div className="card">
        {/* Define an input field and a button that retrieve the value of the input and send it */}
        <input type="text" disabled={isFetching} value={message} onChange={(e) => setMessage(e.target.value)} />
        <button disabled={isFetching} onClick={() => setFetchMessage(true)}>Send</button>
        {/* Display the result of the API call */}
        <div className="div-left">
        {isFetching && <p className="read-the-docs center
        ">Loading...</p>}
        {cowprint && !isFetching && <pre className={isError ? "error" : "text-left"}>{cowprint.stdout}</pre>}
        </div>

      </div>
      <p className={"read-the-docs"}>
        A website written by <a href="github.com/GridexX">GridexX</a> with <a href="https://vitejs.dev">Vite</a> and <a href="https://reactjs.org">React</a>
      </p>
    </>
  );
}

export default App;
