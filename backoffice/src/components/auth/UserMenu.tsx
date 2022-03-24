import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, Menu, MenuItem } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { AuthContext } from "./AuthWrapper";

export const UserMenu: FunctionComponent = () => {
  const [anchorElement, setAnchorElement] = useState(null);

  const handleClick = (event: any) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  return (
    <AuthContext.Consumer>
      {(auth) => (
        <>
          <Button
            color="inherit"
            aria-controls="user-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <AccountCircleIcon />
            &nbsp;
            {auth.user.displayName}
          </Button>
          <Menu
            id="user-menu"
            anchorEl={anchorElement}
            keepMounted
            open={Boolean(anchorElement)}
            onClose={handleClose}
          >
            <MenuItem onClick={auth.logout}>Logout</MenuItem>
          </Menu>
        </>
      )}
    </AuthContext.Consumer>
  );
};
