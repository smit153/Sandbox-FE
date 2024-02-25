import { useContext, useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { color } from "@uiw/codemirror-extensions-color";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_SANDBOX_CODE, GET_OUTPUT_LOGS } from "../../resolvers/data";
import EditorContext from "../../contexts/EditorContext";
import ToastUI from "../home/Toast";
import { useToast } from "../../hooks/useToast";
import { ImCross } from "react-icons/im";
import "./CodeEditor.css";
import Ansi  from "./AnsiRenderer";


const CodeEditor = ({ containerLoading }: { containerLoading: boolean }) => {
  const [code, setCode] = useState("");
  const [activeFileList, setActiveFileList] = useState<string[]>([]);
  const [outputLog, setOutputLog] = useState<string>("");
  const ctx = useContext(EditorContext);
  const { errors, setErrors, openToast } = useToast();

  const {
    activeFile,
    sandboxCode,
    editor,
    setSandboxCode,
    setActiveFile,
    port,
  } = ctx;

  const [updateSandboxCode] = useMutation(UPDATE_SANDBOX_CODE, {
    onError: (error) => setErrors(error.message),
  });
  const { error, data, refetch } = useQuery(GET_OUTPUT_LOGS, {
    variables: { port: port },
  });
  const height = window.innerHeight * 0.75;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!containerLoading) refetch();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [refetch, containerLoading]);

  useEffect(() => {
    if (data) {
      setOutputLog(data.getOutput);
    }
    if (error) {
      setErrors(error.message);
    }
  }, [data, error, setErrors]);

  useEffect(() => {
    const handleCodeUpdate = async () => {
      if (activeFile) {
        await updateSandboxCode({
          variables: {
            sandboxId: editor,
            filename: activeFile,
            code: code,
            port: port,
          },
        });
        setSandboxCode((prev) => {
          return prev.map((file) => {
            if (file.filename === activeFile) {
              return { filename: file.filename, code: code };
            }
            return file;
          });
        });
      }
    };

    const timeoutId = setTimeout(() => {
      handleCodeUpdate();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [activeFile, code, editor, setSandboxCode, updateSandboxCode, port]);

  useEffect(() => {
    if (activeFile) {
      const file = sandboxCode.find((file) => file.filename === activeFile);
      if (!activeFileList.includes(activeFile))
        setActiveFileList((prev) => [...prev, activeFile]);
      if (file) {
        setCode(file.code);
      }
    }
  }, [activeFile, activeFileList, sandboxCode]);
  console.log("activeFile", activeFile, activeFileList);

  const handleRemoveFile = (file: string) => {
    setActiveFileList((prev) => prev.filter((f) => f !== file));
    if (activeFileList.length > 1) {
      setActiveFile(activeFileList[0]);
    }
  };

  return (
    <>
      <ToastUI openToast={openToast} message={errors} success={false} />
      <div className="bg-black flex overflow-auto cm-scroller h-[5vh]">
        {activeFileList.map((file) => {
          return (
            <div className="relative w-fit" key={file}>
              <ImCross
                className="absolute right-1 text-white top-[50%] translate-y-[-50%] cursor-pointer p-0.5 hover:bg-white rounded-full hover:text-black"
                size={15}
                onClick={() => handleRemoveFile(file)}
              />
              <div
                className={`text-white h-8 border-r-2 border-zinc-600 hover:bg-zinc-600 cursor-pointer flex items-center ${
                  file === activeFile ? "bg-zinc-600" : ""
                }`}
                onClick={() => setActiveFile(file)}
              >
                <p className="text-sm text-center ml-2 mr-6  w-full">
                  {file.split("/").pop()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <CodeMirror
        value={code}
        extensions={[javascript({ jsx: true }), color]}
        height={`${height}px`}
        theme={tokyoNight}
        onChange={(value) => {
          setCode(value);
        }}
      />
      <pre
        className="h-[20vh] text-xs bg-black text-white overflow-y-auto cm-scroller text-wrap"
       
      >
        <Ansi  text={outputLog} />
      </pre>
    </>
  );
};

export default CodeEditor;
