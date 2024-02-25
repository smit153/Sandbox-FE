import LoginForm from "../components/home/LoginForm";
import Navbar from "../components/home/Navbar";
const Login = () => {
  return (
    <>
      <Navbar />
      <div className="mx-auto bg-gray-900">
        <LoginForm/>
      </div>
    </>
  );
};

export default Login;
