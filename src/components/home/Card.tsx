import React from "react";
import { MdDelete } from "react-icons/md";
import ToastUI from "./Toast";
import { useMutation } from "@apollo/client";
import { DELETE_SANDBOX } from "../../resolvers/data";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import ReactLogo from "../../assets/react-logo.png";
import NodeLogo from "../../assets/node-logo.png";

interface CardProps {
  title: string;
  type: string;
  id: string;
  handleDeleteSandbox: (id: string) => void;
}

const Card: React.FC<CardProps> = ({
  title,
  type,
  id,
  handleDeleteSandbox,
}) => {
  const { errors, setErrors, openToast } = useToast();
  const navigate = useNavigate();

  const [deleteSandbox] = useMutation(DELETE_SANDBOX, {
    onCompleted: () => {
      handleDeleteSandbox(id);
    },
    onError: (error) => {
      console.log(error);
      setErrors(error.message);
    },
  });

  const handleDelete = () => {
    const token = localStorage.getItem("token");
    deleteSandbox({
      variables: {
        deleteSandboxId: id,
        token,
      },
    });
  };

  const openEditor = () => {
    navigate(`/editor/${id}`);
  }

  const getLogo = () => {
    if (type === "react") {
      return (
        <img src={ReactLogo} alt="React Logo" className="w-8 h-8 bg-cover" />
      );
    } else if (type === "node") {
      return (
        <img src={NodeLogo} alt="Node Logo" className="w-8 h-8 bg-cover" />
      );
    }
    return null;
  };

  return (
    <div className="relative">
      <ToastUI openToast={openToast} message={errors} success={false} />
      <div
        className="absolute right-2 top-[50%] translate-y-[-50%] cursor-pointer"
        onClick={handleDelete}
      >
        <MdDelete color="white" size={24} />
      </div>
      <div className=" dark:bg-gray-800 w-full shadow-md rounded-lg p-6 flex items-center justify-between h-16 text-white cursor-pointer hover:bg-blue-900 " onClick={openEditor}>
        <div className="flex items-center justify-start my-1 w-full">
          <>{getLogo()}</>
          <div className="mx-3 align-middle">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {title}
            </h2>
            <div className="flex items-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm ">
                {type}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
