import React, { useState, createContext, ReactNode, Dispatch, SetStateAction } from "react";
import { codeSchema } from "../types/types";

interface EditorContextProps {
  editor: string;
  setEditor: Dispatch<SetStateAction<string>>;
  sandboxName: string;
  setSandboxName: Dispatch<SetStateAction<string>>;
  sandboxType: string;
  setSandboxType: Dispatch<SetStateAction<string>>;
  sandboxCode: codeSchema[];
  setSandboxCode: Dispatch<SetStateAction<codeSchema[]>>;
  activeFile: string;
  setActiveFile: Dispatch<SetStateAction<string>>;
  port: number;
  setPort: Dispatch<SetStateAction<number>>;
}

const EditorContext = createContext<EditorContextProps>({
  editor: "",
  setEditor: () => {},
  sandboxName: "",
  setSandboxName: () => {},
  sandboxType: "",
  setSandboxType: () => {},
  sandboxCode: [],
  setSandboxCode: () => {},
  activeFile: "",
  setActiveFile: () => {},
  port: 0,
  setPort: () => {},
});

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [editor, setEditor] = useState<string>("");
  const [sandboxName, setSandboxName] = useState<string>("");
  const [sandboxType, setSandboxType] = useState<string>("");
  const [sandboxCode, setSandboxCode] = useState<codeSchema[]>([]);
  const [activeFile, setActiveFile] = useState<string>("");
  const [port, setPort] = useState<number>(0);
  
  const contextValue: EditorContextProps = {
    editor,
    setEditor,
    sandboxName,
    setSandboxName,
    sandboxType,
    setSandboxType,
    sandboxCode,
    setSandboxCode,
    activeFile,
    setActiveFile,
    port,
    setPort,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorContext;
