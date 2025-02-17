import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createColumnHelper } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Button } from "components/ui/Button";
import { Heading } from "components/ui/Heading";
import { Table } from "components/ui/Table";

import { useListUsers, useUserHook } from "core/api/cloud";
import { WorkspaceUserRead } from "core/api/types/CloudApi";
import { useTrackPage, PageTrackingCodes } from "core/services/analytics";
import { useConfirmationModalService } from "hooks/services/ConfirmationModal";
import { useModalService } from "hooks/services/Modal";
import { useCurrentWorkspace } from "hooks/services/useWorkspace";
import { useAuthService } from "packages/cloud/services/auth/AuthService";

import styles from "./UsersSettingsView.module.scss";
import { InviteUsersModal } from "../InviteUsersModal";

const RemoveUserSection: React.VFC<{ workspaceId: string; email: string }> = ({ workspaceId, email }) => {
  const { openConfirmationModal, closeConfirmationModal } = useConfirmationModalService();
  const { removeUserLogic } = useUserHook();
  const { isLoading, mutate: removeUser } = removeUserLogic;

  const onRemoveUserButtonClick = () => {
    openConfirmationModal({
      text: `modals.removeUser.text`,
      title: `modals.removeUser.title`,
      submitButtonText: "modals.removeUser.button.submit",
      onSubmit: async () => {
        removeUser({ email, workspaceId });
        closeConfirmationModal();
      },
      submitButtonDataId: "remove",
    });
  };

  return (
    <Button variant="secondary" onClick={onRemoveUserButtonClick} isLoading={isLoading}>
      <FormattedMessage id="userSettings.user.remove" />
    </Button>
  );
};

const Header: React.VFC = () => {
  const { openModal } = useModalService();
  const { formatMessage } = useIntl();

  const onOpenInviteUsersModal = () =>
    openModal({
      title: formatMessage({ id: "modals.addUser.title" }),
      content: () => <InviteUsersModal invitedFrom="user.settings" />,
      size: "md",
    });

  return (
    <div className={styles.header}>
      <Heading as="h1" size="sm">
        <FormattedMessage id="userSettings.table.title" />
      </Heading>
      <Button
        onClick={onOpenInviteUsersModal}
        icon={<FontAwesomeIcon icon={faPlus} />}
        data-testid="userSettings.button.addNewUser"
      >
        <FormattedMessage id="userSettings.button.addNewUser" />
      </Button>
    </div>
  );
};

export const UsersTable: React.FC = () => {
  const { workspaceId } = useCurrentWorkspace();
  const { users } = useListUsers();
  const { user } = useAuthService();

  const columnHelper = createColumnHelper<WorkspaceUserRead>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => <FormattedMessage id="userSettings.table.column.fullname" />,
        cell: (props) => props.cell.getValue(),
      }),
      columnHelper.accessor("email", {
        header: () => <FormattedMessage id="userSettings.table.column.email" />,
        cell: (props) => props.cell.getValue(),
      }),
      // TEMP: Currently all cloud users are admins.
      // Remove when there is more than role
      // {
      //   Header: (
      //     <>
      //       <FormattedMessage id="userSettings.table.column.role" />
      //       <RoleToolTip />
      //     </>
      //   ),
      //   headerHighlighted: true,
      //   accessor: "userId",
      //   Cell: (_: CellProps<User>) => "Admin",
      // },
      columnHelper.accessor("status", {
        header: () => <FormattedMessage id="userSettings.table.column.action" />,
        cell: (props) =>
          [
            user?.userId !== props.row.original.userId ? (
              <RemoveUserSection workspaceId={workspaceId} email={props.row.original.email} />
            ) : null,
          ].filter(Boolean),
      }),
    ],
    [columnHelper, user?.userId, workspaceId]
  );

  return <Table data={users ?? []} columns={columns} />;
};

export const UsersSettingsView: React.VFC = () => {
  useTrackPage(PageTrackingCodes.SETTINGS_ACCESS_MANAGEMENT);

  return (
    <>
      <Header />
      <UsersTable />
    </>
  );
};
