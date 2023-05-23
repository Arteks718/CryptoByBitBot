
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://arteks718:2907324013@cluster0.0kggzfn.mongodb.net/?retryWrites=true&w=majority";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {x
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);


const { Telegraf, Scenes, session, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
const { bot } = require('./config')

bot.start(ctx => ctx.reply("Hello!"));

bot.use(session());

const test = new Scenes.BaseScene("test");
test.enter(ctx => ctx.reply("Hello!!!"));

const stage = new Scenes.Stage([test]);

bot.use(stage.middleware());

bot.command('test', ctx => ctx.scene.enter("test"))

bot.launch();
