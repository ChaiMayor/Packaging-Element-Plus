import type { MenuItem } from "../src/types";

export default <MenuItem[]>[
  {
    name: "菜单1",
    icon: "document",
    index: "1",
  },
  {
    name: "菜单2",
    icon: "document",
    index: "2",
  },
  {
    name: "菜单3",
    icon: "document",
    index: "3",
    children: [
      {
        name: "菜单3-1",
        icon: "document",
        index: "3-1",
      },
      {
        name: "菜单3-2",
        icon: "document",
        index: "3-2",
      },
      {
        name: "菜单3-3",
        icon: "document",
        index: "3-3",
      },
    ],
  },
];
