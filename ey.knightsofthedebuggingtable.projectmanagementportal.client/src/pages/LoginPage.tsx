import { Link, useNavigate } from "react-router";
import { Input, Field, Button } from "@fluentui/react-components";
import { useState } from "react";
import { inputStyles } from "../components/inputStyles";
import { login } from "../services/authService";
import handleError from "../util/handleError";

export default function LoginPage() {
  const styles = inputStyles();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    login(email, password)
      .then(() => {
        navigate("/projects");
      })
      .catch((error) => handleError(error, setErrorMessage));
  };

  return (
    <div className={styles.container}>
      <form
        className={styles.card}
        noValidate
        autoComplete="off"
        onSubmit={handleLogin}
      >
        <h1 className={styles.title}>Login</h1>
        <Field label="Email" size="large" className={styles.field}>
          <Input
            size="large"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field
          label="Password"
          size="large"
          className={styles.field}
          validationMessage={errorMessage}
        >
          <Input
            size="large"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <Button appearance="primary" size="large" type="submit">
          Log in
        </Button>
        <br></br>
        <p>
          Don't have an account <Link to={"/register"}>Register Here</Link>.
        </p>
      </form>
    </div>
  );
}
