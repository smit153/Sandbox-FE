import {  useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "../../resolvers/user";
import { useNavigate } from "react-router-dom";
import ToastUI from "./Toast";
import { useToast } from "../../hooks/useToast";

const LoginForm = () => {
  const [email, setEmail] = useState("test1@gmail.com");
  const [password, setPassword] = useState("test");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);
 
  const {errors, setErrors, openToast} = useToast();

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [signupMutation] = useMutation(SIGNUP_MUTATION);

  const navigate = useNavigate();

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    navigate("/");
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { data } = await loginMutation({
          variables: { email, password },
        });

        localStorage.setItem("token", data.login.token);
      } else {
        const { data } = await signupMutation({
          variables: {
            name: username,
            email,
            password,
          },
        });
        localStorage.setItem("token", data.signup.token);
      }
      resetForm();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Mutation error:", error);
      setErrors(error.message);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded shadow-md w-96">
        <h2 className="text-3xl font-semibold text-center mb-6 text-white">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit}>
          {isLogin || (
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-white text-sm font-semibold mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring focus:border-blue-300 text-white"
                placeholder="Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-white text-sm font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring focus:border-blue-300 text-white"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-white text-sm font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring focus:border-blue-300 text-white"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-white text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            className="cursor-pointer text-blue-500 font-semibold ml-1"
            onClick={handleToggleForm}
          >
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>
      </div>
      <ToastUI openToast={openToast} message={errors} success={false} />
    </div>
  );
};

export default LoginForm;
