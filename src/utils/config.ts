const production = {
    url: "https://sandbox-be-production-proj.up.railway.app/",
  };
  const development = {
    url: "http://localhost:5000",
  };
  const BACKEND_URL =
    process.env.NODE_ENV === "development" ? development.url : production.url;
  
  export default BACKEND_URL;