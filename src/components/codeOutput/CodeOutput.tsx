import { useContext, useEffect, useState } from "react";
import { IoReload } from "react-icons/io5";
import EditorContext from "../../contexts/EditorContext";
import BACKEND_URL from "../../utils/config";

const CodeOutput = () => {
  const [URL, setURL] = useState(BACKEND_URL);
  const ctx = useContext(EditorContext);
  const { port } = ctx;
  const [reloadKey, setReloadKey] = useState(0); // State to force iframe reload

  const reloadIframe = () => {
    setReloadKey(prevKey => prevKey + 1); // Increment key to trigger reload
  };

  useEffect(() => {
    const url=BACKEND_URL.replace(':5000', `:${port}`);
    setURL(url);
  }, [port]);


  return (
    <>
      <div className="bg-black flex overflow-auto h-[5vh] text-gray-400 text-center">
        <button
          className="mr-2 px-3 py-1 bg-gray-800 rounded-full text-white "
          onClick={reloadIframe}
        >
          <IoReload />
        </button>
        <input className="w-full m-1 p-0.5 text-gray-700 rounded-full" value={URL} onChange={(e)=>setURL(e.target.value)}></input>
      </div>
      <iframe className="h-[95vh] w-full bg-white" src={URL} key={reloadKey}></iframe>
    </>
  );
};

export default CodeOutput;
