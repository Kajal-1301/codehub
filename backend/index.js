const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const http = require("http");

const mainRouter = require("./routes/main.router")

const yargs = require("yargs")
const { hideBin } = require("yargs/helpers")

const { initRepo } = require("./controllers/init")
const { addRepo } = require("./controllers/add")
const { commitRepo } = require("./controllers/commit")
const { pullRepo } = require("./controllers/pull")
const { pushRepo } = require("./controllers/push")
const { revertRepo } = require("./controllers/revert")

require("dotenv").config();

// ------------------------------- Start server function  ----------------------------
async function startServer() {
    const app = express();
    const port = process.env.PORT || 3000

    app.use(cors({
        origin: "https://codehub-three-sooty.vercel.app"
    }));

    app.use(express.json());

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected!");
    } catch (err) {
        console.error("Unable to connect to MongoDB:", err.message);
        process.exit(1);
    }

    app.use("/", mainRouter)


    let user = "test";

    const httpServer = http.createServer(app)

    const io = new Server(httpServer, {
        cors: {
            origin: "https://codehub-three-sooty.vercel.app",
            methods: ["GET", "POST"],
        },
    })

    io.on("connection", (socket) => {
        socket.on("joinRoom", (userId) => {
            user = userId;
            console.log("=====");
            console.log(user);
            console.log("=====");
            socket.join(userId);
        });
    });

    const db = mongoose.connection;

    db.once("open", async () => {
        console.log("CRUD operations called");
        // CRUD operations
    });

    httpServer.listen(port, () => {
        console.log(`Server is running on PORT ${port}`);
    });

}

// -------------------------------------------------------------------------

yargs(hideBin(process.argv))
    .command(                               // start command
        "start",
        "Start the server",
        {},
        startServer
    )
    .command(                              // init command
        "init",
        "Initialize a new repository",
        {},
        initRepo
    )
    .command(                              // add command
        "add <file>",
        "Add a file to the repository",
        (yargs) => {
            yargs.positional("file", {
                describe: "File to add to the staging area",
                type: "string"
            })
        },
        (argv) => {
            addRepo(argv.file)
        }
    )
    .command(                                // commit command
        "commit <message>",
        "Commit the staged files",
        (yargs) => {
            yargs.positional("message", {
                describe: "Commit message",
                type: "string"
            })
        },
        (argv) => {
            commitRepo(argv.message);
        }
    )
    .command(                               // push command 
        "push",
        "Push commits to S3",
        {},
        pushRepo
    )
    .command(                              // pull command
        "pull",
        "Pull commits from S3",
        {},
        pullRepo
    )
    .command(                             // revert command
        "revert <commitId>",
        "Revert to a specific commit",
        (yargs) => {
            yargs.positional("commitId", {
                describe: "Commit ID to revert to ",
                type: "string"
            })
        },
        (argv) => {
            revertRepo(argv.commitId)
        }
    )
    .demandCommand(1, "You need at least one command")
    .help()
    .parse()



