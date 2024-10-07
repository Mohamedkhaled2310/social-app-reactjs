import { useState,useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  DarkMode,
  LightMode,
  Menu as MenuIcon,
  Close,
  Home,
  Person,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import axios from "axios";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;
  const userId = user._id;

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
// دي فانكشن ال seacrh 
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500); 
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]); // Reset results if search query is empty
      return;
    }

    if (!token) {
      console.error('User token is missing');
      return;
    }

    try {
      setIsLoading(true);

      const params = { name: searchQuery }; 

      const response = await axios.get('http://localhost:3001/users/search', {
        params,
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.users) {
        console.log('Search results:', response.data.users);
        setSearchResults(response.data.users); 
      } else {
        console.warn('No users found for the search query.');
        setSearchResults([]); 
      }
    } catch (error) {
      if (error.response) {
        console.error('Server responded with error:', error.response.data);
      } else {
        console.error('Error during search request:', error.message);
      }
    } finally {
      setIsLoading(false); 
    }
  };
  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      {/* Logo and Search */}
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1.5rem, 2.5rem, 3rem)"
          color="orange" // Set color to orange
          onClick={() => navigate("/home")}
          sx={{
            fontFamily: "Poppins, sans-serif", // Modern font
            letterSpacing: "0.05rem",
            transition: "color 0.3s ease", // Smooth transition for hover
            "&:hover": {
              color: "#ff7f50", // Coral color for a softer, more stylish hover effect
              cursor: "pointer",
            },
          }}
        >
          Connect.io
        </Typography>

        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            {/* ال ui بتاع ال searc */}
            <InputBase h 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton> 
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>
      {searchResults.length > 0 && (
  <Box>
    {searchResults.map((user) => (
      <Box key={user._id} onClick={() => navigate(`/profile/${user._id}`)}>
        <Typography>{user.firstName} {user.lastName}</Typography>
        <Avatar alt={user.firstName}  src={`http://localhost:3001/assets/${user.picturePath}`} />
      </Box>
    ))}
  </Box>
)}



      {/* Desktop Navigation */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => navigate("/home")}>
            <Home sx={{ fontSize: "35px", }} />
          </IconButton>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "30px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "30px" }} />
            )}
          </IconButton>
          <IconButton onClick={handleMenuClick}>
          <img
                      src={`http://localhost:3001/assets/${user.picturePath}`} 
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                      />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ mt: "45px" }}
          >
            <MenuItem
              onClick={() => {
                navigate(`/profile/${userId}`);
                handleMenuClose();
              }}
            >
              <Person sx={{ mr: "10px" }} />
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                dispatch(setLogout());
                handleMenuClose();
              }}
            >
              Log Out
            </MenuItem>
          </Menu>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Mobile Navigation */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* Close Button */}
          <Box display="flex" justifyContent="flex-start" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Mobile Menu Items */}
          <FlexBetween
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            gap="2rem"
          >
            <IconButton onClick={() => navigate("/home")}>
              <Home sx={{ fontSize: "45px", color: "#f1c40f" }} />
            </IconButton>
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "35px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "35px" }} />
              )}
            </IconButton>
            <IconButton onClick={handleMenuClick}>
              <Avatar alt={fullName} src={user.profilePicture} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ mt: "45px" }}
            >
              <MenuItem
                onClick={() => {
                  navigate(`/profile/${userId}`);
                  handleMenuClose();
                }}
              >
                <Person sx={{ mr: "10px" }} />
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dispatch(setLogout());
                  handleMenuClose();
                }}
              >
                Log Out
              </MenuItem>
            </Menu>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
