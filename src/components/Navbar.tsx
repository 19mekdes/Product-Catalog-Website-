interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const Navbar = ({ searchTerm, setSearchTerm }: Props) => {
  return (
    <nav className="bg-black text-white px-6 py-3 flex items-center justify-between">
      
      {/* Logo */}
      <div className="text-2xl font-bold text-yellow-400">
        MyShop
      </div>

      {/* Search Bar */}
      <div className="flex w-1/2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2 text-black rounded-l outline-none"
        />
        <button className="bg-yellow-400 px-5 rounded-r text-black font-semibold">
          Search
        </button>
      </div>

      {/* Cart */}
      <div className="relative">
        <span className="text-2xl">🛒</span>
        <span className="absolute -top-2 -right-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
          0
        </span>
      </div>
    </nav>
  );
};

export default Navbar;