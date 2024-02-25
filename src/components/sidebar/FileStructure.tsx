import React, { useContext, useState } from "react";
import { FaFileAlt, FaAngleRight } from "react-icons/fa";
import EditorContext from "../../contexts/EditorContext";
import AddFile from "./AddFile";

interface File {
  filename: string;
  code: string;
}

interface Folder {
  name: string;
  files: File[];
  folders: { [folderName: string]: Folder };
}

const FileStructure: React.FC<{ files: File[] }> = ({ files }) => {
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const rootFolder: Folder = { name: "", files: [], folders: {} };
  const ctx = useContext(EditorContext);

  // Preprocess data to organize files into folders
  files.forEach((file) => {
    const parts = file.filename.split("/");
    let currentFolder = rootFolder;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // Last part, it's a file
        currentFolder.files.push(file);
      } else {
        // Check if folder exists, if not, create it
        if (!currentFolder.folders[part]) {
          currentFolder.folders[part] = { name: part, files: [], folders: {} };
        }
        currentFolder = currentFolder.folders[part];
      }
    });
  });

  const toggleFolder = (folderPath: string) => {
    if (openFolders.includes(folderPath)) {
      setOpenFolders(openFolders.filter((path) => path !== folderPath));
    } else {
      setOpenFolders([...openFolders, folderPath]);
    }
  };

  const renderFile = (file: File, indentation: number) => (
    <div
      style={{ paddingLeft: `${indentation * 1.1}rem` }}
      key={file.filename}
      className="my-1 cursor-pointer"
      onClick={() => {
        ctx.setActiveFile(file.filename);
      }}
    >
      <div className="w-4 h-4 inline-block mr-1">
        <FaFileAlt />
      </div>
      <span>{file.filename.split("/").pop()}</span>
    </div>
  );

  const renderFolder = (
    folder: Folder,
    folderPath: string,
    indentation: number
  ) => (
    <div key={folder.name}>
      <div
        style={{ paddingLeft: `${indentation}rem` }}
        className="cursor-pointer my-1"
        onClick={() => toggleFolder(folderPath)}
      >
        <div
          className={`w-4 h-4 inline-block mr-1 transform  ${
            openFolders.includes(folderPath) ? "rotate-90 pl-1" : "pt-1"
          }`}
        >
          <FaAngleRight />
        </div>
        <span>{folder.name}</span>
      </div>
      {openFolders.includes(folderPath) && (
        <div>
          {Object.values(folder.folders).map((subFolder) =>
            renderFolder(
              subFolder,
              `${folderPath}/${subFolder.name}`,
              indentation + 1
            )
          )}
          {folder.files.map((file) => renderFile(file, indentation + 1))}
        </div>
      )}
    </div>
  );

  const renderFiles = (folder: Folder, folderPath: string) => {
    return (
      <div>
        {Object.values(folder.folders).map((subFolder) =>
          renderFolder(subFolder, `${folderPath}/${subFolder.name}`, 0)
        )}
        {folder.files.map((file) => renderFile(file, 0))}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-gray-300 p-4 rounded w-full min-h-96 max-h-[500px] overflow-auto">
      <AddFile />
      {renderFiles(rootFolder, "")}
    </div>
  );
};

export default FileStructure;
