import Link from "next/link";
import React from "react";
import { useRouter } from "next/dist/client/router";

export default function ActiveLink({ children, activeClass, ...props }) {
  const { pathname } = useRouter();
  let className = children.props.className || "";
  if (pathname === props.href)
    className = `${className} ${activeClass ?? "text-indigo-600"}`;
  return <Link {...props}>{React.cloneElement(children, { className })}</Link>;
}
