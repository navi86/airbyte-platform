import { Meta, StoryFn } from "@storybook/react";

import { WorkspaceItem } from "./WorkspaceItem";

export default {
  title: "Workspaces/WorkspaceItem",
  component: WorkspaceItem,
} as Meta<typeof WorkspaceItem>;

const Template: StoryFn<typeof WorkspaceItem> = (args) => (
  <div style={{ maxWidth: 680 }}>
    <WorkspaceItem
      workspaceId={args.workspaceId}
      workspaceName={args.workspaceName}
      testId="select-this-workspace"
      permissions={args.permissions}
      orgName={args.orgName}
    />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  workspaceId: "1234",
  workspaceName: "My Cool Workspace",
  orgName: "Awesome Org",
  permissions: "Admin",
};
