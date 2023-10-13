const git = require(`simple-git`)(__dirname);
const lineReplace = require(`line-replace`);

async function main () {
  const remote = await git.getRemotes(true);
  const originFetch = remote.filter(r => r.name === `origin`)[0].refs.fetch;
  const originRemote = originFetch
    .replace(`https://`, ``)
    .replace(`git@`, ``)
    .replace(`.git`, ``)
    .replace(`:`, `/`);

  const result = `[![GitHub Classroom Workflow](https://${originRemote}/actions/workflows/classroom.yml/badge.svg)](https://${originRemote}/actions/workflows/classroom.yml)`;

  lineReplace({
    file: `README.md`,
    line: 3,
    text: result,
    callback: ({ file, line, text, replacedText, error }) => {
      lineReplace({
        file: `README.md`,
        line: 8,
        text: `- [x] update the assignment checks above to the correct link. - Done Automatically`,
        callback: ({ file, line, text, replacedText, error }) => {
          git.add([`../README.md`]);
          git.commit(`update README file`);
        }
      });
    }
  });

}

main();