import React from 'react';
import ReactDOM from 'react-dom';
import { Octokit } from "@octokit/rest";
import { IMessage } from './background';
import Label, { labelClassName } from "./components/label";
import Notification, { notificationClassName, notificationId } from "./components/notification";
import { hasElementAdded } from './services/element';

let octokit;
window.addEventListener("focus popstate", () => {
  const path = window.location.pathname;
  pathHandler(path);
});

const baseRefClassName = 'base-ref';
const headRefClassName = 'head-ref';
const mergeDetailClassName = 'mergeability-details';

const regexpPullReq = /^issue_([0-9]+)$/;
const regexpPullsPage = /\/([^\/]+)\/([^\/]+)\/pulls.*/; // 1:org, 2:repo
const regexpPullDetailPage = /\/([^\/]+)\/([^\/]+)\/pull\/([^\/#?]+)[#?]?/; // 1:org, 2:repo, 2:id
const regexpGitHubHost = /^github.com$/;
const isPullsListPage = (path: string): boolean => regexpPullsPage.test(path);
const isPullDetailPage = (path: string): boolean => regexpPullDetailPage.test(path);
const isGitHubHost = (host: string): boolean => regexpGitHubHost.test(host);
const getPullReqId = (id: string): string => {
  const results = id.match(regexpPullReq);
  if (!results || results.length < 2) {
    return '';
  }
  return results[1];
}

const host = window.location.host;

chrome.runtime.onMessage.addListener(function (msg: IMessage, sender, sendResponse) {
  // console.log('on message', msg);
  if (!validateNavMessage(msg) || host !== msg.host) {
    return;
  }
  pathHandler(msg.path);
});

const pathHandler = (path: string = '') => {
  // console.log('path', path, isPullsListPage(path));
  switch (true) {
    case isPullsListPage(path):
      return onPullsListPageLoad();
    case isPullDetailPage(path):
      return onPullDetailPageLoad();
    default:
      return;
  }
}

const validateNavMessage = (msg: IMessage): boolean => {
  if (!msg) return false;
  if (msg.type !== 'navigation') return false;
  if (!msg.url) return false;
  return true;
}

const onPullsListPageLoad = async() => {
  if (hasElementAdded(labelClassName)) {
    return;
  }

  const matches = window.location.pathname.match(regexpPullsPage);
  if (!matches?.length || matches.length < 2) {
    return;
  }

  const host = window.location.host;
  octokit = isGitHubHost(host) ? new Octokit() : new Octokit({ baseUrl: `https://${host}/api/v3` });

  const owner = matches[1];
  const repo = matches[2];
  const { data } = await octokit.rest.pulls.list({owner, repo}).catch(e => {
    console.warn(e);
    return {data: undefined};
  });
  // console.log(data);
  if (!data) {
    return;
  }

  const mergeBranches = data.map((obj) => ({
    prNumber: obj.number,
    headRef: obj.head.ref,
    baseRef: obj.base.ref,      
  }));

  let count = 0;
  let els = document.querySelectorAll("div[id^=issue_]");
  while (els.length < 1 && count < 5) {
    els = document.querySelectorAll("div[id^=issue_]");
    count = count + 1;
    els.length < 1 && await sleepWithDelay();
  }
  els.forEach((el) => {
    const pullReqId = getPullReqId(el.id);
    if (!pullReqId) {
      return;
    }
    // workaround for the issue multiple elements inserted during sleep
    const newId = `extensions-label-${pullReqId}`;
    const existingEl = document.getElementById(newId)
    if (existingEl) {
      existingEl.remove();
    }

    const extensionEl = document.createElement('div');
    extensionEl.id = newId;
    el.prepend(extensionEl);
    const mergeBranch = mergeBranches.find((b) => String(b.prNumber) === pullReqId);
    if (!mergeBranch) {
      return;
    }
    ReactDOM.hydrate(
      <Label
        pullReqId={pullReqId}
        headRef={mergeBranch.headRef}
        baseRef={mergeBranch.baseRef}
        baseHref={`/${owner}/${repo}/tree/${mergeBranch.headRef}`}
        headHref={`/${owner}/${repo}/tree/${mergeBranch.baseRef}`}
      />, extensionEl);
  });
}

const onPullDetailPageLoad = async(): Promise<void> => {
  let count = 0;
  const maxRetry = 5;
  const delay = 500;
  if (hasElementAdded(notificationClassName)) {
    return;
  }
  while (!hasReady([mergeDetailClassName, baseRefClassName, headRefClassName]) && count < maxRetry) {
    count = count + 1;
    await sleepWithDelay(delay);
  }

  if (count < maxRetry) {
    appendNotificationEl();
  }
}

const hasReady = (classNames: string[]) => {
  return classNames.every((name) => {
    const el = document.getElementsByClassName(name);
    return el && el.length > 0;
  });
}

const appendNotificationEl = () => {
  const targetEl = document.getElementsByClassName(mergeDetailClassName);
  const baseRefEl = document.getElementsByClassName(baseRefClassName);
  const headRefEl = document.getElementsByClassName(headRefClassName);
  const baseBranchName = baseRefEl[0]?.querySelector('span')?.textContent || '';
  const baseBranchHref = baseRefEl[0]?.querySelector('a')?.href || '';
  const headBranchName = headRefEl[0]?.querySelector('span')?.textContent || '';
  const headBranchHref = headRefEl[0]?.querySelector('a')?.href || '';

  if (document.getElementById(notificationId)) {
    return; // already added
  }

  const extensionEl = document.createElement('div');
  extensionEl.id = notificationId;
  targetEl[0].appendChild(extensionEl);
  ReactDOM.hydrate(
    <Notification
      baseBranchName={baseBranchName}
      baseBranchHref={baseBranchHref}
      headBranchName={headBranchName}
      headBranchHref={headBranchHref}
    />,
    extensionEl
  );
}

const sleepWithDelay = async(delay: number = 500): Promise<boolean> => await new Promise((resolve) => setTimeout(resolve, delay));
