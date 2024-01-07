#! /usr/bin/env node

module.exports = () => {
  const os = require("os");

  const OS_PLATFORM = {
    AIX: "aix",
    Android: "android",
    macOS: "darwin",
    FreeBSD: "freebsd",
    Linux: "linux",
    OpenBSD: "openbsd",
    SunOS: "sunos",
    Windows: "win32",
  };
  const osPlatform = os.platform();

  if (osPlatform === OS_PLATFORM.Windows) {
    return "set FORCE_COLOR=1";
  }

  return "export FORCE_COLOR=1";
};
