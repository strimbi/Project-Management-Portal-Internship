import React, { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import {
  AppItem,
  Hamburger,
  NavCategory,
  NavCategoryItem,
  NavDrawer,
  NavDrawerBody,
  NavItem,
  NavSubItem,
  NavSubItemGroup,
} from "@fluentui/react-components";

import {
  makeStyles,
  tokens,
  useRestoreFocusTarget,
} from "@fluentui/react-components";
import {
  Board20Filled,
  Board20Regular,
  DocumentBulletListMultiple20Filled,
  DocumentBulletListMultiple20Regular,
  Dismiss20Filled,
  TextAlignJustify20Filled,
  bundleIcon,
  SubtractSquare20Filled,
  SubtractSquare20Regular,
  BookTemplate20Filled,
  BookTemplate20Regular,
  BranchRequest20Filled,
  BranchRequest20Regular,
  ApprovalsApp20Filled,
  ApprovalsApp20Regular,
  ChartMultiple20Filled,
  ChartMultiple20Regular,
} from "@fluentui/react-icons";
import { logout } from "../services/authService";
import ErrorBar from "./ErrorBar";
import handleError from "../util/handleError";

const useStyles = makeStyles({
  root: {
    overflow: "hidden",
    display: "flex",
    height: "100vh",
    padding: "0.5rem",
    gap: "0.5rem",
  },
  nav: {
    paddingBottom: "0.5rem",
    paddingTop: "3rem",
    minWidth: "260px",
    background: "rgba(255, 255, 255, 0.25)",
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
  },
  activeNavItem: {
    backgroundColor: "#f0f0f0",
    color: "#850d41ff",
    fontWeight: "bold",
  },
  navItem: {
    width: "100%",
    background: "transparent",
    color: tokens.colorNeutralForeground1,
    ":hover": {
      background: "transparent",
    },
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: "1rem",
    paddingLeft: "1rem",
    background: "rgba(255, 255, 255, 0.25)",
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(19, 3, 3, 0.1)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    transition: "padding-left 0.3s ease 0.1s",
    width: "100%",
  },
  contentWithPadding: {
    paddingLeft: "3.5rem",
  },
  field: {
    display: "flex",
    marginTop: "4px",
    marginLeft: "8px",
    flexDirection: "column",
    gridRowGap: tokens.spacingVerticalS,
  },

  container: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  menuButton: {
    position: "fixed",
    top: "1.5rem",
    left: "1.5rem",
    background: "rgba(255, 255, 255, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
    zIndex: "10",
  },
});

interface NavbarProps {
  children: ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const styles = useStyles();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [error, setError] = useState<string>("");
  const restoreFocusTargetAttributes = useRestoreFocusTarget();

  const Template = bundleIcon(BookTemplate20Filled, BookTemplate20Regular);
  const Dashboard = bundleIcon(Board20Filled, Board20Regular);
  const Analytics = bundleIcon(ChartMultiple20Filled, ChartMultiple20Regular);
  const Request = bundleIcon(BranchRequest20Filled, BranchRequest20Regular);
  const Approval = bundleIcon(ApprovalsApp20Filled, ApprovalsApp20Regular);
  const Reports = bundleIcon(
    DocumentBulletListMultiple20Filled,
    DocumentBulletListMultiple20Regular
  );
  const Logout = bundleIcon(SubtractSquare20Filled, SubtractSquare20Regular);

  const handleLogout = () => {
    logout()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => handleError(error, setError));
  };

  return (
    <div className={styles.root}>
      <NavDrawer
        type="inline"
        open={isOpen}
        multiple={true}
        className={styles.nav}
      >
        <NavDrawerBody>
          <div className={styles.container}>
            <div>
              <AppItem className={styles.navItem}>
                Project Management Portal
              </AppItem>
              <Link to="/analytics">
                <NavItem
                  className={styles.navItem}
                  icon={<Analytics />}
                  value="0"
                >
                  Analytics
                </NavItem>
              </Link>
              <Link to="/projects">
                <NavItem
                  className={styles.navItem}
                  icon={<Dashboard />}
                  value="1"
                >
                  Projects
                </NavItem>
              </Link>
              <Link to="/templates">
                <NavItem
                  className={styles.navItem}
                  icon={<Template />}
                  value="3"
                >
                  Templates
                </NavItem>
              </Link>
              <Link to="/advance-requests">
                <NavItem
                  className={styles.navItem}
                  icon={<Request />}
                  value="4"
                >
                  Advance requests
                </NavItem>
              </Link>
              <Link to="/approvals">
                <NavItem
                  className={styles.navItem}
                  icon={<Approval />}
                  value="5"
                >
                  Approvals
                </NavItem>
              </Link>

              <NavCategory value="8">
                <NavCategoryItem className={styles.navItem} icon={<Reports />}>
                  Create
                </NavCategoryItem>
                <NavSubItemGroup>
                  <Link to="/projects/create">
                    <NavSubItem className={styles.navItem} value="9">
                      Create Project
                    </NavSubItem>
                  </Link>
                  <Link to="/templates/create">
                    <NavSubItem className={styles.navItem} value="10">
                      Create Template
                    </NavSubItem>
                  </Link>
                </NavSubItemGroup>
              </NavCategory>
            </div>
            <ErrorBar error={error} />
            <NavItem
              className={styles.navItem}
              icon={<Logout />}
              value="10"
              onClick={handleLogout}
            >
              Logout
            </NavItem>
          </div>
        </NavDrawerBody>
      </NavDrawer>
      <Hamburger
        icon={isOpen ? <Dismiss20Filled /> : <TextAlignJustify20Filled />}
        className={styles.menuButton}
        onClick={() => setIsOpen(!isOpen)}
        {...restoreFocusTargetAttributes}
        aria-expanded={isOpen}
      />
      <div
        className={`${styles.content} ${
          !isOpen ? styles.contentWithPadding : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Navbar;
