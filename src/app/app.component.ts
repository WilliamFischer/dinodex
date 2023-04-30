import { Component } from '@angular/core';
import { query, getDocs, collection, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'dinodex';
  loading = true;

  keyword = 'name';

  dinos: any[] = [];

  constructor(public firestore: Firestore) {
    this.pullAllDinos();
  }

  async pullAllDinos() {
    this.loading = true;

    this.dinos = localStorage.getItem('dinos')
      ? JSON.parse(localStorage.getItem('dinos'))
      : await this.fetchDinosFromFirestore();

    console.log(this.dinos);
    this.loading = false;
  }

  async fetchDinosFromFirestore() {
    let dinos = [];
    const queryPromises = [];

    // Fetch dinos from Firestore for every letter in the alphabet
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const queryPromise = getDocs(
        query(collection(this.firestore, letter.toLowerCase()))
      );
      queryPromises.push(queryPromise);
    }

    // Wait for all the queries to complete
    const querySnapshots = await Promise.all(queryPromises);

    // Extract the data from each query snapshot and concatenate them
    for (const snapshot of querySnapshots) {
      const results = snapshot.docs.map((listing) => listing.data());
      dinos = dinos.concat(results);
    }

    // Store dinos in local storage
    localStorage.setItem('dinos', JSON.stringify(dinos));

    return dinos;
  }

  selectDino(dino) {
    console.log(dino);
  }
}
