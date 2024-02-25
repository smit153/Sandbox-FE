import { useContext } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { useNavigate } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import FileStructure from "./FileStructure";
import EditorContext from "../../contexts/EditorContext";
import Dependency from "./Dependency";
import ReactLogo from "../../assets/react-logo.png";
import NodeLogo from "../../assets/node-logo.png";

const SideBar = ({handleCleanUp}:{handleCleanUp:()=>void}) => {
  const ctx = useContext(EditorContext);
  const { sandboxName, sandboxType,setActiveFile,setEditor,setPort,setSandboxCode,setSandboxName,setSandboxType } = ctx;
  const navigate = useNavigate();
  const getLogo = () => {
    if (sandboxType === "react") {
      return (
        <img src={ReactLogo} alt="React Logo" className="w-8 h-8 bg-cover" />
      );
    } else if (sandboxType === "node") {
      return (
        <img src={NodeLogo} alt="Node Logo" className="w-8 h-8 bg-cover" />
      );
    }
    return null;
  };
  

  const handleClose = () => {
    handleCleanUp();
    setEditor("");
    setActiveFile("");
    setPort(0);
    setSandboxCode([]);
    setSandboxName("");
    setSandboxType("");
    navigate("/");
  }
  return (
    <>
      <Accordion.Root
        className="bg-black w-full h-[100vh] rounded-md shadow-[0_2px_10px] shadow-black/5 relative"
        type="single"
        defaultValue="item-1"
        collapsible
      >
        {/* sandbox details */}
        <Accordion.Item
          className="focus-within:shadow-mauve12 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px]"
          value="item-2"
        >
          <Accordion.Header className="flex">
            <Accordion.Trigger className="text-gray-400 shadow-black hover:bg-gray900 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-black px-5 text-[15px] leading-none shadow-[0_1px_0] outline-none">
              Sandbox Details
              <FaAngleDown
                className="text-gray-400 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
                aria-hidden
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="text-gray-400 bg-black data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]">
            <div className="p-5 bg-gray-900">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-mauve-12 rounded-full mr-2"></div>
                <div className="text-gray-400 font-bold">Name</div>
                <div className="text-gray-400 ml-2">{sandboxName}</div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-mauve-12 rounded-full mr-2"></div>
                <div className="text-gray-400 font-bold">Type</div>
                <div className="text-gray-400 ml-2">{getLogo()}</div>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>

        {/* file structure */}
        <Accordion.Item
          className="focus-within:shadow-mauve12 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px]"
          value="item-1"
        >
          <Accordion.Header className="flex">
            <Accordion.Trigger className="text-gray-400 shadow-black hover:bg-gray900 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-black px-5 text-[15px] leading-none shadow-[0_1px_0] outline-none">
              Files
              <FaAngleDown
                className="text-gray-400 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
                aria-hidden
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="text-gray-400 bg-black data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]">
            <FileStructure files={ctx.sandboxCode} />
          </Accordion.Content>
        </Accordion.Item>

        {/* dependency */}
        <Accordion.Item
          className="focus-within:shadow-mauve12 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px]"
          value="item-3"
        >
          <Accordion.Header className="flex">
            <Accordion.Trigger className="text-gray-400 shadow-black hover:bg-gray900 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-black px-5 text-[15px] leading-none shadow-[0_1px_0] outline-none">
              Dependencies
              <FaAngleDown
                className="text-gray-400 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
                aria-hidden
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="text-gray-400 bg-gray-900 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]">
            <Dependency/>
          </Accordion.Content>
        </Accordion.Item>
        <div className="w-full rounded-xl bg-gray-900 border-2 border-black hover:bg-gray-800 absolute bottom-0 h-12 text-center text-white pt-2 cursor-pointer text-lg font-bold" onClick={handleClose}>
          Dashboard
        </div>
      </Accordion.Root>
    </>
  );
};

export default SideBar;
