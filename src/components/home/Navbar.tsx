import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate=useNavigate();
  const handleLogout = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    if(token){
      localStorage.removeItem("token");
      navigate("/login");
    }
  }
  return (
    <nav className="bg-gray-800 p-4 h-[8vh]">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-lg">Your Logo</div>
        <div>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="text-white hover:text-gray-300">
                Home
              </a>
            </li>
            <li>
              <button onClick={handleLogout} className="text-white hover:text-gray-300">
                Log {token?"Out":"In"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
