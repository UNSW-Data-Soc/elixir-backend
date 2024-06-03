import { UserLevel, userLevels, userRoleGroups } from "../types/data";

import { relations, sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = sqliteTableCreator((name) => `elixir_${name}`);

export const users = mysqlTable(
  "users",
  {
    id: text("id", { length: 255 }).primaryKey(),
    name: text("name", { length: 255 }),
    email: text("email", { length: 255 }).notNull(),
    emailVerified: integer("emailVerified", {
      mode: "timestamp",
    }).default(sql`CURRENT_TIMESTAMP`),
    passwordHash: text("passwordHash", { length: 255 }).notNull(),
    about: text("about"),
    image: text("image", { length: 255 }),
    role: text("userRole", userLevels).$type<UserLevel>().default("user").notNull(),
    registeredTime: integer("registeredTime", {
      mode: "timestamp",
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    retired: integer("retired", { mode: "boolean" }).default(false),
  },
  (user) => ({
    userIdIdx: index("userIdIdx").on(user.id),
  })
);

export const userYearsActive = mysqlTable(
  "userYearsActive",
  {
    userId: text("id", { length: 255 }).notNull(),
    year: integer("year").notNull(),
    group: text("group", userRoleGroups).notNull(),
    role: text("role").notNull(), // either 'role' name for exec or 'portfolio' name for directors/subcom
    photo: text("photo"),
  },
  (r) => ({
    compoundKey: primaryKey({
      columns: [r.userId, r.year],
    }),
  })
);

export const resetTokens = mysqlTable(
  "resetTokens",
  {
    token: text("token", { length: 255 }).notNull(),
    user: text("id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.token, t.user],
    }),
  })
);

export const sessions = mysqlTable(
  "sessions",
  {
    sessionToken: text("sessionToken", { length: 255 }).notNull(),
    userId: text("userId", { length: 255 }).notNull(),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
    compoundKey: primaryKey({
      columns: [session.sessionToken, session.expires, session.userId],
    }),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationTokens",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    token: text("token", { length: 255 }).notNull(),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const blogs = mysqlTable(
  "blogs",
  {
    id: text("id", { length: 255 }).primaryKey(),
    creator: text("creatorId", { length: 255 }).references(() => users.id, {
      onDelete: "set null",
    }),
    slug: text("slug", { length: 255 }).unique().notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    author: text("author", { length: 255 }).notNull(),
    createdTime: integer("createdTime", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    lastEditTime: integer("lastEditTime", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    public: integer("public", { mode: "boolean" }).notNull().default(false),
  },
  (blog) => ({
    blogSlugIdx: index("blogSlugIdx").on(blog.slug),
  })
);

export const events = mysqlTable(
  "events",
  {
    id: text("id", { length: 255 }).primaryKey(),
    creator: text("creatorId", { length: 255 }).references(() => users.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    slug: text("slug", { length: 255 }).unique().notNull(),
    description: text("description").notNull(),
    startTime: integer("startTime", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    endTime: integer("endTime", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    location: text("location").notNull(),
    link: text("link").notNull(),
    public: integer("public", { mode: "boolean" }).notNull().default(false),
    lastEditTime: integer("lastEditTime", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    photo: text("photoId", { length: 36 }),
  },
  (event) => ({
    eventSlugIdx: index("eventSlugIdx").on(event.slug),
  })
);

export const companies = mysqlTable(
  "companies",
  {
    id: text("id", { length: 255 }).primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    websiteUrl: text("websiteUrl"),
    logo: text("logoId", { length: 36 }),
  },
  (company) => ({
    companyId: index("companyIdIdx").on(company.id),
  })
);

export const sponsorships = mysqlTable(
  "sponsorships",
  {
    id: text("id", { length: 255 }).primaryKey(),
    message: text("message").notNull(),
    company: text("companyId", { length: 255 }).references(() => companies.id, {
      onDelete: "cascade",
    }),
    public: integer("public", { mode: "boolean" }).notNull().default(false),
    type: text("sponsorshipType", ["major", "partner", "other"]),
    expiration: integer("expiration", { mode: "timestamp" }).notNull(),
    order: integer("order").notNull().default(0),
  },
  (sponsorship) => ({
    sponsorshipId: index("sponsorshipIdIdx").on(sponsorship.id),
  })
);

export const jobPostings = mysqlTable(
  "jobPostings",
  {
    id: text("id", { length: 255 }).primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    body: text("body").notNull(),
    company: text("companyId", { length: 255 })
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    photo: text("photoId", { length: 255 }),
    link: text("link"),
    public: integer("public", { mode: "boolean" }).notNull().default(false),
    createdTime: integer("createdTime", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    lastEditedTime: integer("lastEditedTime", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    expiration: integer("expiration", { mode: "timestamp" }).notNull(),
    creator: text("creatorId", { length: 255 }).references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (job) => ({})
);

export const coverPhotos = mysqlTable(
  "coverphotos",
  {
    id: text("id", { length: 255 }).primaryKey(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (cp) => ({})
);

export const resources = mysqlTable("resources", {
  id: text("id", { length: 255 }).primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  link: text("link").notNull(), // either a link to the resource or the S3 resource id
  public: integer("public", { mode: "boolean" }).notNull().default(false),
  internal: integer("internal", { mode: "boolean" }).notNull().default(false), // whether the link is stored internally (S3) or externally (e.g. Google Drive)
  lastEditTime: integer("lastEditTime", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  createdTime: integer("createdTime", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const tags = mysqlTable("tags", {
  id: text("id", { length: 255 }).primaryKey(),
  name: text("name", { length: 255 }).notNull().unique(),
  colour: text("colour", { length: 7 }).notNull().default("#000000"),
});

export const resourceTags = mysqlTable(
  "resourceTags",
  {
    resourceId: text("resourceId", { length: 255 })
      .notNull()
      .references(() => resources.id, { onDelete: "cascade" }),
    tagId: text("tagId", { length: 255 })
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (rt) => ({
    compoundKey: primaryKey({ columns: [rt.resourceId, rt.tagId] }),
  })
);

export const blogTags = mysqlTable(
  "blogTags",
  {
    blogId: text("blogId", { length: 255 })
      .notNull()
      .references(() => blogs.id, { onDelete: "cascade" }),
    tagId: text("tagId", { length: 255 })
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (bt) => ({
    compoundKey: primaryKey({ columns: [bt.blogId, bt.tagId] }),
  })
);

export const eventTags = mysqlTable(
  "eventTags",
  {
    eventId: text("eventId", { length: 255 })
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    tagId: text("tagId", { length: 255 })
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (et) => ({
    compoundKey: primaryKey({ columns: [et.eventId, et.tagId] }),
  })
);
