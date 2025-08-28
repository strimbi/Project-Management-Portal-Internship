import { Link, useNavigate } from "react-router";
import { Input, Button, Field, Toaster } from "@fluentui/react-components";
import { useState } from "react";
import { inputStyles } from "../components/inputStyles";
import { register } from "../services/authService";
import { useToast } from "../hooks/ToasterLink";
import handleError from "../util/handleError";

export default function RegisterPage() {
  const styles = inputStyles();
  const navigate = useNavigate();
  const { notify, toasterId } = useToast();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationMessage("");
    setPasswordMessage("");

    if (!/[@]/.test(email)) {
      setValidationMessage("Email format is not correct.");

      return;
    }

    if (password.length < 6) {
      setPasswordMessage("Password must be at least 6 characters.");

      return;
    }

    if (!/[A-Z]/.test(password)) {
      setPasswordMessage("Passwords must have at least one uppercase letter");

      return;
    }

    if (!/[a-z]/.test(password)) {
      setPasswordMessage("Passwords must have at least one lowercase letter");

      return;
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      setPasswordMessage(
        "Password must have at least one non-alphanumeric character."
      );

      return;
    }

    if (password !== confirmPassword) {
      setValidationMessage("Passwords don't match!");

      return;
    }

    register(email, password)
      .then(() =>
        notify(
          "/login",
          "Login",
          "Registration successful. Redirecting to login.",
          "success"
        )
      )
      .then(() => setTimeout(() => navigate("/login"), 3000))
      .catch((error) => handleError(error, setValidationMessage));
  };

  return (
    <div className={styles.container}>
      <Toaster toasterId={toasterId} />
      <form
        className={styles.card}
        noValidate
        autoComplete="off"
        onSubmit={handleRegister}
      >
        <h1 className={styles.title}>Register</h1>
        <Field label="Email" size="large" className={styles.field}>
          <Input
            size="large"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field
          label="Password"
          size="large"
          className={styles.field}
          validationMessage={passwordMessage}
        >
          <Input
            size="large"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field
          label="Confirm Password"
          size="large"
          validationMessage={validationMessage}
          className={styles.field}
        >
          <Input
            size="large"
            type="password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </Field>
        <Button appearance="primary" size="large" type="submit">
          Register
        </Button>

        <br></br>
        <p>
          Already have an account <Link to={"/login"}>Login Here</Link>.
        </p>
      </form>
    </div>
  );
}
