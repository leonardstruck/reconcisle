import * as React from "react";
import { Link as RLink } from "react-router-dom";

import { Button, Heading, Pane } from "evergreen-ui";

export default function Home() {
  return (
    <Pane width="100%" height="100%" display="flex" background="tint2">
      <Pane background="tint1" elevation={1} width={400} height={600} margin="auto" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Heading size={700}>reconcIsle</Heading>
        <Button is={RLink} to="/open">Open Project</Button>
      </Pane>
    </Pane>
  );
}
