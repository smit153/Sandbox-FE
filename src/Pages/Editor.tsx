import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import EditorContext from "../contexts/EditorContext";
import CodeEditor from "../components/codeEditor/CodeEditor";
import SideBar from "../components/sidebar/SideBar";
import CodeOutput from "../components/codeOutput/CodeOutput";
import ToastUI from "../components/home/Toast";
import Loader from "../components/home/Loader";
import { useToast } from "../hooks/useToast";
import { GET_SANDBOX, CLEAN_UP_SANDBOX } from "../resolvers/data";
const Editor = () => {
  const [currentPort, setCurrentPort] = useState(0);
  const { id } = useParams();
  const ctx = useContext(EditorContext);
  const {
    setEditor,
    setSandboxName,
    setSandboxType,
    setSandboxCode,
    setPort
  } = ctx;
  const { errors, setErrors, openToast } = useToast();

  useEffect(() => {
    if (id) setEditor(id);
  }, [id, setEditor]);

  const { loading, error, data } = useQuery(GET_SANDBOX, {
    variables: { getSandboxId: id },
  });

  const [cleanUpSandbox] = useMutation(CLEAN_UP_SANDBOX);

  useEffect(() => {
    if (error) {
      setErrors(error.message);
    }
  }, [error, setErrors]);

  useEffect(() => {
    if (data) {
      setSandboxName(data.getSandbox.sandbox.name);
      setSandboxType(data.getSandbox.sandbox.type);
      setSandboxCode(data.getSandbox.sandbox.codes);
      setPort(data.getSandbox.port);
      setCurrentPort(data.getSandbox.port);
    }
  }, [data, setSandboxName, setSandboxType, setSandboxCode, setPort]);

  const handleCleanUp = async () => {
    await cleanUpSandbox({ variables: { port: currentPort } });
  };
  console.log(currentPort);
  
  useEffect(() => {
    const cleanUp = async () => {
      await cleanUpSandbox({ variables: { port: currentPort } });
    };
    
    window.addEventListener("unload", cleanUp);

    return () => {
      window.removeEventListener("unload", cleanUp);
    };
  }, [cleanUpSandbox, currentPort]);

  return (
    <>
      <Loader loading={loading} />
      <div className="flex justify-between h-[100vh] w-[100vw] bg-gray-900">
        <ToastUI openToast={openToast} message={errors} success={false} />
        <div className="w-[20vw]">
          <SideBar handleCleanUp={handleCleanUp}/>
        </div>

        <div className="w-[40vw]">
          <CodeEditor containerLoading={loading}/>
        </div>

        <div className="w-[40vw]">
          <CodeOutput />
        </div>
      </div>
    </>
  );
};

export default Editor;
