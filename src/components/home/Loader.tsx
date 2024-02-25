const Loader = ({ loading }: { loading: boolean }) => {
  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-600"></div>
        </div>
      )}
    </>
  );
};

export default Loader;
