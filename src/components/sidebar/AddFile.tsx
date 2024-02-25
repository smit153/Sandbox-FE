import { useContext, useEffect, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useMutation } from "@apollo/client";
import { UPDATE_SANDBOX_CODE, DELETE_SANDBOX_FILE } from "../../resolvers/data";
import { FaFileMedical } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";
import { FaQuestionCircle } from "react-icons/fa";
import EditorContext from "../../contexts/EditorContext";
import { useToast } from "../../hooks/useToast";
import ToastUI from "../home/Toast";

const AddFile = () => {
  const [fileName, setFileName] = useState("");
  const [success, setSuccess] = useState(false);
  const ctx = useContext(EditorContext);
  const { editor, setSandboxCode,setActiveFile,activeFile ,port} = ctx;

  const { errors, setErrors, openToast } = useToast();

  const [updateSandboxCode] = useMutation(UPDATE_SANDBOX_CODE, {
    onError: (error) => setErrors(error.message),
    onCompleted: () => {
      setSuccess(true);
      setErrors(`${fileName.split("/").pop()} File added successfully`);
      setFileName("");
      setActiveFile(`root/${fileName}`);
    },
  });

  const [deleteSandboxFile] = useMutation(DELETE_SANDBOX_FILE, {
    onError: (error) => setErrors(error.message),
    onCompleted: () => {
      setSuccess(true);
      setErrors(`${fileName.split("/").pop()} File deleted successfully`);
      setFileName("");
      if(activeFile===`root/${fileName}`){
        setActiveFile("");
      }
    },
  });

  const handleAddFile = () => {
    if (fileName) {
      setSandboxCode((prev) => [
        ...prev,
        { filename: `root/${fileName}`, code: "" },
      ]);
      updateSandboxCode({
        variables: {
          sandboxId: editor,
          filename: `root/${fileName}`,
          code: "",
          port:port
        },
      });
    }
  };

  const handleDeleteFile = () => {
    console.log(fileName);

    if (fileName) {
      setSandboxCode((prev) =>
        prev.filter((file) => file.filename !== `root/${fileName}`)
      );
      deleteSandboxFile({
        variables: {
          sandboxId: editor,
          filename: `root/${fileName}`,
          port:port
        },
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
    }, 3100);
    return () => {
      clearTimeout(timer);
    };
  }, [success]);

  return (
    <div className="w-full flex items-center">
      {success ? (
        <ToastUI openToast={openToast} message={errors} success={true} />
      ) : (
        <ToastUI openToast={openToast} message={errors} success={false} />
      )}

      <input
        type="text"
        className="outline-none rounded bg-gray-600 p-1 text-white w-[70%]"
        placeholder="Enter file name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      {/* add file */}
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              className="text-gray-400 inline-flex items-center w-[10%] justify-center rounded-full bg-gray-900  outline-none   "
              onClick={handleAddFile}
            >
              <FaFileMedical size={24} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-black select-none rounded-[4px] bg-gray-400 px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] z-50"
              sideOffset={5}
            >
              Add File
              <Tooltip.Arrow className="fill-gray-400" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>

      {/* remove file */}
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              className="text-gray-400 inline-flex items-center w-[10%] justify-center rounded-full bg-gray-900  outline-none   "
              onClick={handleDeleteFile}
            >
              <CiCircleRemove size={24} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-black select-none rounded-[4px] bg-gray-400 px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] z-50"
              sideOffset={5}
            >
              Delete File
              <Tooltip.Arrow className="fill-gray-400" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>

      {/* help */}
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button className="text-gray-400 inline-flex items-center w-[10%] justify-center rounded-full bg-gray-900  outline-none   ">
              <FaQuestionCircle size={24} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-black select-none rounded-[4px] bg-gray-400 px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] max-w-[290px] text-wrap text-center z-50"
              sideOffset={5}
            >
              Write whole file name to add or delete, with folder name and file
              extension. <b>For example, "public/index.html"</b>.
              <Tooltip.Arrow className="fill-gray-400" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
};

export default AddFile;
