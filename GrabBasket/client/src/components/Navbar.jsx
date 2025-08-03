import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from "../assets/assets";
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const ref = useRef(null);

    const {
        user,
        setUser,
        setShowUserLogin,
        navigate,
        setSearchQuery,
        searchQuery,
        getCartCount,
        axios
    } = useAppContext();

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/user/logout');
            if (data.success) {
                toast.success(data.message);
                setUser(null);
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate("/products");
        }
    }, [searchQuery]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            ref={ref}
            className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between 
                ${isScrolled
                    ? 'bg-[#f8f8f8] backdrop-blur-md shadow-md py-2 text-[#333]'
                    : 'bg-[#002395] py-4 text-[#fff] shadow'
                }`}
        >
            {/* Logo */}
           <NavLink to='/' onClick={() => setOpen(false)}>
    <img
        className={`h-9 transition-all duration-300 ${isScrolled ? 'opacity-90' : ''}`}
        src={isScrolled ? assets.logo_black : assets.logo}
        alt="logo"
    />
</NavLink>


            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8 font-medium">
                <NavLink to='/' className="relative group text-transition duration-300">
                    Home
                    <span className={`absolute left-0 -bottom-1 h-0.5 w-0 group-hover:w-full transition-all duration-300 ${isScrolled ? 'bg-black' : 'bg-white'}`}></span>
                </NavLink>

                <NavLink to='/products' className="relative group text-transition duration-300">
                    All Products
                    <span className={`absolute left-0 -bottom-1 h-0.5 w-0 group-hover:w-full transition-all duration-300 ${isScrolled ? 'bg-black' : 'bg-white'}`}></span>
                </NavLink>

                <NavLink to='/' className="relative group text-transition duration-300">
                    Contact
                    <span className={`absolute left-0 -bottom-1 h-0.5 w-0 group-hover:w-full transition-all duration-300 ${isScrolled ? 'bg-black' : 'bg-white'}`}></span>
                </NavLink>


                {/* Search Bar */}
                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full bg-[#f8f8f8]">
                    <input
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500 text-[#333]"
                        type="text"
                        placeholder="Search products"
                    />
                    <img src={assets.search_icon} alt='search' className='w-4 h-4' />
                </div>

                {/* Cart Icon */}
                <div
                    onClick={() => navigate("/cart")}
                    className="relative cursor-pointer">
                    <img src={isScrolled ? assets.nav_cart_icon : assets.cart_icon} alt='cart' className='w-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-[#3BB77E] w-[18px] h-[18px] rounded-full">
                        {getCartCount()}
                    </button>
                </div>

                {/* Login or Profile */}
                {!user ? (
                    <button
                        onClick={() => setShowUserLogin(true)}
                        className={`cursor-pointer px-8 py-2 rounded-full transition duration-300 
                            ${isScrolled
                                ? 'bg-[#000] text-white hover:bg-[#377DFF]'
                                : 'bg-white text-[#377DFF] hover:bg-gray-100 border border-[#3BB77E]'
                            }`}
                    >
                        Login
                    </button>

                ) : (
                    <div className="relative group">
                        <img src={assets.profile_icon} className="w-10" alt="profile" />
                        <ul className="hidden group-hover:block absolute top-10 right-0 bg-white text-[#333] shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
                            <li
                                onClick={() => navigate("my-orders")}
                                className="p-1.5 pl-3 hover:bg-gray-100 cursor-pointer"
                            >
                                My Orders
                            </li>
                            <li
                                onClick={logout}
                                className="p-1.5 pl-3 hover:bg-gray-100 cursor-pointer"
                            >
                                Logout
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Mobile Cart & Menu Button */}
            <div className="flex items-center gap-6 sm:hidden">
                <div
                    onClick={() => navigate("/cart")}
                    className="relative cursor-pointer"
                >
                    <img src={isScrolled ? assets.nav_cart_icon : assets.cart_icon} alt="cart" className="w-6 opacity-80" />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-[#3BB77E] w-[18px] h-[18px] rounded-full">
                        {getCartCount()}
                    </button>
                </div>
                <button onClick={() => setOpen(!open)} aria-label="Menu">
                    <img
                        src={isScrolled ? assets.menu_icon_black : assets.menu_icon}
                        alt="menu"
                        className={`${isScrolled ? '' : ''}`}
                    />
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="absolute top-full left-0 w-full bg-white text-[#333] shadow-md py-4 flex flex-col items-start gap-2 px-5 text-sm md:hidden transition-all duration-500">
                    <NavLink to="/" onClick={() => setOpen(false)} className="hover:text-[#2ca56e]">Home</NavLink>
                    <NavLink to="/products" onClick={() => setOpen(false)} className="hover:text-[#2ca56e]">All Products</NavLink>
                    {user && <NavLink to="/my-orders" onClick={() => setOpen(false)} className="hover:text-[#2ca56e]">My Orders</NavLink>}
                    <NavLink to="/" onClick={() => setOpen(false)} className="hover:text-[#2ca56e]">Contact</NavLink>

                    {!user ? (
                        <button
                            onClick={() => {
                                setOpen(false);
                                setShowUserLogin(true);
                            }}
                            className="cursor-pointer px-6 py-2 mt-2 bg-[#3BB77E] hover:bg-[#2ca56e] transition text-white rounded-full text-sm"
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={logout}
                            className="cursor-pointer px-6 py-2 mt-2 bg-[#3BB77E] hover:bg-[#2ca56e] transition text-white rounded-full text-sm"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
