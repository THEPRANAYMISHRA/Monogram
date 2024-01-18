import React from "react";
import Feed from "../feeds/Feed";
import Widgets from "../widgets/Widgets";

export default function Home() {
  return (
    <div className="d-flex w-100 h-100">
      <Feed />
      <Widgets />
    </div>
  );
}
