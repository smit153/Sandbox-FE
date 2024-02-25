import React, { useContext, useEffect, useState } from "react";
import { DependencyType, DependencyVersions } from "../../types/types";
import EditorContext from "../../contexts/EditorContext";
import { TiDeleteOutline } from "react-icons/ti";
import ToastUI from "../home/Toast";
import { UPDATE_SANDBOX_CODE } from "../../resolvers/data";
import { useMutation } from "@apollo/client";
import { useToast } from "../../hooks/useToast";

const Dependency: React.FC = () => {
  const [dependency, setDependency] = useState("");
  const [searchResults, setSearchResults] = useState<DependencyType[]>([]);
  const [dependencies, setDependencies] = useState<DependencyVersions>();
  const [success, setSuccess] = useState(false);

  const ctx = useContext(EditorContext);
  const { sandboxCode, setSandboxCode, editor,port } = ctx;
  const { errors, setErrors, openToast } = useToast();

  const [updateSandboxCodeMutation] = useMutation(UPDATE_SANDBOX_CODE, {
    onError: (error) => setErrors(error.message),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false);
    }, 3100);
    return () => {
      clearTimeout(timer);
    };
  }, [success]);

  useEffect(() => {
    if (dependency.trim() !== "") {
      fetch(`https://registry.npmjs.com/-/v1/search?text=${dependency}&size=5`)
        .then((response) => response.json())
        .then((data) => setSearchResults(data.objects || []))
        .catch((error) =>
          console.error("Error fetching search results:", error)
        );
    } else {
      setSearchResults([]);
    }
  }, [dependency]);

  useEffect(() => {
    if (sandboxCode) {
      const dependencyList = sandboxCode.find(
        (code) => code.filename === "root/package.json"
      );

      if (dependencyList) {
        setDependencies({
          ...JSON.parse(dependencyList.code).dependencies,
          ...JSON.parse(dependencyList.code).devDependencies,
        });
      }
    }
  }, [sandboxCode]);
  console.log(sandboxCode, dependencies);

  const convertToDependencyString = (depend: DependencyVersions) => {
    const packageJson = sandboxCode.find(
      (code) => code.filename === "root/package.json"
    );

    const newCode = sandboxCode.filter(
      (code) => code.filename !== "root/package.json"
    );
    if (packageJson) {
      const newPackageJson = {
        ...JSON.parse(packageJson.code),
        dependencies: {},
      };

      Object.entries(depend).forEach(([name, version]) => {
        newPackageJson.dependencies[name] = version;
      });

      newCode.push({
        ...packageJson,
        code: JSON.stringify(newPackageJson, null, 2),
      });
    }
    return newCode;
  };

  const updateSandboxCode = (depend: DependencyVersions) => {
    if (depend) {
      const newCode = convertToDependencyString(depend);
      setSandboxCode(newCode);
    }
  };

  const addDependencyLocally = async (name: string, version: string) => {
    const newCode = convertToDependencyString({
      ...dependencies,
      [name]: version,
    });
    const packageCode = newCode.find(
      (code) => code.filename === "root/package.json"
    );
    await updateSandboxCodeMutation({
      variables: {
        sandboxId: editor,
        filename: `root/package.json`,
        code: packageCode?.code,
        port: port,
      },
    });
    setDependencies((prevDependencies) => ({
      ...prevDependencies,
      [name]: version,
    }));
    setDependency("");
    setSearchResults([]);
    updateSandboxCode({ ...dependencies, [name]: version });
    setSuccess(true);
    setErrors(`${name} added successfully`);
  };

  const removeDependencyLocally = async (name: string) => {
    const newDependencies = { ...dependencies };
    delete newDependencies[name];
    const newCode = convertToDependencyString(newDependencies);
    const packageCode = newCode.find(
      (code) => code.filename === "root/package.json"
    );
    await updateSandboxCodeMutation({
      variables: {
        sandboxId: editor,
        filename: `root/package.json`,
        code: packageCode?.code,
        port: port,
      },
    });
    setDependencies(newDependencies);
    updateSandboxCode(newDependencies);
    setSuccess(true);
    setErrors(`${name} removed successfully`);
  };

  return (
    <div className="w-full min-h-96 max-h-[400px] overflow-auto bg-gray-900 text-gray-300 flex flex-col items-center relative cm-scroller">
      {success ? (
        <ToastUI openToast={openToast} message={errors} success={true} />
      ) : (
        <ToastUI openToast={openToast} message={errors} success={false} />
      )}
      <div className="p-2 w-full">
        <input
          type="text"
          className="outline-none rounded bg-gray-600 p-1 text-white w-full"
          placeholder="Enter package name"
          value={dependency}
          onChange={(e) => setDependency(e.target.value)}
        />
      </div>
      {searchResults.length > 0 && (
        <div className="absolute bg-gray-700 px-2 rounded shadow-md w-full mt-10">
          <ul>
            {searchResults.map((result) => (
              <li
                key={result.package.name}
                className="p-2 cursor-pointer hover:bg-gray-500 flex justify-between overflow-hidden"
                onClick={() =>
                  addDependencyLocally(
                    result.package.name,
                    result.package.version
                  )
                }
              >
                <div className="max-w-[65%] text-ellipsis overflow-hidden text-nowrap">
                  {result.package.name}
                </div>
                <div className="w-[30%] text-right">
                  {result.package.version}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="w-full px-2 mt-4">
        <ul className="bg-gray-700 rounded shadow-md w-full">
          {dependencies &&
            Object.entries(dependencies).map(([name, version]) => (
              <li
                key={name}
                className="p-2 cursor-pointer w-full hover:bg-gray-500 flex justify-between overflow-hidden"
              >
                <div className="w-[65%] text-ellipsis overflow-hidden text-nowrap">
                  {name}
                </div>
                <div className="flex w-[35%] items-center justify-between">
                  <div className="w-[70%] text-right mr-2 text-ellipsis overflow-hidden text-nowra">
                    {version}
                  </div>
                  <div
                    className="w-[20%] h-5 "
                    onClick={() => removeDependencyLocally(name)}
                  >
                    <TiDeleteOutline className="hover:text-red-500" size={18} />
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Dependency;
