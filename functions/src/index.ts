import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cheerio from "cheerio";
import axios from "axios";

admin.initializeApp();

const db = admin.firestore();

export const scrapeDinosaurs = functions.https.onRequest(async (req, res) => {
  try {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

    await Promise.all(
      alphabet.map(async (letter) => {
        const url = `http://www.prehistoric-wildlife.com/listings/${letter}.html`;

        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const dinosaurList: string[] = [];
        $("table tr td:first-child a").each((i, el) => {
          dinosaurList.push($(el).text());
        });

        await Promise.all(
          dinosaurList.map(async (dinosaur) => {
            await db.doc(`dinodex/${dinosaur}`).set(
              {
                name: dinosaur,
              },
              {merge: true}
            );
          })
        );
      })
    );

    console.log("Dinosaurs saved to Firestore!");
    res.status(200).send("Dinosaurs saved to Firestore!");
  } catch (error) {
    res.status(500).send(error);
  }
});


// export const pullDino = functions.https.onCall(async (data) => {
//   try {
//     const firstLetter = data.name.charAt(0).toLowerCase();
//     const url = `http://www.prehistoric-wildlife.com/listings/${firstLetter}/${data.name.toLowerCase()}.html`;

//     const response = await axios.get(url);
//     const html = response.data;
//     const $ = cheerio.load(html);

//     const dinosaurList: string[] = [];
//     $("p").each((i, el) => {
//       dinosaurList.push($(el).text());
//     });

//     await Promise.all(
//       dinosaurList.map(async (dinosaur) => {
//         await db.doc("Dinos/" + data.name).set(
//           {
//             data: dinosaur,
//           },
//           {merge: true}
//         );
//       })
//     );
//   } catch (error) {
//     console.error(error);
//   }
// });
