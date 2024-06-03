export const userLevels = ["admin", "moderator", "user"] as const;
export type UserLevel = (typeof userLevels)[number];

// TODO: add more fields
export type BlogNode =
  | {
      type: "heading";
      attrs: {
        level: 1 | 2 | 3;
      };
      content: { type: "text"; text: string }[];
    }
  | {
      type: "image";
      attrs: (
        | { src: string; blogId: null; imageId: null }
        | { src: null; blogId: string; imageId: string }
      ) & {
        alt: string | null;
        title: string | null;
      };
    }
  | {
      type: "paragraph";
      content?: {
        type: "text";
        text: string;
      }[];
    };

export type BlogBody = {
  type: string;
  content: BlogNode[];
};

export const execRoles = [
  "President",
  "Vice President (Externals)",
  "Vice President (Operations)",
  "Vice President (Activities)",
  "Vice President (Development)",
  "Diversity Ambassador",
  "Secretary",
  "Treasurer",
] as const;
export type ExecRole = (typeof execRoles)[number];

export const directorRoles = [
  "Careers Director",
  "Sponsorships Director",
  "IT Director",
  "Marketing Director",
  "Media Director",
  "HR Director",
  "Social Director",
  "Education Director",
  "Philanthropy & Projects Director",
] as const;
export type DirectorRole = (typeof directorRoles)[number];

export const subcomRoles = [
  "Careers Subcom",
  "Sponsorships Subcom",
  "IT Subcom",
  "Marketing Subcom",
  "Media Subcom",
  "HR Subcom",
  "Social Subcom",
  "Education Subcom",
  "Philanthropy & Projects Subcom",
] as const;
export type SubcomRole = (typeof subcomRoles)[number];

export const userRoleGroups = ["exec", "director", "subcom"] as const;
export type UserRoleGroup = (typeof userRoleGroups)[number];
