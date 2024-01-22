import { PropsWithChildren } from "react";

import Layout from "../../layouts/landing";

export default function LandingLayout(props: PropsWithChildren) {
  return <Layout>{props.children}</Layout>;
}
