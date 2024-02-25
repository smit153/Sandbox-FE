import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoClose } from "react-icons/io5";
import { useMutation } from "@apollo/client";
import { CREATE_SANDBOX } from "../../resolvers/data";
import { SandboxCardType } from "../../types/types";
import ToastUI from "./Toast";
import ReactLogo from "../../assets/react-logo.png";
import NodeLogo from "../../assets/node-logo.png";
import { useToast } from "../../hooks/useToast";

const CreateModal = ({
  open,
  setOpen,
  handleAddSandbox
}: {
  open: boolean;
  setOpen: (bool: boolean) => void;
  handleAddSandbox: (newSandbox: SandboxCardType) => void;
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("react");

  const [createSandbox] = useMutation(CREATE_SANDBOX,{
    onCompleted: (data) => {
      setOpen(false);
      handleAddSandbox(data.createSandbox);
    },
    onError: (error) => {
      setErrors(error.message);
    },
  });

  const { errors, setErrors, openToast } = useToast();

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
       createSandbox({
        variables: {
          name,
          type,
          token,
        },
      });
  };

  return (<>
  <ToastUI openToast={openToast} message={errors} success={false} />
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-gray-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-white m-0 text-[17px] font-medium">
            Create Sandbox
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
            Choose a name and a type for your new sandbox.
          </Dialog.Description>
          <fieldset className="mb-[15px] flex items-center gap-5">
            <label
              className="bg-gray-800 w-[90px] text-left text-[15px] text-white"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="text-gray-700 shadow-gray-700 focus:shadow-gray-800 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="name"
              placeholder="Sandbox Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </fieldset>

          <div className="flex justify-between">
            <div
              className={`flex items-center justify-start my-1 w-1/2 rounded me-1 hover:bg-blue-900 ${
                type === "react" ? " border-4 border-white" : " m-1"
              }`}
              onClick={() => {
                setType("react");
              }}
            >
              <>
                <img
                  src={ReactLogo}
                  alt="React Logo"
                  className="w-8 h-8 bg-cover"
                />
              </>
              <div className="mx-3 align-middle">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  React JS
                </h2>
                <div className="flex items-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm ">
                    SandBox
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`flex items-center justify-start my-1 w-1/2 rounded ms-1 hover:bg-blue-900 ${
                type === "node" ? " border-4 border-white" : " m-1"
              }`}
              onClick={() => {
                setType("node");
              }}
            >
              <>
                <img
                  src={NodeLogo}
                  alt="React Logo"
                  className="w-8 h-8 bg-cover"
                />
              </>
              <div className="mx-3 align-middle">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Node JS
                </h2>
                <div className="flex items-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm ">
                    SandBox
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[25px] flex justify-end">
            <button
              className="bg-gray-700 text-white hover:bg-blue-900 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              onClick={handleSubmit}
            >
              Create
            </button>
          </div>
          <button
            className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
            aria-label="Close"
            onClick={() => {
              setOpen(false);
            }}
          >
            <IoClose />
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root></>
  );
};

export default CreateModal;
