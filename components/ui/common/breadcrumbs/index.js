import ActiveLink from "../link";
import { Fragment } from "react";

const BreadcrumbItem = ({ item, idx }) => {
  return (
    <li
      className={`${
        idx == 0 ? "pr-4" : "px-4"
      } font-medium text-gray-500 hover:text-gray-900`}
    >
      <ActiveLink href={item.href}>
        <a>{item.value}</a>
      </ActiveLink>
    </li>
  );
};
export default function Breadcrumbs({ items, isAdmin }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex leading-none text-indigo-600 divide-x divide-indigo-400">
        {items.map((item, i) => (
          <Fragment key={i}>
            {!item.requireAdmin && <BreadcrumbItem item={item} idx={i} />}
            {item.requireAdmin && isAdmin && (
              <BreadcrumbItem item={item} idx={i} />
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
