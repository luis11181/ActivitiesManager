import { NavLink, Link, useNavigate } from "react-router-dom";

import classes from "./MainNavigation.module.css";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";

import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import Container from "@mui/material/Container";
import logo from "../../assets/psi.png";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";

import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  changeAuthState,
  changeJWTFechaExpiracion,
  changeJwtToken,
  changeNombreUsuario,
  changeRol,
  changeUserId,
} from "../../app/mainStateSlice";
import { paginasPermitidas } from "../../permisos";

const ResponsiveAppBar = () => {
  const rol = useAppSelector((state) => state.main.rol);
  const auth = useAppSelector((state) => state.main.autenticado);
  const pages = paginasPermitidas(rol);

  let navigate = useNavigate();
  const dispatch = useAppDispatch();

  function logOut() {
    dispatch(changeAuthState(false));
    dispatch(changeJwtToken(null));
    dispatch(changeJWTFechaExpiracion(null));
    dispatch(changeUserId(null));
    dispatch(changeNombreUsuario(null));
    dispatch(changeRol(null));

    localStorage.removeItem("JWTToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("JWTFechaExpiracion");
    localStorage.removeItem("rol");
    localStorage.removeItem("nombreUsuario");

    navigate("/");
    handleCloseNavMenu();
  }

  function logIn() {
    navigate("signIn");
    handleCloseNavMenu();
  }

  let settings = [{ nombre: "SignIn", function: logIn }];

  if (auth) {
    settings = [{ nombre: "Logout", function: logOut }];
  } else settings = [{ nombre: "SignIn", function: logIn }];

  if (rol === "admin") {
    settings = [
      {
        nombre: "Estructura Empresarial",
        function: () => navigate("/admin/estructuraEmpresarial"),
      },
      ...settings,
    ];
  }

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {
            //  estilos para pantalla grande con xs: none se esconde para pantallas pequeñas
          }
          <Box
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
            }}
          >
            <NavLink
              to={"/"}
              style={{
                fontWeight: "bold",
                fontSize: "1.2rem",
                textDecoration: "none",
              }}
            >
              <Chip
                color="secondary"
                avatar={
                  <Avatar>
                    {process.env.REACT_APP_COMPANY_NAME?.slice(0, 1)}
                  </Avatar>
                }
                label={process.env.REACT_APP_COMPANY_NAME}
              />
            </NavLink>
          </Box>

          {
            //  estilos para pequeña
          }

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <NavLink
                  key={page[1]}
                  to={page[1]}
                  className={({ isActive }) => {
                    return !isActive ? classes.inactive : classes.active;
                  }}
                  // style={(isActive) => ({
                  //   color: isActive ? "green" : "blue",
                  // })}
                >
                  <MenuItem
                    key={page[1]}
                    onClick={handleCloseNavMenu}
                    className={classes.menu}
                  >
                    <Typography
                      textAlign="center"
                      sx={{ color: "black", fontWeight: "bold" }}
                    >
                      {page[0]}
                    </Typography>
                  </MenuItem>
                </NavLink>
              ))}
            </Menu>
          </Box>

          {
            //* todo lo del menu para pantallas grandes
          }

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <NavLink to={"/"}>
              <img src={logo} alt="logo" className={classes.logo} />
            </NavLink>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <NavLink
                key={page[1]}
                to={page[1]}
                className={({ isActive }) => {
                  return !isActive ? classes.inactive : classes.active;
                }}
              >
                {" "}
                <MenuItem
                  key={page[1]}
                  onClick={handleCloseNavMenu}
                  className={classes.menu}
                >
                  <Typography
                    textAlign="center"
                    sx={{
                      display: "block",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {page[0]}
                  </Typography>
                </MenuItem>
              </NavLink>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: "#616161" }}>
                  <SettingsIcon />
                </Avatar>
                {
                  // <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                }
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.nombre} onClick={setting.function}>
                  <Typography
                    textAlign="center"
                    sx={{
                      display: "block",
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    {setting.nombre}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;

// const MainNavigation = () => {
//   return (
//     <header className={classes.header}>
//       <div className={classes.logo}>Great Quotes</div>
//       <nav className={classes.nav}>
//         <ul>
//           <li>
//             <NavLink
//               to="/quotes"
//               className={(isActive) => (isActive ? classes.active : "")}
//             >
//               All Quotes
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/new-quote"
//               className={(isActive) => (isActive ? classes.active : "")}
//             >
//               Add a Quote
//             </NavLink>
//           </li>
//         </ul>
//       </nav>
//     </header>
//   );
// };
