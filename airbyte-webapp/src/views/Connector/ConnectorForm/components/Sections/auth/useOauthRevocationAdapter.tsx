import set from "lodash/set";
import { useFormContext } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { ConnectorDefinition, ConnectorDefinitionSpecification } from "core/domain/connector";
import { AdvancedAuth } from "core/request/AirbyteClient";

import { useNotificationService } from "../../../../../../hooks/services/Notification";
import { useRunOauthRevocation } from "../../../../../../hooks/services/useConnectorAuthRevocation";
import { ConnectorFormValues } from "../../../types";
import { makeConnectionConfigurationPath, serverProvidedOauthPaths } from "../../../utils";

interface Credentials {
  credentials: AdvancedAuth;
}

function useFormOauthRevocationAdapter(
  connector: ConnectorDefinitionSpecification,
  connectorDefinition?: ConnectorDefinition
): {
  loading: boolean;
  run: () => Promise<void>;
} {
  const { setValue, getValues: getRawValues } = useFormContext<ConnectorFormValues<Credentials>>();
  const { registerNotification } = useNotificationService();

  const OAUTH_REVOCATION_SUCCESS_ID = "connectorForm.revocation.succeeded";

  const onDone = () => {
    const oauthPaths = serverProvidedOauthPaths(connector);

    const newValues = Object.entries(oauthPaths).reduce(
      (acc, [_, { path_in_connector_config }]) =>
        set(acc, makeConnectionConfigurationPath(path_in_connector_config), undefined),
      getRawValues()
    );
    Object.entries(newValues).forEach(([key, value]) => {
      setValue(key as keyof ConnectorFormValues<Credentials>, value);
    });
    registerNotification({
      id: OAUTH_REVOCATION_SUCCESS_ID,
      text: <FormattedMessage id={OAUTH_REVOCATION_SUCCESS_ID} values={{ connector: connectorDefinition?.name }} />,
      type: "success",
    });
  };

  const { run, loading } = useRunOauthRevocation({ connector, onDone });

  return {
    loading,
    run: async () => {
      run();
    },
  };
}

export { useFormOauthRevocationAdapter };
