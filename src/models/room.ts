import firebase from "firebase/app";
import FirebaseModel from "./firebasemodel";

export default class Room extends FirebaseModel {
  constructor(
    _model:
      | firebase.firestore.QueryDocumentSnapshot
      | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
  ) {
    super(_model);
  }

  isMine(account: string, tokenId: string) {
    return this.data.uid === account && this.data.tokenId === tokenId;
  }
}
