import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Table,
  Button,
  Popover,
  Position,
  IconButton,
  MoreIcon,
  Menu,
  Heading,
  ChevronLeftIcon,
  PlusIcon,
} from 'evergreen-ui';

export default function Open() {
  const renderRowMenu = () => {
    return (
      <Menu>
        <Menu.Group>
          <Menu.Item>Export...</Menu.Item>
          <Menu.Item>Rename...</Menu.Item>
        </Menu.Group>
        <Menu.Divider />
        <Menu.Group>
          <Menu.Item intent="danger">Delete...</Menu.Item>
        </Menu.Group>
      </Menu>
    );
  };
  return (
    <Card background="tint1" padding={40} elevation={3}>
      <Heading>Choose Existing Project</Heading>
      <Table border="default" marginY={20} background="tint2" width={400}>
        <Table.Body height={200}>
          <Table.Row isSelectable>
            <Table.TextCell>Item 1</Table.TextCell>
            <Table.Cell width={48} flex="none">
              <Popover content={renderRowMenu} position={Position.BOTTOM_RIGHT}>
                <IconButton icon={MoreIcon} height={24} appearance="minimal" />
              </Popover>
            </Table.Cell>
          </Table.Row>
          <Table.Row isSelectable>
            <Table.TextCell>Item 1</Table.TextCell>
            <Table.Cell width={48} flex="none">
              <Popover content={renderRowMenu} position={Position.BOTTOM_RIGHT}>
                <IconButton icon={MoreIcon} height={24} appearance="minimal" />
              </Popover>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <Link to="/">
        <Button iconBefore={ChevronLeftIcon} appearance="minimal">Back</Button>
      </Link>
      <Button iconBefore={PlusIcon} appearance="minimal">Create a new Project</Button>
    </Card>
  );
}
