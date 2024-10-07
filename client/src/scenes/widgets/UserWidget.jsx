import {
  ManageAccountsOutlined,
  Edit,
  LocationOnOutlined,
  WorkOutlineOutlined,
  SchoolOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogEducation, setOpenDialogEducation] = useState(false);
  const [openDialogWork, setOpenDialogWork] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [newEducation, setNewEducation] = useState("");
  const [newWork, setNewWork] = useState("");
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);

  const getUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
      setNewLocation(response.data.location);
      setNewEducation(response.data.education);
      setNewWork(response.data.work);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUser = async (field, value) => {
    try {
      await axios.patch(`http://localhost:3001/users/${userId}`, { [field]: value }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser((prevUser) => ({
        ...prevUser,
        [field]: value, 
      }));
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const handleSaveLocation = () => {
    updateUser("location", newLocation);
    setOpenDialog(false);
  };

  const handleSaveEducation = () => {
    updateUser("education", newEducation); 
    setOpenDialogEducation(false);
  };

  const handleSaveWork = () => {
    updateUser("work", newWork); 
    setOpenDialogWork(false);
  };

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
    education,
    work,
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={palette.neutral.dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={palette.neutral.medium}>
              {friends.length} Follow
            </Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined
            fontSize="medium"
            sx={{ color: palette.neutral.main }}
          />
          <Typography color={palette.neutral.medium}>{location}</Typography>
          <Box sx={{ marginLeft: "auto" }}>
            <Edit
              fontSize="medium"
              sx={{ color: palette.neutral.main, cursor: "pointer" }}
              onClick={() => {
                setOpenDialog(true);
                setNewLocation(location);
              }}
            />
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Dialog for Editing Location */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor:
              palette.mode === "dark" ? palette.background.default : "#fff",
            borderRadius: "8px",
            padding: "1rem",
          },
        }}
      >
        <DialogTitle sx={{ color: palette.text.primary, fontWeight: "bold" }}>
          Edit Location
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Location"
            type="text"
            fullWidth
            variant="outlined"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: palette.neutral.main,
                },
                "&:hover fieldset": {
                  borderColor: palette.primary.dark,
                },
                "&.Mui-focused fieldset": {
                  borderColor: palette.grey.light,
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              color: palette.error.main,
              "&:hover": {
                backgroundColor: palette.error.light,
                color: "#fff",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveLocation}
            sx={{
              backgroundColor: "orange",
              color: "#fff",
              "&:hover": {
                backgroundColor: "darkorange",
                boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* THIRD ROW - EDUCATION */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <SchoolOutlined
            fontSize="medium"
            sx={{ color: palette.neutral.main }}
          />
          <Typography color={palette.neutral.medium}>{education}</Typography>
          <Box sx={{ marginLeft: "auto" }}>
            <Edit
              fontSize="medium"
              sx={{ color: palette.neutral.main, cursor: "pointer" }}
              onClick={() => {
                setOpenDialogEducation(true);
                setNewEducation(education);
              }}
            />
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Dialog for Editing Education */}
      <Dialog
        open={openDialogEducation}
        onClose={() => setOpenDialogEducation(false)}
        PaperProps={{
          sx: {
            backgroundColor:
              palette.mode === "dark" ? palette.background.default : "#fff",
            borderRadius: "8px",
            padding: "1rem",
          },
        }}
      >
        <DialogTitle sx={{ color: palette.text.primary, fontWeight: "bold" }}>
          Edit Education
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Education"
            type="text"
            fullWidth
            variant="outlined"
            value={newEducation}
            onChange={(e) => setNewEducation(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: palette.neutral.main,
                },
                "&:hover fieldset": {
                  borderColor: palette.primary.dark,
                },
                "&.Mui-focused fieldset": {
                  borderColor: palette.grey.light,
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialogEducation(false)}
            sx={{
              color: palette.error.main,
              "&:hover": {
                backgroundColor: palette.error.light,
                color: "#fff",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEducation}
            sx={{
              backgroundColor: "orange",
              color: "#fff",
              "&:hover": {
                backgroundColor: "darkorange",
                boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* FOURTH ROW - WORK */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <WorkOutlineOutlined
            fontSize="medium"
            sx={{ color: palette.neutral.main }}
          />
          <Typography color={palette.neutral.medium}>{work}</Typography>
          <Box sx={{ marginLeft: "auto" }}>
            <Edit
              fontSize="medium"
              sx={{ color: palette.neutral.main, cursor: "pointer" }}
              onClick={() => {
                setOpenDialogWork(true);
                setNewWork(work);
              }}
            />
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Dialog for Editing Work */}
      <Dialog
        open={openDialogWork}
        onClose={() => setOpenDialogWork(false)}
        PaperProps={{
          sx: {
            backgroundColor:
              palette.mode === "dark" ? palette.background.default : "#fff",
            borderRadius: "8px",
            padding: "1rem",
          },
        }}
      >
        <DialogTitle sx={{ color: palette.text.primary, fontWeight: "bold" }}>
          Edit Work
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Work"
            type="text"
            fullWidth
            variant="outlined"
            value={newWork}
            onChange={(e) => setNewWork(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: palette.neutral.main,
                },
                "&:hover fieldset": {
                  borderColor: palette.primary.dark,
                },
                "&.Mui-focused fieldset": {
                  borderColor: palette.grey.light,
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialogWork(false)}
            sx={{
              color: palette.error.main,
              "&:hover": {
                backgroundColor: palette.error.light,
                color: "#fff",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveWork}
            sx={{
              backgroundColor: "orange",
              color: "#fff",
              "&:hover": {
                backgroundColor: "darkorange",
                boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Divider />

      {/* FIFTH ROW */}
      <Box p="1rem 0">
        <FlexBetween>
          <Typography color={palette.neutral.medium}>
            {viewedProfile} people viewed your profile
          </Typography>
          <Typography color={palette.neutral.medium}>
            {impressions} impressions
          </Typography>
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
