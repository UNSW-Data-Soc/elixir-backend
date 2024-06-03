import { Octokit } from "@octokit/core";
import dayjs from "dayjs";

import { env } from "@/env";

const octokit = new Octokit({
  auth: env.GITHUB_ACCESS_TOKEN,
});

async function getLatestGithubCommit() {
  const res = await octokit.request("GET /repos/UNSW-Data-Soc/elixir-backend/commits/main", {
    owner: "UNSW-Data-Soc",
    repo: "elixir-backend",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return {
    id: res.data.sha.split("").slice(0, 7).join("") as string,
    message: res.data.commit.message as string,
    author: res.data.commit.author.name as string,
    avatar: res.data.author.avatar_url as string,
    date: res.data.commit.author.date as string,
  };
}

async function displayLatestGithubCommit() {
  const c = await getLatestGithubCommit();
  return `<div style="display:inline-flex;flex-direction:column;
                    align-items:start;gap:20px;background-color:#c9e4ff;
                    padding:20px;border-radius:20px;min-width:0;">
        <h1 style="margin:0;font-weight:bold;font-size:2em;">elixir-backend</h1>
        <p style="margin:0;">Latest commit:
            <span style="margin:0;padding:5px 10px;background-color:#a4d0fc;
                            border-radius:5px;">
                ${c.id}
            </span>
        </p>
        <p style="margin:0;font-weight:300;font-style:italic;">
            ${c.message}
        </p> 
        <div style="display:flex;flex-direction:row;
                    align-items:center;gap:10px;">
            <img src="${c.avatar}" height="25" style="border-radius:9999px;" />
            <p style="margin:0;">${c.author}</p> 
        </div>
        <p style="margin:0;">${dayjs(c.date).format("YYYY MMM DD HH:mm:ss")}</p>
    </div>`;
}

export { displayLatestGithubCommit };
