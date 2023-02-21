import Image from "next/image";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Logo from "/public/logo/black/ecoseller.io.svg";
import Link from "next/link";

import styles from "./LoginBox.module.scss";
import Emoji from "../Emoji";

const LoginBox = ({ }) => {

    return (
        <>
            <Link href={"https://ecoseller.io"}>
                <div className={styles.login_logo} />
            </Link>
            <h1 className={styles.welcome}>
                Welcome back!
                <Emoji symbol="✌️" label="peace" />
            </h1>
            <Box sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="E-mail Address"
                    name="e-mail"
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
                <Button
                    type="submit"
                    color="primary"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 2, height: 60 }}
                >
                    Login
                </Button>
            </Box>
        </>
    )
}

export default LoginBox;