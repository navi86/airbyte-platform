import { useMemo } from "react";
import { get, useFormContext, useFormState, useWatch } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { ControlLabels } from "components/LabeledControl";
import { DropDown } from "components/ui/DropDown";
import { Text } from "components/ui/Text";

import styles from "./StreamReferenceField.module.scss";
import { useBuilderWatch } from "../types";

interface StreamReferenceFieldProps {
  // path to the location in the Connector Manifest schema which should be set by this component
  path: string;
  label: string;
  tooltip?: string;
  optional?: boolean;
  currentStreamIndex: number;
}

export const StreamReferenceField: React.FC<StreamReferenceFieldProps> = ({
  path,
  label,
  tooltip,
  optional,
  currentStreamIndex,
  ...props
}) => {
  const streams = useBuilderWatch("streams");
  const { setValue } = useFormContext();
  const value = useWatch({ name: path });
  const { errors } = useFormState({ name: path });
  const error = get(errors, path);
  const hasError = !!error;

  const options = useMemo(() => {
    return streams
      .filter((_value, index) => index !== currentStreamIndex)
      .map((stream) => ({
        value: stream.id,
        label: stream.name,
      }));
  }, [currentStreamIndex, streams]);

  return (
    <ControlLabels label={label} infoTooltipContent={tooltip} optional={optional}>
      <DropDown
        {...props}
        options={options}
        onChange={(selected) => selected && setValue(path, selected.value)}
        value={value}
        error={hasError}
      />
      {hasError && (
        <Text className={styles.error}>
          <FormattedMessage id={error.message} />
        </Text>
      )}
    </ControlLabels>
  );
};
