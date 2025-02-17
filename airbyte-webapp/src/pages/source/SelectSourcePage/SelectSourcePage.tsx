import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";

import { HeadTitle } from "components/common/HeadTitle";
import { PageContainer } from "components/PageContainer";
import { SelectConnector } from "components/source/SelectConnector";
import { Box } from "components/ui/Box";
import { Heading } from "components/ui/Heading";

import { useAvailableSourceDefinitions } from "hooks/domain/connector/useAvailableSourceDefinitions";

export const SelectSourcePage: React.FC = () => {
  const navigate = useNavigate();
  const sourceDefinitions = useAvailableSourceDefinitions();

  return (
    <>
      <HeadTitle titles={[{ id: "sources.newSourceTitle" }]} />
      <Box px="md" pt="2xl" pb="md">
        <PageContainer centered>
          <Heading as="h2" size="lg">
            <FormattedMessage id="sources.selectSourceTitle" />
          </Heading>
        </PageContainer>
      </Box>
      <Box pb="2xl">
        <SelectConnector
          connectorType="source"
          connectorDefinitions={sourceDefinitions}
          onSelectConnectorDefinition={(id) => navigate(`./${id}`)}
        />
      </Box>
    </>
  );
};
