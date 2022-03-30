import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { LoggedInUser } from "../../lib/User";
import { useAuthContext } from "./AuthProvider";

export const UserMenu = (): JSX.Element | null => {
  const [anchorElement, setAnchorElement] = useState(null);
  const { user, logout } = useAuthContext();

  const handleClick = (event: any) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  if (user.type !== "loggedInUser") {
    return null;
  }

  return (
    <>
      <Button
        color="inherit"
        aria-controls="user-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <AccountCircleIcon />
        &nbsp;
        {(user as LoggedInUser).attributes.displayName}
      </Button>
      <Menu
        id="user-menu"
        anchorEl={anchorElement}
        keepMounted
        open={Boolean(anchorElement)}
        onClose={handleClose}
      >
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  );
};
