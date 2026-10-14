const Header = () => {
  return (
    <header className="bg-transparent py-4 mt-6">
      <div className="flex items-center justify-between px-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            Welcome to THORNodes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Here are the latest stats for you!
          </p>
        </div>
      </div>
      <hr className="mt-4 border-t  border-gray-500 dark:border-gray-50" />
    </header>
  );
};

export default Header;
