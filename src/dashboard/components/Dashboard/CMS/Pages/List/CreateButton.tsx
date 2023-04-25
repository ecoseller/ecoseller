// next
import { useRouter } from "next/router";

// react
import { useState, useRef } from "react";

// libs
import { createNewCMSPage, createNewFrontendPage } from "@/api/cms/page/page";

// mui
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

const options = ["Create new page", "Create storefront link"];

const CreateButton = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleCreateNewFrontendPage = async () => {
    console.log("Create new frontend page");

    await createNewFrontendPage()
      .then((data) => {
        console.log(data);
        const { id } = data;

        if (!id) {
          console.error("Could not create new frontend page");
          return;
        }
        // redirect to edit page
        router.push(`/dashboard/cms/pages/storefront/${id}`);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCreateNewCMSPage = async () => {
    console.log("Create new CMS page");
    await createNewCMSPage()
      .then((data) => {
        console.log(data);
        const { id } = data;

        if (!id) {
          console.error("Could not create new CMS page");
          return;
        }
        // redirect to edit page
        router.push(`/dashboard/cms/pages/cms/${id}`);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);

    switch (selectedIndex) {
      case 0:
        // CMS page
        handleCreateNewCMSPage();
        break;
      case 1:
        // Storefront page
        handleCreateNewFrontendPage();
        break;
    }
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default CreateButton;
