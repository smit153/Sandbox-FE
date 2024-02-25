import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Navbar from "../components/home/Navbar";
import ToastUI from "../components/home/Toast";
import Card from "../components/home/Card";
import { GET_DATA } from "../resolvers/data";
import { SandboxCardType } from "../types/types";
import { IoIosAddCircle } from "react-icons/io";
import CreateModal from "../components/home/CreateModal";
import { useToast } from "../hooks/useToast";

const Home = () => {
  const [sandbox, setSandbox] = useState<SandboxCardType[]>([]);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { errors, setErrors, openToast } = useToast();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  const { loading, error, data } = useQuery(GET_DATA, {
    variables: { id:token },
  });

  useEffect(() => {
    if (data?.getUserSandbox?.user?.sandbox) {
      setSandbox(data?.getUserSandbox?.user?.sandbox);
    }
    if (error) {
      setErrors(error.message);
    }
  }, [data, error, setErrors]);

  const handleAddSandbox = (newSandbox: SandboxCardType) => {
    setSandbox([...sandbox, newSandbox]);
  };

  const handleDeleteSandbox = (id: string) => {
    const newSandbox = sandbox.filter((item) => item._id !== id);
    setSandbox(newSandbox);
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto h-[92vh] p-4 bg-gray-900">
        <h1 className="text-3xl font-bold text-white">Home</h1>
        {loading && <p className="text-white">Loading...</p>}

        <ToastUI openToast={openToast} message={errors} success={false} />

        <>
          <CreateModal
            open={open}
            setOpen={setOpen}
            handleAddSandbox={handleAddSandbox}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div
              className=" dark:bg-gray-800 w-full shadow-md rounded-lg p-6 flex items-center justify-between h-16 text-white cursor-pointer hover:bg-blue-900 "
              onClick={() => setOpen(true)}
            >
              <div className="flex items-center justify-center my-1 w-full">
                <IoIosAddCircle size={48} />
              </div>
            </div>
            {sandbox.length > 0 && (
              <>
                {sandbox.map((item: SandboxCardType, index: number) => (
                  <Card
                    key={index}
                    title={item.name}
                    type={item.type}
                    id={item._id}
                    handleDeleteSandbox={handleDeleteSandbox}
                  />
                ))}
              </>
            )}
          </div>
        </>
      </div>
    </>
  );
};

export default Home;
