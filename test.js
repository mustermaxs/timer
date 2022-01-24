const fs = require("fs");
const yargs = require("yargs");
const chalk = require("chalk");

var notes = [];

const loadNotes = function () {
  try {
    var notes_json = fs.readFileSync("./notesList.json").toString();
    return JSON.parse(notes_json);
  } catch (e) {
    return [];
  }
};

const saveNotes = function (notes) {
  var notes_json = JSON.stringify(notes);
  var buffered = Buffer.from(notes_json, "utf-8");
  fs.writeFileSync("./notesList.json", buffered);
};

const addNote = (title, body) => {
  var notes = loadNotes();
  const titleExists = notes["notes"][title];

  if (titleExists === undefined) {
    notes["notes"][title] = [
      {
        body: body,
      },
    ];
    saveNotes(notes);
    console.log(chalk.bgGreen("added new note!"));
    return;
  }
  notes["notes"][title].push({ body: body });
  console.log(chalk.bgGreen(" added new note! "));

  saveNotes(notes);
  return;
};

const removeNote = function (title, body) {
  var notes = loadNotes();
  var indexOfNote = notes["notes"][title].findIndex(function (note) {
    return note.body === body;
  });
  if (indexOfNote === -1) {
    console.log(chalk.bgRed(" note does not exist "));
    return;
  }
  console.log(chalk.bgRed(" removed note! "));

  notes["notes"][title].splice(indexOfNote, indexOfNote);
  saveNotes(notes);
};

yargs.command({
  command: "add",
  describe: "Adds a new note",
  builder: {
    title: {
      describe: "note title",
    },
    body: {
      describe: "note body",
    },
  },
  handler: function (argv) {
    addNote(argv.title, argv.body);
  },
});

yargs.command({
  command: "read",
  describe: "Reads notes",
  builder: {
    showTitle: {
      describe: "shows the title",
    },
    showBody: {
      describe: "shows the body",
    },
  },
  handler: () => {
    var notes = loadNotes();
    if (notes["notes"].length === 0) {
      console.log("No notes found");
      return;
    }
    Object.keys(notes["notes"]).forEach((title) => {
      console.log(`-- ${title}--\n`);
      notes["notes"][title].forEach((note) => {
        console.log(`\t# ${note.body}\n`);
      });
    });
  },
});

yargs.command({
  command: "remove",
  describe: "removes note",
  handler: function (argv) {
    removeNote(argv.title, argv.body);
  },
});

yargs.parse();
