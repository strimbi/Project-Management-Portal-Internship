import { useState, type FunctionComponent } from "react";
import {
  Combobox,
  Field,
  makeStyles,
  Option,
  tokens,
} from "@fluentui/react-components";
import type { ComboboxProps } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    display: "grid",
    gridTemplateRows: "repeat(1fr)",
    justifyItems: "start",
    gap: "2px",
  },
  tagsList: {
    listStyleType: "none",
    marginBottom: tokens.spacingVerticalXXS,
    marginTop: 0,
    paddingLeft: 0,
    display: "flex",
    gridGap: tokens.spacingHorizontalXXS,
    paddingTop: "0.5rem",
  },
  stakeholders: {
    fontWeight: "600",
    fontSize: "16px",
    paddingBottom: "0.5rem",
  },
  field: {
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(15px)",
  },
});

interface ICustomComboBoxProps extends ComboboxProps {
  onSelectionChange?: (selected: string) => void;
  options: string[];
  icon: React.ReactNode;
  label: string;
}

export const CustomComboBox: FunctionComponent<ICustomComboBoxProps> = ({
  icon,
  label,
  options,
  onSelectionChange,
  ...props
}) => {
  const styles = useStyles();

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const onSelect: ComboboxProps["onOptionSelect"] = (_event, data) => {
    setSelectedOptions(data.selectedOptions);

    if (!onSelectionChange) {
      return;
    }

    onSelectionChange(data.selectedOptions[0]);
  };

  return (
    <div className={styles.root}>
      <Field label={label} size="large" required>
        <Combobox
          autoComplete="false"
          className={styles.field}
          size="large"
          selectedOptions={selectedOptions}
          onOptionSelect={onSelect}
          {...props}
        >
          <div>
            {options.map((option) => {
              return (
                <Option text={option} value={option} key={option}>
                  {icon} {option}
                </Option>
              );
            })}
          </div>
        </Combobox>
      </Field>
    </div>
  );
};
